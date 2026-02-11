document.addEventListener("DOMContentLoaded", function () {

  const container = document.getElementById("dashboardPengumuman");
  if (!container) return;

  const data = JSON.parse(localStorage.getItem("pengumumanData")) || [];

  if (data.length === 0) {
    container.innerHTML = `
      <div class="bg-white p-4 rounded shadow text-center text-gray-500">
        Belum ada pengumuman
      </div>
    `;
    return;
  }

  // Ambil 3 terbaru
  const terbaru = [...data].reverse().slice(0, 3);

  terbaru.forEach(item => {
    container.innerHTML += `
      <div class="bg-white p-4 rounded shadow">
        <span class="text-xs px-2 py-1 rounded ${
          item.kategori === "Penting"
            ? "bg-red-100 text-red-600"
            : "bg-blue-100 text-blue-600"
        }">${item.kategori}</span>

        <h3 class="font-semibold mt-2">${item.judul}</h3>
        <p class="text-sm text-gray-500">${item.tanggal}</p>
      </div>
    `;
  });

});
