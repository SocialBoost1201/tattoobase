# TattooBase Data Model
Version: v2.2.1
Last Updated: 2026-02-22

## 1. 目的
TattooBase を業界標準OSとして設計するためのデータモデル定義。
Doc-01 v2.2.0 に準拠。

## 2. Artist
- id
- studioId
- displayName
- bio
- gender enum (male/female/other/undisclosed)
- specialties Tag[]
- styles Tag[]
- avatarImageId
- isVerified Boolean
- publicPortfolioEnabled Boolean
- createdAt
- updatedAt

## 3. PortfolioWork
- id
- artistId
- images[]
- tags[]
- visibility enum (public/unlisted/private)
- publishedAt
- createdAt
- updatedAt

## 4. DesignRequest
- id
- bookingId
- userId
- artistId
- status enum (requested/accepted/deposit_required/in_design/delivered/cancelled)
- depositRequired Boolean
- depositAmount Int
- depositPaymentIntentId String?
- briefJson Json
- deliveryAssetId String?
- createdAt
- updatedAt

## 5. DesignAsset
- id
- designRequestId
- fileId
- contentHash String (SHA256)
- hashAlgo String ("sha256")
- proofType enum (internal_hash/notary/blockchain)
- proofRef String?
- proofIssuedAt DateTime?
- watermarkPolicy enum
- visibility enum
- viewLimit Int
- downloadAllowed Boolean default false
- createdAt
- updatedAt

## 6. RiskProfile
- id
- userId
- score Int (0-100)
- tier enum (low/medium/high)
- reasonsJson Json
- lastEvaluatedAt
- createdAt
- updatedAt

## 7. ReservationPolicyDecision
- id
- bookingId
- decision enum (allow/require_deposit/require_approval/block)
- appliedRulesJson Json
- createdAt

## 8. AuditLog対象強化
以下は全てAuditLog対象:
- DesignAsset閲覧
- DesignAsset生成/更新
- DesignRequest状態変更
- ReservationPolicyDecision生成/変更
- デポジット緩和判断
