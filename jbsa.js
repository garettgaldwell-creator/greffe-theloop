// ===== JBSA AUTH & STATE SYSTEM =====

const JBSA = (() => {

  // ===== LOGO (inline SVG base64 placeholder) =====
  const LOGO_PATH = 'seal.webp';

  // ===== DEFAULT DATA =====
  const defaultUsers = [
    {
      id: 1, username: 'admin', password: 'Admin@1926', grade: 'admin',
      name: 'Administrateur Système', email: 'admin@jbsa.gov', department: 'Administration',
      active: true, created: '2024-01-01', avatar: '⚙️'
    },
    {
      id: 2, username: 'chief.justice', password: 'Judge@1926', grade: 'judge',
      name: 'Hon. Robert Marshall', email: 'r.marshall@jbsa.gov', department: 'Cour Suprême',
      title: 'Juge en Chef', active: true, created: '2024-01-15', avatar: '⚖️'
    },
    {
      id: 3, username: 'da.johnson', password: 'Prose@1926', grade: 'prosecutor',
      name: 'Thomas Johnson', email: 't.johnson@jbsa.gov', department: 'Bureau du Procureur',
      title: 'Procureur en Chef', active: true, created: '2024-02-01', avatar: '📋'
    },
    {
      id: 4, username: 'me.garcia', password: 'Avoc@1926', grade: 'lawyer',
      name: 'Me. Sofia Garcia', email: 's.garcia@jbsa.gov', department: 'Barreau de San Andreas',
      title: 'Avocate de la Défense', active: true, created: '2024-03-10', avatar: '🏛️'
    }
  ];

  const defaultAnnouncements = [
    {
      id: 1, title: 'Réorganisation des audiences du mois d\'avril',
      content: 'Suite aux décisions administratives, les audiences prévues du 15 au 22 avril sont reportées. Un nouveau calendrier sera communiqué prochainement.',
      author: 'Hon. Robert Marshall', grade: 'judge', date: '2025-04-10',
      visibility: 'all', pinned: true
    },
    {
      id: 2, title: 'Nouveau protocole de dépôt des actes d\'accusation',
      content: 'À compter du 1er mai, tous les actes d\'accusation devront être déposés via la plateforme intranet. Les dépôts papier ne seront plus acceptés.',
      author: 'Thomas Johnson', grade: 'prosecutor', date: '2025-04-08',
      visibility: 'all', pinned: false
    },
    {
      id: 3, title: 'Mise à jour du règlement intérieur du Barreau',
      content: 'Le règlement intérieur a été mis à jour. Tous les membres sont priés d\'en prendre connaissance avant le 30 avril.',
      author: 'Administrateur Système', grade: 'admin', date: '2025-04-05',
      visibility: 'all', pinned: false
    }
  ];

  const defaultCases = [
    {
      id: 'SA-2025-0142', title: 'État vs. Marcus Webb',
      type: 'Criminel', status: 'open', priority: 'high',
      judge: 'Hon. Robert Marshall', prosecutor: 'Thomas Johnson',
      lawyer: 'Me. Sofia Garcia', created: '2025-03-15',
      nextHearing: '2025-04-28', description: 'Accusation de meurtre au premier degré.'
    },
    {
      id: 'SA-2025-0118', title: 'État vs. Diana Torres',
      type: 'Correctionnel', status: 'pending', priority: 'medium',
      judge: 'Hon. Robert Marshall', prosecutor: 'Thomas Johnson',
      lawyer: null, created: '2025-03-01',
      nextHearing: '2025-05-05', description: 'Trafic de stupéfiants, classe B.'
    },
    {
      id: 'SA-2025-0099', title: 'Société Vespucci vs. Liberty Corp.',
      type: 'Civil', status: 'open', priority: 'low',
      judge: 'Hon. Robert Marshall', prosecutor: null,
      lawyer: 'Me. Sofia Garcia', created: '2025-02-20',
      nextHearing: '2025-05-12', description: 'Litige commercial, violation de contrat.'
    },
    {
      id: 'SA-2025-0075', title: 'État vs. Kevin Park',
      type: 'Criminel', status: 'closed', priority: 'medium',
      judge: 'Hon. Robert Marshall', prosecutor: 'Thomas Johnson',
      lawyer: 'Me. Sofia Garcia', created: '2025-01-10',
      nextHearing: null, description: 'Condamné — 5 ans ferme.'
    }
  ];

  const defaultHearings = [
    { id: 1, caseId: 'SA-2025-0142', date: '2025-04-28', time: '09:00', room: 'Salle A', type: 'Audience de fond' },
    { id: 2, caseId: 'SA-2025-0118', date: '2025-05-05', time: '14:00', room: 'Salle B', type: 'Première comparution' },
    { id: 3, caseId: 'SA-2025-0099', date: '2025-05-12', time: '10:30', room: 'Salle C', type: 'Audience de conciliation' }
  ];

  // ===== STORAGE HELPERS =====
  const store = {
    get: (key) => {
      try { return JSON.parse(localStorage.getItem('jbsa_' + key)); } catch { return null; }
    },
    set: (key, val) => {
      localStorage.setItem('jbsa_' + key, JSON.stringify(val));
    }
  };

  // ===== INIT =====
  function init() {
    if (!store.get('users')) store.set('users', defaultUsers);
    if (!store.get('announcements')) store.set('announcements', defaultAnnouncements);
    if (!store.get('cases')) store.set('cases', defaultCases);
    if (!store.get('hearings')) store.set('hearings', defaultHearings);
    if (!store.get('siteSettings')) store.set('siteSettings', {
      siteName: 'Judicial Branch of San Andreas',
      founded: 1926,
      heroText: 'Justice, Équité et Droit dans l\'État de San Andreas',
      courtInfo: 'La Cour Suprême de San Andreas est la plus haute juridiction de l\'État. Elle statue en dernier ressort sur les affaires les plus importantes.',
      prosecutorInfo: 'Le Bureau du Procureur représente l\'État dans les poursuites pénales. Il est chargé d\'enquêter et de poursuivre les infractions à la loi.',
      barInfo: 'Le Barreau de San Andreas régule la profession d\'avocat et garantit la qualité des services juridiques dans tout l\'État.'
    });
  }

  // ===== AUTH =====
  function login(username, password) {
    const users = store.get('users') || [];
    const user = users.find(u => u.username === username && u.password === password && u.active);
    if (user) {
      const session = { userId: user.id, grade: user.grade, name: user.name, expires: Date.now() + 8 * 3600000 };
      sessionStorage.setItem('jbsa_session', JSON.stringify(session));
      return { success: true, user, grade: user.grade };
    }
    return { success: false, error: 'Identifiant ou mot de passe incorrect.' };
  }

  function logout() {
    sessionStorage.removeItem('jbsa_session');
    window.location.href = getBasePath() + 'login.html';
  }

  function getSession() {
    try {
      const s = JSON.parse(sessionStorage.getItem('jbsa_session'));
      if (s && s.expires > Date.now()) return s;
      sessionStorage.removeItem('jbsa_session');
      return null;
    } catch { return null; }
  }

  function requireAuth(allowedGrades = null) {
    const session = getSession();
    if (!session) { window.location.href = getBasePath() + 'login.html'; return null; }
    if (allowedGrades && !allowedGrades.includes(session.grade)) {
      window.location.href = getBasePath() + 'pages/intranet.html';
      return null;
    }
    return session;
  }

  function getCurrentUser() {
    const session = getSession();
    if (!session) return null;
    const users = store.get('users') || [];
    return users.find(u => u.id === session.userId) || null;
  }

  function getBasePath() {
    // Detect if we're in /pages/ subdirectory
    return window.location.pathname.includes('/pages/') ? '../' : '';
  }

  // ===== GRADE CONFIG =====
  const grades = {
    admin: { label: 'Administrateur', icon: '⚙️', color: 'gold', badgeClass: 'badge-admin' },
    judge: { label: 'Juge', icon: '⚖️', color: 'red', badgeClass: 'badge-judge' },
    prosecutor: { label: 'Procureur', icon: '📋', color: 'blue', badgeClass: 'badge-prosecutor' },
    lawyer: { label: 'Avocat', icon: '🏛️', color: 'green', badgeClass: 'badge-lawyer' }
  };

  function getGradeConfig(grade) { return grades[grade] || grades.lawyer; }

  // ===== HELPERS =====
  function formatDate(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  }

  function getStatusLabel(status) {
    const map = { open: 'En cours', pending: 'En attente', closed: 'Clôturé', urgent: 'Urgent' };
    return map[status] || status;
  }

  function getPriorityLabel(priority) {
    const map = { high: 'Haute', medium: 'Moyenne', low: 'Basse' };
    return map[priority] || priority;
  }

  function getStatusClass(status) {
    const map = { open: 'status-open', pending: 'status-pending', closed: 'status-closed', urgent: 'status-urgent' };
    return map[status] || '';
  }

  function showAlert(message, type = 'info', containerId = 'alert-container') {
    const icons = { error: '⚠', success: '✓', info: 'ℹ' };
    const el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = `<div class="alert alert-${type}"><span>${icons[type]}</span> ${message}</div>`;
    setTimeout(() => { el.innerHTML = ''; }, 5000);
  }

  function generateId() {
    return 'SA-2025-' + String(Math.floor(Math.random() * 9000) + 1000);
  }

  // ===== SIDEBAR BUILDER =====
  function buildSidebar(grade, activePage) {
    const session = getSession();
    if (!session) return '';

    const g = getGradeConfig(grade);
    const user = getCurrentUser();

    const commonLinks = [
      { page: 'intranet', icon: '🏠', label: 'Tableau de bord', href: 'intranet.html' },
      { page: 'cases', icon: '📂', label: 'Dossiers', href: 'cases.html' },
      { page: 'calendar', icon: '📅', label: 'Audiences', href: 'calendar.html' },
      { page: 'announcements', icon: '📢', label: 'Annonces', href: 'announcements.html' },
      { page: 'documents', icon: '📄', label: 'Documents', href: 'documents.html' },
    ];

    const adminLinks = grade === 'admin' ? [
      { page: 'admin', icon: '⚙️', label: 'Administration', href: 'admin.html' },
      { page: 'admin-users', icon: '👥', label: 'Gestion Utilisateurs', href: 'admin-users.html' },
      { page: 'admin-settings', icon: '🔧', label: 'Paramètres Site', href: 'admin-settings.html' },
    ] : [];

    const allLinks = [...commonLinks, ...(adminLinks.length ? [{ section: 'Administration' }, ...adminLinks] : [])];

    const linksHtml = allLinks.map(link => {
      if (link.section) return `<div class="sidebar-section-label">${link.section}</div>`;
      return `<a href="${link.href}" class="sidebar-link ${activePage === link.page ? 'active' : ''}">
        <span class="icon">${link.icon}</span> ${link.label}
      </a>`;
    }).join('');

    return `
    <aside class="sidebar">
      <div class="sidebar-header">
        <a href="intranet.html" class="sidebar-logo">
          <img src="../assets/seal.webp" alt="JBSA">
          <span>JBSA<br><small style="font-family:var(--font-ui);font-size:0.55rem;letter-spacing:0.1em;color:var(--cream-dark);font-weight:300;">Intranet</small></span>
        </a>
        <div class="sidebar-user">
          <div class="sidebar-user-name">${user ? user.name : session.name}</div>
          <span class="badge ${g.badgeClass}">${g.icon} ${g.label}</span>
        </div>
      </div>
      <nav class="sidebar-nav">
        <div class="sidebar-section-label">Navigation</div>
        ${linksHtml}
      </nav>
      <div style="padding:1.5rem;margin-top:auto;border-top:var(--border-gold);margin-top:2rem;">
        <a href="../index.html" class="sidebar-link" style="margin-bottom:0.5rem;">
          <span class="icon">🌐</span> Site Public
        </a>
        <button onclick="JBSA.logout()" class="btn btn-ghost btn-sm w-full" style="justify-content:center;">
          Déconnexion
        </button>
      </div>
    </aside>`;
  }

  return {
    init, login, logout, getSession, requireAuth, getCurrentUser,
    getGradeConfig, formatDate, getStatusLabel, getPriorityLabel, getStatusClass,
    showAlert, generateId, buildSidebar, store, LOGO_PATH
  };
})();

// Auto-init
document.addEventListener('DOMContentLoaded', () => JBSA.init());
