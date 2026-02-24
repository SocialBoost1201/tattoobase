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

    /** 作品ポートフォリオ一覧 */
    getPortfolio(studioId: string) {
        return this.prisma.portfolioWork.findMany({
            where: { studioId },
            include: { artist: true },
            orderBy: { createdAt: 'desc' },
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
}
