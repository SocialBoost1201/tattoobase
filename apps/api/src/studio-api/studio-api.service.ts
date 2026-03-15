import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * StudioApiService
 * - 全クエリは studioId によるテナント境界でスコープされる
 * - 将来的に AuthGuard で studioId を req.user から取得する設計を前提とする
 * - 書き込み操作は一切提供しない
 */
@Injectable()
export class StudioApiService {
    constructor(private readonly prisma: PrismaService) { }

    /** ダッシュボード: 本日の予約件数 + アクティブなデザイン依頼数 + スタジオ情報 */
    async getDashboard(studioId: string) {
        const [studio, todayBookings, activeDesigns] = await Promise.all([
            this.prisma.studio.findUnique({ where: { id: studioId } }),
            this.prisma.booking.count({
                where: {
                    studioId,
                    scheduledAtUtc: {
                        gte: new Date(new Date().setHours(0, 0, 0, 0)),
                        lt: new Date(new Date().setHours(23, 59, 59, 999)),
                    },
                },
            }),
            this.prisma.designRequest.count({
                where: {
                    artist: { studioId },
                    status: { in: ['REQUESTED', 'DEPOSIT_REQUIRED', 'IN_PROGRESS'] },
                },
            }),
        ]);
        return { studio, todayBookings, activeDesigns };
    }

    /** 予約一覧 (studioId スコープ) */
    getBookings(studioId: string) {
        return this.prisma.booking.findMany({
            where: { studioId },
            include: { artist: true, user: true, payments: true },
            orderBy: { scheduledAtUtc: 'asc' },
        });
    }

    /** 予約詳細 (studioId スコープ) */
    getBooking(studioId: string, id: string) {
        return this.prisma.booking.findFirst({
            where: { id, studioId },
            include: {
                artist: true,
                user: true,
                payments: true,
                pricingSnapshot: true,
                reservationDecision: true,
            },
        });
    }

    /** デザイン依頼一覧 (studioId スコープ) */
    getDesigns(studioId: string) {
        return this.prisma.designRequest.findMany({
            where: { artist: { studioId } },
            include: { artist: true, user: true },
            orderBy: { createdAt: 'desc' },
        });
    }

    /** デザイン依頼詳細 */
    getDesign(studioId: string, id: string) {
        return this.prisma.designRequest.findFirst({
            where: { id, artist: { studioId } },
            include: { artist: true, user: true, designAssets: true, designDeposits: true },
        });
    }

    /** 所属アーティスト一覧 */
    getArtists(studioId: string) {
        return this.prisma.artistProfile.findMany({
            where: { studioId },
            include: { portfolioWorks: { take: 3 } },
        });
    }

    /** 所属アーティスト更新 */
    async updateArtist(studioId: string, id: string, data: any) {
        // 所属チェック
        const artist = await this.prisma.artistProfile.findFirst({ where: { id, studioId } });
        if (!artist) throw new Error('Artist not found or access denied.');

        return this.prisma.artistProfile.update({
            where: { id },
            data: {
                displayName: data.displayName,
                bio: data.bio,
                specialties: data.specialties,
                gender: data.gender,
                yearsOfExperience: data.yearsOfExperience,
                profileImageUrl: data.profileImageUrl,
                instagramHandle: data.instagramHandle,
            },
        });
    }

    /** 作品ポートフォリオ一覧 */
    getPortfolio(studioId: string) {
        return this.prisma.portfolioWork.findMany({
            where: { studioId },
            include: { artist: true },
            orderBy: { createdAt: 'desc' },
        });
    }

    /** 作品ポートフォリオ追加 */
    async createPortfolioWork(studioId: string, data: any) {
        // 所属チェック
        const artist = await this.prisma.artistProfile.findFirst({ where: { id: data.artistId, studioId } });
        if (!artist) throw new Error('Artist not found or access denied.');

        return this.prisma.portfolioWork.create({
            data: {
                artistId: data.artistId,
                studioId: studioId,
                title: data.title,
                description: data.description,
                mediaUrls: data.imageUrl ? [data.imageUrl] : [],
                tags: data.tags || [],
                styleCategory: data.styleCategory,
            },
        });
    }

    /** サブスク・請求情報 */
    getBilling(studioId: string) {
        return this.prisma.subscription.findUnique({
            where: { studioId },
        });
    }

    /** 顧客リスク一覧 (studioId スコープ) */
    getRisk(studioId: string) {
        return this.prisma.booking.findMany({
            where: { studioId },
            select: {
                id: true,
                status: true,
                userId: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                        riskProfile: true,
                    },
                },
            },
        });
    }

    /** 予約リクエストの承認 */
    async approveBooking(studioId: string, id: string) {
        const booking = await this.prisma.booking.findFirst({ where: { id, studioId } });
        if (!booking || booking.status !== 'RequireApproval') {
            throw new Error('Booking not found or not in RequireApproval state.');
        }

        // デポジットの有無等に応じたステータス遷移。MVPとしていったんは一律 PendingPayment に遷移させる。
        // （実際には `ReservationPolicyDecision` 等から `depositRequired` を判定し `Confirmed` に直行させる場合もある）
        return this.prisma.booking.update({
            where: { id },
            data: { status: 'PendingPayment' },
        });
    }

    /** 予約リクエストの拒否 */
    async rejectBooking(studioId: string, id: string) {
        const booking = await this.prisma.booking.findFirst({ where: { id, studioId } });
        if (!booking || booking.status !== 'RequireApproval') {
            throw new Error('Booking not found or not in RequireApproval state.');
        }

        return this.prisma.booking.update({
            where: { id },
            data: { status: 'CancelledByStudio' },
        });
    }

    // --- Settings (Deposit) ---
    async getDepositSettings(studioId: string) {
        return this.prisma.studio.findUnique({
            where: { id: studioId },
            select: {
                id: true,
                requiresDeposit: true,
                depositAmount: true,
            }
        });
    }

    async updateDepositSettings(studioId: string, payload: { requiresDeposit: boolean, depositAmount: number }) {
        return this.prisma.studio.update({
            where: { id: studioId },
            data: {
                requiresDeposit: payload.requiresDeposit,
                depositAmount: payload.depositAmount,
            },
            select: {
                id: true,
                requiresDeposit: true,
                depositAmount: true,
            }
        });
    }
}
