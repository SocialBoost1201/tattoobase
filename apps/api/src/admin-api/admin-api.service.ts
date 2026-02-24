import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@tattoobase/database';

/**
 * AdminApiService
 * - 全テナントを横断して参照できる管理者専用サービス
 * - 読み取り専用（書き込み・削除操作は実装しない）
 * - 将来的に AdminGuard で Role: ADMIN 検証を行う設計を前提とする
 */
@Injectable()
export class AdminApiService {
    constructor(private readonly prisma: PrismaService) { }

    /** システムダッシュボード: KYC件数、Webhook失敗、スタジオ数 */
    async getDashboard() {
        const [totalStudios, pendingKyc, failedWebhooks, riskEvents] = await Promise.all([
            this.prisma.studio.count(),
            this.prisma.kYCSubmission.count({ where: { status: 'pending' } }),
            this.prisma.webhookEvent.count({
                where: { processedAt: null, errorJson: { not: Prisma.JsonNull } },
            }),
            this.prisma.riskEvent.count({
                where: { occurredAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
            }),
        ]);
        return { totalStudios, pendingKyc, failedWebhooks, riskEventsLast24h: riskEvents };
    }

    /** KYC 審査キュー */
    getKycQueue() {
        return this.prisma.kYCSubmission.findMany({
            where: { status: 'pending' },
            orderBy: { birthDate: 'asc' },
        });
    }

    /** KYC 詳細 */
    getKycDetail(id: string) {
        return this.prisma.kYCSubmission.findUnique({ where: { id } });
    }

    /** Webhook イベント一覧 (監視目的) */
    getWebhooks() {
        return this.prisma.webhookEvent.findMany({
            orderBy: { receivedAt: 'desc' },
            take: 100,
        });
    }

    /** 監査ログ検索 */
    getAuditLogs(filters: { entityType?: string; actorId?: string; limit?: number }) {
        return this.prisma.auditLog.findMany({
            where: {
                ...(filters.entityType && { entityType: filters.entityType }),
                ...(filters.actorId && { actorId: filters.actorId }),
            },
            orderBy: { createdAt: 'desc' },
            take: filters.limit ?? 50,
        });
    }

    /** リスクプロファイル + 直近リスクイベント */
    getRiskMonitor() {
        return this.prisma.riskProfile.findMany({
            where: { tier: { in: ['HIGH', 'MEDIUM'] } },
            include: {
                user: { select: { id: true, email: true, riskEvents: { take: 5, orderBy: { occurredAt: 'desc' } } } },
            },
        });
    }

    /** スタジオ一覧 */
    getStudios() {
        return this.prisma.studio.findMany({
            include: { subscription: true },
            orderBy: { createdAt: 'desc' },
        });
    }

    /** スタジオ詳細 */
    getStudio(id: string) {
        return this.prisma.studio.findUnique({
            where: { id },
            include: {
                staffs: true,
                artists: true,
                subscription: true,
                bookings: { take: 10, orderBy: { createdAt: 'desc' } },
            },
        });
    }

    /** インシデントログ (AuditLog から action=INCIDENT フィルタ) */
    getIncidents() {
        return this.prisma.auditLog.findMany({
            where: { action: 'INCIDENT' },
            orderBy: { createdAt: 'desc' },
        });
    }

    /** レポート枠 (将来的に生成済みレポートテーブルに繋ぐ) */
    getReports() {
        return this.prisma.auditLog.findMany({
            where: { action: { startsWith: 'REPORT_' } },
            take: 50,
            orderBy: { createdAt: 'desc' },
        });
    }
}
