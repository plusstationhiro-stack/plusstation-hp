/**
 * Vercel の Environment Variables から config.js を生成する（anon key を Git に書かない）
 */
import fs from 'node:fs';

const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '').trim();
const key = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '').trim();
const scheme = (process.env.NEXT_PUBLIC_APP_SCHEME || 'plusstation-app').trim() || 'plusstation-app';

if (!url || !key) {
  console.error(
    'Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY (personal Supabase).',
  );
  process.exit(1);
}

const body = `window.__PS_AUTH__ = ${JSON.stringify({ url, key, scheme })};\n`;
fs.writeFileSync(new URL('./config.js', import.meta.url), body, 'utf8');
console.log('Wrote config.js');
