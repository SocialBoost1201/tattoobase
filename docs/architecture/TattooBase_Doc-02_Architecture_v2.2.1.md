# TattooBase Doc-02 Architecture
Version: v2.2.1
Last Updated: 2026-02-22
Owner: Architecture Council
Change Summary:
- Risk Engine明文化
- Design Protection Layer追加
- 状態遷移統制レイヤー明確化
- 監査伝播構造強化

## 1. アーキテクチャ原則

### 1.1 中核原則
- モジュラーモノリス構造
- ドメイン単位の明確な責務分離
- 決済確定はWebhookのみ
- 更新系は必ず監査ログ記録
- 冪等性・排他最優先
- 将来のサービス分割を前提とした設計

### 1.2 レイヤー構造

Presentation Layer
- User PWA
- Studio Web
- Admin Web

Application Layer
- Booking Service
- Payment Service
- Risk Engine
- Design Protection Service
- Artist Profile Service
- KYC Service

Domain Layer
- Booking Aggregate
- Payment Aggregate
- DesignRequest Aggregate
- RiskProfile Aggregate
- Artist Aggregate

Infrastructure Layer
- Prisma / PostgreSQL
- Stripe
- File Storage
- Webhook Receiver
- CI Pipeline
- AuditLog Store

## 2. モジュール構成

### 2.1 Booking Module
責務:
- 予約作成
- 状態遷移管理
- キャンセルポリシー適用
- ReservationPolicyDecision生成

Bookingは状態機械で管理。
許可された遷移のみ実行可能。

### 2.2 Payment Module
責務:
- PaymentIntent生成
- Webhook受信
- 冪等処理
- Confirmed遷移トリガ

WebhookEventが唯一の確定トリガ。

### 2.3 Risk Engine
責務:
- 行動スコア算出
- tier判定 (low/medium/high)
- 予約時の制御判断生成

Risk EngineはBooking作成前に呼び出される。
出力:
- allow
- require_deposit
- require_approval
- block

### 2.4 Design Protection Layer
責務:
- DesignRequest管理
- デポジット必須判定
- DesignAsset生成
- contentHash生成
- proofType管理
- 閲覧制御
- AuditLog伝播

DesignAssetは内部ハッシュ方式で開始。
proofTypeは抽象化済。

### 2.5 Artist Profile Module
責務:
- ジャンル管理
- 性別属性
- ポートフォリオ管理
- 検索用インデックス前提

### 2.6 KYC Module
責務:
- 身分証管理
- リスク判定補助
- ステータス管理

## 3. 状態遷移統制

Booking状態:
draft
pending_payment
confirmed
cancelled
completed

Confirmed遷移条件:
- Webhook成功のみ

DesignRequest状態:
requested
deposit_required
in_design
delivered
cancelled

in_design遷移条件:
- deposit支払い完了

## 4. 冪等性設計

- paymentIntentId unique
- WebhookEvent tableで排他制御
- event.id単位で一意制約
- 再試行安全設計

## 5. 監査ログ伝播

全更新系は以下を必須:
- requestId
- actorId
- entityType
- entityId
- before/after snapshot

対象:
- Booking更新
- DesignRequest更新
- DesignAsset閲覧
- RiskDecision生成
- KYC判定
- 手動ポリシー解除

## 6. Stripe Connect前提

- accountType enum (EXPRESS/STANDARD/CUSTOM)
- payoutStrategy抽象化
- Phase1はExpressStrategyのみ

Transfer処理はPhase2以降。

## 7. 非機能設計

- 未翻訳キー検出はCIのみ失敗
- ローカルビルドは失敗させない
- Webhook再試行設計
- 監視対象定義（決済失敗、Webhook遅延）

## 8. 将来拡張ポイント

- 検索エンジン分離
- LTV分析基盤
- スタッフ評価モジュール
- ブロックチェーン証明
- 広告配信基盤
- マイクロサービス分割
