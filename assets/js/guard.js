const isLogin = localStorage.getItem("login");
const role = localStorage.getItem("role");

// cek apakah halaman admin
const isAdminPage = location.pathname.includes("/admin/");

// redirect RELATIF (AMAN UNTUK GITHUB PAGES PROJECT)
function goLogin() {
  location.href = isAdminPage ? "../index.html" : "index.html";
}

// belum login
if (!isLogin) {
  goLogin();
}

// proteksi admin
if (isAdminPage && role !== "admin") {
  alert("Akses ditolak. Khusus admin.");
  location.href = "../dashboard.html";
}
