# TattooBase Doc-02 Architecture
Version: v2.2.1
Last Updated: 2026-02-22
Scope: SaaS主軸 / Phase1-3完全統合構造設計

---
## 1. 設計方針
TattooBaseは「予約ツール」ではなく、「スタジオ経営OS」および「アーティスト保護プラットフォーム」として設計する。
基本思想：
- SaaS月額課金を主軸とし安定ARR優先
- 将来のMarketplace化（Stripe Connect抽象化）が容易な構造
- 決済の冪等性と排他制御を最優先
- ステートマシンによる状態遷移統制
- CIのみ未翻訳失敗とするi18n方針
- 更新系APIへの監査ログ（AuditLog）の強制
- モジュラーモノリス前提、将来独立サービス化可能構造

---
## 2. 全体構成（モジュラーモノリス）
### 2.1 モノレポ構成
- `apps/`
  - `user-pwa` (顧客体験: 軽量・予約フロー・ポートフォリオ)
  - `studio-web` (店舗運用: 予約管理、プロフィール・デザイン保護管理)
  - `admin-web` (運営: KYC審査、監査ログ監視)
  - `api` (NestJS: ロジック集約レイヤー)
- `packages/`
  - `database` (Prisma)
  - `shared-types`
  - `i18n` (日英完全対応。CI検証用)

---
## 3. アプリケーション・レイヤー構造
### 3.1 Presentation Layer
- Next.js (App Router)
- JWT + HTTP Only Cookie

### 3.2 API Layer (NestJS)
- UseCase単位での分離
- リクエストごとの `requestId` 伝播

### 3.3 Domain Layer (主要モジュール)
明確なドメイン境界を定義：
- **Booking Module:** 状態遷移統制
- **Risk Engine:** 行動スコア、予約可否判定
- **Payment & Pricing:** スナップショット正本化、Stripe Connect抽象化
- **Design Protection:** アセットアクセス制御、ハッシュ管理
- **Audit & Webhook:** 冪等性、監査証跡

### 3.4 Infrastructure Layer
- PostgreSQL (プライマリDB)
- Prisma (ORM)
- Stripe (Stripe Billing / PaymentIntent / Connect)
- S3互換ストレージ (KYC, ウォーターマーク済みDesignAsset)

---
## 4. ドメインモジュールの責務詳細
### 4.1 Booking & StateMachine Module
- 状態遷移の単一窓口 ( `Draft` -> `PendingPayment` -> `Confirmed` など)
- 不正遷移のブロック
- 更新時における同一トランザクションでのAuditLog記録

### 4.2 Webhook & Payment Module
- 決済確定はWebhook (`payment_intent.succeeded`) のみで成立させる
- `WebhookEvent` を用いた並列処理の排他ロック・リトライ
- `paymentIntentId` による二重課金の確実な防止

### 4.3 Stripe Connect抽象化レイヤー (Payout Strategy)
- 今後機能する `Transfer` を見据え、アカウント単位で `accountType` (Express/Standard/Custom) を抽象化
- Phase1はExpress固定だがStrategyパターンで将来の分配処理を分離可能にする

### 4.4 Risk Engine (新規)
- ユーザーの行動履歴 (cancelRate, lateCount等) から RiskTier (Low/Mid/High) を算出
- 算出結果に基づき `ReservationPolicyDecision` を発行し、Deposit要否を動的に切り替える
- スタジオによる意図的な例外（Deposit免除など）は必ずAuditLogに記録

### 4.5 Design Protection Layer (新規)
- 独立モジュールとしてDesignAsset (画像ファイル) を管理
- `watermarkPolicy` を通した透かしの強制
- ダウンロード防止 (`downloadAllowed` の制御)
- ファイルアクセス(view)やステータス更新を監査イベントとして `AuditLog` に伝播させる責務

### 4.6 Pricing Engine
- Snapshot パターン（`PricingSnapshot` をBookingに紐付けて固定化）
- 設計依頼の `designDepositAmount` の加算

---
## 5. 監査とイベント伝播
- データベースの `AuditLog` テーブルをすべての不正対策・証明の基盤とする
- `requestId`、`actor`（誰が）、`beforeJson`/`afterJson`（どう変わったか）をトランザクション単位で保証
- 「DesignAssetの閲覧」「DesignRequestの更新」「デポジット免除の例外判断」は専用の AuditEmitter を通して記録

---
## 6. フェーズ別実装と拡張
- **Phase1（実行中）:** Booking、PaymentIntent、Risk判定（基礎）、DesignDeposit（基礎）、Audit基盤
- **Phase2:** Connect Transfer 実装、CRM拡張、LTV指標ダッシュボード
- **Phase3:** 物販、広告高度化

End of Document
