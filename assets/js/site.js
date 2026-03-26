window.addEventListener('scroll', function(){
  const header = document.getElementById('siteHeader');
  if(!header) return;
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
      files: [
        {src:'assets/img/swatch-linen-01.jpg', label:"Desert Sand 006"},
        {src:'assets/img/swatch-linen-02.jpg', label:"Natural Beige 003"},
        {src:'assets/img/swatch-linen-03.jpg', label:"Harvest Wheat 002"},
        {src:'assets/img/swatch-linen-04.jpg', label:"Stone Grey 004"},
        {src:'assets/img/swatch-linen-05.jpg', label:"Dusty Rose 005"},
        {src:'assets/img/swatch-linen-06.jpg', label:"Deep Charcoal 001"}
      ]
    },
    'cotton': {
      title: 'Premium Cloth',
      description: 'A smooth, clean cloth finish with a light softness and understated character.',
      files: [
        {src:'assets/img/swatch-cotton-01.jpg', label:"Pure White 012"},
        {src:'assets/img/swatch-cotton-02.jpg', label:"Soft Ivory 013"},
        {src:'assets/img/swatch-cotton-03.jpg', label:"Desert Sand 018"},
        {src:'assets/img/swatch-cotton-04.jpg', label:"Silver 028"},
        {src:'assets/img/swatch-cotton-05.jpg', label:"Nude Beige 016"},
        {src:'assets/img/swatch-cotton-06.jpg', label:"Golden Sand 017"},
        {src:'assets/img/swatch-cotton-07.jpg', label:"Sky Blue 027"},
        {src:'assets/img/swatch-cotton-08.jpg', label:"Fresh Mint 021"},
        {src:'assets/img/swatch-cotton-09.jpg', label:"Aqua 026"},
        {src:'assets/img/swatch-cotton-10.jpg', label:"Lime 020"},
        {src:'assets/img/swatch-cotton-11.jpg', label:"Latte 011"},
        {src:'assets/img/swatch-cotton-12.jpg', label:"Blossom Pink 023"},
        {src:'assets/img/swatch-cotton-13.jpg', label:"Mustard 003"},
        {src:'assets/img/swatch-cotton-14.jpg', label:"Camel 014"},
        {src:'assets/img/swatch-cotton-15.jpg', label:"Amber 015"},
        {src:'assets/img/swatch-cotton-16.jpg', label:"Soft Lilac 025"},
        {src:'assets/img/swatch-cotton-17.jpg', label:"Grape 024"},
        {src:'assets/img/swatch-cotton-18.jpg', label:"Warm Grey 010"},
        {src:'assets/img/swatch-cotton-19.jpg', label:"Pine 004"},
        {src:'assets/img/swatch-cotton-20.jpg', label:"Teal 006"},
        {src:'assets/img/swatch-cotton-21.jpg', label:"Berry 005"},
        {src:'assets/img/swatch-cotton-22.jpg', label:"Forest Green 019"},
        {src:'assets/img/swatch-cotton-23.jpg', label:"Chocolate Brown 022"},
        {src:'assets/img/swatch-cotton-24.jpg', label:"Burgundy 001"},
        {src:'assets/img/swatch-cotton-25.jpg', label:"Midnight Blue 007"},
        {src:'assets/img/swatch-cotton-26.jpg', label:"Deep Black 008"},
        {src:'assets/img/swatch-cotton-27.jpg', label:"Carbon Black 009"},
        {src:'assets/img/swatch-cotton-28.jpg', label:"Charcoal 002"}
      ]
    },
    'faux-leather': {
      title: 'Faux Leather',
      description: 'A refined leather-look surface with structure, depth, and a more formal finish.',
      files: [
        {src:'assets/img/swatch-faux-leather-01.jpg', label:"Champagne 016"},
        {src:'assets/img/swatch-faux-leather-02.jpg', label:"Ivory 006"},
        {src:'assets/img/swatch-faux-leather-03.jpg', label:"Pure White 021"},
        {src:'assets/img/swatch-faux-leather-04.jpg', label:"Coral Blush 013"},
        {src:'assets/img/swatch-faux-leather-05.jpg', label:"Powder Blue 012"},
        {src:'assets/img/swatch-faux-leather-06.jpg', label:"Warm Stone 004"},
        {src:'assets/img/swatch-faux-leather-07.jpg', label:"Ash Grey 018"},
        {src:'assets/img/swatch-faux-leather-08.jpg', label:"Saddle Tan 005"},
        {src:'assets/img/swatch-faux-leather-09.jpg', label:"Cocoa Brown 017"},
        {src:'assets/img/swatch-faux-leather-10.jpg', label:"Olive Green 026"},
        {src:'assets/img/swatch-faux-leather-11.jpg', label:"Slate Blue 023"},
        {src:'assets/img/swatch-faux-leather-12.jpg', label:"Plum 020"},
        {src:'assets/img/swatch-faux-leather-13.jpg', label:"Taupe 025"},
        {src:'assets/img/swatch-faux-leather-14.jpg', label:"Steel Blue 014"},
        {src:'assets/img/swatch-faux-leather-15.jpg', label:"Chestnut 001"},
        {src:'assets/img/swatch-faux-leather-16.jpg', label:"Deep Ocean 003"},
        {src:'assets/img/swatch-faux-leather-17.jpg', label:"Ink Blue 024"},
        {src:'assets/img/swatch-faux-leather-18.jpg', label:"Graphite 019"},
        {src:'assets/img/swatch-faux-leather-19.jpg', label:"Dark Mocha 022"},
        {src:'assets/img/swatch-faux-leather-20.jpg', label:"Charcoal 008"},
        {src:'assets/img/swatch-faux-leather-21.jpg', label:"Navy Classic 010"},
        {src:'assets/img/swatch-faux-leather-22.jpg', label:"Forest Green 009"},
        {src:'assets/img/swatch-faux-leather-23.jpg', label:"Burgundy 015"},
        {src:'assets/img/swatch-faux-leather-24.jpg', label:"Midnight Teal 002"},
        {src:'assets/img/swatch-faux-leather-25.jpg', label:"Crimson 007"},
        {src:'assets/img/swatch-faux-leather-26.jpg', label:"Jet Black 011"}
      ]
    },
    'suede': {
      title: 'Suede',
      description: 'A softer, velvety material with warmth, richness, and a beautifully tactile presence.',
      files: [
        {src:'assets/img/swatch-suede-01.jpg', label:"Snow 018"},
        {src:'assets/img/swatch-suede-02.jpg', label:"Sandstone 012"},
        {src:'assets/img/swatch-suede-03.jpg', label:"Platinum Grey 020"},
        {src:'assets/img/swatch-suede-04.jpg', label:"Blush Rose 006"},
        {src:'assets/img/swatch-suede-05.jpg', label:"Aqua 008"},
        {src:'assets/img/swatch-suede-06.jpg', label:"Mist Blue 003"},
        {src:'assets/img/swatch-suede-07.jpg', label:"Mauve 017"},
        {src:'assets/img/swatch-suede-08.jpg', label:"Sage 004"},
        {src:'assets/img/swatch-suede-09.jpg', label:"Baltic Blue 007"},
        {src:'assets/img/swatch-suede-10.jpg', label:"Desert Tan 002"},
        {src:'assets/img/swatch-suede-11.jpg', label:"Dusty Rose 019"},
        {src:'assets/img/swatch-suede-12.jpg', label:"Graphite 001"},
        {src:'assets/img/swatch-suede-13.jpg', label:"Amber Brown 010"},
        {src:'assets/img/swatch-suede-14.jpg', label:"Indigo 015"},
        {src:'assets/img/swatch-suede-15.jpg', label:"Deep Forest 005"},
        {src:'assets/img/swatch-suede-16.jpg', label:"Pine 013"},
        {src:'assets/img/swatch-suede-17.jpg', label:"Fuchsia 014"},
        {src:'assets/img/swatch-suede-18.jpg', label:"Bordeaux 009"},
        {src:'assets/img/swatch-suede-19.jpg', label:"Midnight Navy 016"},
        {src:'assets/img/swatch-suede-20.jpg', label:"Carbon 011"}
      ]
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