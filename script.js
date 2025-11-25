(function () {
    // ========== CONFIG ==========
    const TARGET_URL = "https://google.com"; // куда отправляем
    const EXTRA = { has_redirected: "true" };

    let hasRedirected = false;

    // ========== UTILS ==========
    const isFacebook = () =>
        /FBAN|FBAV|Instagram/i.test(navigator.userAgent);

    const isIOS = () =>
        /iPhone|iPad|iPod/i.test(navigator.userAgent);

    const isAndroid = () =>
        /Android/i.test(navigator.userAgent);

    const buildParams = () => {
        const params = new URLSearchParams();
        Object.entries(EXTRA).forEach(([k, v]) => params.append(k, v));
        return params.toString();
    };

    const intentUrl = (url, params) =>
        `intent://navigate?url=${encodeURIComponent(url + "?" + params)}#Intent;scheme=googlechrome;end;`;

    const safariUrl = (url, params) =>
        url + "?" + params;

    // ========== REDIRECT CORE ==========
    function doRedirect() {
        if (hasRedirected) return;
        hasRedirected = true;

        const params = buildParams();
        let finalUrl = TARGET_URL;

        if (!isFacebook()) {
            window.location.href = finalUrl + "?" + params;
            return;
        }

        if (isAndroid()) {
            finalUrl = intentUrl(TARGET_URL, params);
        } else if (isIOS()) {
            finalUrl = safariUrl(TARGET_URL, params);
        }

        const a = document.getElementById("redirect-link");
        a.href = finalUrl;
        a.click();

        // fallback
        setTimeout(() => {
            window.location.href = TARGET_URL + "?" + params;
        }, 1200);
    }

    // ========== AUTO REDIRECT ==========
    document.addEventListener("DOMContentLoaded", () => {
        doRedirect();
    });

    document.getElementById("redirect")?.addEventListener("click", (e) => {
        e.preventDefault();
        doRedirect();
    });

})();