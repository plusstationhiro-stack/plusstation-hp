# ++Station 公式サイト（plusstation-hp）

アプリ（`plusstation-new`）とは **別フォルダ**。Cursor はここだけ開いて作業する。

## Cursor の開き方

1. Cursor → File → Open Folder…
2. このフォルダを選択:  
   `Developer/PlusStation-Project/plusstation-hp`
3. アプリ用の Cursor は閉じてよい

## いま入っているもの

| パス | 用途 |
|------|------|
| `index.html` | トップ（下地。これから公式HP化） |
| `reset-password.html` + `reset-password.js` | パスワード再設定 |
| `styles.css` | 共通スタイル |
| `pages/` | 利用規約・プライバシー等の下地用 |
| `assets/` | 写真・ロゴ（後から追加） |

## Studio との関係

審査中の Studio URL（利用規約・プライバシー）は **触らない**。  
ここは下地。写真・デザインは後で反映し、完成後にドメイン切替を検討。

## Vercel（将来）

Root Directory = このリポジトリ直下。  
個人アプリの `EXPO_PUBLIC_APP_WEB_URL` は本番ホストに合わせる。

## アプリ側に残している auth-web

`plusstation-new/auth-web` は当面そのまま（既存デプロイ用）。  
HP が安定したら、アプリ側は「こちらへ移行済み」と案内する想定。
