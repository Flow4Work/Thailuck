import fs from 'node:fs';
import path from 'node:path';

const distDir = process.argv[2];
if (!distDir) throw new Error('Usage: node bootstrap.mjs <dist-directory>');

const versionPath = path.join(distDir, 'version.json');
const { build } = JSON.parse(fs.readFileSync(versionPath, 'utf8'));

const html = `<!doctype html>
<html lang="th">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#24133f">
<meta http-equiv="Cache-Control" content="no-store, no-cache, must-revalidate, max-age=0">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Expires" content="0">
<title>ดวงวันดี</title>
<style>html,body{margin:0;min-height:100%;background:#120a24;color:#fff;font-family:system-ui,sans-serif}body{display:grid;place-items:center}.wrap{text-align:center}.spin{width:42px;height:42px;margin:0 auto 14px;border:4px solid #ffffff2e;border-top-color:#ffd166;border-radius:50%;animation:s .7s linear infinite}@keyframes s{to{transform:rotate(360deg)}}p{font-size:14px;margin:0;opacity:.9}</style>
</head>
<body>
<div class="wrap"><div class="spin"></div><p>กำลังเปิดเวอร์ชันล่าสุด…</p></div>
<script>
(()=>{
  const FALLBACK=${JSON.stringify(build)};
  let running=false;

  async function clearLegacyCaches(){
    try{
      if('serviceWorker' in navigator){
        const regs=await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map(reg=>reg.unregister()));
      }
      if('caches' in window){
        const keys=await caches.keys();
        await Promise.all(keys.map(key=>caches.delete(key)));
      }
    }catch{}
  }

  async function getLatestBuild(){
    try{
      const response=await fetch('/version.json?_='+Date.now(),{
        cache:'no-store',
        credentials:'same-origin',
        headers:{'Cache-Control':'no-cache','Pragma':'no-cache'}
      });
      if(!response.ok) return FALLBACK;
      const data=await response.json();
      return data.build||FALLBACK;
    }catch{
      return FALLBACK;
    }
  }

  async function openLatest(){
    if(running) return;
    running=true;
    await clearLegacyCaches();
    const version=await getLatestBuild();
    const target=new URL('/app',location.origin);
    target.searchParams.set('v',version);
    target.searchParams.set('_',Date.now());
    location.replace(target.href);
  }

  window.addEventListener('pageshow',openLatest);
  window.addEventListener('focus',openLatest);
  window.addEventListener('online',openLatest);
  document.addEventListener('visibilitychange',()=>{
    if(document.visibilityState==='visible') openLatest();
  });
  setTimeout(openLatest,0);
})();
</script>
</body>
</html>`;

fs.writeFileSync(path.join(distDir, 'index.html'), html, 'utf8');
console.log(`Created version bootstrap for ${build}`);
