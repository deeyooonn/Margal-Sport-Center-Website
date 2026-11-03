import { test } from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { promisify } from 'node:util';
import { execFile } from 'node:child_process';

test('auth settles on failure and cannot restore a signed-out profile or session', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'margal-auth-'));
  const bundle = await build({
    entryPoints: [fileURLToPath(new URL('./auth-harness.jsx', import.meta.url))],
    bundle: true, write: false, format: 'iife', define: {'process.env.NODE_ENV': '"production"'},
    plugins: [{name:'test-backend', setup(builder) {
      builder.onResolve({filter:/lib\/supabase$/}, () => ({path:'backend',namespace:'test'}));
      builder.onLoad({filter:/.*/,namespace:'test'}, () => ({contents: 'export const supabaseConfigured = true; export const supabase = { auth: { getSession: () => window.backend.getSession(), onAuthStateChange: cb => { window.authCallback = cb; return {data:{subscription:{unsubscribe(){}}}}; }, signOut: async () => {} }, from: () => ({select: () => ({eq: () => ({single: () => window.backend.profile()})})}) };'}));
    }}],
  });
  const file = join(directory, 'test.html');
  await writeFile(file, `<div id="root"></div><pre id="result">pending</pre><script>${bundle.outputFiles[0].text.replaceAll('</script', '<\\/script')}</script>`);
  const {stdout} = await promisify(execFile)(process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--virtual-time-budget=5000', '--dump-dom', `--user-data-dir=${join(directory,'profile')}`, pathToFileURL(file).href], {windowsHide:true,timeout:30000,maxBuffer:2_000_000});
  const match = stdout.match(/<pre id="result">([\s\S]*?)<\/pre>/);
  assert.ok(match, 'Browser must return test results');
  const result = JSON.parse(match[1].replaceAll('&quot;', '"').replaceAll('&amp;', '&').replaceAll('&lt;', '<').replaceAll('&gt;', '>'));
  assert.deepEqual(result.filter(r => !r.passed), []);
});
