import fs from 'node:fs';
const file=process.argv[2];
if(!file) throw new Error('Usage: node service-v4-patch.mjs <html-file>');
let html=fs.readFileSync(file,'utf8');
if(html.includes('thailuck-service-v4')){console.log('service-v4 already applied');process.exit(0)}
if(!html.includes('</head>')||!html.includes('</body>')) throw new Error('Invalid HTML document');
const css=fs.readFileSync(new URL('./service-v4.css',import.meta.url),'utf8');
const js=fs.readFileSync(new URL('./service-v4-runtime.js',import.meta.url),'utf8');
html=html.replace('</head>',`<style id="thailuck-service-v4">${css}</style></head>`);
html=html.replace('</body>',`<script id="thailuck-service-v4-runtime">${js}</script></body>`);
fs.writeFileSync(file,html,'utf8');
console.log(`Applied service-v4 to ${file}`);
