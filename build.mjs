import fs from 'node:fs';
import zlib from 'node:zlib';

const release = 'release-20260713-2035.html';
const chunks = Array.from({ length: 6 }, (_, index) =>
  fs.readFileSync(new URL(`./clean-bundle/${index + 1}.txt`, import.meta.url), 'utf8').trim()
).join('');

const files = JSON.parse(zlib.gunzipSync(Buffer.from(chunks, 'base64')).toString('utf8'));
const dist = new URL('./dist/', import.meta.url);
fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

for (const [name, content] of Object.entries(files)) {
  fs.writeFileSync(new URL(name, dist), content, 'utf8');
}

fs.copyFileSync(new URL('index.html', dist), new URL(release, dist));
fs.copyFileSync(new URL('index.html', dist), new URL('404.html', dist));
fs.writeFileSync(
  new URL('version.json', dist),
  JSON.stringify({ version: '5.0.0', release, builtAt: new Date().toISOString() }),
  'utf8'
);

for (const name of ['index.html', 'app.css', 'app.js']) {
  if (!fs.existsSync(new URL(name, dist))) throw new Error(`Missing ${name}`);
}

const joined = `${files['index.html']}\n${files['app.js']}`;
if (/formsubmit|flow4work@gmail|ผู้ดูแล/i.test(joined)) {
  throw new Error('Forbidden transmission code detected');
}

console.log('Built privacy-safe Thailuck 5.0.0');
