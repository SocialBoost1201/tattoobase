import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RiskEngineService } from '../domain/risk-engine.service';
import { BookingStatus, ReservationDecision } from '@tattoobase/database';
import { BookingDraftDto } from './booking/dto/booking-draft.dto';
import Stripe from 'stripe';

@Injectable()
export class UserApiService {
    private stripe: Stripe;

    constructor(
        private readonly prisma: PrismaService,
        private readonly riskEngine: RiskEngineService
    ) {
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
            apiVersion: '2023-10-16'
        });
    }

    // --- Artists ---
    getArtists(params?: { genre?: string; gender?: string }) {
        const where: any = {};
        
        // ジャンル検索（specialtiesの配列内にジャンル名が含まれているか）
        if (params?.genre) {
            where.specialties = {
                has: params.genre
            };
        }
        
        // 性別検索
        if (params?.gender) {
            where.gender = params.gender;
        }

        return this.prisma.artistProfile.findMany({
            where,
            include: { studio: true, portfolioWorks: { take: 1 } },
            orderBy: { createdAt: 'desc' }
        });
    }

    getArtistMeta(id: string) {
        return this.prisma.artistProfile.findUnique({
            where: { id },
            include: { studio: true, portfolioWorks: true }
        });
    }

    // --- Studios ---
    getStudios() {
        return this.prisma.studio.findMany({
            where: { accountType: { not: 'CUSTOM' } }
        });
    }

    getStudioMeta(id: string) {
        return this.prisma.studio.findUnique({
            where: { id },
            include: { staffs: true, artists: true }
        });
    }

    // --- Portfolios ---
    getPortfolios() {
        return this.prisma.portfolioWork.findMany({
            take: 20,
            orderBy: { createdAt: 'desc' },
            include: { artist: true }
        });
    }

    getPortfolio(id: string) {
        return this.prisma.portfolioWork.findUnique({
            where: { id },
            include: { artist: true, studio: true }
        });
    }

    // --- Account Data ---
    getUserProfile(userId: string) {
        return this.prisma.user.findUnique({
            where: { id: userId },
            include: { riskProfile: true }
        });
    }

    getUserBookings(userId: string) {
        return this.prisma.booking.findMany({
            where: { userId },
            include: { artist: true, studio: true },
            orderBy: { createdAt: 'desc' }
        });
    }

    getBookingDetail(id: string) {
        return this.prisma.booking.findUnique({
            where: { id },
            include: { artist: true, studio: true, payments: true }
        });
    }

    getUserDesigns(userId: string) {
        return this.prisma.designRequest.findMany({
            where: { userId },
            include: { artist: true },
            orderBy: { createdAt: 'desc' }
        });
    }

    getDesignDetail(id: string) {
        return this.prisma.designRequest.findUnique({
            where: { id },
            include: { artist: true, designAssets: true }
        });
    }

    // --- KYC ---
    async submitKyc(userId: string, data: { encryptedFilePath: string, birthDate: string }) {
        // KYCSubmissionを作成し、UserのKYCStatusをPENDINGにする
        return this.prisma.$transaction(async (tx) => {
            const submission = await tx.kYCSubmission.create({
                data: {
                    // bookingIdは本来予約紐付けだが、今回はユーザー単位のKYCとするため仮のUUIDを入れるなど工夫が必要
                    // 仕様上 bookingId が @unique となっているため、今回は userId-UUID などの形式で暫定対応
                    bookingId: `kyc-${userId}-${Date.now()}`, 
                    encryptedFilePath: data.encryptedFilePath,
                    birthDate: new Date(data.birthDate),
                    status: 'PENDING'
                }
            });

            await tx.user.update({
                where: { id: userId },
                data: { kycStatus: 'PENDING' }
            });

            return submission;
        });
    }

    // --- Facilities ---
    getFacilities(params?: { type?: any; area?: string; acceptanceLevel?: string; includeBanned?: boolean }) {
        const where: any = {};
        if (params?.type) where.type = params.type;
        if (params?.area) {
            where.OR = [
                { prefecture: { contains: params.area } },
                { city: { contains: params.area } },
            ];
        }
        if (params?.acceptanceLevel) {
            where.acceptanceLevel = params.acceptanceLevel;
        } else if (!params?.includeBanned) {
            where.acceptanceLevel = { not: 'BANNED' };
        }
        
        return this.prisma.facility.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });
    }

    getFacilityMeta(slugOrId: string) {
        return this.prisma.facility.findFirst({
            where: {
                OR: [
                    { id: slugOrId },
                    { slug: slugOrId }
                ]
            }
        });
    }

    createFacilityReport(data: {
        facilityId: string;
        userId?: string;
        reportedLevel: any;
        evidenceText?: string;
        evidenceUrl?: string;
    }) {
        return this.prisma.facilityReport.create({
            data: {
                facilityId: data.facilityId,
                userId: data.userId,
                reportedLevel: data.reportedLevel,
                evidenceText: data.evidenceText,
                evidenceUrl: data.evidenceUrl,
                status: 'PENDING',
            }
        });
    }

    // --- Booking Logic (New) ---
    async createBookingDraft(userId: string, dto: BookingDraftDto) {
        // 0. スタジオのデポジット設定を取得
        const studioSettings = await this.prisma.studio.findUnique({
            where: { id: dto.studioId },
            select: { requiresDeposit: true, depositAmount: true }
        });
        const studioDepositAmount = studioSettings?.depositAmount || 10000;
        const studioRequiresDeposit = studioSettings?.requiresDeposit || false;

        // 1. リスク判定エンジンの呼び出し
        const riskResult = await this.riskEngine.evaluateRisk(userId);

        if (riskResult.decision === ReservationDecision.BLOCK) {
            throw new BadRequestException('Reservation blocked due to high risk profile.');
        }

        // デポジット要否の判定（リスク要請 or スタジオ基本設定）
        const depositRequired = riskResult.decision === ReservationDecision.REQUIRE_DEPOSIT || 
                                (riskResult.decision === ReservationDecision.ALLOW && studioRequiresDeposit);

        // 2. Draft作成
        const targetStatus = riskResult.decision === ReservationDecision.REQUIRE_APPROVAL 
                                ? BookingStatus.RequireApproval 
                                : (depositRequired ? BookingStatus.PendingPayment : BookingStatus.Confirmed);

        const booking = await this.prisma.$transaction(async (tx) => {
            // Decision記録の保存
            const decisionRecord = await tx.reservationPolicyDecision.create({
                data: {
                    decision: riskResult.decision,
                    riskTier: riskResult.tier,
                    ruleVersion: 'v2.2.1',
                    // schema.prismaには appliedRulesJson フィールドが存在しないため一旦除外
                }
            });

            // 予約本体の作成
            return tx.booking.create({
                data: {
                    userId,
                    studioId: dto.studioId,
                    artistId: dto.artistId,
                    status: targetStatus,
                    notes: dto.notes,
                    reservationPolicyDecisionId: decisionRecord.id,
                }
            });
        });

        // 3. 承認不要で決済が必要な場合
        let clientSecret = null;

        if (targetStatus === BookingStatus.PendingPayment && depositRequired) {
            const amount = studioDepositAmount; // スタジオ設定から動的取得
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount,
                currency: 'jpy', // 日本円
                metadata: {
                    bookingId: booking.id,
                    userId,
                },
            });
            clientSecret = paymentIntent.client_secret;
        }

        return {
            bookingId: booking.id,
            status: booking.status,
            decision: riskResult.decision,
            tier: riskResult.tier,
            depositRequired,
            clientSecret, // PWAに返却し Stripe.js で決済を完了させる
        };
    }
}
