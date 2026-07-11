# ✨ 派手電卓

無駄にエフェクトがド派手な電卓 Web アプリ。iPhone の Safari からそのまま使えます。

## iPhone で今すぐ開く（Settings 不要・一番簡単）

GitHub の設定画面は **スマホアプリには出てきません**。以下の方法なら設定不要です。

### 手順

1. iPhone の **Safari** で PR を開く  
   https://github.com/Daaaaaaan3229/CursorTest/pull/1
2. ファイル一覧から **`calculator-standalone.html`** をタップ
3. 右上の **⋯（三点）** → **ダウンロード**（または Raw を開いて共有）
4. **ファイル** アプリ → ダウンロード → `calculator-standalone.html` を長押し → **共有** → **Safari で開く**
5. 動いたら Safari の **共有ボタン** → **ホーム画面に追加**

これでオフラインでも使えるアプリになります。

---

## なぜ「Settings（設定）」が見つからない？

| 原因 | 説明 |
|------|------|
| GitHub アプリを使っている | リポジトリの Settings は **アプリにありません**。Safari で github.com を開いてください |
| スマホの Safari | タブが `...` メニューに隠れていることがあります。横スクロールまたは `...` を確認 |
| 非公開リポジトリ | 無料プランでは GitHub Pages を **非公開リポジトリに公開できません** |

---

## Web URL で公開したい場合（PC が必要）

1. PC のブラウザで https://github.com/Daaaaaaan3229/CursorTest を開く
2. 上部タブの **Settings**（設定）をクリック  
   直接 URL: https://github.com/Daaaaaaan3229/CursorTest/settings
3. 左メニュー **Pages** をクリック
4. **Build and deployment** → Source を **GitHub Actions** に変更
5. PR #1 を **main にマージ**（Actions が自動デプロイ）
6. 数分後、`https://daaaaaaan3229.github.io/CursorTest/` で開ける

※ 非公開リポジトリのままだと Pages は使えません。**Settings → General → Danger Zone → Change visibility** で Public に変更するか、上の「ファイルダウンロード」方法を使ってください。

---

## 機能

- 四則演算（＋ − × ÷）、AC、±、%
- ボタンタップでパーティクル爆発
- ネオン表示・グリッチ・画面シェイク
- `=` 押下で紙吹雪＋フラッシュ＋振動
- 効果音（Web Audio API）
- 星空アニメーション背景

## ファイル構成

```
index.html                  … メインページ（複数ファイル版）
calculator-standalone.html  … 1ファイル完結版（iPhone 向け・おすすめ）
css/style.css
js/calculator.js
manifest.json
```

## ライセンス

MIT
