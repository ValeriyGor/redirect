(function () {
    // ========== CONFIG ==========
    const TARGET_URL = "https://redirect-three-rosy.vercel.app/";
    const PARAM_NAME = "has_redirected";
    const PARAM_VALUE = "true";

    let hasRedirected = false;

    // ========== UTILS ==========
    const isFacebook = () =>
    /FBAN|FBAV|Instagram/i.test(navigator.userAgent);

    const isIOS = () =>
    /iPhone|iPad|iPod/i.test(navigator.userAgent);

    const isAndroid = () =>
    /Android/i.test(navigator.userAgent);

    const alreadyRedirected = () => {
    return new URLSearchParams(location.search).get(PARAM_NAME) === PARAM_VALUE;
};

    const addParam = (url) => {
    const u = new URL(url);
    u.searchParams.set(PARAM_NAME, PARAM_VALUE);
    return u.toString();
};

    const intentUrl = (url) =>
    `intent://navigate?url=${encodeURIComponent(addParam(url))}#Intent;scheme=googlechrome;end;`;

    // Safari вариант — просто то же URL с параметром
    const safariUrl = (url) => addParam(url);

    // ========== REDIRECT CORE ==========
    function redirectFromFacebookToRealBrowser() {
    if (hasRedirected) return;
    hasRedirected = true;

    // Защита от цикла: если мы уже делали редирект → стоп
    if (alreadyRedirected()) return;

    let finalUrl = TARGET_URL;

    // Android → Chrome intent://
    if (isAndroid()) {
    finalUrl = intentUrl(TARGET_URL);
}

    // iOS → Safari (только обычный URL работает)
    else if (isIOS()) {
    finalUrl = safariUrl(TARGET_URL);
}

    // Клик по скрытой ссылке
    const a = document.getElementById("redirect-link");
    a.href = finalUrl;
    a.click();

    // fallback — если intent заблокирован
    setTimeout(() => {
    window.location.href = addParam(TARGET_URL);
}, 1200);
}

    // ========== MAIN LOGIC ==========
    document.addEventListener("DOMContentLoaded", () => {
    // Только если это FB браузер
    if (isFacebook()) {
    redirectFromFacebookToRealBrowser();
}
    // В других браузерах НИЧЕГО НЕ ДЕЛАЕМ
});

})();
