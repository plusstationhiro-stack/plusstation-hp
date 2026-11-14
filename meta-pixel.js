/**
 * Meta Pixel（ベースコード）＋ CTA クリック計測
 * Pixel ID: 1748548186208932
 *
 * - PageView: 全ページ表示
 * - Lead: Googleフォーム（無料相談・導入の相談）クリック
 * - Contact: LINE（相談・資料）クリック
 */
(function () {
  var PIXEL_ID = "1748548186208932";

  if (window.fbq) return;

  !(function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = "2.0";
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");

  fbq("init", PIXEL_ID);
  fbq("track", "PageView");

  function track(eventName, contentName) {
    if (typeof fbq !== "function") return;
    fbq("track", eventName, { content_name: contentName });
  }

  document.addEventListener(
    "click",
    function (e) {
      var a = e.target && e.target.closest ? e.target.closest("a") : null;
      if (!a || !a.href) return;
      var href = a.href;
      if (href.indexOf("docs.google.com/forms") !== -1) {
        track("Lead", "google_form");
        return;
      }
      if (href.indexOf("lin.ee/") !== -1 || href.indexOf("line.me/") !== -1) {
        track("Contact", "line");
      }
    },
    true
  );
})();
