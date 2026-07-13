import fs from 'node:fs';

const file = process.argv[2];
if (!file) throw new Error('Usage: node engagement-flow-patch.mjs <html-file>');

let html = fs.readFileSync(file, 'utf8');
const patchId = 'thailuck-question-flow-v3';
if (html.includes(patchId)) {
  console.log(`Skipped ${patchId}; already applied to ${file}`);
  process.exit(0);
}
if (!html.includes('</head>') || !html.includes('</body>')) {
  throw new Error('Expected a complete HTML document with </head> and </body>');
}

const css = fs.readFileSync(new URL('./engagement-flow.css', import.meta.url), 'utf8');
const runtime = [
  fs.readFileSync(new URL('./engagement-flow-runtime.1.txt', import.meta.url), 'utf8'),
  fs.readFileSync(new URL('./engagement-flow-runtime.2.txt', import.meta.url), 'utf8'),
  fs.readFileSync(new URL('./engagement-flow-runtime.3.txt', import.meta.url), 'utf8')
].join('');
const guard = `<script id="thailuck-first-run-guard-v3">(function(){try{var returning=false;for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i)||'',raw=localStorage.getItem(k)||'';if(!/duang|saju|luck/i.test(k)||raw.charAt(0)!=='{')continue;try{var v=JSON.parse(raw);if(v&&v.profile&&v.profile.birth&&v.done===true){returning=true;break}}catch(_){}}if(!returning&&!localStorage.getItem('tl_flow_v3_complete'))document.documentElement.classList.add('tl-first-run-pending')}catch(_){document.documentElement.classList.add('tl-first-run-pending')}})();</script>`;

html = html.replace('</head>', `${guard}<style id="${patchId}">${css}</style></head>`);
html = html.replace('</body>', `<script id="thailuck-question-flow-runtime-v3">${runtime}</script></body>`);
fs.writeFileSync(file, html, 'utf8');
console.log(`Applied ${patchId} to ${file}`);
