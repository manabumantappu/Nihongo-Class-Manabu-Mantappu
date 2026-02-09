const isLogin = localStorage.getItem("login");
const role = localStorage.getItem("role");

// belum login
if (!isLogin) {
  if (location.pathname.includes("/admin/")) {
    location.href = "../index.html";
  } else {
    location.href = "index.html";
  }
}

// proteksi admin
if (location.pathname.includes("/admin/") && role !== "admin") {
  alert("Akses ditolak. Khusus admin.");
  location.href = "../dashboard.html";
}
