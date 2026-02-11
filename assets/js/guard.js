document.addEventListener("DOMContentLoaded", () => {

  const isLogin = localStorage.getItem("login");
  const role = localStorage.getItem("role");

  const isAdminPage = location.pathname.includes("/admin/");

  if (!isLogin) {
    window.location.href = isAdminPage ? "../index.html" : "index.html";
    return;
  }

  // Proteksi admin page
  if (isAdminPage && role !== "admin") {
    alert("Akses ditolak.");
    window.location.href = "../dashboard.html";
  }

});
