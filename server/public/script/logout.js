//! Logout
export const logout = () => {
  //* Get the logout button
  const logoutBtn = document.querySelector(".logout-button");
  if (!logoutBtn) return;
  logoutBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    //* Clear all data for client side
    localStorage.clear();
    sessionStorage.clear();
    document.cookie =
      "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; secure; sameSite=strict";
    //* Send a request to the server to logout
    const res = await fetch("/api/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    if (res.status === 200) location.href = "/";
  });
};
