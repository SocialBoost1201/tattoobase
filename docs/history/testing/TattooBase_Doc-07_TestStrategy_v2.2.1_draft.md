# TattooBase Doc-07 Test Strategy
Version: v2.2.1
Last Updated: 2026-02-22
Owner: QA & Architecture Council
Change Summary:
- 状態遷移・Webhook排他テスト強化
- Risk Engine分岐テスト要件追加
- DesignAsset関連（デポジット・閲覧制御）のテスト要件追加
- AuditLog完全網羅要件の追加

## 1. テスト戦略原則

### 1.1 中核原則
- 決済の異常系（並列到達、失敗、遅延）およびWebhookの再試行の確実性を重んじる。
- データの不整合を起こさない（冪等性の担保）ためのインフラ層へのテストを最優先する。
- 更新系操作がAuditLogを漏らしていないかを全APIのIntegration Testレベルで検証する。
- CIパイプライン上で未翻訳キーを失敗させるテスト(i18n validate)は静的解析の一部として強制する。

## 2. コア機能検証シナリオ

### 2.1 状態遷移テスト (State Machine)
- **Booking**: `draft` -> `pending_payment` -> `confirmed` の正常遷移をテスト。
- **不正遷移ブロック**: `draft` から直接 `confirmed` への更新リクエストがService/DBレベルで明確に拒否されることを保証。
- **DesignRequest**: `requested` -> `deposit_required` -> （決済成功） -> `in_design` のフロー。デポジット未払いでの `in_design` 遷移が弾かれることをテスト。

### 2.2 Webhook並列到達テスト (Concurrency & Idempotency)
- **並列ロック奪取**: 全く同じ `event.id` を持つStripe Webhookリクエストを同時に5〜10並列で突きつけ、`WebhookEvent` に処理開始ロック (`processingStartedAt`) を書き込めるトランザクションが**正確に1つ**だけであることを検証。
- **二重課金防止**: 異なるWebhookEventであっても同一の `paymentIntentId` をもつ要求が来た場合、 `UNIQUE` 制約違反として弾かれ、Bookingの二重更新が発生しないことを検証。

### 2.3 Risk Engine分岐テスト
入力パターンに対するReservationPolicyDecisionの出力をテスト。
- **Low Risk (優良顧客)**: 定期利用、遅刻ゼロ。結果が `allow`（通常予約）。
- **Medium Risk**: 無断キャンセル1回。結果が `require_deposit`。
- **High Risk**: スコア基準未満。結果が `block` 又は `require_approval`。

### 2.4 デザインデポジット分岐テスト
- DesignRequestが発生しない通常予約ではデポジットをスキップできること。
- DesignRequestが発生する予約では、優良顧客であってもポリシー設定に基づきDepositの支払い処理（Stripe Elements）が要求されること。
- ClientからのPaymentIntent要求の際、正しく「要求額 (`depositAmount`)」が計算・固定化されていること。

### 2.5 DesignAsset閲覧制御テスト
- API側で `proofType=internal_hash` スキームを用いた `contentHash` が計算・保存されること。
- 発行された閲覧署名URLにアクセスした際、`viewLimit`が1減算され、同時にAction: 'VIEW'の `AuditLog` が記録されること。
- `viewLimit` が0になったアカウントからアクセスした場合、403 Forbidden等のエラーとなり画像実体へのアクセスがブロックされること。

### 2.6 Grace7日テスト (SaaS Subscription)
- Time-travelテスト（現在時刻のモック）：Webhookで決済失敗イベントを受け取った際、`status`が`grace`に変更され、`graceUntil`が現在時刻の正確に+7日後（UTC）にセットされることを確認。
- 7日経過したバッチ処理の模擬により、`status`が`suspended`に落ちるバウンダリテスト。

### 2.7 監査ログ完全網羅テスト
- Integration Testを通じ「全更新系エンドポイント（`POST`, `PUT`, `PATCH`, `DELETE`）」リクエスト後、データベースの `AuditLog` テーブルに対応するレコードが生成されたかアサーションを追加する。
- ログには `requestId`, `actorId`, `entityType`, `beforeJson`/`afterJson` の差分が内包されていること。

### 2.8 パフォーマンス境界・例外運用テスト
- **手動例外 (Studio overrides)**: スタジオ管理者が高リスク顧客へのデポジットを「手動で免除」した際のAPIにて、理由（reason）文字列が必須パラメータとして要求され、それが `AuditLog` に正しく反映されること。
- **パフォーマンス**: アーティスト検索時における、ジャンル・性別・タグ等の複合フィルタリングがインデックスを利用し許容レスポンスタイム内で返却されること。

## 3. 多言語 (i18n) のCIテスト
- `pnpm validate:i18n` (または相当コマンド) をCIジョブの先頭で実行。
- 英語や日本語のファイル内で片方に「キーが存在しない」「空文字が入っている」場合、CIステータスが `Fail` しマージをブロックできること。
- 同一のコマンドをローカルで実行した場合（またはローカルビルド時）は無視またはWarningに留まること。

End of Document
