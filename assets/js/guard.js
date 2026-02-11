document.addEventListener("DOMContentLoaded", function () {

  const isLogin = localStorage.getItem("login");
  const role = localStorage.getItem("role");
  const isAdminPage = location.pathname.includes("/admin/");

  function goLogin() {
    location.href = isAdminPage ? "../index.html" : "index.html";
  }

  // Belum login
  if (!isLogin) {
    goLogin();
  }

  // Proteksi admin
  if (isAdminPage && role !== "admin") {
    alert("Akses ditolak. Khusus admin.");
    location.href = "../dashboard.html";
  }

});
