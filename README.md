# ++Station 公式サイト（plusstation-hp）

アプリ（`plusstation-new`）とは **別フォルダ**。Cursor はここだけ開いて作業する。

## Cursor の開き方

1. Cursor → File → Open Folder…
2. このフォルダを選択:  
   `Developer/PlusStation-Project/plusstation-hp`
3. アプリ用の Cursor は閉じてよい

## 設計の正

サイトの方針・来訪者・ジャーニー・サイトマップは **`docs/hp-brief.md`**。  
Cursor 用ルールは `.cursor/rules/`（`hp-project` / `hp-design`）。

## いま入っているもの

| パス | 用途 |
|------|------|
| `docs/hp-brief.md` | 公式サイトの設計 brief |
| `index.html` | トップ（ヒーロー・News枠・会社一言・二本柱分岐） |
| `pages/app.html` | 個人向け（機能・料金・ストア近日公開） |
| `pages/team.html` | チーム向け（コンテンツ力・問い合わせCTA） |
| `pages/company.html` | 会社概要 |
| Googleフォーム | チーム向けの導入相談（各CTAから直接遷移） |
| `pages/news.html` | お知らせ一覧 |
| `pages/news/*.html` | 個別記事（`npm run build:news` で生成） |
| `content/news.json` | ニュースの編集元（更新手順は `docs/news-ops.md`） |
| `pages/privacy.html` / `terms.html` / `tokusho.html` | 法的3点（plusstation-new 流用） |
| `reset-password.html` + `reset-password.js` | パスワード再設定 |
| `styles.css` | 共通スタイル |
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
