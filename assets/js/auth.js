function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Email dan password wajib diisi");
    return;
  }

  // default role
  let role = "siswa";

  // rule sederhana (bebas kamu ubah)
  if (email.includes("admin")) {
    role = "admin";
  }

  // simpan status login
  localStorage.setItem("login", "true");
  localStorage.setItem("role", role);
  localStorage.setItem("email", email);

  // redirect
  window.location.href = "dashboard.html";
}

function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}
