/* ===========================================================
   Supabase Client Configuration
   ===========================================================

   🔧 CONFIG: Replace the placeholder values below with your
   actual Supabase project credentials to enable the live
   database & authentication features.

   How to get these values:
   1. Create a free account at https://supabase.com
   2. Create a new project
   3. Go to Project Settings → API
   4. Copy the "Project URL" → SUPABASE_URL
   5. Copy the "anon public" key → SUPABASE_ANON_KEY
   6. (Optional) Copy "service_role" key → SUPABASE_SERVICE_KEY
      (only for admin/server-side operations)

   While the placeholders are empty, the system will fall back to
   a built-in localStorage demo backend so the UI works end-to-end.
   =========================================================== */

const SUPABASE_CONFIG = {
  // 🔧 CONFIG — paste your Supabase Project URL here
  url: 'https://pksbaysqmojtfomnbtou.supabase.co',

  // 🔧 CONFIG — paste your Supabase anon public key here (safe for client-side)
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrc2JheXNxbW9qdGZvbW5idG91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0MDY3NjMsImV4cCI6MjA5Njk4Mjc2M30.rLYqaSfcQ_fg1ybx3kd9Q4IIs2yKY5uXWTMII2dUwLY',

  // ⚠️ service_role key has been moved to .env (server-side only)
  // NEVER expose it in client-side code

  // Optional OAuth providers — paste your OAuth client IDs if using social login
  oauth: {
    google: {
      // 🔧 CONFIG — your Google OAuth Client ID (set up at https://console.cloud.google.com)
      clientId: '523029171375-ru6td8f6k07858s943dhrtf643eg9emj.apps.googleusercontent.com',
      redirectUri: window.location.origin + '/pages/volunteer-login.html'
    },
    github: {
      clientId: '',
      redirectUri: window.location.origin + '/pages/volunteer-login.html'
    }
  },

  // Toggle demo mode (set false once Supabase is configured)
  demoMode: false
};

/* ===========================================================
   Database Schema (run this in Supabase SQL Editor)
   ===========================================================

   -- Volunteers table
   create table volunteers (
     id uuid primary key default uuid_generate_v4(),
     user_id uuid references auth.users unique,
     full_name text not null,
     email text unique not null,
     phone text,
     age_group text,
     city text,
     country text default 'India',
     bio text,
     avatar_url text,
     skills text[],
     interests text[],
     availability text,
     experience text,
     motivation text,
     status text default 'pending', -- pending | approved | rejected | active | inactive
     role text default 'volunteer', -- volunteer | lead | coordinator | admin
     hours_logged integer default 0,
     events_attended integer default 0,
     joined_date timestamp default now(),
     approved_date timestamp,
     approved_by uuid,
     last_active timestamp,
     metadata jsonb
   );

   -- Activity log
   create table activity_log (
     id uuid primary key default uuid_generate_v4(),
     volunteer_id uuid references volunteers,
     action text not null,
     details jsonb,
     created_at timestamp default now()
   );

   -- Events
   create table events (
     id uuid primary key default uuid_generate_v4(),
     title text not null,
     description text,
     location text,
     city text,
     event_date timestamp,
     capacity integer,
     skills_needed text[],
     status text default 'upcoming', -- upcoming | ongoing | completed | cancelled
     created_by uuid,
     created_at timestamp default now()
   );

   -- Event registrations
   create table event_registrations (
     id uuid primary key default uuid_generate_v4(),
     event_id uuid references events,
     volunteer_id uuid references volunteers,
     status text default 'registered', -- registered | attended | absent
     registered_at timestamp default now()
   );

   -- Row Level Security (RLS) — IMPORTANT for security
   alter table volunteers enable row level security;
   create policy "Users can read own profile" on volunteers
     for select using (auth.uid() = user_id);
   create policy "Users can update own profile" on volunteers
     for update using (auth.uid() = user_id);
   create policy "Admins can read all" on volunteers
     for select using (
       exists (select 1 from volunteers where user_id = auth.uid() and role = 'admin')
     );

   =========================================================== */

/* ===========================================================
   Database Abstraction Layer
   ------------------------------------------------------------
   • When SUPABASE_CONFIG.url + anonKey are filled → uses Supabase
   • Otherwise → uses localStorage as a working demo backend
   =========================================================== */

class VolunteerDB {
  constructor() {
    this.isLive = !!(SUPABASE_CONFIG.url && SUPABASE_CONFIG.anonKey);
    this.client = null;

    if (this.isLive) {
      // Load Supabase JS client from CDN
      if (!window.supabase) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
        script.async = false;
        document.head.appendChild(script);
        script.addEventListener('load', () => this._initSupabase());
      } else {
        this._initSupabase();
      }
    } else {
      console.info(
        '%c🔧 NayePankh DB (Demo Mode)',
        'background:#667eea;color:#fff;padding:4px 8px;border-radius:4px;font-weight:bold;',
        '\nRunning in localStorage demo mode.\n' +
        'To enable real database + auth, edit js/supabase-client.js\n' +
        'and fill in SUPABASE_CONFIG.url + anonKey.'
      );
      this._seedDemoData();
    }
  }

  _initSupabase() {
    if (window.supabase && SUPABASE_CONFIG.url) {
      this.client = window.supabase.createClient(
        SUPABASE_CONFIG.url,
        SUPABASE_CONFIG.anonKey
      );
      console.info('✅ Supabase client initialized');
    }
  }

  /* ---------- Demo data seeding (only in demo mode) ---------- */
  _seedDemoData() {
    if (localStorage.getItem('np_demo_seeded')) return;
    const demoVolunteers = [
      {
        id: 'demo-1', full_name: 'Ananya Sharma', email: 'ananya@example.com',
        phone: '+91 9876543210', age_group: '18-24', city: 'Kanpur',
        skills: ['teaching', 'tech'], interests: ['education', 'design'],
        availability: '5-10 hours/week', status: 'approved', role: 'lead',
        hours_logged: 142, events_attended: 18,
        joined_date: '2024-08-15T10:00:00Z', approved_date: '2024-08-20T10:00:00Z',
        bio: 'Computer Science student passionate about teaching kids to code.'
      },
      {
        id: 'demo-2', full_name: 'Rohit Verma', email: 'rohit@example.com',
        phone: '+91 9876543211', age_group: '25-34', city: 'Ghaziabad',
        skills: ['event', 'fundraising'], interests: ['food', 'clothing'],
        availability: '10+ hours/week', status: 'active', role: 'coordinator',
        hours_logged: 287, events_attended: 32,
        joined_date: '2023-11-02T10:00:00Z', approved_date: '2023-11-05T10:00:00Z',
        bio: 'Operations manager coordinating food drives across UP.'
      },
      {
        id: 'demo-3', full_name: 'Sneha Mishra', email: 'sneha@example.com',
        phone: '+91 9876543212', age_group: '18-24', city: 'Lucknow',
        skills: ['design', 'research'], interests: ['hygiene', 'education'],
        availability: '5-10 hours/week', status: 'approved', role: 'volunteer',
        hours_logged: 89, events_attended: 11,
        joined_date: '2025-01-10T10:00:00Z', approved_date: '2025-01-15T10:00:00Z',
        bio: 'Graphic designer helping with campaign creatives.'
      },
      {
        id: 'demo-4', full_name: 'Aditya Tiwari', email: 'aditya@example.com',
        phone: '+91 9876543213', age_group: '25-34', city: 'Delhi',
        skills: ['tech', 'research'], interests: ['skills', 'education'],
        availability: '10+ hours/week', status: 'pending', role: 'volunteer',
        hours_logged: 0, events_attended: 0,
        joined_date: '2026-05-20T10:00:00Z',
        bio: 'Full-stack developer wanting to contribute to NGO tech.'
      },
      {
        id: 'demo-5', full_name: 'Priya Gupta', email: 'priya@example.com',
        phone: '+91 9876543214', age_group: '18-24', city: 'Kanpur',
        skills: ['teaching', 'design'], interests: ['education'],
        availability: '2-5 hours/week', status: 'active', role: 'volunteer',
        hours_logged: 56, events_attended: 7,
        joined_date: '2024-12-01T10:00:00Z', approved_date: '2024-12-03T10:00:00Z',
        bio: 'English literature student teaching at weekend centers.'
      },
      {
        id: 'demo-6', full_name: 'Arjun Patel', email: 'arjun@example.com',
        phone: '+91 9876543215', age_group: '35-44', city: 'Mumbai',
        skills: ['fundraising', 'event'], interests: ['food'],
        availability: 'Weekends only', status: 'approved', role: 'volunteer',
        hours_logged: 34, events_attended: 5,
        joined_date: '2025-03-15T10:00:00Z', approved_date: '2025-03-18T10:00:00Z',
        bio: 'Corporate professional supporting weekend food drives.'
      },
      {
        id: 'demo-7', full_name: 'Kavya Reddy', email: 'kavya@example.com',
        phone: '+91 9876543216', age_group: '18-24', city: 'Bangalore',
        skills: ['tech', 'design'], interests: ['skills'],
        availability: '5-10 hours/week', status: 'rejected', role: 'volunteer',
        hours_logged: 0, events_attended: 0,
        joined_date: '2025-09-10T10:00:00Z',
        bio: 'Moved to different city — could not continue.'
      },
      {
        id: 'demo-8', full_name: 'Vikram Singh', email: 'vikram@example.com',
        phone: '+91 9876543217', age_group: '25-34', city: 'Kanpur',
        skills: ['teaching', 'event'], interests: ['education', 'food'],
        availability: '10+ hours/week', status: 'active', role: 'lead',
        hours_logged: 198, events_attended: 24,
        joined_date: '2023-06-20T10:00:00Z', approved_date: '2023-06-25T10:00:00Z',
        bio: 'School teacher volunteering on weekends for education programs.'
      }
    ];
    localStorage.setItem('np_volunteers', JSON.stringify(demoVolunteers));
    localStorage.setItem('np_demo_seeded', '1');
  }

  /* ---------- Volunteer CRUD ---------- */
  async createVolunteer(data) {
    if (this.isLive && this.client) {
      const { data: result, error } = await this.client
        .from('volunteers')
        .insert([{ ...data, status: 'pending', joined_date: new Date().toISOString() }])
        .select();
      if (error) throw error;
      return result[0];
    } else {
      // Demo mode — localStorage
      const list = this._getVolunteers();
      const newVol = {
        id: 'v-' + Date.now(),
        ...data,
        status: 'pending',
        role: 'volunteer',
        hours_logged: 0,
        events_attended: 0,
        joined_date: new Date().toISOString()
      };
      list.push(newVol);
      localStorage.setItem('np_volunteers', JSON.stringify(list));
      return newVol;
    }
  }

  async getVolunteers(filters = {}) {
    if (this.isLive && this.client) {
      let query = this.client.from('volunteers').select('*');
      if (filters.status) query = query.eq('status', filters.status);
      if (filters.city) query = query.eq('city', filters.city);
      if (filters.role) query = query.eq('role', filters.role);
      const { data, error } = await query.order('joined_date', { ascending: false });
      if (error) throw error;
      return data;
    } else {
      let list = this._getVolunteers();
      if (filters.status) list = list.filter(v => v.status === filters.status);
      if (filters.city) list = list.filter(v => v.city === filters.city);
      if (filters.role) list = list.filter(v => v.role === filters.role);
      if (filters.search) {
        const q = filters.search.toLowerCase();
        list = list.filter(v =>
          v.full_name.toLowerCase().includes(q) ||
          v.email.toLowerCase().includes(q) ||
          (v.skills || []).some(s => s.toLowerCase().includes(q))
        );
      }
      return list.sort((a, b) => new Date(b.joined_date) - new Date(a.joined_date));
    }
  }

  async getVolunteer(id) {
    if (this.isLive && this.client) {
      const { data, error } = await this.client
        .from('volunteers').select('*').eq('id', id).single();
      if (error) throw error;
      return data;
    } else {
      const list = this._getVolunteers();
      return list.find(v => v.id === id) || null;
    }
  }

  async updateVolunteer(id, updates) {
    if (this.isLive && this.client) {
      const { data, error } = await this.client
        .from('volunteers').update(updates).eq('id', id).select();
      if (error) throw error;
      return data[0];
    } else {
      const list = this._getVolunteers();
      const idx = list.findIndex(v => v.id === id);
      if (idx === -1) throw new Error('Volunteer not found');
      list[idx] = { ...list[idx], ...updates };
      localStorage.setItem('np_volunteers', JSON.stringify(list));
      return list[idx];
    }
  }

  async deleteVolunteer(id) {
    if (this.isLive && this.client) {
      const { error } = await this.client.from('volunteers').delete().eq('id', id);
      if (error) throw error;
      return true;
    } else {
      const list = this._getVolunteers().filter(v => v.id !== id);
      localStorage.setItem('np_volunteers', JSON.stringify(list));
      return true;
    }
  }

  async getStats() {
    const list = await this.getVolunteers();
    const stats = {
      total: list.length,
      pending: list.filter(v => v.status === 'pending').length,
      approved: list.filter(v => v.status === 'approved').length,
      active: list.filter(v => v.status === 'active').length,
      rejected: list.filter(v => v.status === 'rejected').length,
      totalHours: list.reduce((sum, v) => sum + (v.hours_logged || 0), 0),
      totalEvents: list.reduce((sum, v) => sum + (v.events_attended || 0), 0),
      byCity: {},
      bySkill: {},
      byMonth: {}
    };

    list.forEach(v => {
      stats.byCity[v.city] = (stats.byCity[v.city] || 0) + 1;
      (v.skills || []).forEach(s => {
        stats.bySkill[s] = (stats.bySkill[s] || 0) + 1;
      });
      const month = new Date(v.joined_date).toISOString().slice(0, 7);
      stats.byMonth[month] = (stats.byMonth[month] || 0) + 1;
    });

    return stats;
  }

  _getVolunteers() {
    try { return JSON.parse(localStorage.getItem('np_volunteers')) || []; }
    catch { return []; }
  }
}

/* ---------- Singleton ---------- */
window.NPDB = new VolunteerDB();
