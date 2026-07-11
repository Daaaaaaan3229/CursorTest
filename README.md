# ✨ 派手電卓

無駄にエフェクトがド派手な電卓 Web アプリ。iPhone の Safari からそのまま使えます。

## 機能

- 四則演算（＋ − × ÷）、AC、±、%
- ボタンタップでパーティクル爆発
- ネオン表示・グリッチ・画面シェイク
- `=` 押下で紙吹雪＋フラッシュ＋振動
- 効果音（Web Audio API）
- 星空アニメーション背景
- ホーム画面に追加可能（PWA 対応）

## iPhone で開く方法

### 方法1: GitHub Pages（推奨）

1. リポジトリの **Settings → Pages** を開く
2. **Source** を `Deploy from a branch` に設定
3. **Branch** を `main`（またはこの PR のブランチ）、フォルダを `/ (root)` に設定
4. 数分後、表示された URL（例: `https://<user>.github.io/<repo>/`）を iPhone の Safari で開く
5. 共有ボタン → **ホーム画面に追加** でアプリのように使える

### 方法2: ローカルサーバー（開発・同一 Wi‑Fi）

```bash
cd /path/to/repo
python3 -m http.server 8080
```

iPhone を PC と同じ Wi‑Fi に接続し、Safari で `http://<PCのIP>:8080` を開く。

## ファイル構成

```
index.html       … メインページ
css/style.css    … スタイル
js/calculator.js … 計算ロジック & エフェクト
manifest.json    … PWA マニフェスト
```

## ライセンス

MIT
