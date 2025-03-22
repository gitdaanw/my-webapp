export async function checkLogin() {
    try {
        const res = await fetch("/auth/check", { credentials: "same-origin" });
        if (res.ok) {
            return await res.json();
        }
    } catch (err) {
        // Silent fail
    }
    return null;
}