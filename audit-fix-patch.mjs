import fs from 'node:fs';
const file=process.argv[2];
if(!file) throw new Error('Usage: node audit-fix-patch.mjs <html-file>');
let html=fs.readFileSync(file,'utf8');

html=html.replace('ดูความรัก งาน เงิน วันดี และสิ่งที่ควรทำวันนี้ จากวันเกิดแบบเกาหลี ชื่อเล่นไม่บังคับ','ดูความรัก งาน เงิน วันดี และสิ่งที่ควรทำวันนี้ จากวันเกิดแบบเกาหลี');

const extraAnimals="['turtle','🐢','เต่า','ค่อยเป็นค่อยไป','ความมั่นคงที่กำลังก่อตัว','เต่ามักสื่อถึงความอดทน ความมั่นคง และผลลัพธ์ที่ต้องใช้เวลา','ทำเรื่องสำคัญช้า ๆ แต่ให้เสร็จทีละขั้น'],['horse','🐎','ม้า','การเคลื่อนไหว','โอกาสจากการเดินทางหรือการลงมือ','ม้ามักสื่อถึงพลัง การเดินทาง และการเปลี่ยนจังหวะอย่างรวดเร็ว','เตรียมตัวให้พร้อมก่อนตอบรับโอกาสใหม่'],['cat','🐈','แมว','สัญชาตญาณ','เรื่องเล็กที่ควรสังเกต','แมวมักสื่อถึงสัญชาตญาณ ความเป็นอิสระ และสิ่งที่ยังไม่พูดตรง ๆ','เชื่อความรู้สึกได้ แต่ควรตรวจข้อเท็จจริงด้วย'],['butterfly','🦋','ผีเสื้อ','การเปลี่ยนแปลง','การเริ่มต้นรูปแบบใหม่','ผีเสื้อมักสื่อถึงการเปลี่ยนแปลง เสน่ห์ และการปล่อยสิ่งเดิม','เปิดรับการเปลี่ยนแปลงเล็ก ๆ ที่ทำให้ใจเบาขึ้น']";
html=html.replace(/const dreams=\[([\s\S]*?)\];\s*function key/, (all,body)=>body.includes("'turtle'")?all:`const dreams=[${body},${extraAnimals}];function key`);

const categoryStart=html.indexOf('function openCategory(type){');
const categoryEnd=html.indexOf('function renderPeople(){',categoryStart);
if(categoryStart>=0&&categoryEnd>categoryStart){
 const rich=`function openCategory(type){const c=fortune.categories.find(x=>x.type===type),label=focusMeta[type],extra={love:{signal:'สังเกตน้ำเสียง ความสม่ำเสมอ และว่าอีกฝ่ายถามกลับหรือไม่ มากกว่าจับเวลาอ่านข้อความ',steps:['เริ่มด้วยเรื่องที่ตอบง่าย','ถามเพียงหนึ่งประเด็น','เว้นพื้นที่ให้อีกฝ่ายตอบ'],phrase:'วันนี้เป็นยังไงบ้าง? ถ้าว่างค่อยตอบก็ได้',fallback:'ถ้ายังเงียบ อย่าส่งข้อความทดสอบใจ ให้รอจังหวะแล้วกลับมาคุยด้วยคำถามที่ชัดกว่าเดิม'},work:{signal:'งานที่สำคัญจริงมักมีเส้นตาย คนรับต่อ และผลลัพธ์ที่ชัด แยกออกจากงานด่วนที่มีแต่เสียงดัง',steps:['เลือกงานค้างหนึ่งชิ้น','ส่งฉบับที่พอให้คนอื่นตรวจได้','ค่อยรับงานใหม่หลังเช็กเวลา'],phrase:'ขอเช็กกำหนดส่งและขอบเขตก่อน แล้วจะยืนยันอีกครั้ง',fallback:'ถ้าแผนสะดุด ให้ลดขนาดงานและส่งส่วนแรกก่อน อย่ารอให้สมบูรณ์ทั้งหมด'},money:{signal:'แยกของจำเป็น ของอยากได้ และการซื้อเพราะกลัวพลาด ก่อนดูว่าราคาถูกหรือแพง',steps:['เช็กยอดที่มีจริง','เทียบราคาอย่างน้อยสองที่','รอหนึ่งคืนถ้าไม่จำเป็นเร่งด่วน'],phrase:'ขอรายละเอียดค่าใช้จ่ายทั้งหมดก่อนตัดสินใจได้ไหม?',fallback:'ถ้าจ่ายไปแล้ว ให้หยุดรายจ่ายซ้ำและปรับงบสัปดาห์นี้ แทนการโทษตัวเอง'}}[type];document.getElementById('detailKicker').textContent='คำตอบแบบละเอียด';document.getElementById('detailTitle').textContent=label;document.getElementById('detailBody').innerHTML=\`<div class="detail"><span>จังหวะวันนี้ \${c.score}/100 · \${c.moment}</span><b>\${c.question}</b><p>\${c.answer}</p></div><div class="detail"><span>สัญญาณที่ควรดู</span><p>\${extra.signal}</p></div><div class="detail"><span>ทำตามลำดับนี้</span><p>1. \${extra.steps[0]}<br>2. \${extra.steps[1]}<br>3. \${extra.steps[2]}</p></div><div class="detail"><span>ประโยคที่ใช้ได้วันนี้</span><b>“\${extra.phrase}”</b></div><div class="pair"><div class="detail"><span>ควรทำ</span><p>\${c.doit}</p></div><div class="detail"><span>ควรเลี่ยง</span><p>\${c.avoid}</p></div></div><div class="detail"><span>ถ้าไม่เป็นตามคาด</span><p>\${extra.fallback}</p></div>\`;openM('detailModal')}
`;
 html=html.slice(0,categoryStart)+rich+html.slice(categoryEnd);
}

const dreamsStart=html.indexOf('function renderDreams(){');
const dreamsEnd=html.indexOf('function ensureHistory(){',dreamsStart);
if(dreamsStart>=0&&dreamsEnd>dreamsStart){
 const dynamic=`let visibleDreams=[];function dreamsForSelectedDate(){const chosen=new Date(selected+'T00:00:00'),day=insight(chosen),toneText={open:['เปิดทาง','วันนี้เหมาะกับเริ่มหรือรับโอกาสใหม่'],love:['ความสัมพันธ์','วันนี้ควรดูน้ำเสียงและความจริงใจ'],money:['การเงิน','วันนี้ควรเช็กราคา รายรับ และข้อตกลง'],work:['งานและการเรียน','วันนี้ควรจัดลำดับและปิดงานสำคัญ'],steady:['ค่อย ๆ ไป','วันนี้ได้ผลจากความสม่ำเสมอมากกว่าความรีบ'],care:['ควรระวัง','วันนี้ควรตรวจข้อมูลและไม่ตัดสินใจจากอารมณ์']}[day.tone],ordered=[...dreams].sort((a,b)=>hash(selected+'|'+a[0]+'|'+state.profile.birth)-hash(selected+'|'+b[0]+'|'+state.profile.birth));return ordered.slice(0,4).map(d=>[d[0],d[1],d[2],d[3]+' · '+toneText[0],d[4],toneText[1]+' '+d[5],day.good+' และ '+d[6]])}function renderDreams(){visibleDreams=dreamsForSelectedDate();const e=document.getElementById('dreamGrid');e.innerHTML=visibleDreams.map(d=>\`<button data-dream="\${d[0]}"><span class="dreamIcon">\${d[1]}</span><span><b>\${d[2]}</b><small>\${d[3]}</small></span><i>›</i></button>\`).join('');e.querySelectorAll('[data-dream]').forEach(b=>b.onclick=()=>openDream(b.dataset.dream))}function openDream(id){const d=visibleDreams.find(x=>x[0]===id)||dreams.find(x=>x[0]===id);document.getElementById('detailKicker').textContent=d[1]+' ความฝันของวันที่เลือก';document.getElementById('detailTitle').textContent='ฝันเห็น'+d[2];document.getElementById('detailBody').innerHTML=\`<div class="detail"><span>\${d[3]}</span><b>\${d[4]}</b><p>\${d[5]}</p></div><div class="detail"><span>ลองสังเกตในวันนี้</span><p>\${d[6]}</p></div><div class="note">ความหมายเปลี่ยนตามวันที่เลือกและบริบทของความฝัน ใช้เพื่อความบันเทิงและทบทวนตนเอง</div>\`;openM('detailModal')}
`;
 html=html.slice(0,dreamsStart)+dynamic+html.slice(dreamsEnd);
}
html=html.replace("selected=b.dataset.date;renderDay(insight(new Date(selected+'T00:00:00')));renderCalendar()","selected=b.dataset.date;renderDay(insight(new Date(selected+'T00:00:00')));renderCalendar();renderDreams()");
html=html.replace('setupInputs();',"document.querySelectorAll('.field').forEach(f=>{if(f.querySelector('#nameInput,#timeInput,#moodChoices'))f.classList.add('optionalHidden')});setupInputs();");

const css=`<style id="audit-fix-v2">.optionalHidden{display:none!important}#detailBody .detail p{line-height:1.65}.fortune{cursor:pointer}</style>`;
html=html.replace('</head>',css+'</head>');
fs.writeFileSync(file,html,'utf8');
console.log('Applied audit-fix-v2');
