# TattooBase Doc-07 Test Strategy
Version: v2.2.1
Last Updated: 2026-02-22
Owner: QA Council
Change Summary:
- 冪等/並列Webhook強化
- デザイン保護テスト追加
- リスク分岐網羅
- Grace7日テスト明文化
- 監査ログ完全網羅

## 1. テスト原則

### 1.1 品質目標
- 二重課金ゼロ
- 不正状態遷移ゼロ
- 冪等違反ゼロ
- 監査漏れゼロ

### 1.2 テスト層
- Unit
- Integration
- Concurrency
- E2E
- Security
- Regression

## 2. Booking状態遷移テスト

### 2.1 正常遷移
- draft → pending_payment
- pending_payment → confirmed（Webhookのみ）
- confirmed → completed

### 2.2 異常遷移
- draft → confirmed（禁止）
- confirmed → pending_payment（禁止）

期待値:
- 不正遷移は拒否
- AuditLog記録

## 3. Webhook並列テスト

### 3.1 同一event.id二重送信
- 1回のみ副作用
- 2回目はスキップ

### 3.2 並列5スレッド同時送信
- 副作用1回
- DB整合性保持

### 3.3 再試行
- 処理中断→再送→正常処理

## 4. Risk Engineテスト

### 4.1 スコア計算
- 無断キャンセル1回→score減少
- KYC完了→改善

### 4.2 tier分岐
- 80以上→low
- 50〜79→medium
- 49以下→high

### 4.3 出力制御
- medium→depositRequired
- high→approvalRequired

## 5. デザインデポジットテスト

### 5.1 deposit未支払い
- in_design遷移不可

### 5.2 deposit支払い成功
- in_design遷移

### 5.3 deposit返金
- ポリシーに従う

## 6. DesignAssetテスト

### 6.1 contentHash生成
- null不可

### 6.2 viewLimit
- 5回で制限
- 6回目拒否

### 6.3 透かし表示確認

### 6.4 downloadAllowed=false確認

### 6.5 閲覧ログ生成確認

## 7. Grace期間テスト

### 7.1 invoice.payment_failed受信
- status=grace
- graceUntil=+7days

### 7.2 7日後
- suspendedへ遷移

## 8. 監査ログ網羅テスト

以下操作でAuditLog必須:
- Booking更新
- Payment更新
- DesignRequest更新
- DesignAsset閲覧
- RiskProfile更新
- 手動解除操作

## 9. セキュリティテスト

- Webhook署名検証
- 不正URL直接アクセス拒否
- 権限外閲覧拒否
- 署名URL期限切れ確認

## 10. パフォーマンステスト

- Webhook 100件/秒想定
- Artist検索1000件データ
- 同時予約処理50件

## 11. 回帰テスト

- 未翻訳キーCI失敗確認
- 冪等性回帰
- Graceロジック回帰
- デザイン保護回帰

## 12. 受け入れ基準

- 冪等違反ゼロ
- 不正遷移ゼロ
- DesignAsset漏洩ゼロ
- Grace誤作動ゼロ
- AuditLog漏れゼロ
