document.addEventListener("DOMContentLoaded", function () {

  let materiData = JSON.parse(localStorage.getItem("materiData")) || [];

  const judul = document.getElementById("judul");
  const jenis = document.getElementById("jenis");
  const link = document.getElementById("link");
  const simpan = document.getElementById("simpanMateri");

  const table = document.getElementById("materiTable");
  const list = document.getElementById("materiList");

  function save() {
    localStorage.setItem("materiData", JSON.stringify(materiData));
  }

  function renderAdmin() {
    if (!table) return;

    table.innerHTML = "";

    materiData.forEach((m, index) => {
      table.innerHTML += `
        <tr class="border-t">
          <td class="p-2">${m.judul}</td>
          <td class="p-2">${m.jenis}</td>
          <td class="p-2">
            <button onclick="editMateri(${index})" class="text-blue-600">Edit</button>
            <button onclick="hapusMateri(${index})" class="text-red-600 ml-2">Hapus</button>
          </td>
        </tr>
      `;
    });
  }

  function renderSiswa() {
    if (!list) return;

    list.innerHTML = "";

    materiData.forEach(m => {
      list.innerHTML += `
        <div class="bg-white p-4 rounded shadow">
          <h3 class="font-semibold">${m.judul}</h3>
          <p class="text-sm text-gray-500">${m.jenis}</p>
          <a href="${m.link}" target="_blank"
             class="mt-3 block text-blue-600 text-sm">
             Buka Materi
          </a>
        </div>
      `;
    });
  }

  if (simpan) {
    simpan.addEventListener("click", function () {

      if (!judul.value || !jenis.value || !link.value) {
        alert("Semua field wajib diisi");
        return;
      }

      materiData.push({
        id: Date.now(),
        judul: judul.value,
        jenis: jenis.value,
        link: link.value
      });

      save();
      renderAdmin();

      judul.value = "";
      jenis.value = "";
      link.value = "";
    });
  }

  window.hapusMateri = function (index) {
    if (confirm("Yakin hapus materi?")) {
      materiData.splice(index, 1);
      save();
      renderAdmin();
      renderSiswa();
    }
  }

  window.editMateri = function (index) {
    const m = materiData[index];

    judul.value = m.judul;
    jenis.value = m.jenis;
    link.value = m.link;

    materiData.splice(index, 1);
    save();
    renderAdmin();
  }

  renderAdmin();
  renderSiswa();

});
