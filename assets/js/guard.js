// GUARD SEDERHANA (AMAN GITHUB PAGES)

// cek login
const isLogin = localStorage.getItem("login");

// jika belum login, lempar ke index (login)
if (!isLogin) {
  // cek apakah sedang di admin atau root
  if (location.pathname.includes("/admin/")) {
    location.href = "../index.html";
  } else {
    location.href = "index.html";
  }
}
