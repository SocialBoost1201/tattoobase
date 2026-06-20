# TattooBase 開発実績サマリー (Dev Log Analysis)

- **Version**: v1.0
- **作成日**: 2026-06-20
- **対象期間**: 2026-02-24 〜 2026-05-23
- **総コミット数**: 49
- **文書版数**: Requirements v2.2.1 / Architecture v2.2.1（体系的ドキュメント管理）
- **形態**: pnpm + Turborepo モノレポ（Node 20.x / pnpm 9.15.4）
- **コンセプト**: タトゥースタジオ向け「予約運用OS」＋アーティスト保護レイヤー

> 本書は git コミットログ（49コミット）とコードベース全体の静的調査に基づき、
> Phase1 時点の実装実績を棚卸ししたものである。

---

## 1. 開発タイムライン（git log フェーズ分析）

| Phase | 期間 | 内容 |
|---|---|---|
| **Phase 0** | 2026-02-24 | 基盤構築。初期コミット（iCloud→ローカル移行）/ seed / .env / api scaffold |
| **Phase 1** | 2026-03-15 | デプロイ基盤の安定化（集中対応・15コミット）。Vercel × pnpm workspace × Node20 互換問題を総当たりで解消（ERR_INVALID_THIS / undici / prisma generate / lockfile v9）。Phase 3-5: KYC・AuditLog・Deposits・デプロイインフラ実装 |
| **Phase 2** | 2026-03-18 | プロダクトUI/UX大量実装（1日で20コミット — 主力開発日）。Phase 6: トップUI刷新 + GSAPスプラッシュ / Phase 8-10: Studio Web UI・MyPage / Phase A-J: ワールドクラスUX / Phase E+I: AIアシスタント・カレンダー。検索・地図(Leaflet/OSM)・ソート・フィルタ件数・お気に入り・PC/スマホ完全レスポンシブ・SEOエリアページ・PWA基盤・Prismaスキーマ拡張 |
| **Phase 3** | 2026-05-18 | 品質修復。本番ビルド復旧 / `/area` ルート衝突解消 / モバイル可読性正規化 |
| **Phase 4** | 2026-05-22〜23 | モバイルUX監査 → 改善（#7〜#14 連番タスク）。Mobile-UX-Audit レポート v1.0（MFRIスコアリング）→ Serwist製 PWA SW 正式導入 / 共通Modal / WCAG 44pxタップ標的 / safe-area / reduced-motion / z-index・stickyトークン化 |

> 開発の山場は **2026-03-18** の1日で、トップUI刷新からAIアシスタント・地図検索・レスポンシブ化まで20コミットが集中投入されている。

---

## 2. モノレポ構成（apps × 4 / packages × 3）

```
tattoobase/
├── apps/
│   ├── user-pwa/    顧客向けPWA       Next.js16 + React19   [本番品質]
│   ├── studio-web/  スタジオ管理      Next.js16 + React19   [MVP]
│   ├── admin-web/   運営管理          Next.js16 + Material3 [MVP]
│   └── api/         バックエンドAPI   NestJS 10 + Prisma    [機能網羅]
├── packages/
│   ├── database/    Prisma スキーマ + seed (PostgreSQL)
│   ├── i18n/        ja / en ロケール
│   └── shared-types/ (プレースホルダ・将来用)
└── docs/            要件〜運用まで12種の正本＋履歴版を体系管理
```

---

## 3. user-pwa（顧客向けPWA） — 21ページ / 31コンポーネント

**技術**: Next.js 16 App Router / React 19 / Tailwind v4 / NextAuth v5 / Serwist PWA / GSAP + Lenis / Leaflet + OSM / Three.js / Stripe Elements

### 主要ルート

| ルート | 内容 |
|---|---|
| `/` | トップ（3D Hero / 人気ジャンル / 安心訴求） |
| `/search` | アーティスト検索（リスト⇔地図トグル） |
| `/area`, `/area/[prefecture]` | エリア導線（SEO都道府県ページ） |
| `/artist/[id]` | アーティスト詳細 + レビュー |
| `/portfolio/[id]`, `/design/[id]` | 作品・デザイン詳細（リッチUI） |
| `/facilities/[slugOrId]` | タトゥーフレンドリー施設（温泉/ジム等） |
| `/booking/start`, `/booking/[id]` | 予約フロー（Stripe決済） |
| `/account/*` | マイページ（bookings/designs/saved/kyc/risk） |
| `/guide/beginner` | 初心者ガイド |
| `/login`, `/login/verify` | メール認証ログイン |
| `/~offline` | オフラインフォールバック |

### 実装済み機能

- ✓ フリーワード検索 / ジャンル・性別・地域フィルタ / 件数リアルタイム表示
- ✓ ソート（新着/人気/評価/価格） / お気に入り保存（localStorage）
- ✓ AIスタイルアシスタント（多段質問でスタイル提案）
- ✓ Leaflet地図検索（評価付きカスタムピン・完全無料OSM）
- ✓ 作品ウォーターマーク表示 / 施設UGC通報モーダル
- ✓ PWA: ServiceWorker(Serwist) / A2HS / スプラッシュ / OfflineBanner
- ✓ モバイル: BottomNav / safe-area / 44pxタップ標的 / reduced-motion対応

---

## 4. studio-web（スタジオ管理） — テナント単位の運用ダッシュボード

| ルート | 内容 |
|---|---|
| `/studio` | ダッシュボード（当日予約/稼働） |
| `/studio/bookings/[id]` | 予約管理（承認/却下） |
| `/studio/calendar` | 予約カレンダー（時間枠） |
| `/studio/artists/[id]` | アーティスト管理（bio/得意ジャンル/料金） |
| `/studio/portfolio`, `/studio/designs/[id]` | 作品・デザイン管理 |
| `/studio/settings/deposit` | 入金（前金）設定 |
| `/studio/billing`, `/studio/risk` | 請求 / リスク監視 |

---

## 5. admin-web（運営管理） — Material Design 3 自前デザインシステム

| ルート | 内容 |
|---|---|
| `/admin` | システムダッシュボード |
| `/admin/kyc/[id]` | KYC審査キュー（承認/却下） |
| `/admin/risk` | リスク評価管理 |
| `/admin/incidents`, `/admin/reports` | インシデント / 通報管理 |
| `/admin/audit` | 監査ログ閲覧 |
| `/admin/studios/[id]` | スタジオ管理 |
| `/admin/facilities` | 施設CRUD + UGC通報レビュー |
| `/admin/webhooks` | Webhook監視 |

- **DS**: Text / Button / Card / Row / TextInput / StateLayer 等 M3コンポーネント自作

---

## 6. api（NestJS 10） — ドメイン駆動 + 多層API

### ドメイン層
- ✓ **BookingStateMachineService**: 予約ライフサイクル状態遷移
- ✓ **RiskEngineService**: 行動スコアリング（0-100 / 3ティア / 自動判定）
  - penalty: no_show `-30` / late `-15` / payment_failed `-20`
  - tier: LOW(80+) / MEDIUM(50-79) / HIGH(<50) → ALLOW/REQUIRE_DEPOSIT/REQUIRE_APPROVAL/BLOCK

### 決済（StripeWebhookController）
- ✓ 署名検証（raw body）/ `payment_intent.succeeded` 処理
- ✓ 冪等化ロック（5分タイムアウト）+ WebhookEvent復旧テーブル
- ✓ 全状態変更を監査ログ連携

### API層
- ✓ **user-api**: アーティスト/スタジオ/作品検索・予約Draft・KYC提出・施設通報
- ✓ **studio-api**: テナント分離(studioId)・予約承認/却下・作品/料金/入金設定
- ✓ **admin-api**: 横断ダッシュボード・KYC審査・監査・リスク・施設管理

### 横断関心事（ミドルウェア/インターセプタ）
- ✓ **RequestIdMiddleware**: `x-request-id` 分散トレーシング
- ✓ **StripeRawBodyMiddleware**: Webhook署名用 raw body 保持
- ✓ **AuditLogInterceptor**: 全更新系を before/after で監査記録

---

## 7. database（Prisma / PostgreSQL） — 主要エンティティ群

| 領域 | モデル |
|---|---|
| 予約 | `Booking`（20状態: Draft→PendingPayment→Confirmed→…→Completed） |
| 決済 | `Payment` / `WebhookEvent`（冪等ロック） / `PricingSnapshot` |
| テナント | `Studio`(slug境界) / `Staff` / `ArtistProfile`(検索最適化) / `PortfolioWork` |
| デザイン | `DesignRequest` / `DesignAsset`(可視性・閲覧上限・透かし) / `DesignDeposit`(保護=前金) |
| リスク | `RiskProfile` / `RiskEvent` / `ReservationPolicyDecision` |
| 本人確認 | `KYCSubmission`（暗号化ファイルパス・審査トレイル） |
| 監査 | `AuditLog`(actor/entity/before/after/requestId) / `ConsentDocument` |
| 認証 | `Account` / `Session` / `VerificationToken`（NextAuth v5） |
| 施設UGC | `Facility`(温泉/銭湯/ジム/ホテル等) / `FacilityReport`(ユーザー投稿→審査) |

- **seed**: スタジオ5（東京×2/大阪/京都/福岡）・スタッフ10・アーティスト20+・施設

---

## 8. 横断的実装（i18n / インフラ / 品質）

- ✓ **i18n**: ja/en ロケール + パラメータ化文字列 + validate.js
- ✓ **デプロイ**: Vercel(web) / Docker(api) / Turborepo / 環境変数体系
- ✓ **SEO**: sitemap / robots / 都道府県エリアページ / パンくず
- ✓ **PWA**: Serwist SW / manifest / maskable icon / View Transitions
- ✓ **アクセシビリティ**: WCAG 44px / aria-modal / reduced-motion / safe-area
- ✓ **ドキュメント**: 要件・アーキ・詳細設計・データモデル・UIUX・AI・LLM・テスト戦略・リスク管理・運用Runbook を版管理（履歴保持）

---

## 9. 実装ステータス総括

### 完了（Complete）
予約状態機械 / Stripe決済(冪等) / リスクスコアリング / 多テナント分離 / アーティスト検索 / KYC審査 / 監査ログ / 施設UGC / 3管理画面ダッシュボード / デザイン管理 / i18n

### 部分（Partial）
- 認証: NextAuthテーブル有・JWTガードは設計段階（MVPはquery認証）
- shared-types: プレースホルダ

### 特徴的な強み
1. **二重課金防止**（Webhook確定 + 冪等ロック）が設計通り実装
2. **アーティスト保護**（デザイン前金 / 閲覧制限 / 透かし）を作り込み
3. **リスクベース予約制御**（行動スコア→自動判定）が稼働
4. **監査ログ必須ポリシー**を Interceptor で全更新系に強制
5. **モバイルUX監査→改善のPDCA**をドキュメント駆動で実施

> 設計思想（要件書 v2.2.1 の「Webhook確定/冪等/監査必須/アーティスト保護/リスク制御」）が、
> コード上の `WebhookEvent` ロック・`AuditLogInterceptor`・`DesignDeposit`/`DesignAsset`・
> `RiskEngineService` として実際に存在している点が本プロジェクトの完成度を示す。
