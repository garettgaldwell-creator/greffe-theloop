const JBSA = (() => {

  // ===== CREDENTIAL STORE (obfuscated, never shown in UI) =====
  // Credentials are stored as encoded pairs; not displayed anywhere
  const _creds = [
    ['\x61\x64\x6d\x69\x6e', '\x4a\x42\x53\x41\x23\x53\x79\x73\x74\x65\x6d\x40\x32\x30\x32\x35', 'admin'],
    ['\x72\x2e\x6d\x61\x72\x73\x68\x61\x6c\x6c', '\x43\x6f\x75\x72\x74\x23\x52\x4d\x40\x31\x39\x32\x36', 'judge'],
    ['\x64\x61\x2e\x6a\x6f\x68\x6e\x73\x6f\x6e', '\x44\x41\x23\x4f\x66\x66\x69\x63\x65\x40\x53\x41', 'prosecutor'],
    ['\x61\x74\x74\x79\x2e\x67\x61\x72\x63\x69\x61', '\x42\x61\x72\x23\x41\x73\x73\x6f\x63\x40\x32\x30\x32\x35', 'lawyer']
  ];

  // ===== DEFAULT USER PROFILES =====
  const defaultUsers = [
    {
      id: 1, username: 'admin', grade: 'admin',
      name: 'System Administrator', email: 'admin@jbsa.gov',
      department: 'Administration', title: 'System Administrator',
      active: true, created: '2024-01-01', avatar: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width:1em;height:1em;vertical-align:-0.15em"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>'
    },
    {
      id: 2, username: 'r.marshall', grade: 'judge',
      name: 'Hon. Robert Marshall', email: 'r.marshall@jbsa.gov',
      department: 'Supreme Court', title: 'Chief Justice',
      active: true, created: '2024-01-15', avatar: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width:1em;height:1em;vertical-align:-0.15em"><path d="M12 3v18M3 9l9-6 9 6M5 9l-2 6h4L5 9zM19 9l-2 6h4L19 9zM3 21h18"/></svg>'
    },
    {
      id: 3, username: 'da.johnson', grade: 'prosecutor',
      name: 'Thomas Johnson', email: 't.johnson@jbsa.gov',
      department: "District Attorney's Office", title: 'District Attorney',
      active: true, created: '2024-02-01', avatar: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width:1em;height:1em;vertical-align:-0.15em"><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/></svg>'
    },
    {
      id: 4, username: 'atty.garcia', grade: 'lawyer',
      name: 'Sofia Garcia, Esq.', email: 's.garcia@jbsa.gov',
      department: 'State Bar of San Andreas', title: 'Defense Counsel',
      active: true, created: '2024-03-10', avatar: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width:1em;height:1em;vertical-align:-0.15em"><line x1="3" y1="21" x2="21" y2="21"/><line x1="3" y1="10" x2="21" y2="10"/><polyline points="5,10 5,21"/><polyline points="19,10 19,21"/><polyline points="9,10 9,21"/><polyline points="15,10 15,21"/><polygon points="12,2 22,10 2,10"/></svg>'
    }
  ];

  const defaultAnnouncements = [
    {
      id: 1, title: 'April Hearing Schedule — Revised Docket',
      content: 'Due to administrative scheduling conflicts, hearings originally set for April 15–22 have been rescheduled. An updated court calendar will be distributed shortly.',
      author: 'Hon. Robert Marshall', grade: 'judge', date: '2025-04-10',
      visibility: 'all', pinned: true
    },
    {
      id: 2, title: 'New Protocol: Electronic Filing of Indictments',
      content: 'Effective May 1st, all indictments and charging documents must be submitted through the intranet filing system. Paper filings will no longer be accepted by the Clerk of Court.',
      author: 'Thomas Johnson', grade: 'prosecutor', date: '2025-04-08',
      visibility: 'all', pinned: false
    },
    {
      id: 3, title: 'State Bar — Updated Rules of Professional Conduct',
      content: 'The State Bar of San Andreas has issued updated Rules of Professional Conduct. All licensed attorneys are required to review the amended provisions before April 30.',
      author: 'System Administrator', grade: 'admin', date: '2025-04-05',
      visibility: 'all', pinned: false
    }
  ];

  const defaultCases = [
    {
      id: 'SA-2025-0142', title: 'People v. Marcus Webb',
      type: 'Criminal', status: 'open', priority: 'high',
      judge: 'Hon. Robert Marshall', prosecutor: 'Thomas Johnson',
      lawyer: 'Sofia Garcia, Esq.', created: '2025-03-15',
      nextHearing: '2025-04-28', description: 'First-degree murder. Defendant remanded without bail.'
    },
    {
      id: 'SA-2025-0118', title: 'People v. Diana Torres',
      type: 'Criminal', status: 'pending', priority: 'medium',
      judge: 'Hon. Robert Marshall', prosecutor: 'Thomas Johnson',
      lawyer: null, created: '2025-03-01',
      nextHearing: '2025-05-05', description: 'Class B narcotics trafficking. Awaiting counsel assignment.'
    },
    {
      id: 'SA-2025-0099', title: 'Vespucci Corp. v. Liberty Holdings LLC',
      type: 'Civil', status: 'open', priority: 'low',
      judge: 'Hon. Robert Marshall', prosecutor: null,
      lawyer: 'Sofia Garcia, Esq.', created: '2025-02-20',
      nextHearing: '2025-05-12', description: 'Commercial dispute, breach of contract claim.'
    },
    {
      id: 'SA-2025-0075', title: 'People v. Kevin Park',
      type: 'Criminal', status: 'closed', priority: 'medium',
      judge: 'Hon. Robert Marshall', prosecutor: 'Thomas Johnson',
      lawyer: 'Sofia Garcia, Esq.', created: '2025-01-10',
      nextHearing: null, description: 'Sentenced — 5 years, Department of Corrections.'
    }
  ];

  const defaultHearings = [
    { id: 1, caseId: 'SA-2025-0142', date: '2025-04-28', time: '09:00', room: 'Courtroom A', type: 'Trial — Evidentiary Hearing' },
    { id: 2, caseId: 'SA-2025-0118', date: '2025-05-05', time: '14:00', room: 'Courtroom B', type: 'Arraignment' },
    { id: 3, caseId: 'SA-2025-0099', date: '2025-05-12', time: '10:30', room: 'Courtroom C', type: 'Mediation Conference' }
  ];

  // ===== STORAGE =====
  const store = {
    get: (key) => { try { return JSON.parse(localStorage.getItem('jbsa_' + key)); } catch { return null; } },
    set: (key, val) => { localStorage.setItem('jbsa_' + key, JSON.stringify(val)); }
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
      heroText: 'Justice, Equity & the Rule of Law in the State of San Andreas',
      courtInfo: 'The Supreme Court of San Andreas is the highest court in the State, exercising final appellate jurisdiction and ensuring uniformity in the interpretation of State law.',
      prosecutorInfo: "The District Attorney's Office represents the People of San Andreas in criminal prosecutions. It investigates offenses and brings charges against violators of State law.",
      barInfo: "The State Bar of San Andreas regulates the legal profession and ensures that all licensed attorneys meet the highest standards of competence and ethical conduct."
    });
  }

  // ===== AUTH =====
  function login(username, password, requiredGrade) {
    // Validate against encoded credential store
    const match = _creds.find(c => c[0] === username && c[1] === password);
    if (!match) return { success: false, error: 'Invalid credentials. Please try again.' };

    const grade = match[2];

    // If a role was selected, enforce it
    if (requiredGrade && grade !== requiredGrade && grade !== 'admin') {
      return { success: false, error: 'Your account does not have access to the selected section.' };
    }

    const users = store.get('users') || [];
    const userProfile = users.find(u => u.username === username && u.active !== false);
    if (!userProfile) return { success: false, error: 'Account is inactive. Contact your administrator.' };

    const session = {
      userId: userProfile.id,
      grade: userProfile.grade,
      name: userProfile.name,
      expires: Date.now() + 8 * 3600000
    };
    sessionStorage.setItem('jbsa_session', JSON.stringify(session));
    return { success: true, grade };
  }

  function logout() {
    sessionStorage.removeItem('jbsa_session');
    const base = window.location.pathname.includes('/pages/') ? '../' : '';
    window.location.href = base + 'login.html';
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
    const base = window.location.pathname.includes('/pages/') ? '../' : '';
    if (!session) { window.location.href = base + 'login.html'; return null; }
    if (allowedGrades && !allowedGrades.includes(session.grade)) {
      window.location.href = base + 'intranet.html';
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

  function getUsers() { return store.get('users') || defaultUsers; }
  function getSiteSettings() { return store.get('siteSettings') || {}; }

  // ===== GRADE CONFIG (US terminology) =====
  const grades = {
    admin:      { label: 'Administrator',   icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width:1em;height:1em;vertical-align:-0.15em"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>', color: 'gold', badgeClass: 'badge-admin' },
    judge:      { label: 'Judge',           icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width:1em;height:1em;vertical-align:-0.15em"><path d="M12 3v18M3 9l9-6 9 6M5 9l-2 6h4L5 9zM19 9l-2 6h4L19 9zM3 21h18"/></svg>', color: 'red',  badgeClass: 'badge-judge' },
    prosecutor: { label: 'District Attorney', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width:1em;height:1em;vertical-align:-0.15em"><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/></svg>', color: 'blue', badgeClass: 'badge-prosecutor' },
    lawyer:     { label: 'Attorney',        icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width:1em;height:1em;vertical-align:-0.15em"><line x1="3" y1="21" x2="21" y2="21"/><line x1="3" y1="10" x2="21" y2="10"/><polyline points="5,10 5,21"/><polyline points="19,10 19,21"/><polyline points="9,10 9,21"/><polyline points="15,10 15,21"/><polygon points="12,2 22,10 2,10"/></svg>', color: 'green', badgeClass: 'badge-lawyer' }
  };

  function getGradeConfig(grade) { return grades[grade] || grades.lawyer; }

  // ===== HELPERS =====
  function formatDate(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' });
  }

  function getStatusLabel(status) {
    const map = { open: 'Active', pending: 'Pending', closed: 'Closed', urgent: 'Urgent' };
    return map[status] || status;
  }

  function getPriorityLabel(priority) {
    const map = { high: 'High', medium: 'Medium', low: 'Low' };
    return map[priority] || priority;
  }

  function getStatusClass(status) {
    const map = { open: 'status-open', pending: 'status-pending', closed: 'status-closed', urgent: 'status-urgent' };
    return map[status] || '';
  }

  function showAlert(message, type = 'info', containerId = 'alert-container') {
    const icons = { error: '!', success: '✓', info: 'i' };
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
      { page: 'divisions',      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width:1em;height:1em;vertical-align:-0.15em"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>', label: 'Divisions',          href: 'divisions.html' },
      { page: 'intranet',       icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width:1em;height:1em;vertical-align:-0.15em"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>', label: 'Dashboard',         href: 'intranet.html' },
      { page: 'cases',          icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width:1em;height:1em;vertical-align:-0.15em"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>', label: 'Case Files',         href: 'cases.html' },
      { page: 'calendar',       icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width:1em;height:1em;vertical-align:-0.15em"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>', label: 'Court Calendar',     href: 'calendar.html' },
      { page: 'announcements',  icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width:1em;height:1em;vertical-align:-0.15em"><polygon points="11,5 6,9 2,9 2,15 6,15 11,19 11,5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>', label: 'Announcements',      href: 'announcements.html' },
      { page: 'documents',      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width:1em;height:1em;vertical-align:-0.15em"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="13" y2="17"/></svg>', label: 'Documents',          href: 'documents.html' },
      { page: 'legal',          icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width:1em;height:1em;vertical-align:-0.15em"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="13" y2="17"/><polyline points="9,9 9,9"/></svg>', label: 'Legal Texts',         href: 'legal.html' },
    ];

    const adminLinks = grade === 'admin' ? [
      { page: 'admin',          icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width:1em;height:1em;vertical-align:-0.15em"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>', label: 'Administration',     href: 'admin.html' },
      { page: 'admin-users',    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width:1em;height:1em;vertical-align:-0.15em"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>', label: 'User Management',    href: 'admin-users.html' },
      { page: 'admin-settings', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width:1em;height:1em;vertical-align:-0.15em"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>', label: 'Site Settings',      href: 'admin-settings.html' },
    ] : [];

    const allLinks = [...commonLinks, ...(adminLinks.length ? [{ section: 'Administration' }, ...adminLinks] : [])];

    const linksHtml = allLinks.map(link => {
      if (link.section) return `<div class="sidebar-section-label">${link.section}</div>`;
      return `<a href="${link.href}" class="sidebar-link ${activePage === link.page ? 'active' : ''}">
        <span class="icon">${link.icon}</span> ${link.label}
      </a>`;
    }).join('');

    const LOGO_PATH = 'seal.webp';

    return `
    <aside class="sidebar">
      <div class="sidebar-header">
        <a href="intranet.html" class="sidebar-logo">
          <img src="${LOGO_PATH}" alt="JBSA" onerror="this.style.opacity=0">
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
      <div style="padding:1.5rem;border-top:var(--border-gold);margin-top:2rem;">
        <a href="index.html" class="sidebar-link" style="margin-bottom:0.5rem;">
          <span class="icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width:1em;height:1em;vertical-align:-0.15em"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg></span> Public Site
        </a>
        <button onclick="JBSA.logout()" class="btn btn-ghost btn-sm w-full" style="justify-content:center;">
          Sign Out
        </button>
      </div>
    </aside>`;
  }

  return {
    init, login, logout, getSession, requireAuth, getCurrentUser, getUsers, getSiteSettings,
    getGradeConfig, formatDate, getStatusLabel, getPriorityLabel, getStatusClass,
    showAlert, generateId, buildSidebar, store
  };
})();

document.addEventListener('DOMContentLoaded', () => JBSA.init());


