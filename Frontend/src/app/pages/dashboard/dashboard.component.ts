template: `
  <div class="dashboard-wrapper">
    <nav class="dashboard-navbar">
      <span class="brand">⚡ BIZLY</span>
      <button class="btn-logout" (click)="auth.logout()">Cerrar sesión</button>
    </nav>
    <div class="dashboard-content">
      <h1 class="dashboard-welcome">Hola, {{ auth.currentUser()?.nombre }} 👋</h1>
      <p class="dashboard-sub">Estás autenticado correctamente.</p>
    </div>
  </div>
`