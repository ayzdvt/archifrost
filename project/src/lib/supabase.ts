import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase ortam değişkenleri eksik');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: localStorage,
    storageKey: 'supabase-auth-token',
  },
  global: {
    fetch: (...args) => {
      return fetch(...args).catch(err => {
        console.error('Supabase network error:', err);
        throw err;
      });
    }
  }
});

// Test connection and handle auth state changes
const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    console.log('Oturum açıldı:', session?.user?.email);
  } else if (event === 'SIGNED_OUT') {
    console.log('Oturum kapatıldı');
    localStorage.removeItem('supabase-auth-token');
  } else if (event === 'TOKEN_REFRESHED') {
    console.log('Token yenilendi');
  } else if (event === 'USER_UPDATED') {
    console.log('Kullanıcı güncellendi:', session?.user?.email);
  } else if (event === 'INITIAL_SESSION') {
    if (!session) {
      console.log('Oturum bulunamadı');
      localStorage.removeItem('supabase-auth-token');
    }
  }
});

// Initial session check
supabase.auth.getSession().then(({ data: { session }, error }) => {
  if (error) {
    console.error('Oturum kontrolü hatası:', error);
    if (error.message?.includes('refresh_token_not_found')) {
      console.warn('Refresh token bulunamadı, oturum temizleniyor');
      localStorage.removeItem('supabase-auth-token');
      window.location.href = '/login';
    }
    return;
  }

  if (session) {
    console.log('Mevcut oturum:', session.user.email);
  } else {
    localStorage.removeItem('supabase-auth-token');
  }
}).catch(error => {
  console.error('Beklenmeyen oturum hatası:', error);
  localStorage.removeItem('supabase-auth-token');
});

export default supabase;