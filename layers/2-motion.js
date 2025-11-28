// 2-motion.js — motion language (slow drift, scroll velocity mapping)
(function(){
  let lastY = window.scrollY;
  let speed = 0;
  function onScroll(){
    const y = window.scrollY;
    speed = Math.min(20, Math.abs(y - lastY));
    lastY = y;
    document.documentElement.style.setProperty('--scroll-speed', String(speed));
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  window.addEventListener('layer:toggle', (e)=>{
    const id = e.detail.id;
    if(id!=='all' && id!=='2') document.documentElement.classList.add('mute-motion'); else document.documentElement.classList.remove('mute-motion');
  });
  window.addEventListener('layer:warp', ()=>{
    document.documentElement.animate([{filter:'hue-rotate(0deg)'},{filter:'hue-rotate(60deg)'},{filter:'hue-rotate(0deg)'}],{duration:1000});
  });
})();
