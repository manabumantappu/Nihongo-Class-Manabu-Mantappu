document.addEventListener("DOMContentLoaded", () => {
  const role = localStorage.getItem("role") || "siswa";

  const navbar = `
<header class="sticky top-0 z-50 bg-white shadow">
  <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

    <!-- LOGO -->
    <div class="flex items-center gap-2">
      <span class="text-2xl">🇯🇵</span>
      <span class="text-lg font-bold text-red-600">JP Nihongo Class</span>
    </div>

    <!-- MENU -->
    <nav class="hidden md:flex gap-6 text-sm font-medium items-center">
      <span class="px-2 py-1 text-xs rounded bg-gray-100 text-gray-600">
        ${role.toUpperCase()}
      </span>

      <a href="dashboard.html" class="hover:text-red-600">Dashboard</a>
      <a href="presensi.html" class="hover:text-red-600">Presensi</a>
      <a href="materi.html" class="hover:text-red-600">Materi</a>
      <a href="jadwal.html" class="hover:text-red-600">Jadwal</a>
      <a href="kalender.html" class="hover:text-red-600">Kalender</a>
      <a href="pengumuman.html" class="hover:text-red-600">Pengumuman</a>
      <a href="akun.html" class="hover:text-red-600">Akun</a>

      ${
        role === "admin"
          ? `<a href="admin/index.html" class="text-red-600 font-semibold">Admin</a>`
          : ""
      }
    </nav>

    <!-- LOGOUT -->
    <button onclick="logout()"
      class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
      Logout
    </button>

  </div>
</header>
`;

  document.body.insertAdjacentHTML("afterbegin", navbar);
});
