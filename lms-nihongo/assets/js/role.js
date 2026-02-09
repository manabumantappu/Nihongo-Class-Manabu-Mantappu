const role = localStorage.getItem('role');

if (!role) {
  location.href = 'index.html';
}

console.log('ROLE:', role);
