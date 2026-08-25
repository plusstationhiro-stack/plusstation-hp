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

## Git

GitHub: `plusstationhiro-stack/plusstation-hp`（`main` に push で Vercel 本番デプロイ）

## Vercel

本番: **https://plusstation-hp.vercel.app**

Root Directory = このリポジトリ直下。`npm run build`（`vercel.json` 済み）。

Environment Variables（個人 Supabase — auth-web と同じ）:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_APP_SCHEME` = `plusstation-app`（任意）

DNS 切替時は Vercel → Domains で `plus-station.jp` を追加。

## ドメイン切替の順序（メモ）

1. Vercel で HP をデプロイ（まず `plusstation-hp.vercel.app`）
2. ストア・Studio 登録 URL を `orchid418137.studio.site/...` → `plus-station.jp/...` に更新
3. `plus-station.jp` の DNS を Vercel（この HP プロジェクト）へ切替
4. 安定後、アプリの `EXPO_PUBLIC_APP_WEB_URL` を HP 本番に寄せる（auth-web からの移行）

## アプリ側に残している auth-web

`plusstation-new/auth-web` は当面そのまま（既存デプロイ用）。  
HP が安定したら、アプリ側は「こちらへ移行済み」と案内する想定。
