import fs from 'node:fs';

const file = process.argv[2];
if (!file) throw new Error('Usage: node share-cache-patch.mjs <html-file>');
let html = fs.readFileSync(file, 'utf8');

const start = html.indexOf('function shareText()');
const end = html.indexOf('setupInputs();', start);
if (start < 0 || end < 0) throw new Error('Share function block not found');

const shareCode = `function shareText(){const cleanUrl=\`${'${location.origin}${location.pathname}'}\`;return\`ดวงวันนี้ของฉัน ${'${fortune.score}'}/100 ✦\\n${'${fortune.headline}'}\\n${'${cleanUrl}'}\`}function openShareUrl(url){const w=window.open(url,'_blank','noopener,noreferrer');if(!w)location.href=url}function lineShare(){const mobile=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);const url=mobile?\`https://line.me/R/msg/text/?${'${encodeURIComponent(shareText())}'}\`:\`https://social-plugins.line.me/lineit/share?url=${'${encodeURIComponent(`${location.origin}${location.pathname}`)}'}\`;openShareUrl(url)}async function copyShare(){const text=shareText();try{await navigator.clipboard.writeText(text)}catch{const t=document.createElement('textarea');t.value=text;t.style.position='fixed';t.style.opacity='0';document.body.appendChild(t);t.select();document.execCommand('copy');t.remove()}toast('คัดลอกข้อความแล้ว')}async function systemShare(){try{if(navigator.share){await navigator.share({title:'ดวงวันดี',text:shareText()});return}await copyShare()}catch(e){if(e?.name!=='AbortError')await copyShare()}}function drawShareCard(){const c=document.getElementById('canvas'),x=c.getContext('2d'),g=x.createLinearGradient(0,0,1080,1350);g.addColorStop(0,'#263e78');g.addColorStop(.5,'#7450ca');g.addColorStop(1,'#d95b72');x.fillStyle=g;x.fillRect(0,0,1080,1350);x.textAlign='center';x.fillStyle='#fff';x.font='700 58px sans-serif';x.fillText('ดวงวันดี ✦',540,180);x.font='700 180px sans-serif';x.fillText(fortune.score,540,530);x.font='700 50px sans-serif';x.fillText('จังหวะวันนี้ / 100',540,610);x.font='600 38px sans-serif';x.fillText(fortune.headline.slice(0,28),540,780);x.font='400 28px sans-serif';x.fillStyle='rgba(255,255,255,.82)';x.fillText(location.host,540,1180);return c.toDataURL('image/png')}function dataUrlFile(dataUrl){const [head,data]=dataUrl.split(',');const mime=head.match(/data:(.*?);/)?.[1]||'image/png';const raw=atob(data),bytes=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);return new File([bytes],'duang-wandee.png',{type:mime})}function downloadCard(dataUrl){const a=document.createElement('a');a.href=dataUrl;a.download='duang-wandee.png';document.body.appendChild(a);a.click();a.remove()}async function instaShare(){const dataUrl=drawShareCard(),file=dataUrlFile(dataUrl);try{if(navigator.share&&navigator.canShare?.({files:[file]})){await navigator.share({files:[file],title:'ดวงวันดี',text:shareText()});toast('เลือก Instagram จากเมนูแชร์ได้เลย');return}}catch(e){if(e?.name==='AbortError')return}downloadCard(dataUrl);toast('บันทึกการ์ดแล้ว กำลังเปิด Instagram');openShareUrl('https://www.instagram.com/')}
`;

html = html.slice(0, start) + shareCode + html.slice(end);
html = html
  .replace('<button class="line" id="lineBtn">', '<button type="button" class="line" id="lineBtn">')
  .replace('<button class="insta" id="instaBtn">', '<button type="button" class="insta" id="instaBtn">')
  .replace('<button class="other" id="shareBtn">', '<button type="button" class="other" id="shareBtn">');

const buildId = Date.now().toString(36);
const cacheGuard = `<meta http-equiv="Cache-Control" content="no-store, no-cache, must-revalidate, max-age=0"><meta http-equiv="Pragma" content="no-cache"><meta http-equiv="Expires" content="0"><meta name="thailuck-build" content="${buildId}"><script>(()=>{const BUILD='${buildId}';try{if('serviceWorker'in navigator)navigator.serviceWorker.getRegistrations().then(rs=>Promise.all(rs.map(r=>r.unregister()))).catch(()=>{});if('caches'in window)caches.keys().then(ks=>Promise.all(ks.map(k=>caches.delete(k)))).catch(()=>{});setTimeout(async()=>{try{const u=new URL('/',location.origin);u.searchParams.set('_check',Date.now());const t=await fetch(u,{cache:'no-store',headers:{'Cache-Control':'no-cache'}}).then(r=>r.text());const m=t.match(/name=["']thailuck-build["'] content=["']([^"']+)/);if(m&&m[1]!==BUILD)location.replace('/?v='+encodeURIComponent(m[1]))}catch{}},1200)}catch{}})();</script>`;
html = html.replace('</head>', `${cacheGuard}</head>`);

fs.writeFileSync(file, html, 'utf8');
console.log(`Applied sharing and cache fixes to ${file}`);
