# TattooBase Doc-03 Detailed Design
Version: v2.2.1
Last Updated: 2026-02-22
Owner: Architecture Council
Change Summary:
- Booking状態遷移マトリクス追加
- Risk Engine詳細化
- デザインデポジット分岐強化
- 冪等Webhook詳細明文化
- ペナルティ自動適用ロジック追加

## 1. Booking詳細設計

### 1.1 Booking状態
- draft
- pending_payment
- confirmed
- cancelled
- completed

### 1.2 許可遷移マトリクス

draft → pending_payment
draft → cancelled

pending_payment → confirmed（Webhookのみ）
pending_payment → cancelled

confirmed → completed
confirmed → cancelled（ポリシー条件付き）

completed → （遷移なし）

不正遷移はすべて拒否し、AuditLogに記録。

### 1.3 confirmed遷移条件
- WebhookEvent.status = succeeded
- event.id未処理
- paymentIntentId unique制約クリア
- 排他ロック取得成功

## 2. Payment/Webhook設計

### 2.1 Webhook処理フロー
1. event.id存在確認
2. 未処理なら処理開始フラグ
3. paymentIntentId整合性確認
4. Booking状態更新
5. WebhookEvent完了記録

### 2.2 冪等条件
- event.id unique
- paymentIntentId unique
- トランザクション内で排他ロック

## 3. Risk Engine設計

### 3.1 入力値
- ユーザー過去予約数
- 無断キャンセル率
- 遅刻率
- KYC有無
- 支払い失敗率

### 3.2 スコア算出（例）
base = 100
- 無断キャンセル1回 = -30
- 遅刻率 > 20% = -15
- KYC未実施 = -10
- 支払い失敗複数回 = -20

score = clamp(0, 100)

### 3.3 tier判定
- 80以上 = low
- 50〜79 = medium
- 49以下 = high

### 3.4 出力
- allow
- require_deposit
- require_approval
- block

ReservationPolicyDecisionとして保存。

## 4. デザインデポジット設計

### 4.1 depositRequired判定条件
- Risk tier = medium or high
- DesignRequest発生
- Studioポリシーで必須設定

### 4.2 デザインフロー
requested
→ deposit_required
→ (PaymentIntent生成)
→ Webhook成功
→ in_design
→ delivered

### 4.3 返金条件
- Studioキャンセル → 全額返金
- 顧客都合キャンセル → ポリシーに従う
- 無断キャンセル → 原則返金なし

### 4.4 例外解除
- Studio手動でdepositRequired=falseに変更可能
- 変更時はAuditLog必須

## 5. DesignAsset閲覧制御

### 5.1 表示ルール
- proofType=internal_hash
- contentHash生成必須
- watermarkPolicy適用
- downloadAllowed=false（Phase1）

### 5.2 viewLimit
- 初期値: 5回（将来変更可）
- 閲覧ごとにAuditLog生成

### 5.3 制限超過時
- 追加閲覧にはStudio承認または再デポジット

## 6. キャンセル・遅刻ロジック

### 6.1 無断キャンセル
- ステータス自動判定
- RiskProfile再計算
- 次回予約に制限適用

### 6.2 遅刻
- 設定時間超過で遅刻フラグ
- 一定回数でtier自動降格

### 6.3 ペナルティ適用順序
1. デポジット必須化
2. 承認制予約
3. ブロック

## 7. 一意制約と整合性

- paymentIntentId unique
- event.id unique
- DesignAsset.contentHash NOT NULL
- Booking.confirmedはWebhook以外禁止
- AuditLogは更新系全てに必須

## 8. エラー処理

- Webhook失敗は再試行
- 排他失敗はリトライ
- 不整合検知時はAdmin通知

## 9. 多言語

- 未翻訳キー検出はCIのみ失敗
- ローカルビルドは許容

## 10. 受け入れ基準

- 並列Webhook到達でも副作用1回
- 不正状態遷移が発生しない
- デザインデポジット未支払いでin_design不可
- 高リスクユーザーは自動制御される
- DesignAsset閲覧が監査可能
