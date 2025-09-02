// Bootloader lifecycle: waits for fonts and load events, enforces min display and fail-safe timeout
(function(){
  const loader = document.getElementById('bootloader');
  const spinner = loader && loader.querySelector('.bootloader__spinner');
  const MIN_MS = 600; // minimum visible time
  const MAX_MS = 5000; // fail-safe
  const start = Date.now();

  function adaptForDPR(){
    try{
      const dpr = window.devicePixelRatio || 1;
      if(spinner){
        const base = 64;
        const size = Math.round(base * Math.min(1.6, Math.max(1, dpr)));
        spinner.style.width = size + 'px';
        spinner.style.height = size + 'px';
      }
    }catch(e){/*ignore*/}
  }

  function hideLoader(){
    if(!loader) return;
    loader.setAttribute('aria-hidden','true');
    setTimeout(()=> loader.style.display = 'none', 520);
  }

  function readyToHide(){
    const elapsed = Date.now() - start;
    const wait = Math.max(0, MIN_MS - elapsed);
    setTimeout(hideLoader, wait);
  }

  const fontReady = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();

  Promise.all([fontReady, new Promise(resolve => {
    if(document.readyState === 'complete') return resolve();
    window.addEventListener('load', resolve, {once:true, capture:true});
    window.addEventListener('DOMContentLoaded', resolve, {once:true, capture:true});
  })]).then(readyToHide).catch(readyToHide);

  setTimeout(hideLoader, MAX_MS);
  adaptForDPR();
  window.matchMedia('(resolution)').addEventListener?.('change', adaptForDPR);
  if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    if(spinner) spinner.style.animation = 'none';
  }
})();
