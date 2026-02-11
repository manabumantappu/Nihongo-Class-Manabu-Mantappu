document.addEventListener("DOMContentLoaded", function () {

  let materiData = JSON.parse(localStorage.getItem("materiData")) || [];

  const judul = document.getElementById("judul");
  const jenis = document.getElementById("jenis");
  const link = document.getElementById("link");
  const simpan = document.getElementById("simpanMateri");
  const table = document.getElementById("materiTable");

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

      alert("Materi berhasil ditambahkan");
    });
  }

  window.hapusMateri = function (index) {
    if (confirm("Yakin hapus materi?")) {
      materiData.splice(index, 1);
      save();
      renderAdmin();
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

});
