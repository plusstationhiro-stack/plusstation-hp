/**
 * Meta Pixel CTA クリック計測
 * ※ベースコード（init / PageView）は各ページ head のインラインに置く
 *
 * - Lead: Googleフォーム（無料相談・導入の相談）クリック
 * - Contact: LINE（相談・資料）クリック
 */
(function () {
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
