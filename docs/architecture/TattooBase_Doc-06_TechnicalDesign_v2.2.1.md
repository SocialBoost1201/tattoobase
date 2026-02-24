# TattooBase Doc-06 Technical Design
Version: v2.2.1
Last Updated: 2026-02-22
Owner: Technical Council

## 1. Stripe決済フロー（予約金・デザインデポジット）
- **PaymentIntent生成**: 予約作成時またはデザインデポジット要求時に一意のPaymentIntentを動的生成し、クライアントに `client_secret` を返却する。
- **正本IDと制約**: `paymentIntentId` を決済の正本IDとし、DB上で完全な `UNIQUE` 制約を持たせる。二重課金や複数予約への使い回しを必ず防止する。
- **デポジット分離管理**: 予約時の前金と、DesignRequestに基づくデザインデポジットは `paymentType` 等の論理フィールドで区別し、必要額を適切にChargeする。

## 2. Webhook排他ロック設計
- **排他用フィールド**: `WebhookEvent` テーブルの `processingStartedAt` (処理開始日時) と `lockExpiresAt` (ロック有効期限) を用いる。
- **ロック取得**: Webhook受信時、該当 `event.id` のレコードを INSERT するか、未処理状態 (`processedAt IS NULL` かつロック期限切れ) であることを条件に `processingStartedAt` をアトミックに取得(UPDATE)する。
- **多重実行防止**: ロック取得に失敗した並列リクエストは安全にドロップまたは 200 OK を即座に返す。

## 3. 冪等設計とトランザクション境界
- **冪等性**: `event.id` に一意制約を付与し、かつ処理済みフラグ (`processedAt`) によって同一イベントの二重適用を排除する。
- **トランザクション**: 「決済ステータス更新」「予約状態(Booking.status)の confirmed への遷移」「監査ログ (AuditLog) の記録」は**全て同一のデータベーストランザクション**内で実行する。一部でも失敗すればロールバックし、後続リトライに委ねる。

## 4. Stripe Connect抽象化
- **accountType**: 各Studioエンティティに `EXPRESS`, `STANDARD`, `CUSTOM` のEnum値を持たせ、実装初期は常に `EXPRESS` を想定する。
- **payoutStrategy**: 将来の機能拡張（Transfer処理や動的比率計算）を見据え、入出金ロジックをStrategyパターン化（`payoutStrategyKey`）しておく。これにより、フェーズ2以降の本実装時へのコード侵襲を最小限に抑える。

## 5. Grace期間（7日）処理詳細
- **自動引き落とし失敗時**: スタジオ向けSubscription利用料の引き落としに失敗した場合、直ちにアカウントを凍結せず `status = grace` ステータスへ移行させる。
- **GraceLimit**: `graceUntil` フィールドに「失敗発生日時 + 7日間」を設定。猶予期間中は全てのシステムアクセスをそのまま許可する。
- **期限超過時**: バッチ処理等により `graceUntil` を超過したスタジオのみを抽出し、`status = suspended` へ移行。管理機能・予約受け付けを安全に停止する。

## 6. 監視・アラート設計
- **Webhook遅延**: Stripe側発火日時と `receivedAt` の乖離、または `lockExpiresAt` の多発超過を監視し、遅延や処理スタックを検知する。
- **決済失敗率**: `Payment.status = failed` の多発など、異常な決済レートを監視してビジネスへアラート通知する。
- **未翻訳検知**: Phase1原則に従い、i18nキーの欠落はあくまで CI 上でのみ検知(Failed)させ、アラートは通常の本番稼働には影響させない。

## 7. ファイルストレージ（DesignAsset）署名URL方針
- **実体保存**: オリジナル画像、透かし入り画像は S3（または互換オブジェクトストレージ）の非公開バケットに保存。
- **アクセス制御**: `DesignAsset` へのアクセス権限を持つユーザーからの要求時のみ、短時間有効な署名付きURL (Signed URL) を発行する。
- **AuditLog必須**: URLを発行（＝閲覧許可）したAPIエンドポイント内で、必ず AuditLog (Action: VIEW) を発行し、誰が・いつ・どのデザインを見たかを記録する。

## 8. 将来マイクロサービス分割ポイント
- **Risk Engine**: 高度なスコアリングロジック、将来的なMLモデルの組み込みを想定し、メインAPIから分離可能な境界とする。
- **Design Protection Module**: 画像の大量透かし・ハッシュ生成処理・ブロックチェーン登録機能を非同期の独立Worker/マイクロサービスとして切り出せる構造。
- **Artist Search Engine**: RDBのLIKE検索から脱却し、Elasticsearch / Algolia等の専用検索クラスタへインデックス同期を行う想定。
