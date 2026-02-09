const isLogin = localStorage.getItem("login");
const role = localStorage.getItem("role");

// cek apakah di folder admin
const isAdminPage = location.pathname.includes("/admin/");

// helper redirect ke login (SELALU BENAR)
function goLogin() {
  location.href = isAdminPage ? "../index.html" : "index.html";
}

// belum login → ke login
if (!isLogin) {
  goLogin();
}

// proteksi admin
if (isAdminPage && role !== "admin") {
  alert("Akses ditolak. Khusus admin.");
  location.href = "../dashboard.html";
}
