window.addEventListener('scroll', function(){
  const header = document.getElementById('siteHeader');
  if(window.scrollY > 40) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
});


(function(){
  const materialDisplay = document.getElementById('materialDisplay');
  if(!materialDisplay) return;

  const materials = {
    'linen': {
      title: 'Linen',
      description: 'A relaxed woven texture with a soft, tactile finish and a timeless natural feel.',
      files: Array.from({length:20}, (_,i) => ({src:`assets/img/swatch-linen-${String(i+1).padStart(2,'0')}.jpg`, label:`Linen ${String(i+1).padStart(2,'0')}`}))
    },
    'cotton': {
      title: 'Cotton',
      description: 'A smooth, clean cloth finish with a light softness and understated character.',
      files: Array.from({length:20}, (_,i) => ({src:`assets/img/swatch-cotton-${String(i+1).padStart(2,'0')}.jpg`, label:`Cotton ${String(i+1).padStart(2,'0')}`}))
    },
    'faux-leather': {
      title: 'Faux Leather',
      description: 'A refined leather-look surface with structure, depth, and a more formal finish.',
      files: Array.from({length:20}, (_,i) => ({src:`assets/img/swatch-faux-leather-${String(i+1).padStart(2,'0')}.jpg`, label:`Faux Leather ${String(i+1).padStart(2,'0')}`}))
    },
    'suede': {
      title: 'Suede',
      description: 'A softer, velvety material with warmth, richness, and a beautifully tactile presence.',
      files: Array.from({length:20}, (_,i) => ({src:`assets/img/swatch-suede-${String(i+1).padStart(2,'0')}.jpg`, label:`Suede ${String(i+1).padStart(2,'0')}`}))
    }
  };

  const titleEl = document.getElementById('materialTitle');
  const descEl = document.getElementById('materialDescription');
  const gridEl = document.getElementById('swatchGrid');
  const modal = document.getElementById('materialModal');
  const modalImg = document.getElementById('materialModalImage');
  const modalLabel = document.getElementById('materialModalLabel');
  const modalClose = document.getElementById('materialModalClose');

  function renderMaterial(key){
    const data = materials[key] || materials['linen'];
    titleEl.textContent = data.title;
    descEl.textContent = data.description;
    gridEl.innerHTML = data.files.map(item => `
      <button class="swatch-button" type="button" data-src="${item.src}" data-label="${item.label}">
        <img src="${item.src}" alt="${item.label}">
        <span>${item.label}</span>
      </button>
    `).join('');
    document.querySelectorAll('.material-trigger').forEach(el => {
      const active = el.dataset.material === key;
      el.classList.toggle('active-material', active);
      const card = el.closest('.material-card');
      if(card) card.classList.toggle('active-material', active);
    });
  }

  function openModal(src,label){
    modalImg.src = src;
    modalImg.alt = label;
    modalLabel.textContent = label;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(){
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  }

  const params = new URLSearchParams(window.location.search);
  const initial = params.get('material') || 'linen';
  renderMaterial(initial);

  document.querySelectorAll('.material-trigger').forEach(link => {
    link.addEventListener('click', function(e){
      e.preventDefault();
      const key = this.dataset.material;
      renderMaterial(key);
      const url = new URL(window.location.href);
      url.searchParams.set('material', key);
      history.replaceState({}, '', url);
      materialDisplay.scrollIntoView({behavior:'smooth', block:'start'});
    });
  });

  gridEl.addEventListener('click', function(e){
    const btn = e.target.closest('.swatch-button');
    if(!btn) return;
    openModal(btn.dataset.src, btn.dataset.label);
  });

  if(modal){
    modal.addEventListener('click', function(e){
      if(e.target.dataset.close === 'true') closeModal();
    });
  }
  if(modalClose){
    modalClose.addEventListener('click', closeModal);
  }
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape') closeModal();
  });
})();