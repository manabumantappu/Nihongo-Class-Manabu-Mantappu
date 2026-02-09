const masuk = document.getElementById("masuk");
const pulang = document.getElementById("pulang");
const table = document.getElementById("table");

masuk?.addEventListener("click", () => {
  table.innerHTML += `
    <tr class="border-t">
      <td class="p-2">${new Date().toLocaleString()}</td>
      <td class="p-2 text-green-600">Masuk</td>
    </tr>`;
});

pulang?.addEventListener("click", () => {
  table.innerHTML += `
    <tr class="border-t">
      <td class="p-2">${new Date().toLocaleString()}</td>
      <td class="p-2 text-blue-600">Pulang</td>
    </tr>`;
});
