import fs from 'node:fs';
import zlib from 'node:zlib';

const release = 'release-20260713-2055.html';
const chunks = Array.from({ length: 6 }, (_, index) =>
  fs.readFileSync(new URL(`./clean-bundle/${index + 1}.txt`, import.meta.url), 'utf8').trim()
).join('');

const files = JSON.parse(zlib.gunzipSync(Buffer.from(chunks, 'base64')).toString('utf8'));

function replaceRequired(source, from, to, label) {
  if (!source.includes(from)) throw new Error(`Patch target missing: ${label}`);
  return source.replace(from, to);
}

files['index.html'] = replaceRequired(
  files['index.html'],
  'width=device-width,initial-scale=1,viewport-fit=cover,maximum-scale=1',
  'width=device-width,initial-scale=1,viewport-fit=cover',
  'viewport zoom accessibility'
);

files['app.css'] = replaceRequired(
  files['app.css'],
  '.time-card{',
  '.feedback-note{margin:13px 0 0;padding:10px 12px;border:1px solid rgba(142,231,212,.24);border-radius:14px;background:rgba(142,231,212,.09);color:#d8fff7;font-size:10px;line-height:1.6}\n.time-card{',
  'feedback note style'
);

files['app.js'] = replaceRequired(
  files['app.js'],
  String.raw`    const tier = chooseTier(seed, state.profile.mood);
    const coreLines = coreMessage(category, tier.id, seed);
    const time = goodTime(seed, category);
    const details = detailSet(category, tier.id, seed);
    const questionTitle = customQuestion || q.title;`,
  String.raw`    const tier = chooseTier(seed, state.profile.mood);
    const feedback = previousCheckinAdjustment();
    const coreLines = [...coreMessage(category, tier.id, seed)];
    const time = goodTime(seed, category);
    const details = detailSet(category, tier.id, seed);
    if (feedback) {
      coreLines[1] = feedback.core;
      details.action = feedback.action;
    }
    const questionTitle = customQuestion || q.title;`,
  'check-in generation hook'
);

files['app.js'] = replaceRequired(
  files['app.js'],
  String.raw`      elementRelation: relation,
      time,
      ...details,
      followupId: overrides.followupId || ''`,
  String.raw`      elementRelation: relation,
      time,
      feedbackNote: feedback?.note || '',
      ...details,
      followupId: overrides.followupId || ''`,
  'check-in result state'
);

files['app.js'] = replaceRequired(
  files['app.js'],
  '  function chooseTier(seed, mood) {',
  String.raw`  function previousCheckinAdjustment() {
    const item = state.checkin;
    if (!item || !item.date || item.date === localDateKey()) return null;
    if (item.result === 'good') return {
      core: 'เมื่อวานวิธีที่เลือกได้ผล วันนี้รักษาจังหวะเดิมโดยไม่เร่งให้มากขึ้น',
      action: 'ทำสิ่งที่ได้ผลเมื่อวานซ้ำในขนาดพอดี แล้วหยุดก่อนความกดดันเพิ่ม',
      note: 'ปรับจากผลเมื่อวาน: สิ่งที่คุณเลือกช่วยให้สถานการณ์ดีขึ้น'
    };
    if (item.result === 'same') return {
      core: 'เมื่อวานสถานการณ์ยังเหมือนเดิม วันนี้จึงควรเปลี่ยนวิธีถามให้ง่ายขึ้น',
      action: 'ลดแรงกดดัน เลือกคำถามที่ตอบง่ายหนึ่งข้อ และรอดูการกระทำจริง',
      note: 'ปรับจากผลเมื่อวาน: ระบบลดความเร่งและเปลี่ยนมุมของคำแนะนำ'
    };
    return {
      core: 'เมื่อวานไม่เป็นตามคาด วันนี้ควรตั้งขอบเขตและขอความชัดเจนเพียงครั้งเดียว',
      action: 'หยุดทำสิ่งเดิมซ้ำ แล้วเลือกตั้งขอบเขตหรือขอคำตอบที่ชัดเจนหนึ่งครั้ง',
      note: 'ปรับจากผลเมื่อวาน: คำแนะนำเปลี่ยนจากการรอเป็นการกำหนดขอบเขต'
    };
  }

  function chooseTier(seed, mood) {`,
  'check-in adjustment function'
);

const feedbackMarker = '            <div class="fortune-center">';
const feedbackTemplate = "            ${r.feedbackNote ? `<div class=\"feedback-note\">${escapeHtml(r.feedbackNote)}</div>` : ''}\n            <div class=\"fortune-center\">";
files['app.js'] = replaceRequired(
  files['app.js'],
  feedbackMarker,
  feedbackTemplate,
  'check-in feedback display'
);

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
  JSON.stringify({ version: '5.1.0', release, builtAt: new Date().toISOString() }),
  'utf8'
);

for (const name of ['index.html', 'app.css', 'app.js']) {
  if (!fs.existsSync(new URL(name, dist))) throw new Error(`Missing ${name}`);
}

const joined = `${files['index.html']}\n${files['app.js']}`;
if (/formsubmit|flow4work@gmail|ผู้ดูแล/i.test(joined)) {
  throw new Error('Forbidden transmission code detected');
}
if (!joined.includes('previousCheckinAdjustment')) {
  throw new Error('Check-in adjustment patch missing');
}

console.log('Built privacy-safe Thailuck 5.1.0');
