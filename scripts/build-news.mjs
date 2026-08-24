/**
 * content/news.json → pages/news.html + pages/news/*.html + index NEWS枠
 * 使い方: npm run build:news
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const newsPath = path.join(root, "content", "news.json");
const outDir = path.join(root, "pages", "news");
const listPath = path.join(root, "pages", "news.html");
const indexPath = path.join(root, "index.html");

const SITE = "https://plus-station.jp";
const CONTACT_FORM =
  "https://docs.google.com/forms/d/e/1FAIpQLSejtY6B5naPM6H2yKKAnMXkYXdOmvDeRB_jo1X9jZT2RwYt1A/viewform";

const FONT_LINKS = `
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700;800&family=Syne:wght@700;800&display=swap"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="/styles.css" />`;

function esc(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function nav(active) {
  const items = [
    ["チーム向け", "/pages/team.html", "team"],
    ["個人向け", "/pages/app.html", "app"],
    ["お知らせ", "/pages/news.html", "news"],
    ["会社概要", "/pages/company.html", "company"],
    ["導入の相談", CONTACT_FORM, "contact"],
  ];
  return items
    .map(([label, href, key]) => {
      const cur = key === active ? ' aria-current="page"' : "";
      const external = key === "contact" ? ' target="_blank" rel="noopener noreferrer"' : "";
      return `<a href="${href}"${cur}${external}>${label}</a>`;
    })
    .join("\n            ");
}

function footer() {
  return `
      <footer class="site-footer">
        <div class="site-footer__inner">
          <div class="site-footer__brand">株式会社 Plus Station</div>
          <div class="footer-links">
            <a href="/pages/team.html">チーム向け</a>
            <a href="/pages/app.html">個人向け</a>
            <a href="/pages/news.html">お知らせ</a>
            <a href="/pages/company.html">会社概要</a>
            <a href="${CONTACT_FORM}" target="_blank" rel="noopener noreferrer">導入の相談</a>
            <a href="/pages/privacy.html">プライバシーポリシー</a>
            <a href="/pages/terms.html">利用規約</a>
            <a href="/pages/tokusho.html">特定商取引法に基づく表記</a>
          </div>
          <p class="footer-copy">&copy; Plus Station Co., Ltd.</p>
        </div>
      </footer>`;
}

function shell({ title, description, activeNav, main, jsonLd, canonical }) {
  const ld = jsonLd
    ? `\n    <script type="application/ld+json">\n${JSON.stringify(jsonLd, null, 2)}\n    </script>`
    : "";
  const canon = canonical
    ? `\n    <link rel="canonical" href="${esc(canonical)}" />`
    : "";
  return `<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}" />${canon}${FONT_LINKS}${ld}
  </head>
  <body>
    <div class="site">
      <header class="site-header">
        <div class="site-header__inner">
          <a class="brand" href="/"><span>++</span>Station</a>
          <nav class="nav" aria-label="メイン">
            ${nav(activeNav)}
          </nav>
        </div>
      </header>
      <main class="site-main">
${main}
      </main>
${footer()}
    </div>
  </body>
</html>
`;
}

function formatDate(iso) {
  const [y, m, d] = iso.split("-");
  return `${y}年${Number(m)}月${Number(d)}日`;
}

function partnerLinkAttrs() {
  return " target=\"_blank\" rel=\"noopener noreferrer\"";
}

function newsImageBlock(a, { className = "", linkClass = "", width = 320, height = 320 } = {}) {
  if (!a.image) return "";
  const img = `<img${className ? ` class="${className}"` : ""} src="${esc(a.image)}" alt="${esc(a.imageAlt || a.partnerName || a.title)}" width="${width}" height="${height}" />`;
  if (a.partnerUrl) {
    const label = esc(`${a.partnerName || "パートナー"}の公式サイト`);
    const linkClassAttr = linkClass ? ` class="${linkClass}"` : "";
    return `<a href="${esc(a.partnerUrl)}"${linkClassAttr}${partnerLinkAttrs()} aria-label="${label}">${img}</a>`;
  }
  return img;
}

const raw = JSON.parse(fs.readFileSync(newsPath, "utf8"));
const articles = raw
  .filter((a) => a.published !== false)
  .sort((a, b) => (a.date < b.date ? 1 : -1));

fs.mkdirSync(outDir, { recursive: true });

// 古い生成記事を消してから作り直し（手動HTMLを置かない前提）
for (const f of fs.readdirSync(outDir)) {
  if (f.endsWith(".html")) fs.unlinkSync(path.join(outDir, f));
}

for (const a of articles) {
  const paragraphs = (a.body || []).map((p) => `            <p>${esc(p)}</p>`).join("\n");
  const articleUrl = `${SITE}/news/${a.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: a.title,
    datePublished: a.date,
    description: a.description || a.summary,
    url: articleUrl,
    mainEntityOfPage: articleUrl,
    author: {
      "@type": "Organization",
      name: "株式会社 Plus Station",
      url: SITE,
    },
    publisher: {
      "@type": "Organization",
      name: "株式会社 Plus Station",
      url: SITE,
    },
  };
  const imageBlock = a.image
    ? `          <figure class="news-figure">
            ${newsImageBlock(a, { linkClass: "news-figure__link", width: 320, height: 320 })}
          </figure>\n`
    : "";
  const main = `
        <article class="wrap legal news-article">
          <p class="muted"><a href="/pages/news.html">← お知らせ一覧</a></p>
          <p class="eyebrow">${esc(a.category || "News")} · ${esc(formatDate(a.date))}</p>
          <h1>${esc(a.title)}</h1>
          <p class="enacted">${esc(a.summary || "")}</p>
${imageBlock}${paragraphs}
        </article>`;
  const html = shell({
    title: `${a.title}｜++Station`,
    description: a.description || a.summary || a.title,
    activeNav: "news",
    main,
    jsonLd,
    canonical: articleUrl,
  });
  fs.writeFileSync(path.join(outDir, `${a.slug}.html`), html, "utf8");
}

const listItems =
  articles.length === 0
    ? `<p class="lead">現在、公開中のお知らせはありません。</p>`
    : `<ul class="news-list">
${articles
  .map((a) => {
    const thumbCell = a.image
      ? newsImageBlock(a, {
          className: "news-list__thumb",
          linkClass: "news-list__thumb-link",
          width: 72,
          height: 72,
        })
      : "";
    return `          <li>
            <div class="news-list__item">
              ${thumbCell}
              <a class="news-list__content" href="/pages/news/${esc(a.slug)}.html">
                <span class="news-list__body">
                  <span class="news-list__meta">${esc(formatDate(a.date))} · ${esc(a.category || "News")}</span>
                  <span class="news-list__title">${esc(a.title)}</span>
                  <span class="news-list__sum">${esc(a.summary || "")}</span>
                </span>
              </a>
            </div>
          </li>`;
  })
  .join("\n")}
        </ul>`;

const listMain = `
        <header class="page-hero">
          <div class="wrap">
            <p class="eyebrow">News</p>
            <h1>お知らせ・導入実績</h1>
            <p class="lead">パートナーシップやサービスに関するお知らせです。チーム・団体様からのご紹介・リンクも歓迎しています。</p>
          </div>
        </header>
        <section class="section">
          <div class="wrap">
${listItems}
          </div>
        </section>`;

fs.writeFileSync(
  listPath,
  shell({
    title: "お知らせ・導入実績｜++Station",
    description:
      "株式会社Plus Stationのお知らせ・パートナーシップ・導入実績。シュバルバスケットボールクラブとの提携など。",
    activeNav: "news",
    main: listMain,
    canonical: `${SITE}/news`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "お知らせ・導入実績",
      url: `${SITE}/news`,
      hasPart: articles.map((a) => ({
        "@type": "NewsArticle",
        headline: a.title,
        datePublished: a.date,
        url: `${SITE}/news/${a.slug}`,
      })),
    },
  }),
  "utf8",
);

// トップ NEWS 枠（マーカー必須）— ホームのみ大きめカード
const latest = articles[0];
const newsSlot = latest
  ? `        <section class="section news-feature" aria-label="お知らせ">
          <div class="wrap">
            <div class="news-feature__head">
              <h2 class="section-title">お知らせ</h2>
              <a class="news-feature__all" href="/pages/news.html">一覧を見る</a>
            </div>
            <div class="news-feature__card">
              ${
                latest.image
                  ? newsImageBlock(latest, {
                      className: "news-feature__img",
                      linkClass: "news-feature__logo-link",
                      width: 160,
                      height: 160,
                    })
                  : ""
              }
              <a class="news-feature__body-link" href="/pages/news/${esc(latest.slug)}.html">
                <div class="news-feature__body">
                  <p class="news-feature__meta">${esc(formatDate(latest.date))} · ${esc(latest.category || "News")}</p>
                  <h3 class="news-feature__title">${esc(latest.title.replace(/^【[^】]+】/, "").trim() || latest.title)}</h3>
                  <p class="news-feature__sum">${esc(latest.summary || "")}</p>
                </div>
              </a>
            </div>
          </div>
        </section>`
  : `        <section class="section news-feature" aria-label="お知らせ">
          <div class="wrap">
            <h2 class="section-title">お知らせ</h2>
            <p class="lead">お知らせは準備中です。</p>
          </div>
        </section>`;

let indexHtml = fs.readFileSync(indexPath, "utf8");
if (!indexHtml.includes("<!-- NEWS_SLOT_START -->")) {
  throw new Error("index.html に <!-- NEWS_SLOT_START --> マーカーがありません");
}
indexHtml = indexHtml.replace(
  /<!-- NEWS_SLOT_START -->[\s\S]*?<!-- NEWS_SLOT_END -->/,
  `<!-- NEWS_SLOT_START -->\n${newsSlot}\n        <!-- NEWS_SLOT_END -->`,
);
fs.writeFileSync(indexPath, indexHtml, "utf8");

const staticUrls = [
  ["/", "1.0", "weekly"],
  ["/team", "0.9", "weekly"],
  ["/app", "0.9", "weekly"],
  ["/news", "0.8", "weekly"],
  ["/company", "0.6", "monthly"],
  ["/privacy", "0.3", "yearly"],
  ["/terms", "0.3", "yearly"],
  ["/tokusho", "0.3", "yearly"],
];
const newsUrls = articles.map((a) => [`/news/${a.slug}`, "0.8", "monthly"]);
const sitemapBody = [...staticUrls, ...newsUrls]
  .map(
    ([loc, priority, changefreq]) => `  <url>
    <loc>${SITE}${loc}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`,
  )
  .join("\n");
fs.writeFileSync(
  path.join(root, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapBody}
</urlset>
`,
  "utf8",
);

console.log(`build:news → ${articles.length} article(s), list, index NEWS slot, sitemap`);
