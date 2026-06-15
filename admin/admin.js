/* ===========================================================
   Admin JS — Shared helpers for admin pages
   =========================================================== */

function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const t = document.createElement('div');
  t.className = `toast-notif ${type}`;
  const icons = { success: '✓', error: '✕', warning: '!', info: 'ℹ' };
  t.innerHTML = `<div class="icon">${icons[type] || icons.info}</div><div>${message}</div>`;
  container.appendChild(t);
  setTimeout(() => {
    t.style.opacity = '0';
    t.style.transform = 'translateX(120%)';
    setTimeout(() => t.remove(), 300);
  }, 3500);
}

function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
}

function getInitials(name) {
  return (name || 'U').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

function exportCSV(volunteers, filename = 'volunteers.csv') {
  const headers = ['ID', 'Full Name', 'Email', 'Phone', 'City', 'Status', 'Role', 'Hours', 'Events', 'Joined'];
  const rows = volunteers.map(v => [
    v.id, v.full_name, v.email, v.phone || '', v.city || '',
    v.status, v.role, v.hours_logged || 0, v.events_attended || 0,
    formatDate(v.joined_date)
  ]);
  const csv = [headers, ...rows]
    .map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(','))
    .join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
  showToast('📥 CSV exported successfully', 'success');
}

function exportJSON(volunteers, filename = 'volunteers.json') {
  const blob = new Blob([JSON.stringify(volunteers, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
  showToast('📥 JSON exported', 'success');
}
