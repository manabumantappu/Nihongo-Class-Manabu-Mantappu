function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Email dan password wajib diisi");
    return;
  }

  let role = "siswa";
  if (email.includes("admin")) role = "admin";

  localStorage.setItem("login", "true");
  localStorage.setItem("role", role);
  localStorage.setItem("email", email);

  // RELATIF
  location.href = "dashboard.html";
}

function logout() {
  localStorage.clear();
  location.href = "index.html";
}
