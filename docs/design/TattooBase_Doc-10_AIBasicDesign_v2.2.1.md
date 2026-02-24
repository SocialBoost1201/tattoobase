# TattooBase Doc-10 AI Basic Design
Version: v2.2.1
Last Updated: 2026-02-22
Owner: AI Engineering
Change Summary:
- AIモジュール分離設計
- AIActivityLog設計追加
- 推論パイプライン明確化
- ガードレール定義

## 1. AIアーキテクチャ原則

### 1.1 分離原則
AIは以下と分離:
- Booking Core
- Payment Core
- Risk Engine（ルール）

AIは上書き不可。
AIは提案のみ。

## 2. AIモジュール構成

### 2.1 AIService
- request受付
- 推論実行
- 結果整形

### 2.2 PredictionEngine
- キャンセル予測
- 需要予測
- 価格提案

### 2.3 RecommendationEngine
- デポジット推奨
- スケジュール提案

## 3. 推論パイプライン

Input:
- 匿名化データ
- 過去行動履歴
- Studio統計

Processing:
- 特徴量抽出
- モデル推論
- 信頼度算出

Output:
- 提案
- confidence値

## 4. オンライン推論

用途:
- 予約作成時
- デポジット判定補助

制約:
- 応答500ms以内
- タイムアウト時はスキップ

## 5. オフライン推論

用途:
- 需要分析
- 経営レポート

バッチ実行:
- 1日1回

## 6. AIActivityLog

保存項目:
- aiType
- inputSummary
- outputSummary
- confidence
- userId or studioId
- timestamp

監査目的のみ使用。

## 7. ガードレール

### 7.1 強制禁止
AIは:
- 自動キャンセル不可
- 自動拒否不可
- 直接RiskScore変更不可

### 7.2 説明可能性
出力には理由テキストを含める。

## 8. モデル抽象化

interface AIModel {
  predict(input): AIResult
}

実装例:
- OpenAIModel
- LocalModel
- FutureModel

差し替え可能設計。

## 9. セキュリティ

- PII最小化
- 外部送信時匿名化
- APIキー環境変数管理

## 10. フォールバック設計

AI失敗時:
- 既存ルールエンジンのみで動作
- システム停止不可

## 11. 受け入れ基準

- AIがコアロジックを上書きしない
- 全AI出力がログ保存
- 予約体験を悪化させない
- 推論失敗で予約停止しない
