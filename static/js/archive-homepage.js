(() => {
  const lang = new URL(location.href).searchParams.get('lang') || localStorage.getItem('lang') || 'zh';
  const pick = (v) => typeof v === 'string' ? v : (v?.[lang] || v?.zh || v?.en || '');

  async function init(){
    const res = await fetch('content/generated/homepage.json?v=' + Date.now());
    const data = await res.json();

    const set = (id,value)=>{const el=document.getElementById(id);if(el)el.textContent=value};
    set('archive-brand', pick(data.chrome.brand));
    set('profile-name', data.profile.name);
    set('profile-role', pick(data.profile.role));
    set('profile-thesis', pick(data.profile.thesis));
    set('profile-status', pick(data.profile.status));
    set('profile-phase', pick(data.profile.phase));
    set('profile-focus', pick(data.profile.focus));
    set('profile-build', data.profile.build);

    const ports=document.getElementById('identity-ports');
    ports.innerHTML=data.profile.ports.map(p=>p.pending
      ? `<span class="pending-port">${pick(p.label)} · PENDING</span>`
      : `<a href="${p.url}">${pick(p.label)}</a>`).join('');

    drawRadar(data.radar.years.find(y=>y.year===data.radar.defaultYear));
    document.querySelectorAll('[data-year]').forEach(btn=>btn.onclick=()=>{
      document.querySelectorAll('[data-year]').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      drawRadar(data.radar.years.find(y=>y.year===Number(btn.dataset.year)));
    });
  }

  function drawRadar(year){
    const svg=document.getElementById('radar-svg');
    if(!svg||!year)return;
    const points=year.capabilities.map((c,i)=>{
      const a=-Math.PI/2+i*Math.PI*2/year.capabilities.length;
      const r=45*c.level;
      return [220+Math.cos(a)*r,220+Math.sin(a)*r];
    });
    svg.innerHTML='';
    for(let r=45;r<=225;r+=45){
      const poly=Array.from({length:5},(_,i)=>{
        const a=-Math.PI/2+i*Math.PI*2/5;
        return `${220+Math.cos(a)*r},${220+Math.sin(a)*r}`;
      }).join(' ');
      svg.insertAdjacentHTML('beforeend',`<polygon points="${poly}" fill="none" stroke="#263342"/>`);
    }
    svg.insertAdjacentHTML('beforeend',`<polygon points="${points.map(p=>p.join(',')).join(' ')}" fill="rgba(120,214,232,.15)" stroke="#78d6e8" stroke-width="2"/>`);
    year.capabilities.forEach((c,i)=>{
      const a=-Math.PI/2+i*Math.PI*2/5;
      const x=220+Math.cos(a)*175;
      const y=220+Math.sin(a)*175;
      svg.insertAdjacentHTML('beforeend',`<text x="${x}" y="${y}" class="radar-label" text-anchor="middle">${pick(c.name)}</text>`);
    });
    document.getElementById('radar-year').textContent=year.year;
  }

  document.addEventListener('DOMContentLoaded',init);
})();
