const masuk = document.getElementById("masuk");
const pulang = document.getElementById("pulang");
const table = document.getElementById("table");

let data = JSON.parse(localStorage.getItem("presensiData")) || [];
const email = localStorage.getItem("email") || "unknown";

function save() {
  localStorage.setItem("presensiData", JSON.stringify(data));
}

function renderUser() {
  table.innerHTML = "";
  data
    .filter(d => d.email === email)
    .forEach(d => {
      table.innerHTML += `
        <tr class="border-t">
          <td class="p-2">${d.email}</td>
          <td class="p-2">${d.waktu}</td>
          <td class="p-2">${d.status}</td>
        </tr>`;
    });
}

function now() {
  return new Date().toLocaleString("id-ID");
}

masuk?.addEventListener("click", () => {
  data.push({
    email,
    waktu: now(),
    status: "Masuk"
  });
  save();
  renderUser();
});

pulang?.addEventListener("click", () => {
  data.push({
    email,
    waktu: now(),
    status: "Pulang"
  });
  save();
  renderUser();
});

renderUser();
