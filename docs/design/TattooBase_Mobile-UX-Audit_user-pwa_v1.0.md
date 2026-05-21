# TattooBase Mobile UX Audit — user-pwa

- **Version**: v1.0
- **Date**: 2026-05-22
- **Scope**: `apps/user-pwa`（モバイルファーストPWA、Next.js 16 App Router、21ページ + 31コンポーネント）
- **Audit Skills**: `mobile-design` / `frontend-design` / `design-with-claude:mobile-specialist` / `ui-component`
- **Method**: タッチサイコロジー（Fitts/サムゾーン）/ モバイルタイポ / SafeArea / アクセシビリティ / パフォーマンス / オフライン / プラットフォーム整合 / z-index衝突
- **Reading order**: 1. MFRI（§1）→ 2. クリティカル所見（§3）→ 3. 優先実装リスト（§9）

> このレポートは `mobile-design` スキルのチェックリスト・教義を user-pwa 実コードに当てて作成。各所見には**重要度・場所・証拠・推奨修正・リスク・SEO/UI影響・コミット粒度**を付与。実装は AGENTS.md「Plan-First」と「UI保護」に沿って項目ごと独立承認で進める前提。

---

## 1. Mobile Feasibility & Risk Index (MFRI)

| 評価軸 | スコア | 根拠 |
|---|---:|---|
| Platform Clarity | **5** | iOS + Android PWA、明確 |
| Accessibility Readiness | **2** | `prefers-reduced-motion` 未対応、`aria-modal`/focus-trap なし、極小タップ標的多数、低コントラスト箇所あり |
| Interaction Complexity | **3** | Lenis スムーススクロール / GSAP / Stripe Elements / Lightbox / Bottom Sheet 模倣 — モバイル特有の摩擦多い |
| Performance Risk | **3** | Lenis 全体ラップ・大量の `transition-all`・Three.js Hero 候補・地図 (Leaflet)・GSAP・大型画像 |
| Offline Dependence | **5** | **Service Worker 未配置・オフライン検出ゼロ**。manifest 単独で「PWA外見だけ」 |

```
MFRI = (5 + 2) − (3 + 3 + 5) = −2  → Dangerous（再設計推奨領域あり）
```

**解釈**: スキルの基準上は「< 0 = Dangerous, 実装前に再設計」。ただし既に本番想定の実装が進んでいるため、**段階的修復**で MFRI を +3 以上（Moderate）まで引き上げる方針が現実解。本レポートの「P0」項目を解消すれば概算 +3〜+5 まで上昇予定。

---

## 2. 既存資産の強み（最初に保持）

`mobile-design` 観点で評価できる要素は維持する:

- **BottomNav（モバイル専用）**: 4タブ + 中央CTA、Miller's law 範囲内、`active:scale-95` ハプティック疑似フィードバック
- **A2HSプロンプト** 実装あり（実体SW不在の点は別途指摘）
- **Header はモバイルで `h-12`＋検索行2行構成**、`sticky top-0`＋`backdrop-blur-xl`
- **`next/image` 採用率高い**（14/15、未使用は ArtistMap の Leaflet マーカーのみ＝動的生成のため不可避）
- **`appleWebApp.statusBarStyle: black-translucent`** iOS PWA 適切
- **UIUX-Guard コミット（`9e5bb19c`）で `text-[9-11px]` を `text-xs`(12px) に正規化済**（モバイル可読性のベース）
- **/area ルート衝突を [prefecture] へ一本化（`a429b2d0`）でSEO無傷でビルド可能化**

> これら既存の意匠を破壊する変更は本レポート提案に含めない。

---

## 3. 所見（重要度別）

### 🔴 P0 — Critical（PWA の前提を欠く・実害確実）

#### P0-1. `safe-area-pb` クラスが**未定義**で BottomNav の safe-area が無効
- **場所**: `src/components/layout/BottomNav.tsx:24` (`<nav ... safe-area-pb>`) / `src/app/globals.css`（該当ルール無し）
- **証拠**: `grep 'safe-area' src/app/globals.css` → 0 hit
- **影響**: iPhone X 系以降のホームインジケーター上にナビが食い込む。`backdrop-blur` で誤魔化されているが、ボトムタブの最下段アイコン中心が安全領域外で**実質タップしづらい**。
- **修正**: globals.css に `.safe-area-pb { padding-bottom: env(safe-area-inset-bottom); }` を追加。または Tailwind 4 の `@layer utilities` で同等。BottomNav 内 `<div className="h-16">` をその外側パディング前提に統一。
- **リスク**: 極小（CSS追加のみ）。視覚的に下方向にナビ分の余白が増える＝意図通りで UI 退行ではない。
- **SEO**: 影響なし
- **コミット粒度**: 1コミット

#### P0-2. Service Worker `public/sw.js` 不在 → 真のオフライン・install eligibility なし
- **場所**: `public/`（`manifest.json` のみ、`sw.js` 無し）/ 直近コミット `be0639c4 fix: Remove next-pwa (Node.js v22 incompatible)` で next-pwa 撤去後、代替未配置
- **影響**: manifest はあるが SW が無いため (a) **install プロンプトの安定誘発が機能しない**（A2HS は表示できても OS の install criteria 未満）、(b) **オフラインで全ページ白画面**、(c) Lighthouse PWA スコア大幅低下、(d) AddToHomeScreen UI がユーザに約束する「アプリ化」が事実上はブラウザショートカット止まり。
- **修正案（独立承認案件）**:
  - 案A（推奨・小）: Next.js App Router 互換の **Serwist (旧 next-pwa の後継)** 導入。ビルド時にSW生成、Node 22+ 対応。
  - 案B（手動・最小）: `public/sw.js` を手書きし、layout で `navigator.serviceWorker.register('/sw.js')` を呼ぶ最小 stale-while-revalidate キャッシュ。
- **リスク**: 中（キャッシュ戦略次第で「古い画面が出る」リスクがあるため要設計）。最初は **app shell のみキャッシュ + ネットワーク優先** が安全。
- **SEO**: 影響なし（むしろPWAスコア改善）
- **コミット粒度**: 設計1コミット + 実装1コミット

#### P0-3. オフライン検出・状態表示が**コードゼロ**
- **場所**: 全`src/` で `navigator.onLine` 等の参照ゼロ
- **影響**: 通信が切れた場合にも UI は何事もないように動作し、フェッチ失敗→空状態を表示してしまう（ユーザーは「壊れた」と感じる）。`mobile-specialist` の必須項目「offline banner + cached content with timestamp」未充足。
- **修正**: 全ページ共通の `OfflineBanner` コンポーネント（最上部 1 行）を layout に組み込み、`window.online/offline` イベントで表示。フェッチ失敗時の汎用 retry UI も `cards/*` 等で整備。
- **リスク**: 低（追加UIのみ・既存破壊なし）
- **SEO**: 影響なし
- **コミット粒度**: 1コミット

#### P0-4. `viewport` メタが**未エクスポート**（Next.js 13+ では `viewport` を別 export）
- **場所**: `src/app/layout.tsx`（`metadata` のみ、`viewport` export 無し）
- **影響**: `viewport-fit=cover` が未設定 → iPhone 切り欠き周辺で SafeArea が機能不全。`themeColor` 未指定で Android のステータスバー色が黒に固定されない。`interactiveWidget` 未指定でモバイルキーボード周りの挙動が不安定。
- **修正**: 
  ```ts
  export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    viewportFit: 'cover',
    themeColor: '#000000',
    interactiveWidget: 'resizes-content',
  };
  ```
- **リスク**: 極小
- **SEO**: 影響なし
- **コミット粒度**: 1コミット（P0-1, P0-2 と独立）

#### P0-5. 全ての `<input>/<select>/<textarea>` で **font-size < 16px** → iOS 自動ズーム発火
- **場所**: 
  - `src/app/booking/start/page.tsx` 内全入力（type=date/time/text/email/tel/textarea/select）が `text-sm`(14px)
  - `src/components/ui/SortSelector.tsx:30` の `<select>` が `text-xs`(12px)
  - `src/components/ui/SearchBar.tsx`（要再確認、推定 `text-sm`）
- **影響**: iOS Safari は input フォントが 16px 未満だとフォーカス時に強制ズーム→`viewport-fit=cover` でもユーザーは指でズームを戻す必要があり**予約フォーム途中で離脱**しやすい。これは PWA で致命的。
- **修正**: フォーム要素のみ最低 `text-base`(16px) に。視覚的に小さく見せたい場合は `font-size: max(16px, …)` か `text-base md:text-sm`（md以上で14px、それ未満で16px）の条件付き。
- **リスク**: 低（テキストサイズ微増、レイアウトは現状の余白で吸収可能。UIUX-Guard の方針と整合）
- **SEO**: 影響なし
- **コミット粒度**: 1コミット（フォーム要素一括）

---

### 🟠 P1 — High（実害大、要早期対応）

#### P1-1. タップ標的サイズ < 44px の多発（WCAG 2.5.8 / iOS HIG / Material 未達）
- **場所**（代表 9 件、他多数）:
  | ファイル | 行 | サイズ | 用途 |
  |---|---|---|---|
  | `booking/start/page.tsx` | 132 | `w-10 h-10` (40px) | 戻る (artistへ) |
  | `portfolio/[id]/PortfolioDetailClient.tsx` | 48 | `w-10 h-10` | 戻る |
  | `portfolio/[id]/PortfolioDetailClient.tsx` | 81 | `w-10 h-10` | フルスクリーン |
  | `portfolio/[id]/PortfolioDetailClient.tsx` | 114 | `w-10 h-10` | 共有/メニュー |
  | `artist/[id]/ArtistDetailClient.tsx` | 61,66,69 | `w-10 h-10` | 戻る / 保存 / 共有 |
  | `facilities/[slugOrId]/page.tsx` | 60 | `w-10 h-10` | 戻る |
  | `account/page.tsx` | 82 | `w-9 h-9` (36px) | 設定 |
  | `Header.tsx (mobile)` | 107-119 | `px-3 py-1.5 text-xs`≒36px | 施設/ログイン |
  | `booking/start/page.tsx` | 189-194 | `py-2.5 text-xs`≒38px | サイズ選択ボタン |
- **影響**: Fitts' law 違反、特に WCAG 2.2 で**法的アクセシビリティ要件未達**。実利用上は誤タップ・タップ失敗増→離脱。
- **修正**: 
  - アイコンボタンは「視覚サイズ維持・hit area 拡大」が原則: `w-10 h-10` → アイコンは `w-5 h-5` 維持しつつコンテナを `min-w-11 min-h-11` (44px) または `w-11 h-11`。ホバー領域だけ広げるなら `p-2.5` で hit-area を視覚に侵食しない形に。
  - Header モバイル「施設」「ログイン」リンクは `py-2` 以上にし `min-h-[44px]`。
- **リスク**: 低〜中（視覚的に若干余白増。`mobile-design` 教義「視覚は小さく hit-area は大きく」を尊重すれば見た目はほぼ不変）。
- **UI保護**: hit area 拡張のみで**視覚サイズ・配置・色は据え置き**を前提に実装。
- **SEO**: 影響なし
- **コミット粒度**: 1〜2コミット（ヘッダ系 / 詳細ページ系で分割可）

#### P1-2. `prefers-reduced-motion` **完全未対応**
- **場所**: 全ての `transition-all`/`transition-colors`/`transition-transform`、GSAP（`SplashScreen.tsx`, `booking/start/page.tsx` の useGSAP）、Lenis、`active:scale-*`
- **影響**: 前庭障害・乗り物酔いユーザに眩暈、WCAG 2.3.3 違反、AppleStore 審査でも指摘対象。
- **修正**:
  - globals.css に `@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }` を追加（最小ガード）
  - GSAP/Lenis は JS 側で `window.matchMedia('(prefers-reduced-motion: reduce)').matches` 分岐
  - Splash は reduce-motion 時はフェードのみ・即終了
- **リスク**: 低（reduce 設定時のみ作用）
- **SEO**: 影響なし
- **コミット粒度**: CSSガード=1コミット / JS分岐=1コミット

#### P1-3. SmoothScroller (Lenis) が全体ラップ → モバイル副作用
- **場所**: `src/components/layout/SmoothScroller.tsx`（root で全画面ラップ）
- **影響**:
  - **iOS のステータスバータップでトップ戻り**が機能しなくなる（lerp で乗っ取り）
  - **Pull-to-refresh** が抑制される（ブラウザ既定動作の干渉）
  - 常時 `requestAnimationFrame` 駆動でモバイル**電池消費**
  - 慣性スクロールが native のものと二重になり、フォーム入力中の visibility/IME 周りで挙動が不安定
  - ネストされた overflow（Lightbox/AIStyleAssistant モーダル内スクロール）と競合
- **修正**:
  - **モバイル(< md)では Lenis 無効化**: `mediaQuery: '(min-width: 768px)'` 条件分岐、PCのみ smooth-wheel。
  - もしくは Lenis を撤去し、必要箇所のみ CSS `scroll-behavior: smooth` で代替。
- **リスク**: 中（PCの体験が変わる。デザイン意図の確認必要）
- **UI保護**: モバイルのみ無効化で PC は現状維持を提案
- **SEO**: 影響なし（むしろ INP 改善）
- **コミット粒度**: 1コミット（要承認）

#### P1-4. Modal/Lightbox に `role="dialog"`/`aria-modal`/focus-trap/ESC ハンドラ無し
- **場所**:
  - `components/facilities/ReportFacilityModal.tsx`（`fixed inset-0` だがdialog roleなし）
  - `app/portfolio/[id]/PortfolioDetailClient.tsx:202`（フルスクリーンビューア）
  - `app/artist/[id]/ArtistDetailClient.tsx:279`（作品ライトボックス）
  - `components/ui/AIStyleAssistant.tsx:88`（チャットシート、`aria-label` はFABのみ）
- **影響**: スクリーンリーダがモーダル文脈を認識しない、キーボード操作で背景フォーカスへ抜ける、ESC で閉じない、body スクロール非ロックで背景が動く。
- **修正**: 共通 `Modal` プリミティブ（`role="dialog" aria-modal="true"` + focus-trap + ESC + body scroll lock + FocusOnMount）を `components/ui/Modal.tsx` で新設し既存4箇所を置換。
- **リスク**: 中（4箇所のリファクタ、視覚は不変）
- **コミット粒度**: プリミティブ作成=1 / 置換=1〜2

#### P1-5. `BottomNav` アクティブ状態が `aria-current="page"` 未付与
- **場所**: `components/layout/BottomNav.tsx:32-78`
- **影響**: スクリーンリーダで「現在のページ」を識別不可。視覚的には色変化があるが a11y 上の意味未付与。
- **修正**: 各 `<Link>` に `aria-current={active ? 'page' : undefined}`
- **リスク**: 極小
- **コミット粒度**: 1コミット（P1-4とまとめても可）

---

### 🟡 P2 — Medium（品質向上、後追い可）

#### P2-1. z-index の重複過密（z-50 が4種、z-100 が arbitrary）
- **場所**: Header z-50 / BottomNav z-50 / AddToHomeScreen z-50 / AIStyleAssistant sheet z-50 / FAB z-40 / Lightbox z-100 / Splash z-100
- **影響**: 将来の重ね順バグ温床、A2HS と AIStyleAssistant モーダルが同時に出るとどちらが上か曖昧。
- **修正**: z-index トークン化（globals.css に `--z-nav: 40; --z-overlay: 50; --z-modal: 60; --z-toast: 70; --z-splash: 80;` 等）し全箇所を置換。
- **リスク**: 中（全置換、視覚的破壊リスクあり要レビュー）
- **コミット粒度**: 1コミット

#### P2-2. 検索ページ モバイルフィルタ `sticky top-[88px]` のハードコード
- **場所**: `app/search/page.tsx:188`
- **影響**: Header 高さがログイン状態や検索バー有無で変動した場合に被り or 隙間。
- **修正**: CSS変数 `--header-h-mobile` を layout で計算し、`top: var(--header-h-mobile)` に。
- **リスク**: 低
- **コミット粒度**: 1コミット

#### P2-3. ジェスチャの代替手段が一部欠落（gesture-only パターン）
- **場所**: ArtistDetailClient のライトボックス左右切替（279-302行）はキーボード/ボタン両方あり ✅、しかし他のスワイプ示唆 UI は少ない。
- **影響**: 該当所見は限定的。逆に**「edge swipe で戻る」**示唆も無いため、ジェスチャ前提のUIは少ない＝この観点は概ね良好。
- **修正**: 大規模対応不要、必要時に個別判断。
- **リスク**: —

#### P2-4. ヘッダー モバイルの「施設」「ログイン」リンクが `text-xs` で読みづらい
- **場所**: `Header.tsx:107, 112, 117`
- **影響**: 12px は最低限だが情報密度が高く可読性が劣る。
- **修正**: `text-sm`(14px) に格上げ + P1-1 と合わせて `min-h-[44px]`。
- **リスク**: 低
- **コミット粒度**: P1-1 と統合可

#### P2-5. アイコンボタンに `aria-label` が部分的に欠落
- **場所**: 
  - PortfolioDetailClient:48 戻るボタン: テキスト無し・aria-label 無し
  - PortfolioDetailClient:81, 114 アイコンのみボタン
  - ArtistDetailClient:66, 69 保存/共有
  - ArtistDetailClient:290, 297 prev/next
- **影響**: スクリーンリーダで「ボタン」としか読まれない。
- **修正**: 各ボタンに `aria-label="戻る" / "保存" / "共有" / "前の作品" / "次の作品"`。
- **リスク**: 極小
- **コミット粒度**: 1コミット

---

### 🟢 P3 — Low（任意改善）

- **P3-1. `tap-highlight-color: transparent`** を `body` か `*` に設定（Androidの青ハイライト抑制、`active:scale-95` の演出と整合）
- **P3-2. ハプティック擬似フィードバック強化**: `active:scale-95` は BottomNav 中央CTAのみ、他の CTA にも展開
- **P3-3. `font-display: swap`** が next/font の既定で適用済か再確認（Inter/Poppins） / Inter は AI デフォルト忌避リストに該当（`frontend-design` 指摘）→ ただし**置換は本監査スコープ外（ブランド/タイポは別案件）**
- **P3-4. Lighthouse PWA / Mobile スコア**: P0-2 の SW 復活後に基準値計測（CI に挟むのは別案件）
- **P3-5. `hide-scrollbar` カスタムクラス** Header.tsx:70 で使用、定義場所と挙動を確認（未定義の可能性、UIUX-Guard `safe-area-pb` と同じパターン）

---

## 4. プラットフォーム整合（iOS vs Android）

| 観点 | 現状 | iOS推奨 | Android推奨 | 判定 |
|---|---|---|---|---|
| Fontサイズ最小 | 12px (text-xs) | 11pt+ | 11sp+ | OK |
| Body | 14px | 17pt | 16sp | **やや小** |
| 入力 | 14px | **16pt+ 必須** | 16sp+ | **NG (P0-5)** |
| タップ最小 | 36-40px多発 | 44pt | 48dp | **NG (P1-1)** |
| ボタン挙動 | `active:scale-95` | ハプティック | リップル | 擬似OK |
| 戻る | UI上の `<` ボタン | edge swipe + UI | system back + UI | OK |
| 共有 | アイコン (未実装) | Action Sheet | Share Sheet | **未実装** |

> 「共有」アイコンが UI 上にあるが onClick が空のボタンも見られた（artist:69）。**機能未実装が UI で示唆されている**＝触る側にはバグ。実装 or 非表示の判断必要（別案件）。

---

## 5. パフォーマンスドクトリン適合

| 項目 | 現状 | 評価 |
|---|---|---|
| 画像最適化 | 14/15 `next/image` | ✅ |
| 大型リスト仮想化 | 検索結果は通常マップ列、件数次第で要 `react-virtuoso` | ⚠️ 将来課題 |
| 不要な `transition-all` | 多数 | ⚠️ INP 影響可能 |
| Three.js Hero | `HeroCanvas.tsx` 存在、SSR分離は要確認 | ⚠️ dynamic import + ssr:false 必須 |
| GSAP | useGSAP 使用、reduce-motion 未対応 (P1-2) | ⚠️ |
| Lenis | 全体ラップ (P1-3) | ❌ モバイル無効化推奨 |
| Map | Leaflet 採用、 LCP 影響要確認 | ⚠️ |
| `console.log` 本番残存 | 要grep（別タスク） | 未確認 |

---

## 6. オフライン / 接続性ドクトリン適合

| 項目 | 現状 | 評価 |
|---|---|---|
| Service Worker | **無し** | ❌ (P0-2) |
| Offline banner | **無し** | ❌ (P0-3) |
| キャッシュ済みコンテンツのタイムスタンプ表示 | 無し | ❌ |
| アクション失敗時 retry | カードレベルで未統一 | ⚠️ |
| Stripe Elements の通信失敗ハンドリング | 確認要 | ⚠️ |

---

## 7. アクセシビリティ総括（WCAG 2.2）

| WCAG | 現状 | 評価 |
|---|---|---|
| 1.4.4 文字サイズ拡大 | em/rem 基調だが固定px多数 | ⚠️ |
| 1.4.12 行間/字間 | `leading-*` 系で概ね適切、UIUX-Guard で改善済 | ✅ |
| 2.1.1 キーボード操作 | Modal/Lightbox で破綻 (P1-4) | ❌ |
| 2.3.3 アニメ抑制 | 全未対応 (P1-2) | ❌ |
| 2.5.8 タップ標的 | 多数未達 (P1-1) | ❌ |
| 4.1.2 名前/役割/値 | aria-label 部分欠落 (P2-5) / aria-current 欠落 (P1-5) | ⚠️ |

---

## 8. Mandatory Mobile Checkpoint（スキル必須）

```
🧠 MOBILE CHECKPOINT

Platform:     iOS + Android (PWA / Mobile Web), + Desktop (md+)
Framework:    Next.js 16 App Router + Tailwind 4 (PWA shell, manifest only, no SW)
Files Read:   layout.tsx / BottomNav / Header / SmoothScroller / AIStyleAssistant
              / globals.css / safe-area / fixed-bottom 全件 / booking/start 全文
              + touch-psychology.md + mobile-typography.md

3 Principles I Will Apply:
1. UI保護: 視覚サイズ/配置/色/アニメは据え置き、hit-area と aria のみ最小修正
2. SEO無傷: URL/sitemap/canonical/JSON-LD/メタは触らない
3. 最小差分・項目独立コミット: 各 P0/P1 を分離可能な単位で

Anti-Patterns I Will Avoid:
1. Inter/Roboto などのタイポを勝手に置換しない（既存ブランド維持）
2. SmoothScroller を黙って撤去しない（PC体験への影響＝要承認）
```

---

## 9. 優先順実装リスト（提案）

> 各項目は**独立したコミット候補**。承認次第順次実装。SEO 影響なし・UI 視覚不変・低リスクのものは「安全バッチ」、視覚や体験を変えるものは「要独立判断」。

| # | 項目 | 重要度 | リスク | UI視覚変化 | SEO影響 | コミット粒度 |
|---|---|:---:|:---:|:---:|:---:|---|
| 1 | P0-4 viewport export 追加 | 🔴 | 極小 | 切欠周辺のみ正規化 | 無 | 1 |
| 2 | P0-1 `safe-area-pb` ユーティリティを globals.css に定義 | 🔴 | 極小 | BottomNav下に環境依存余白 | 無 | 1 |
| 3 | P0-5 フォーム要素 font-size を 16px に格上げ | 🔴 | 低 | 入力欄の文字微増 | 無 | 1 |
| 4 | P1-2 `prefers-reduced-motion` CSS ガード | 🟠 | 極小 | reduce設定時のみ | 無 | 1 |
| 5 | P1-5 BottomNav `aria-current="page"` 付与 | 🟠 | 極小 | 無 | 無 | 1 |
| 6 | P2-5 アイコンボタン `aria-label` 補完 | 🟡 | 極小 | 無 | 無 | 1 |
| 7 | P0-3 OfflineBanner 実装 + layout 組込み | 🔴 | 低 | 接続断時に上部1行 | 無 | 1 |
| 8 | P1-1 タップ標的 hit-area 拡張（視覚サイズ維持） | 🟠 | 低 | 余白微増 | 無 | 1〜2（Header系/詳細ページ系） |
| 9 | P1-4 共通 Modal プリミティブ → 4箇所置換 | 🟠 | 中 | 無（挙動が改善） | 無 | プリミティブ1 + 置換1〜2 |
| 10 | P0-2 Service Worker 復活（Serwist or 手書きSW） | 🔴 | 中 | 無（インストール可能化） | 無 | 設計1 + 実装1 |
| 11 | P1-2 GSAP/Lenis 側の reduce-motion JS 分岐 | 🟠 | 低 | reduce時のみ | 無 | 1 |
| 12 | P1-3 SmoothScroller モバイル無効化 | 🟠 | 中（PC体験要承認） | モバイルのみ native scroll | 無 | 1 |
| 13 | P2-1 z-index トークン化 | 🟡 | 中 | 無（重ね順設計改善） | 無 | 1 |
| 14 | P2-2 sticky top 値を CSS 変数化 | 🟡 | 低 | 無 | 無 | 1 |

**推奨着手順序**: 1→2→3→4→5→6（安全バッチ、まとめて1 PR 化も可）→ 7 → 8 → 9 → 10 → 11 → 12 → 13 → 14

---

## 10. 既知の前提・スコープ外

- **Item 1 の環境修復**（pnpm/npm 混在 node_modules 根治）は本レポートのスコープ外
- **Vercel デプロイ**（個人 `takuma1201` vs `seiren-inc` org の不整合）は別途決定が必要
- **タイポ刷新**（Inter→より特徴的なフォント）は **frontend-design** の指摘あるが、ブランド変更扱いで本レポート対象外
- **本物の MFRI Moderate（+3〜）化** は P0 + P1 完了後の再評価で判定
- 各実装案件は実装前に **Plan-First** で短い計画を提示し承認を得る運用

---

> **Final note**: 本監査は静的解析中心。実機 (iPhone SE / 標準的 Android) / モバイル Lighthouse / 実ユーザ操作観察での確認を、本レポートの P0/P1 修正後に必ず行うこと。
