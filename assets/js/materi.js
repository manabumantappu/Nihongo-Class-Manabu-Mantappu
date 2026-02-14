document.addEventListener("DOMContentLoaded", function () {

  const role = localStorage.getItem("role");

  let materiData = JSON.parse(localStorage.getItem("materiData")) || [];

  const judul = document.getElementById("judul");
  const jenis = document.getElementById("jenis");
  const link = document.getElementById("link");
  const simpan = document.getElementById("simpanMateri");

  const table = document.getElementById("materiTable");
  const list = document.getElementById("materiList");

  let editIndex = null;

  function saveToStorage() {
    localStorage.setItem("materiData", JSON.stringify(materiData));
  }

  // ================= ADMIN =================
  function renderAdmin() {
    if (!table || role !== "admin") return;

    table.innerHTML = "";

    if (materiData.length === 0) {
      table.innerHTML = `
        <tr>
          <td colspan="3" class="p-4 text-center text-gray-400">
            Belum ada materi
          </td>
        </tr>
      `;
      return;
    }

    materiData.forEach((m, index) => {
      table.innerHTML += `
        <tr class="border-t hover:bg-gray-50">
          <td class="p-3 font-medium">${m.judul}</td>
          <td class="p-3 text-gray-500">${m.jenis}</td>
          <td class="p-3 space-x-3">
            <button onclick="editMateri(${index})"
              class="text-blue-600 hover:underline text-sm">
              Edit
            </button>
            <button onclick="hapusMateri(${index})"
              class="text-red-600 hover:underline text-sm">
              Hapus
            </button>
          </td>
        </tr>
      `;
    });
  }

  // ================= SISWA =================
  function renderSiswa() {
    if (!list) return;

    list.innerHTML = "";

    if (materiData.length === 0) {
      list.innerHTML = `
        <div class="bg-white p-6 rounded-xl shadow text-center text-gray-400">
          Belum ada materi tersedia
        </div>
      `;
      return;
    }

    materiData.forEach(m => {
      list.innerHTML += `
        <div class="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition">
          <h3 class="font-semibold text-lg text-gray-800">
            ${m.judul}
          </h3>
          <p class="text-sm text-gray-500 mt-1">
            ${m.jenis}
          </p>
          <a href="${m.link}" target="_blank"
             class="inline-block mt-4 text-indigo-600 text-sm font-medium hover:underline">
             Buka Materi →
          </a>
        </div>
      `;
    });
  }

  // ================= SIMPAN =================
  if (simpan) {
    simpan.addEventListener("click", function () {

      if (!judul.value.trim() || !jenis.value.trim() || !link.value.trim()) {
        alert("Semua field wajib diisi");
        return;
      }

      const newData = {
        id: Date.now(),
        judul: judul.value.trim(),
        jenis: jenis.value.trim(),
        link: link.value.trim()
      };

      if (editIndex !== null) {
        materiData[editIndex] = newData;
        editIndex = null;
      } else {
        materiData.push(newData);
      }

      saveToStorage();
      renderAdmin();
      renderSiswa();

      judul.value = "";
      jenis.value = "";
      link.value = "";

      alert("Materi berhasil disimpan");
    });
  }

  // ================= HAPUS =================
  window.hapusMateri = function (index) {
    if (!confirm("Yakin hapus materi?")) return;

    materiData.splice(index, 1);
    saveToStorage();
    renderAdmin();
    renderSiswa();
  }

  // ================= EDIT =================
  window.editMateri = function (index) {

    const m = materiData[index];

    judul.value = m.judul;
    jenis.value = m.jenis;
    link.value = m.link;

    editIndex = index;
  }

  renderAdmin();
  renderSiswa();

});
