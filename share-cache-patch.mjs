import fs from 'node:fs';
import path from 'node:path';

const file = process.argv[2];
if (!file) throw new Error('Usage: node share-cache-patch.mjs <html-file>');
let html = fs.readFileSync(file, 'utf8');

const start = html.indexOf('function shareText()');
const end = html.indexOf('setupInputs();', start);
if (start < 0 || end < 0) throw new Error('Share function block not found');

const shareCode = `function canonicalShareUrl(){return 'https://thailuck-rho.vercel.app/release-20260713-0750'}function shareText(){return\`ดวงวันนี้ของฉัน \${fortune.score}/100 ✦\\n\${fortune.headline}\\n\${canonicalShareUrl()}\`}async function copyShare(){const text=shareText();try{await navigator.clipboard.writeText(text)}catch{const t=document.createElement('textarea');t.value=text;t.style.position='fixed';t.style.opacity='0';document.body.appendChild(t);t.select();document.execCommand('copy');t.remove()}toast('คัดลอกข้อความแล้ว')}async function nativeTextShare(preferred){try{if(navigator.share){await navigator.share({title:'ดวงวันดี',text:shareText(),url:canonicalShareUrl()});toast(preferred==='LINE'?'เลือก LINE จากเมนูแชร์ได้เลย':'เลือกแอปที่ต้องการแชร์');return true}}catch(e){if(e?.name==='AbortError')return true}return false}async function lineShare(){if(await nativeTextShare('LINE'))return;location.href=\`https://social-plugins.line.me/lineit/share?url=\${encodeURIComponent(canonicalShareUrl())}\`}async function systemShare(){if(await nativeTextShare('OTHER'))return;await copyShare()}function drawShareCard(){const c=document.getElementById('canvas'),x=c.getContext('2d'),g=x.createLinearGradient(0,0,1080,1350);g.addColorStop(0,'#263e78');g.addColorStop(.5,'#7450ca');g.addColorStop(1,'#d95b72');x.fillStyle=g;x.fillRect(0,0,1080,1350);x.textAlign='center';x.fillStyle='#fff';x.font='700 58px sans-serif';x.fillText('ดวงวันดี ✦',540,180);x.font='700 180px sans-serif';x.fillText(fortune.score,540,530);x.font='700 50px sans-serif';x.fillText('จังหวะวันนี้ / 100',540,610);x.font='600 38px sans-serif';x.fillText(fortune.headline.slice(0,28),540,780);x.font='400 28px sans-serif';x.fillStyle='rgba(255,255,255,.82)';x.fillText('thailuck-rho.vercel.app',540,1180);return c.toDataURL('image/png')}function dataUrlFile(dataUrl){const [head,data]=dataUrl.split(',');const mime=head.match(/data:(.*?);/)?.[1]||'image/png';const raw=atob(data),bytes=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);return new File([bytes],'duang-wandee.png',{type:mime})}function downloadCard(dataUrl){const a=document.createElement('a');a.href=dataUrl;a.download='duang-wandee.png';document.body.appendChild(a);a.click();a.remove()}async function instaShare(){const dataUrl=drawShareCard(),file=dataUrlFile(dataUrl);try{if(navigator.share&&(!navigator.canShare||navigator.canShare({files:[file]}))){await navigator.share({files:[file],title:'ดวงวันดี'});toast('เลือก Instagram หรือ Direct จากเมนูแชร์ได้เลย');return}}catch(e){if(e?.name==='AbortError')return}downloadCard(dataUrl);await copyShare();toast('บันทึกการ์ดและคัดลอก Vercel 링크แล้ว กรุณาแนบใน Instagram')}
`;

html = html.slice(0, start) + shareCode + html.slice(end);
html = html
  .replace('<button class="line" id="lineBtn">', '<button type="button" class="line" id="lineBtn">')
  .replace('<button class="insta" id="instaBtn">', '<button type="button" class="insta" id="instaBtn">')
  .replace('<button class="other" id="shareBtn">', '<button type="button" class="other" id="shareBtn">');

const buildId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;
const distDir = path.dirname(file);
fs.writeFileSync(path.join(distDir, 'version.json'), JSON.stringify({ build: buildId }), 'utf8');

const cacheGuard = `<meta http-equiv="Cache-Control" content="no-store, no-cache, must-revalidate, max-age=0"><meta http-equiv="Pragma" content="no-cache"><meta http-equiv="Expires" content="0"><meta name="thailuck-build" content="${buildId}"><script>(()=>{try{if('serviceWorker'in navigator)navigator.serviceWorker.getRegistrations().then(rs=>Promise.all(rs.map(r=>r.unregister()))).catch(()=>{});if('caches'in window)caches.keys().then(ks=>Promise.all(ks.map(k=>caches.delete(k)))).catch(()=>{})}catch{}})();</script>`;
html = html.replace('</head>', `${cacheGuard}</head>`);

fs.writeFileSync(file, html, 'utf8');
console.log(`Applied Vercel sharing and cache cleanup to ${file}`);
