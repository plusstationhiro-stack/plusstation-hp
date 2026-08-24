# ニュース（お知らせ・実績）運用

Studio は使わない。このリポジトリの静的サイトが正。

## 更新手順（かんたん）

1. 画像があれば `assets/news/` に置く（例: `cheval-logo.jpg`）  
2. `content/news.json` に記事オブジェクトを **先頭（新しい順）** に追加する  
3. ターミナルで `npm run build:news` を実行する  
4. 生成された `pages/news.html` と `pages/news/*.html`、トップの NEWS 枠を確認する  
5. 問題なければコミット

## 記事オブジェクトの形

```json
{
  "slug": "cheval-u15-partnership",
  "date": "2025-08-01",
  "title": "タイトル（H1・titleタグ兼用の核）",
  "description": "meta description（120字前後）",
  "category": "チーム支援",
  "summary": "一覧・トップ用の短い要約",
  "published": true,
  "image": "/assets/news/cheval-logo.jpg",
  "imageAlt": "シュバルバスケットボールクラブのロゴ",
  "body": [
    "段落1",
    "段落2"
  ]
}
```

- `image` / `imageAlt` は任意。なければテキストのみ
- `partnerUrl` は任意。パートナーロゴクリック時の外部リンク（例: CHEVAL 公式 `https://chevalbasketballclub.1web.jp/`）。本文リンクは自社ニュース記事のまま
- `published: false` → 本番に出ない（下書き）
- 千葉ジェッツ等、発表前は出さない
- **シュバル（CHEVAL）** は第一弾（ロゴ許諾あり・`assets/news/cheval-logo.jpg`）

## 画像フォルダ

| パス | 用途 |
|------|------|
| `assets/news/` | お知らせ・パートナーロゴ |
| `assets/people/` | 資格保有者の顔写真（`pt-cscs.png` = 理学療法士+NSCA-CSCS、`pt.png` = 理学療法士） |
| `assets/hero/` | トップの大きな背景写真（素材なし・要調達） |
| `content/people.json` | 専門職のメタデータ（氏名は確認後） |

## URL

| パス | 内容 |
|------|------|
| `/news` または `/pages/news.html` | 一覧 |
| `/news/{slug}` | 個別記事（被リンクされやすい固定URL） |

## 被リンク・サイテーション

導入先には「公式サイトのこのURLを紹介・リンクしてほしい」と依頼する。  
第一弾: `/news/cheval-u15-partnership`

## SEO

`build:news` が各記事に `NewsArticle` の JSON-LD、一覧用のリンク構造を出力する。
