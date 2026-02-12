document.addEventListener("DOMContentLoaded", () => {

  const email = localStorage.getItem("email");
  const role = localStorage.getItem("role");

  const isAdminPage = location.pathname.includes("/admin/");

  // Jika belum login → kembali ke login
  if (!email) {
    window.location.href = isAdminPage ? "../index.html" : "index.html";
    return;
  }

  // Proteksi halaman admin
  if (isAdminPage && role !== "admin") {
    alert("Akses ditolak.");
    window.location.href = "../dashboard.html";
  }

});
