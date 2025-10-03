export const Logout = () => {
    localStorage.removeItem("mobile_builder_user_data");
    localStorage.removeItem("persist:root");
    window.location.reload()
}
