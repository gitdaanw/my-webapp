// TODO fix this as it gives continuous 401s
// check if a user is logged in
export async function checkLogin() {
    try {
        const res = await fetch("/authentication/check", { credentials: "same-origin" });
        if (res.ok) {
            return await res.json(); // logged in user information
        } 
    } catch (err) {
        console.error("Login check failed: ", err);
    }
    return null;
}

// protects pages where login is required
export async function guardProtectedPage() {
    // check if .html has data-protected= "true" tag
    const requiresLogin = document.body.dataset.protected === "true";
    if (!requiresLogin) return; // if not it skips login check

    // perform the check if required
    const user = await checkLogin();
    if (!user) {
        window.location.href = "/login.html";
    }
}