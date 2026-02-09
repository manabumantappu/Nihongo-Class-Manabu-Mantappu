const auth = JSON.parse(localStorage.getItem("auth"));

if (!auth) {
  location.href = "../index.html";
}

// proteksi halaman admin
if (location.pathname.includes("/admin") && auth.role !== "admin") {
  alert("Akses ditolak");
  location.href = "../dashboard.html";
}

// expose role (optional)
console.log("LOGIN AS:", auth.role);
