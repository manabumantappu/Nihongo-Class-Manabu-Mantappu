document.addEventListener("DOMContentLoaded", function () {

  const masuk = document.getElementById("masuk");
  const pulang = document.getElementById("pulang");
  const table = document.getElementById("table");

  if (!table) return;

  let data = JSON.parse(localStorage.getItem("presensiData")) || [];
  const email = localStorage.getItem("email") || "unknown";

  function save() {
    localStorage.setItem("presensiData", JSON.stringify(data));
  }

  function now() {
    return new Date().toLocaleString("id-ID");
  }

  function renderUser() {
    table.innerHTML = "";

    const userData = data.filter(d => d.email === email);

    if (userData.length === 0) {
      table.innerHTML = `
        <tr>
          <td colspan="3" class="p-3 text-center text-gray-500">
            Belum ada presensi
          </td>
        </tr>
      `;
      return;
    }

    userData.forEach(d => {
      table.innerHTML += `
        <tr class="border-t">
          <td class="p-2">${d.email}</td>
          <td class="p-2">${d.waktu}</td>
          <td class="p-2">${d.status}</td>
        </tr>
      `;
    });
  }

  // ===== ABSEN MASUK =====
  if (masuk) {
    masuk.addEventListener("click", function () {

      data.push({
        email: email,
        waktu: now(),
        status: "Masuk"
      });

      save();
      renderUser();

      alert("Absen Masuk berhasil");
    });
  }

  // ===== ABSEN PULANG =====
  if (pulang) {
    pulang.addEventListener("click", function () {

      data.push({
        email: email,
        waktu: now(),
        status: "Pulang"
      });

      save();
      renderUser();

      alert("Absen Pulang berhasil");
    });
  }

  renderUser();

});
