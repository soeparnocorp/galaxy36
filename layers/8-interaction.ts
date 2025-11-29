// 8-interaction.ts — TypeScript micro-interactions (kept simple for demo)
declare global {
  interface Window { __LAYER_TOGGLE?: (v:string)=>void; }
}
(() => {
  // pointer-follow light element (will be toggled by compiled CSS)
  const pl = document.createElement('div');
  pl.className = 'pointer-light';
  document.body.appendChild(pl);

  window.addEventListener('pointermove', (e: PointerEvent) => {
    pl.style.left = (e.clientX - 70) + 'px';
    pl.style.top = (e.clientY - 70) + 'px';
    pl.style.opacity = '1';
  });

  window.addEventListener('pointerout', ()=> pl.style.opacity = '0');

  window.addEventListener('layer:toggle', (ev: Event) => {
    const id = (ev as CustomEvent).detail.id;
    if(id !== 'all' && id !== '8') document.documentElement.classList.add('mute-interaction');
    else document.documentElement.classList.remove('mute-interaction');
  });
})();
export {};
