// LT Dev Studio — interactive layer
(function(){
  // ---------- Page loader ----------
  const loader = document.getElementById('page-loader');
  function hideLoader(){
    if(!loader) return;
    requestAnimationFrame(()=>{
      setTimeout(()=>loader.classList.add('hidden'), 400);
    });
  }
  function showLoaderAndGo(href){
    if(!loader){ window.location.href = href; return; }
    loader.classList.remove('hidden');
    setTimeout(()=>{ window.location.href = href; }, 350);
  }

  // ---------- Header scroll state ----------
  const header = document.querySelector('.header');
  const onScroll = () => {
    if(window.scrollY > 20) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, {passive:true});

  // ---------- Mobile nav ----------
  const toggle = document.querySelector('.nav-toggle');
  const drawer = document.querySelector('.mobile-nav');
  function setOpen(open){
    drawer.classList.toggle('open', open);
    document.body.classList.toggle('no-scroll', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.innerHTML = '';
    const span = document.createElement('span');
    span.setAttribute('data-icon', open ? 'x' : 'menu');
    span.className = 'i18';
    span.style.display='inline-flex';
    toggle.appendChild(span);
    renderIcons();
  }
  if(toggle && drawer){
    toggle.addEventListener('click', () => setOpen(!drawer.classList.contains('open')));
    drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setOpen(false)));
  }

  // ---------- Active link ----------
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('[data-nav]').forEach(a => {
    const href = a.getAttribute('href');
    if(href === path || (path === '' && href === 'index.html') || (path === 'index.html' && href === 'index.html')){
      a.classList.add('active');
    }
  });

  // ---------- Reveal on scroll ----------
  const io = ('IntersectionObserver' in window) ? new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, {threshold:0.12, rootMargin:'0px 0px -40px 0px'}) : null;
  document.querySelectorAll('.reveal').forEach(el => {
    if(io) io.observe(el); else el.classList.add('in');
  });

  // ---------- SPA-style page transitions ----------
  const internal = (href) => {
    if(!href) return false;
    if(href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('http')) return false;
    return /\.html$/.test(href) || href === '/';
  };
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if(!a) return;
    const href = a.getAttribute('href');
    if(!internal(href)) return;
    if(a.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    showLoaderAndGo(href);
  });

  // ---------- Year ----------
  const y = document.getElementById('year');
  if(y) y.textContent = new Date().getFullYear();

  // ---------- Contact form ----------
  const form = document.getElementById('contact-form');
  if(form){
    const status = form.querySelector('.form-status');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      status.className = 'form-status';
      status.textContent = '';
      const btn = form.querySelector('button[type=submit]');
      const original = btn.innerHTML;
      btn.disabled = true; btn.innerHTML = 'Sending…';
      try{
        const fd = new FormData(form);
        const res = await fetch('process_form.php', {method:'POST', body:fd, headers:{'Accept':'application/json'}});
        let data = {}; try{ data = await res.json(); }catch(_){}
        if(res.ok && data.ok){
          form.reset();
          status.className = 'form-status ok';
          status.textContent = "Message sent — I'll be in touch shortly.";
        }else{
          const msg = (data.errors && data.errors.join(' ')) || data.error || 'Something went wrong. Please try again or email info@ltdevstudio.co.za.';
          status.className = 'form-status err';
          status.textContent = msg;
        }
      }catch(err){
        status.className = 'form-status err';
        status.textContent = 'Network error. Please try again or email info@ltdevstudio.co.za.';
      }finally{
        btn.disabled = false; btn.innerHTML = original;
      }
    });
  }

  // ---------- Render icons & hide loader ----------
  if(typeof renderIcons === 'function') renderIcons();
  onScroll();
  window.addEventListener('load', hideLoader);
  // Fallback in case load doesn't fire
  setTimeout(hideLoader, 1500);
})();
