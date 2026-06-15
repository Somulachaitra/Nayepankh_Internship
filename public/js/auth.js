/* ===========================================================
   Authentication Layer
   ------------------------------------------------------------
   • Uses Supabase Auth when configured (email/password, magic
     link, OAuth — Google/GitHub)
   • Falls back to localStorage-based demo auth otherwise
   =========================================================== */

const AUTH_CONFIG = {
  // 🔧 CONFIG — set to false once Supabase is configured
  demoMode: false,

  // Where to redirect after login/logout
  redirectAfterLogin: 'volunteer-dashboard.html',
  redirectAfterAdminLogin: '../admin/dashboard.html',
  redirectAfterLogout: '../index.html',

  // Admin emails (in demo mode) — replace with role check on backend
  adminEmails: ['admin@nayepankh.com', 'prashant@nayepankh.com', 'schaitra3894@gmail.com', 'somulavarshith@gmail.com']
};

class AuthService {
  constructor() {
    this.currentUser = null;
    this.isAdmin = false;
    this._loadSession();
    this.isSynced = false;
    this.syncSupabaseSession();
  }

  /* ---------- Session persistence ---------- */
  _loadSession() {
    try {
      const stored = localStorage.getItem('np_session');
      if (stored) {
        const session = JSON.parse(stored);
        if (session.expiresAt > Date.now()) {
          this.currentUser = session.user;
          this.isAdmin = AUTH_CONFIG.adminEmails.includes(session.user.email);
        } else {
          localStorage.removeItem('np_session');
        }
      }
    } catch { /* no-op */ }
  }

  _saveSession(user) {
    const session = {
      user,
      expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
    };
    localStorage.setItem('np_session', JSON.stringify(session));
    this.currentUser = user;
    this.isAdmin = AUTH_CONFIG.adminEmails.includes(user.email);
  }

  _clearSession() {
    localStorage.removeItem('np_session');
    this.currentUser = null;
    this.isAdmin = false;
  }

  syncSupabaseSession() {
    if (this.isSynced || !window.NPDB || !window.NPDB.client) return;
    this.isSynced = true;

    // Check if a session already exists on load
    window.NPDB.client.auth.getSession().then(({ data: { session } }) => {
      if (session && session.user) {
        this._saveSession(session.user);
      }
    });

    // Listen to authentication changes (login, logout, token refresh, etc.)
    window.NPDB.client.auth.onAuthStateChange((event, session) => {
      if (session && session.user) {
        this._saveSession(session.user);
        
        // If we are on login page, redirect to dashboard
        const path = window.location.pathname;
        if (path.includes('volunteer-login.html')) {
          const redirectTarget = this.isAdmin ? AUTH_CONFIG.redirectAfterAdminLogin : AUTH_CONFIG.redirectAfterLogin;
          window.location.href = redirectTarget;
        }
      } else if (event === 'SIGNED_OUT') {
        this._clearSession();
      }
    });
  }

  /* ---------- Sign Up (email + password) ---------- */
  async signUp(profileData) {
    const { email, password, full_name } = profileData;
    const fullName = full_name || profileData.fullName;
    if (!AUTH_CONFIG.demoMode && window.NPDB.isLive) {
      const { data, error } = await window.NPDB.client.auth.signUp({
        email, password,
        options: { data: { full_name: fullName } }
      });
      if (error) throw error;

      // Create volunteer record with all provided profile data
      const { password: _, ...volunteerData } = profileData;
      await window.NPDB.createVolunteer({
        ...volunteerData,
        user_id: data.user.id,
        full_name: fullName,
        status: 'pending'
      });

      return { user: data.user, needsEmailConfirmation: !data.session };
    }

    // Demo mode
    if (!email || !password || password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }
    const user = {
      id: 'u-' + Date.now(),
      email,
      user_metadata: { full_name: fullName },
      created_at: new Date().toISOString()
    };
    this._saveSession(user);
    return { user, needsEmailConfirmation: false };
  }

  /* ---------- Sign In (email + password) ---------- */
  async signIn({ email, password }) {
    if (!AUTH_CONFIG.demoMode && window.NPDB.isLive) {
      const { data, error } = await window.NPDB.client.auth.signInWithPassword({
        email, password
      });
      if (error) throw error;
      this._saveSession(data.user);
      return data.user;
    }

    // Demo mode
    const user = {
      id: 'u-demo',
      email,
      user_metadata: { full_name: email.split('@')[0] },
      created_at: new Date().toISOString()
    };
    this._saveSession(user);
    return user;
  }

  /* ---------- Magic Link (passwordless) ---------- */
  async signInWithMagicLink(email) {
    if (!AUTH_CONFIG.demoMode && window.NPDB.isLive) {
      const { error } = await window.NPDB.client.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: window.location.origin + '/pages/' + AUTH_CONFIG.redirectAfterLogin }
      });
      if (error) throw error;
      return { sent: true };
    }
    // Demo
    return { sent: true, demoNote: 'In demo mode — check your inbox in production.' };
  }

  /* ---------- OAuth — Google ---------- */
  async signInWithGoogle() {
    if (!AUTH_CONFIG.demoMode && window.NPDB.isLive) {
      const { error } = await window.NPDB.client.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin + '/pages/' + AUTH_CONFIG.redirectAfterLogin }
      });
      if (error) throw error;
      return;
    }
    // Demo mode
    const user = {
      id: 'u-google-demo',
      email: 'demo.user@gmail.com',
      user_metadata: { full_name: 'Google Demo User', provider: 'google' },
      created_at: new Date().toISOString()
    };
    this._saveSession(user);
    setTimeout(() => {
      window.location.href = AUTH_CONFIG.redirectAfterLogin;
    }, 800);
  }

  /* ---------- OAuth — GitHub ---------- */
  async signInWithGitHub() {
    if (!AUTH_CONFIG.demoMode && window.NPDB.isLive) {
      const { error } = await window.NPDB.client.auth.signInWithOAuth({
        provider: 'github',
        options: { redirectTo: window.location.origin + '/pages/' + AUTH_CONFIG.redirectAfterLogin }
      });
      if (error) throw error;
      return;
    }
    // Demo
    const user = {
      id: 'u-github-demo',
      email: 'demo.user@github.com',
      user_metadata: { full_name: 'GitHub Demo User', provider: 'github' },
      created_at: new Date().toISOString()
    };
    this._saveSession(user);
    setTimeout(() => {
      window.location.href = AUTH_CONFIG.redirectAfterLogin;
    }, 800);
  }

  /* ---------- Password Reset ---------- */
  async resetPassword(email) {
    if (!AUTH_CONFIG.demoMode && window.NPDB.isLive) {
      const { error } = await window.NPDB.client.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/pages/volunteer-login.html?reset=1'
      });
      if (error) throw error;
      return { sent: true };
    }
    return { sent: true, demoNote: 'Reset link would be emailed in production.' };
  }

  /* ---------- Sign Out ---------- */
  async signOut() {
    if (!AUTH_CONFIG.demoMode && window.NPDB.isLive) {
      await window.NPDB.client.auth.signOut();
    }
    this._clearSession();
    window.location.href = AUTH_CONFIG.redirectAfterLogout;
  }

  /* ---------- Helpers ---------- */
  isLoggedIn() { return !!this.currentUser; }

  requireAuth(redirectTo = 'volunteer-login.html') {
    if (!this.isLoggedIn()) {
      window.location.href = redirectTo;
      return false;
    }
    return true;
  }

  requireAdmin() {
    if (!this.isLoggedIn() || !this.isAdmin) {
      window.location.href = 'admin-login.html';
      return false;
    }
    return true;
  }

  getUser() { return this.currentUser; }
  getDisplayName() {
    return this.currentUser?.user_metadata?.full_name ||
           this.currentUser?.email?.split('@')[0] ||
           'User';
  }
}

window.NPAuth = new AuthService();
