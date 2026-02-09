function login() {
  const email = document.getElementById('email').value;

  let role = 'siswa';
  if (email.includes('guru')) role = 'guru';
  if (email.includes('admin')) role = 'admin';

  localStorage.setItem('role', role);
  location.href = 'dashboard.html';
}
