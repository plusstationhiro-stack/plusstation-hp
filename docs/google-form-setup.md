# Googleフォーム（導入の相談）

問い合わせは **Googleフォームにリンク**する方式（いちばん手間が少ない）。

## 手順

1. [Googleフォーム](https://forms.google.com) で新規作成  
2. 項目例: 団体名・チーム名／ご担当者名／メール／相談内容  
3. 「送信」→ リンクをコピー（`https://forms.gle/...` または `docs.google.com/forms/...`）  
4. 各ページの「導入を相談する」とナビ・フッターの相談リンクを、そのURLへ直接つなぐ  

```html
href="https://forms.gle/xxxxxxxx"
```

5. `/contact` は既存リンク対策として、`vercel.json` で同じフォームへリダイレクトする  
6. 回答の通知メールを自分のGmailで受け取る設定にしておく  

Formspree は使わない（`docs/formspree-setup.md` は参考残し／非推奨）。
