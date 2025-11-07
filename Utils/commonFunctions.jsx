export const BaseURL = "https://20dqgn6p-3000.inc1.devtunnels.ms/";
export const Logout = () => {
    console.log('logoutA')
    console.log('typeof window:', typeof window)

    // Handle server-side logout
    if (typeof window === 'undefined') {
        console.log('logoutB - Server side logout')
        console.log('Server side: Cannot clear localStorage or redirect')
        // On server side, we can't clear localStorage or redirect
        // The client will need to handle the redirect after the error is thrown
        return;
    }

    // Handle client-side logout
    console.log('logoutB - Client side logout')
    console.log('Client side: Clearing localStorage and redirecting')

    // Clear localStorage
    localStorage.removeItem("mobile_builder_user_data");
    localStorage.removeItem("persist:root");
    localStorage.removeItem("mainScreenType");
    localStorage.removeItem("mainSectionName");
    localStorage.removeItem("mainBlockName");
    localStorage.removeItem("mainThemeName");

    // Clear all cookies
    document.cookie = "auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "mobile_builder_user_data=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Clear any other potential cookies
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
    }

    // Redirect to login page
    window.location.href = '/login';
}

export function getImageUrl(imagePath) {
    if (!imagePath) return '';
    if (imagePath.startsWith('blob:')) return imagePath;
    if (imagePath.startsWith('http')) return imagePath;
    return `${BaseURL}uploads/${imagePath}`;
}