export async function checkLogin() {
    try {
        const res = await fetch("/authentication/check", { credentials: "same-origin" });
        if (res.ok) {
            return await res.json();
        }
    } catch (err) {
        // Silent fail
    }
    return null;
}