function login() {
  const emailInput = document.getElementById("email");
  const email = emailInput ? emailInput.value : "";

  // default role
  let role = "siswa";

  // simple rule (bisa kamu ganti)
  if (email.includes("admin")) {
    role = "admin";
  }

  // simpan login & role
  localStorage.setItem("login", "true");
  localStorage.setItem("role", role);

  // redirect
  window.location.href = "dashboard.html";
}

function logout() {
  localStorage.removeItem("login");
  localStorage.removeItem("role");
  window.location.href = "index.html";
}
