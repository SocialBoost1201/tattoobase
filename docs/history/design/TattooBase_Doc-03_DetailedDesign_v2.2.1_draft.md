# TattooBase Doc-03 Detailed Design
Version: v2.2.1
Last Updated: 2026-02-22

## 1. リスクベース予約制御

### 1.1 判定フロー
1. RiskProfile取得
2. tier評価
3. DesignRequest有無確認
4. ReservationPolicyDecision生成

### 1.2 デポジット適用ルール
- tier = low → 通常予約
- tier = medium/high → depositRequired = true
- DesignRequest発生時 → 原則 depositRequired = true
- Studio緩和可（AuditLog必須）

## 2. デザイン保護フロー
1. DesignRequest作成
2. depositRequired判定
3. デポジット支払い完了後 in_design へ遷移
4. DesignAsset生成時 contentHash計算
5. proofType = internal_hash
6. 閲覧時AuditLog記録
