# TattooBase Doc-04 Data Model
Version: v2.2.1
Last Updated: 2026-02-22
DB: PostgreSQL
ORM: Prisma
Note: 時刻は UTC + Local を併存し、studioTzを正本とする
Change Summary:
- Artist/Portfolio entities added per Doc-01 v2.2.0
- DesignRequest / DesignAsset introduced with strong protection
- RiskProfile / ReservationPolicyDecision introduced to control friction
- Required AuditLog explicit scoping for DesignAsset access and Policy exceptions

---
## 1. 共通設計ルール
### 1.1 ID
- 基本は UUID
- Stripe系IDは文字列で保持（例: sub_xxx, cus_xxx, pi_xxx）

### 1.2 時刻
- createdAt/updatedAt: UTC
- 予約・営業関連: scheduledAtUtc + scheduledAtLocal + studioTz を必須化

### 1.3 正本スナップショット
- 料金: PricingSnapshot を正本
- 規約: PolicySnapshot を正本
- プラン: PlanSnapshot を正本

---
## 2. 主要エンティティ
### 2.1 Studio
スタジオ（課金主体）
Fields:
- id
- name
- slug
- country
- city
- address
- studioTz
- localeDefault (ja/en)
- status (active/inactive)
- stripeCustomerId
- stripeSubscriptionId
- accountType (EXPRESS/STANDARD/CUSTOM) - 抽象化前提
- stripeConnectAccountId
- createdAt, updatedAt

---
### 2.2 User
施術希望ユーザー
Fields:
- id
- email
- phone
- displayName
- locale (ja/en)
- createdAt, updatedAt

---
### 2.3 Staff
スタジオオーナー・管理者向けアカウント
Fields:
- id
- studioId
- displayName
- role (owner/admin/staff_manager)
- isActive
- createdAt, updatedAt

---
### 2.4 Artist
実際に施術やデザインを担当するアーティスト
Fields:
- id
- studioId
- staffId (nullable: staffアカウントと紐付く場合)
- displayName
- profileText
- gender (female/male/other/unspecified)
- genres (Json Array: 和彫, 洋彫, アニメ, etc)
- faceImageUrl (nullable)
- isVerified (Boolean)
- isPublic (Boolean)
- createdAt, updatedAt

---
### 2.5 PortfolioWork
アーティストの作品・実績管理
Fields:
- id
- artistId
- studioId
- imageUrl (CDN path)
- description (nullable)
- tags (Json array)
- visibility (public/hidden)
- publishControls (Json)
- createdAt, updatedAt

---
## 3. 予約・制約・決済
### 3.1 Booking
予約の正本
Fields:
- id
- studioId
- userId
- artistId
- status (BookingStatus: PendingPayment/Confirmed/Completed/Cancelledなど)
- scheduledAtUtc (nullable)
- scheduledAtLocal (nullable)
- studioTz (nullable)
- notes (nullable)
- policySnapshotJson
- pricingSnapshotId (nullable)
- riskProfileId (nullable: 予約時点のスコア)
- reservationPolicyDecisionId (nullable)
- createdAt, updatedAt

---
### 3.2 PricingSnapshot
料金計算の正本
Fields:
- id
- studioId
- bookingId (unique)
- currency
- basePrice
- discountAmount
- platformFeeAmount
- paymentFeeAmount
- taxAmount
- totalAmount
- calcVersion
- createdAt

---
### 3.3 Payment
決済の正本（PaymentIntent基準）
Fields:
- id
- bookingId
- paymentIntentId (unique)
- status (Pending/Succeeded/Failed/Refunded)
- amount
- currency
- paymentType (Deposit / Full / DesignDeposit)
- createdAt, updatedAt

---
### 3.4 WebhookEvent
冪等・排他制御の正本
Fields:
- id (Stripe event.id)
- type
- receivedAt
- processingStartedAt (nullable)
- lockExpiresAt (nullable)
- processedAt (nullable)
- errorJson (nullable)

---
## 4. アーティスト保護（デザイン・リスク）
### 4.1 RiskProfile
顧客のリスク・信用スコア
Fields:
- id
- userId (unique)
- score (Float)
- tier (LowRisk / MidRisk / HighRisk)
- noShowCount (Int)
- lateCount (Int)
- cancelRate (Float)
- designCancelRate (Float)
- completedBookingCount (Int)
- reviewScore (Float)
- reasons (Json array)
- lastEvaluatedAt
- createdAt, updatedAt

### 4.2 ReservationPolicyDecision
スコアに基づく予約要件の自動判定
Rule:
- 初回ユーザー（Completed=0）に対してはデポジットを一律強制しない
- tier=Mid/High の場合は予約デポジット必須
- 例外的にStudioが緩和判断した場合は監査ログ必須
Fields:
- id
- bookingId
- riskProfileId
- decision (allow / require_deposit / require_approval / block)
- appliedRulesSnapshot (Json)
- overriddenByStaffId (nullable: 例外緩和実施者)
- overrideReason (nullable)
- decidedAt

---
### 4.3 DesignRequest
デザイン依頼・制作進捗・デポジット要件
Rule:
- デザイン依頼が発生する場合は原則デポジット必須
Fields:
- id
- bookingId
- userId
- artistId
- status (Requested / DepositPaid / InProgress / Delivered / Locked)
- requiresDeposit (Boolean: 原則 true)
- requiredDepositAmount (nullable)
- briefSpecText (nullable)
- createdAt, updatedAt

### 4.4 DesignAsset
納品画像・保護アセット
Rule:
- downloadAllowed は原則 false。透かし（watermark）必須。
Fields:
- id
- designRequestId
- contentHash (証明用SHA256等)
- originalFilePath (encrypted CDN/S3 Path)
- watermarkedFilePath
- lowResFilePath
- watermarkPolicy (Json: UserId埋め込み等)
- visibility (strict/shared/public)
- viewLimit (Int: 閲覧回数制限)
- isDownloadable (Boolean: default false)
- createdAt, updatedAt

---
## 5. 監査ログ
### 5.1 AuditLog
更新系・重要閲覧履歴の正本
Fields:
- id
- actorType (User/Studio/Admin/System)
- actorId
- entityType (Booking, Payment, DesignRequest, DesignAsset, PolicyDecision etc)
- entityId
- action
- beforeJson
- afterJson
- requestId
- createdAt

**[特別要件: AuditLog 対象の明文化]**
- API等の更新系は必ず書く（Booking / Payment / Subscription等）
- **DesignAssetの閲覧(view)**、**DesignAssetの生成・更新** は必ずAuditLog対象とする（漏洩・不正利用検知用）
- **DesignRequestの状態更新** は必ずAuditLog対象とする
- **ReservationPolicyDecisionの生成・例外変更**（Studioによるデポジット免除など）は必ずAuditLog対象とする（「誰が・なぜ・いつ」を事後追跡可能にするため）

---
End of Document
