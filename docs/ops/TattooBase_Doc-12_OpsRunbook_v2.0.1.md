TattooBase Doc-12 Operations & CI/CD Runbook
Version: v2.0.1
Last Updated: 2026-02-21

Change Summary: i18n未翻訳ビルド失敗の適用範囲を「CIのみ」に明確化し、将来ローカル含む全環境へ適用移行できる構成とする方針を追記

Target: Production-grade SaaS / Zero Financial Incident
Scope: API, Web, AI, Stripe, DB
---
1. 目的
TattooBaseを
- 安全にリリースする
- 安全に更新する
- 安全に障害復旧する
ための運用基盤を定義する。
---
2. 環境構成
2.1 環境分離
- local
- staging
- production
原則：
本番に直接変更禁止。
---
3. CIパイプライン
3.1 Pull Request時
必須チェック：
- TypeScript型チェック
- ESLint
- Unit Test
- Integration Test
- i18nキー一致検証（※不一致時はCI上でビルド失敗とする）
- Prisma schema整合
- Security lint
失敗時はマージ禁止。

### 3.3 開発環境（ローカル）での運用
- ローカル開発時はdev体験優先のため、未翻訳によるビルド失敗は強制しない。
- ただし将来（Phase2以降）は全環境でビルド失敗を適用する(B)構成へと移行可能なようスクリプトを設計する。
---
3.2 mainブランチマージ後
- staging自動デプロイ
- e2e自動実行
- Webhookテストモード検証
---
4. CD（本番リリース）
4.1 リリース前チェックリスト
- Stripe本番キー確認
- Webhook URL本番設定確認
- DBバックアップ取得
- Migration staging反映済確認
- i18n差分ゼロ
- FeatureFlag設定確認
4.2 デプロイ方式
推奨：Blue/Green
- 新バージョンを待機環境へ
- ヘルスチェックOK確認
- トラフィック切替
- 問題時即ロールバック
---
5. データベース運用
5.1 Migration方針
- 本番は prisma migrate deploy のみ
- 手動SQL禁止
- stagingで必ず検証
5.2 バックアップ
- 日次自動バックアップ
- 30日保持
- 月次スナップショット別保存
---
6. Webhook運用
6.1 ヘルスチェック
Admin画面で：
- 未processedイベント数
- エラー率
- 直近成功率
6.2 障害時対応
- Stripe再送を確認
- lockExpiresAtで再処理
- 重大時は一時的に受信停止
---
7. 決済インシデント対応
7.1 二重課金
手順：
1. paymentIntentId確認
2. AuditLog確認
3. Stripeダッシュボード照合
4. 即時返金
5. インシデント記録
---
7.2 未確定状態
- Booking状態確認
- Snapshot確認
- 手動修復は監査ログ必須
---
8. AI運用
8.1 コスト監視
- 月次AI予算
- feature別使用量
- provider別成功率
8.2 AI障害時
- フォールバック動作確認
- Router切替
- CircuitBreaker開放確認
---
9. 監査ログ運用
9.1 保持期間
- 最低5年
9.2 監査時提出可能形式
- CSVエクスポート
- JSONエクスポート
---
10. セキュリティ運用
10.1 鍵管理
- 環境変数のみ
- Git管理禁止
10.2 ログ監視
- 署名不一致Webhook
- 異常アクセス
- 連続失敗ログイン
---
11. モニタリング
11.1 監視項目
- APIエラー率
- Webhook失敗率
- DB接続数
- 決済失敗率
- AI失敗率
- チャーン率
---
12. インシデントレベル分類
Level 1 軽微
Level 2 一部機能停止
Level 3 決済影響
Level 4 個人情報影響
Level3以上は即日報告。
---
13. Runbook（代表例）
13.1 Webhook停止
- processedAt確認
- lockExpiresAt確認
- 再処理実行
13.2 DB障害
- フェイルオーバー
- バックアップ復元
13.3 Stripe API障害
- 決済一時停止
- 予約はPendingPaymentで保持
---
14. Feature Flag運用
新機能は必ずFlag付き。
例：
- aiSearchEnabled
- connectTransferEnabled
- adsModuleEnabled
---
15. 定期レビュー
月次：
- AIコスト
- チャーン率
- 決済成功率
- 監査ログ件数
- 障害件数
---
16. 将来拡張
- Multi-region対応
- DB Read replica
- AI Gateway独立サービス化
- Connect自動分配
---
End of Document
