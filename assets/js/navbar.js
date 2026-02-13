document.addEventListener("DOMContentLoaded", () => {

  const role = localStorage.getItem("role") || "siswa";
  const isAdminPage = location.pathname.includes("/admin/");

  // Helper path
  const p = (file) => isAdminPage ? `../${file}` : file;

  // Dashboard link yang BENAR
  let dashboardLink;

  if (role === "admin") {
    dashboardLink = isAdminPage ? "index.html" : "admin/index.html";
  } else {
    dashboardLink = isAdminPage ? "../dashboard.html" : "dashboard.html";
  }

  const navbar = `
<header class="sticky top-0 z-50 bg-white shadow">
  <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

    <div class="flex items-center gap-2">
      <span class="text-lg font-bold text-red-600">JP Nihongo Class</span>
    </div>

    <nav class="hidden md:flex gap-6 text-sm font-medium items-center">

      <span class="px-2 py-1 text-xs rounded bg-gray-100 text-gray-600">
        ${role.toUpperCase()}
      </span>

      <a href="${dashboardLink}" class="hover:text-red-600">Dashboard</a>
      <a href="${p("presensi.html")}" class="hover:text-red-600">Presensi</a>
      <a href="${p("materi.html")}" class="hover:text-red-600">Materi</a>
      <a href="${p("jadwal.html")}" class="hover:text-red-600">Jadwal</a>
      <a href="${p("kalender.html")}" class="hover:text-red-600">Kalender</a>
      <a href="${p("pengumuman.html")}" class="hover:text-red-600">Pengumuman</a>
      <a href="${p("akun.html")}" class="hover:text-red-600">Akun</a>

      ${
        role === "admin"
          ? `<a href="${isAdminPage ? "index.html" : "admin/index.html"}"
               class="text-red-600 font-semibold">Admin</a>`
          : ""
      }

    </nav>

    <button onclick="logout()"
      class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
      Logout
    </button>

  </div>
</header>
`;

  document.body.insertAdjacentHTML("afterbegin", navbar);

});


// Tambahkan ini di luar DOMContentLoaded
window.logout = function () {
  localStorage.clear();

  const repo = window.location.pathname.split("/")[1];

  window.location.href = `/${repo}/login.html`;
};


