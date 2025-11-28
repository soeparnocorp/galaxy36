// 3-audio.js — generative ambient (WebAudio); user gesture resumes
(function(){
  if(!window.AudioContext) return;
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const master = ctx.createGain(); master.gain.value = 0.045; master.connect(ctx.destination);

  function oscCluster(freqBase, count){
    const arr = [];
    for(let i=0;i<count;i++){
      const o = ctx.createOscillator(); o.type='sine'; o.frequency.value = freqBase * (1 + i*0.02);
      const g = ctx.createGain(); g.gain.value = 0;
      o.connect(g); g.connect(master); o.start();
      arr.push({o,g});
    }
    return arr;
  }

  const cluster = [...oscCluster(28,3), ...oscCluster(44,2)];
  function morph(){
    const t = Date.now()*0.00006;
    cluster.forEach((c,i)=>{
      const amp = (Math.sin(t*(0.8+i*0.2)) + 1)/2;
      c.g.gain.linearRampToValueAtTime(0.012 * amp, ctx.currentTime + 0.06);
      c.o.frequency.setValueAtTime( (20 + i*6) * (1 + Math.sin(t*0.6 + i)/20), ctx.currentTime);
    });
    requestAnimationFrame(morph);
  }
  morph();

  // resume on first interaction
  const resume = ()=>{ if(ctx.state==='suspended') ctx.resume(); window.removeEventListener('pointerdown', resume) };
  window.addEventListener('pointerdown', resume);

  window.addEventListener('layer:toggle', (e)=>{
    const id=e.detail.id;
    if(id!=='all' && id!=='3') master.gain.gain.setTargetAtTime(0.0, ctx.currentTime, 0.4);
    else master.gain.gain.setTargetAtTime(0.045, ctx.currentTime, 0.4);
  });
})();
