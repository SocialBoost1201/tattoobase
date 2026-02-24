# TattooBase Doc-04 Data Model
Version: v2.2.1
Last Updated: 2026-02-22
DB: PostgreSQL
ORM: Prisma
Note: 時刻は UTC + Local を併存し、studioTzを正本とする
Change Summary:
- ArtistProfile & PortfolioWork entities complete definition
- DesignRequest & DesignAsset with strict view controls and proofs
- RiskProfile & RiskEvent mapping explicitly defined
- Stripe Connect layout finalized (accountType, payoutStrategyKey)
- Keys, uniques, indexing and cascade policies documented

---
## 1. 共通設計ルール

### 1.1 ID & Keys
- Primary Key (id) は常に CUIDv2 または UUIDv4 とする。
- Stripe系の外部IDは文字列で保持（例: `sub_xxx`, `cus_xxx`, `pi_xxx`, `evt_xxx`）し、厳密にUnique Indexを張る。
- 外部API呼び出し用のトレーシングID (`requestId`) はログ関連で必ず利用する。

### 1.2 時刻 & Audit
- `createdAt` / `updatedAt`: UTC (Database default function `now()`) 
- 予約・営業関連: `scheduledAtUtc` + `scheduledAtLocal` + `studioTz` を併存必須化
- **DB設計上の必須ルール**: 更新系テーブルには原則としてAuditLogを書き出し、削除方針は論理削除（Soft Delete）を基本とするが、トランザクション・イベント系（WebhookEvent）はそのまま保存する。

### 1.3 参照整合性 (Relation & Cascade)
- 親が削除された場合の子の振る舞い: `Studio` のような大元が論理削除された場合、一連の予約も論理削除。但し、`Payment` などの会計正本は物理削除不可 (Restrict/NoAction)。

---
## 2. 主要エンティティ

### 2.1 Studio
スタジオ（課金主体・テナントのルート）
**Fields:**
- `id` (String, PK)
- `name`, `slug` (String, unique)
- `country`, `city`, `address` (String)
- `studioTz` (String, default: "Asia/Tokyo")
- `localeDefault` (Enum: ja/en)
- `status` (Enum: active/inactive)
- `stripeCustomerId` (String, unique null)
- `stripeSubscriptionId` (String, unique null)
- `stripeConnectAccountId` (String, unique null)
- `accountType` (Enum: EXPRESS | STANDARD | CUSTOM, default: EXPRESS)
- `payoutStrategyKey` (String, default: "default_express")
- `createdAt`, `updatedAt`

### 2.2 User
施術希望ユーザー
**Fields:**
- `id` (String, PK)
- `email` (String, unique)
- `phone` (String, unique null)
- `displayName` (String)
- `locale` (Enum: ja/en)
- `createdAt`, `updatedAt`

### 2.3 Staff
スタジオ所属の運用アカウント
**Fields:**
- `id` (String, PK)
- `studioId` (FK -> Studio.id)
- `displayName` (String)
- `role` (Enum: owner/admin/staff_manager)
- `isActive` (Boolean)
- `createdAt`, `updatedAt`

---
## 3. アーティスト・作品管理

### 3.1 ArtistProfile
アーティスト詳細と検索軸
**Fields:**
- `id` (String, PK)
- `studioId` (FK -> Studio.id)
- `staffId` (FK nullable -> Staff.id)
- `displayName` (String)
- `bio` (Text)
- `gender` (Enum: male/female/other/undisclosed)
- `specialties` (String[] / Tag Enum Array) - 例: 和彫, 洋彫, アニメ
- `styles` (String[] / Tag Enum Array)
- `avatarImageUrl` (String nullable)
- `isVerified` (Boolean, default: false)
- `isPublic` (Boolean, default: true)
- `createdAt`, `updatedAt`
**Indexes:** `(studioId)`, `(genres)`, `(isPublic)`

### 3.2 PortfolioWork (MediaAsset)
ポートフォリオとメタデータ
**Fields:**
- `id` (String, PK)
- `artistId` (FK -> ArtistProfile.id)
- `studioId` (FK -> Studio.id)
- `mediaUrls` (String[])
- `bodyPart` (String nullable)
- `size` (String nullable)
- `priceRange` (String nullable)
- `createdYear` (Int nullable)
- `nsfw` (Boolean, default: false)
- `tags` (String[])
- `visibility` (Enum: public/unlisted/private)
- `publishedAt` (DateTime nullable)
- `createdAt`, `updatedAt`

---
## 4. 予約・決済・Webhook (Phase1 Core)

### 4.1 Booking
予約の正本。StateMachineの管理対象。
**Fields:**
- `id` (String, PK)
- `studioId` (FK -> Studio)
- `userId` (FK -> User)
- `artistId` (FK -> ArtistProfile)
- `status` (Enum: draft/pending_payment/confirmed/cancelled/completed)
- `scheduledAtUtc`, `scheduledAtLocal`, `studioTz` (DateTime / String)
- `notes` (Text nullable)
- `policySnapshotJson` (Json)
- `pricingSnapshotId` (FK nullable)
- `reservationPolicyDecisionId` (FK nullable)
- `createdAt`, `updatedAt`
**State Rule:** `Confirmed` は Webhook 以外からの遷移を拒否。

### 4.2 Payment
決済の正本
**Fields:**
- `id` (String, PK)
- `bookingId` (FK -> Booking)
- `paymentIntentId` (String, UNIQUE 必須)
- `status` (Enum: pending/succeeded/failed/refunded)
- `amount` (Int)
- `currency` (String)
- `paymentType` (Enum: full/deposit/design_deposit)
- `createdAt`, `updatedAt`
**Constraint:** `(paymentIntentId)` は二重課金防止の最終防衛線としてUnique。

### 4.3 WebhookEvent
冪等・排他制御用の実行ログ
**Fields:**
- `id` (String, PK) - Stripeの `event.id` をそのまま使用することでUnique担保
- `type` (String)
- `receivedAt` (DateTime)
- `processingStartedAt` (DateTime nullable)
- `lockExpiresAt` (DateTime nullable)
- `processedAt` (DateTime nullable)
- `errorJson` (Json nullable)
- `createdAt`

---
## 5. デザイン保護 (Design Protection Layer)

### 5.1 DesignRequest
デザイン依頼・進行管理
**Fields:**
- `id` (String, PK)
- `bookingId` (FK -> Booking)
- `userId` (FK -> User)
- `artistId` (FK -> ArtistProfile)
- `status` (Enum: requested/deposit_required/in_design/delivered/cancelled)
- `depositRequired` (Boolean, default: true)
- `depositAmount` (Int nullable)
- `depositPaymentIntentId` (String nullable, FK -> Payment)
- `briefJson` (Json)
- `deliveryAssetId` (String nullable)
- `createdAt`, `updatedAt`

### 5.2 DesignAsset
納品物および保護（ビュー制限、ハッシュ証明）
**Fields:**
- `id` (String, PK)
- `designRequestId` (FK -> DesignRequest)
- `fileId` (String / CDN Path)
- `contentHash` (String, SHA256等。NOT NULL必須)
- `hashAlgo` (String, default: "sha256")
- `proofType` (Enum: internal_hash/notary/blockchain)
- `proofRef` (String nullable)
- `proofIssuedAt` (DateTime nullable)
- `watermarkPolicy` (Enum: strong/light/none)
- `visibility` (Enum: private/shared)
- `viewLimit` (Int, default: 5)
- `downloadAllowed` (Boolean, default: false)
- `createdAt`, `updatedAt`

---
## 6. リスクベース予約制御 (Risk Engine)

### 6.1 RiskProfile
ユーザー単位のスコアとTier
**Fields:**
- `id` (String, PK)
- `userId` (FK -> User, UNIQUE)
- `score` (Int: 0-100)
- `tier` (Enum: low/medium/high)
- `noShowCount` (Int)
- `lateCount` (Int)
- `cancelRate` (Float)
- `designCancelRate` (Float)
- `completedBookingCount` (Int)
- `reasonsJson` (Json array: ["late_frequently", "no_show_once"])
- `lastEvaluatedAt` (DateTime)
- `createdAt`, `updatedAt`

### 6.2 RiskEvent
スコア再計算のトリガーとなるユーザーの行動履歴
**Fields:**
- `id` (String, PK)
- `userId` (FK -> User)
- `eventType` (Enum: no_show/late/cancelled/payment_failed/completed)
- `bookingId` (FK nullable)
- `occurredAt` (DateTime)

### 6.3 ReservationPolicyDecision
予約要求時にRiskEngineが出した決定スナップショット
**Fields:**
- id (String, PK)
- bookingId (FK -> Booking)
- decision (Enum: allow/require_deposit/require_approval/block)
- appliedRulesJson (Json)
- overriddenByStaffId (FK nullable: スタッフ手動緩和)
- overrideReason (Text nullable)
- createdAt

---
## 7. SaaS 課金 (Subscription)

### 7.1 Subscription
**Fields:**
- id (PK)
- studioId (UNIQUE)
- status (active/grace/suspended/cancelled)
- currentPeriodEnd (DateTime)
- graceUntil (DateTime nullable) - 失敗時に現在+7日で設定
- stripeSubscriptionId (UNIQUE)

---
## 8. 監査ログ (AuditLog)

### 8.1 AuditLog
全更新系および重要参照ログ
**Fields:**
- id (String, PK)
- actorType (Enum: User/Studio/Admin/System)
- actorId (String)
- entityType (String)
- entityId (String)
- action (String)
- beforeJson (Json nullable)
- afterJson (Json nullable)
- requestId (String)
- createdAt (DateTime)

**明記される監査対象 (設計必須要件):**
1. Booking / Payment等の各種 Update
2. **DesignAsset の閲覧 (action: 'VIEW')**
3. **DesignAsset の生成・更新**
4. **DesignRequest の状態変更**
5. **ReservationPolicyDecision の生成およびスタジオ手動変更 (デポジット緩和判断)**
