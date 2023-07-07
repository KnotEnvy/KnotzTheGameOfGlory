export function isMobileDevice() {
    const isMobile = (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
    console.log(`Is mobile: ${isMobile}`);
    return isMobile;
}
