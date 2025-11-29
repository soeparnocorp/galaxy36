// main.js — loader & orchestrator (ES module)
const LAYERS = [
  { id:1, file:'../layers/1-visual.svg', type:'svg' },
  { id:2, file:'../layers/2-motion.js', type:'js' },
  { id:3, file:'../layers/3-audio.js', type:'js' },
  { id:4, file:'../layers/4-particles.py', type:'py' },
  { id:5, file:'../layers/5-light.css', type:'css' },
  { id:6, file:'../layers/6-atmosphere.svg', type:'svg' },
  { id:7, file:'../layers/7-narrative.json', type:'json' },
  { id:8, file:'../layers/8-interaction.ts', type:'ts' },
  { id:9, file:'../layers/9-portal.glsl', type:'glsl' }
];

const dimSelect = document.getElementById('dimSelect');
const warpBtn = document.getElementById('warpBtn');
const content = document.getElementById('content');

async function loadLayer(layer){
  try {
    if(layer.type==='svg'){
      const res = await fetch(layer.file);
      const svgText = await res.text();
      const wrapper = document.createElement('div');
      wrapper.className = 'layer-svg';
      wrapper.dataset.id = String(layer.id);
      wrapper.innerHTML = svgText;
      document.body.appendChild(wrapper);
      return wrapper;
    }
    if(layer.type==='css'){
      const link = document.createElement('link'); link.rel='stylesheet'; link.href=layer.file; document.head.appendChild(link); link.dataset.id = String(layer.id); return link;
    }
    if(layer.type==='js'){
      const s = document.createElement('script'); s.type='module'; s.src=layer.file; s.dataset.id=String(layer.id); document.body.appendChild(s); return s;
    }
    if(layer.type==='json'){
      const res = await fetch(layer.file); return await res.json();
    }
    if(layer.type==='glsl'){
      const res = await fetch(layer.file); const txt = await res.text();
      const el = document.createElement('script'); el.type='x-shader/fragment'; el.id='portal-shader'; el.textContent = txt; document.body.appendChild(el); return el;
    }
    if(layer.type==='py'){
      // Python file included for GitHub language stats (not executed in browser)
      const res = await fetch(layer.file); return await res.text();
    }
    if(layer.type==='ts'){
      // TypeScript file included for GitHub linguistic detection; not transpiled here.
      const res = await fetch(layer.file); return await res.text();
    }
  } catch(e){
    console.warn('load error', layer, e);
    return null;
  }
}

async function init(){
  const results = await Promise.all(LAYERS.map(loadLayer));
  const narrative = results[6];
  if(narrative){
    document.querySelector('[data-key="title"]').textContent = narrative.hero.title;
    document.querySelector('[data-key="subtitle"]').textContent = narrative.hero.subtitle;
    content.innerHTML = '';
    narrative.fragments.forEach((f,i)=>{
      const p = document.createElement('p'); p.className='nfrag'; p.style.opacity=0; p.textContent = f;
      content.appendChild(p);
      setTimeout(()=> p.style.opacity=1, 300 + i*350);
    });
  }

  dimSelect.addEventListener('change', e=>{
    const v=e.target.value;
    document.querySelectorAll('.layer-svg, .layer-canvas').forEach(el=>{
      el.style.display = (v==='all' || el.dataset.id===v) ? '' : 'none';
    });
    window.dispatchEvent(new CustomEvent('layer:toggle',{detail:{id:v}}));
  });

  warpBtn.addEventListener('click', ()=>{
    window.dispatchEvent(new CustomEvent('layer:warp'));
    const h=document.querySelector('[data-key="title"]');
    h.animate([{opacity:1},{opacity:0.2},{opacity:1}],{duration:900});
  });

  setTimeout(()=>document.body.classList.add('ready'),400);
}

init();
