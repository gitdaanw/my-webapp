// TODO fix this as it gives continuous 401s

export async function checkLogin() {
    try {
        const res = await fetch("/authentication/check", { credentials: "same-origin" });
        if (res.ok) {
            return await res.json(); // logged in user information
        } else {
            console.warn("User not logged in: ", res.status);
        }
    } catch (err) {
        console.error("Login check failed: ", err);
    }
    return null;
}