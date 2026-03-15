import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ReservationDecision, RiskTier } from '@tattoobase/database';

export interface EvaluatedRisk {
    tier: RiskTier;
    score: number;
    decision: ReservationDecision;
    appliedRules: string[];
}

@Injectable()
export class RiskEngineService {
    private readonly logger = new Logger(RiskEngineService.name);

    constructor(private readonly prisma: PrismaService) {}

    /**
     * ユーザーのこれまでの行動履歴を集計してスコアを算出し、今回の予約リクエストに対する判定を下す
     */
    async evaluateRisk(userId: string): Promise<EvaluatedRisk> {
        let baseScore = 100;
        const appliedRules: string[] = [];
        
        // 1. ユーザーの行動履歴(RiskEvents)を取得
        const events = await this.prisma.riskEvent.findMany({
            where: { userId },
            orderBy: { occurredAt: 'desc' },
        });

        // 2. イベント種別ごとに減点（または加点）を計算
        const noShowCount = events.filter(e => e.eventType === 'no_show').length;
        const lateCount = events.filter(e => e.eventType === 'late').length;
        const cancelCount = events.filter(e => e.eventType === 'cancelled').length;
        const paymentFailedCount = events.filter(e => e.eventType === 'payment_failed').length;
        const completedCount = events.filter(e => e.eventType === 'completed').length;

        // 【ルール適用】
        if (noShowCount > 0) {
            baseScore -= (noShowCount * 30);
            appliedRules.push(`PENALTY: no_show_count=${noShowCount}`);
        }
        if (lateCount > 1) { // 1回までは許容
            baseScore -= ((lateCount - 1) * 15);
            appliedRules.push(`PENALTY: late_count=${lateCount}`);
        }
        if (paymentFailedCount > 0) {
            baseScore -= (paymentFailedCount * 20);
            appliedRules.push(`PENALTY: payment_failed_count=${paymentFailedCount}`);
        }
        
        // 頻繁なキャンセルのペナルティ（完了数と比較）
        const totalActionCount = completedCount + cancelCount;
        if (totalActionCount >= 3 && (cancelCount / totalActionCount) > 0.3) {
            baseScore -= 10;
            appliedRules.push('PENALTY: high_cancel_rate');
        }

        // 優良ユーザーへの加点
        if (completedCount >= 5 && noShowCount === 0 && lateCount === 0) {
            baseScore += 10;
            appliedRules.push('BONUS: faithful_customer');
        }

        // スコアのクランプ (0 ~ 100)
        const finalScore = Math.max(0, Math.min(100, baseScore));

        // 3. Tier判定
        let tier: RiskTier;
        if (finalScore >= 80) {
            tier = RiskTier.LOW;
        } else if (finalScore >= 50) {
            tier = RiskTier.MEDIUM;
        } else {
            tier = RiskTier.HIGH;
        }

        // 4. Action判定 (Decision)
        let decision: ReservationDecision;
        // ※Phase1では、全体を通して Deposit を要求する/しない の二元管理を主軸とする
        if (tier === RiskTier.HIGH) {
            // Highリスクは原則承認制（またはブロック）とするが今回はRequireApproval
            decision = ReservationDecision.REQUIRE_APPROVAL;
            appliedRules.push('DECISION: HIGH_TIER -> REQUIRE_APPROVAL');
        } else if (tier === RiskTier.MEDIUM) {
            // Mediumリスクにはデポジットを要求
            decision = ReservationDecision.REQUIRE_DEPOSIT;
            appliedRules.push('DECISION: MEDIUM_TIER -> REQUIRE_DEPOSIT');
        } else {
            // Lowリスクは通常通り許可
            decision = ReservationDecision.ALLOW;
            appliedRules.push('DECISION: LOW_TIER -> ALLOW');
        }

        this.logger.log(`Evaluated User ${userId} - Score: ${finalScore}, Tier: ${tier}, Decision: ${decision}`);

        // 5. DBのRiskProfileを更新 (サイドエフェクト)
        await this.prisma.riskProfile.upsert({
            where: { userId },
            update: {
                tier,
                score: finalScore
            },
            create: {
                userId,
                tier,
                score: finalScore
            }
        });

        return {
            tier,
            score: finalScore,
            decision,
            appliedRules,
        };
    }
}
