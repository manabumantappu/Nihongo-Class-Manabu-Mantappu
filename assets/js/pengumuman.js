document.addEventListener("DOMContentLoaded", function () {

  let data = JSON.parse(localStorage.getItem("pengumumanData")) || [];

  const judul = document.getElementById("judul");
  const kategori = document.getElementById("kategori");
  const simpan = document.getElementById("simpanPengumuman");

  const adminList = document.getElementById("adminList");
  const list = document.getElementById("pengumumanList");

  function save() {
    localStorage.setItem("pengumumanData", JSON.stringify(data));
  }

  function today() {
    return new Date().toLocaleDateString("id-ID");
  }

  // ================= ADMIN VIEW =================
  function renderAdmin() {
    if (!adminList) return;

    adminList.innerHTML = "";

    if (data.length === 0) {
      adminList.innerHTML = `
        <div class="bg-white p-4 rounded shadow text-center text-gray-500">
          Belum ada pengumuman
        </div>
      `;
      return;
    }

    data.forEach((item, index) => {
      adminList.innerHTML += `
        <div class="bg-white p-4 rounded shadow">
          <span class="text-xs px-2 py-1 rounded ${
            item.kategori === "Penting"
              ? "bg-red-100 text-red-600"
              : "bg-blue-100 text-blue-600"
          }">${item.kategori}</span>

          <h3 class="font-semibold mt-2">${item.judul}</h3>
          <p class="text-sm text-gray-500">${item.tanggal}</p>

          <div class="mt-2">
            <button onclick="editPengumuman(${index})"
              class="text-blue-600 text-sm">Edit</button>

            <button onclick="hapusPengumuman(${index})"
              class="text-red-600 text-sm ml-3">Hapus</button>
          </div>
        </div>
      `;
    });
  }

  // ================= SISWA VIEW =================
  function renderSiswa() {
    if (!list) return;

    list.innerHTML = "";

    if (data.length === 0) {
      list.innerHTML = `
        <div class="bg-white p-4 rounded shadow text-center text-gray-500">
          Belum ada pengumuman
        </div>
      `;
      return;
    }

    // tampil terbaru di atas
    const sorted = [...data].reverse();

    sorted.forEach(item => {
      list.innerHTML += `
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
  }

  // ================= TAMBAH =================
  if (simpan) {
    simpan.addEventListener("click", function () {

      if (!judul.value) {
        alert("Judul wajib diisi");
        return;
      }

      data.push({
        judul: judul.value,
        kategori: kategori.value,
        tanggal: today()
      });

      save();
      renderAdmin();
      renderSiswa();

      judul.value = "";
    });
  }

  // ================= HAPUS =================
  window.hapusPengumuman = function (index) {
    if (confirm("Yakin hapus pengumuman?")) {
      data.splice(index, 1);
      save();
      renderAdmin();
      renderSiswa();
    }
  };

  // ================= EDIT =================
  window.editPengumuman = function (index) {
    const item = data[index];

    judul.value = item.judul;
    kategori.value = item.kategori;

    data.splice(index, 1);
    save();
    renderAdmin();
    renderSiswa();
  };

  renderAdmin();
  renderSiswa();

});
