# TattooBase Doc-12 Operations Runbook
Version: v2.2.1
Last Updated: 2026-02-22
Owner: Operations Council
Change Summary:
- AI/LLM運用対応追加
- デザイン漏洩対応手順追加
- Grace運用統制明文化
- 障害レベル再定義

## 1. 運用原則

- 冪等性を壊さない
- Webhook確定以外で決済状態を変更しない
- 更新系は必ずAuditLog
- 手動介入は最小化
- 全操作は監査可能

## 2. 障害レベル定義

Level 1:
表示不具合、軽微バグ

Level 2:
AI/分析停止

Level 3:
Webhook遅延、予約遅延

Level 4:
決済不整合、二重課金疑い

Level 5:
デザイン漏洩、重大セキュリティ事故

## 3. Webhook障害対応

- Stripeステータス確認
- WebhookEventテーブル確認
- 再送要求
- 手動更新禁止（例外除く）
- 再処理は冪等前提で実行

## 4. 決済トラブル対応

### 4.1 二重課金疑い
- paymentIntentId確認
- WebhookEvent確認
- Ledger整合確認
- 返金はStripe側からのみ

### 4.2 支払い済み未反映
- event受信有無確認
- 再送依頼

## 5. デザイン漏洩対応

- DesignAssetアクセスログ確認
- 署名URL失効
- 当該ユーザーRiskScore即時再計算
- Studioへ通知
- 必要時アカウント停止

## 6. Risk誤判定対応

- RiskProfile履歴確認
- AIActivityLog確認
- Studio手動解除
- 解除理由AuditLog記録

## 7. AI誤出力対応

- AIActivityLog確認
- 該当出力無効化
- モデル一時停止可
- 根本原因分析

## 8. LLM暴走対応

- Gateway遮断
- APIキー無効化
- 出力サニタイズログ確認
- 影響範囲確認

## 9. Grace誤作動対応

- graceUntil確認
- invoiceイベント確認
- 誤停止時は手動復旧
- AuditLog記録必須

## 10. 手動介入ルール

許可例:
- 誤判定解除
- 明確な不具合修正

禁止:
- 状態遷移強制変更
- 決済状態手動変更

## 11. バックアップ

- DB日次バックアップ
- 30日保持
- S3類似構造（将来）

## 12. 定期運用タスク

日次:
- Webhook失敗確認
- 監査ログ異常確認

週次:
- Risk高スコア一覧確認
- デザイン閲覧異常確認

月次:
- AI誤検知率確認
- LLMコスト確認
- スタジオ不正利用確認

## 13. 監査対応

- AuditLog即時抽出可能
- AIActivityLog提示可能
- Payment履歴完全保存
- DesignAsset閲覧履歴提示可能

## 14. 受け入れ基準

- 二重課金ゼロ
- デザイン漏洩ゼロ
- 誤判定長期放置ゼロ
- LLM暴走ゼロ
- 手動介入は全て記録
