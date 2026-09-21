/* ============================================================
   NextTrade — Supabase Configuration
   ============================================================
   Drop this file in the SAME folder as admin.html and app.html.

   Both admin.html and app.html read from window.NT_CONFIG.

   ⚠️ IMPORTANT — READ BEFORE DEPLOYING:
   ─────────────────────────────────────
   1. The URL and anon key below are PUBLIC (they're meant to be
      in client-side code). Security comes from the RLS policies
      you set up in Supabase SQL Editor.

   2. NEVER put your service_role key in this file. That key
      bypasses all security. Keep it only in the Supabase dashboard.

   3. Set ADMIN_EMAIL to the exact email you created in
      Supabase → Authentication → Users. Only that email can
      post signals. Everyone else can only read them.

   4. If you ever rotate your Supabase keys, you only need to
      edit this file — not the giant HTML files.
   ============================================================ */

window.NT_CONFIG = {

  /* Your Supabase project URL. Found at:
     Supabase Dashboard → Settings → API → Project URL */
  SUPABASE_URL: 'https://hbhzwodlyascenitbxq.supabase.co',

  /* Your Supabase anon/public key. Found at:
     Supabase Dashboard → Settings → API → Project API keys → anon public */
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhiaHp3b2RseWFzY2VuaXRieHEiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTc4OTk5MzM1OSwiZXhwIjoyMTA1NTY5MzU5fQ.r5h_dmImuJuHcq6X-tLDRXl-Iw8Yg6P56Y3X8dKX_fA',

  /* ⚠️ CHANGE THIS to your actual admin email.
     It must match EXACTLY what you created in
     Supabase → Authentication → Users.
     Only this email can post copy signals. */
  ADMIN_EMAIL: 'tylerdwayne1912@gmail.com',

  /* Profit percentage applied to every successful copy trade.
     0.006 = 0.6% */
  COPY_PROFIT_PCT: 0.006,

  /* Seconds a copy position stays open before auto-closing
     and crediting the profit. */
  COPY_AUTO_CLOSE_SECONDS: 45,

  /* Demo mode seed balance for new users */
  DEMO_SEED: 10000
};