export const Logout = () => {
    if (typeof window !== 'undefined') {
        // Clear localStorage
        localStorage.removeItem("mobile_builder_user_data");
        localStorage.removeItem("persist:root");
        localStorage.removeItem("mainScreenType");
        localStorage.removeItem("mainSectionName");
        localStorage.removeItem("mainBlockName");

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
}
