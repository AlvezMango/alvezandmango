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
      files: [
        {src:'assets/img/faux-leather/Champagne-faux-leather-016.jpg', label:'Champagne', filename:'Champagne-faux-leather-016.jpg'},
        {src:'assets/img/faux-leather/Ivory-faux-leather-006.jpg', label:'Ivory', filename:'Ivory-faux-leather-006.jpg'},
        {src:'assets/img/faux-leather/Saddle-tan-faux-leather-005.jpg', label:'Saddle Tan', filename:'Saddle-tan-faux-leather-005.jpg'},
        {src:'assets/img/faux-leather/Warm-stone-faux-leather-004.jpg', label:'Warm Stone', filename:'Warm-stone-faux-leather-004.jpg'},
        {src:'assets/img/faux-leather/Ash-grey-faux-leather-018.jpg', label:'Ash Grey', filename:'Ash-grey-faux-leather-018.jpg'},
        {src:'assets/img/faux-leather/Pure-white-faux-leather-021.jpg', label:'Pure White', filename:'Pure-white-faux-leather-021.jpg'},
        {src:'assets/img/faux-leather/Powder-blue-faux-leather-012.jpg', label:'Powder Blue', filename:'Powder-blue-faux-leather-012.jpg'},
        {src:'assets/img/faux-leather/Coral-blush-faux-leather-013.jpg', label:'Coral Blush', filename:'Coral-blush-faux-leather-013.jpg'},
        {src:'assets/img/faux-leather/Taupe-faux-leather-025.jpg', label:'Taupe', filename:'Taupe-faux-leather-025.jpg'},
        {src:'assets/img/faux-leather/Cocoa-brown-faux-leather-017.jpg', label:'Cocoa Brown', filename:'Cocoa-brown-faux-leather-017.jpg'},
        {src:'assets/img/faux-leather/Steel-blue-faux-leather-014.jpg', label:'Steel Blue', filename:'Steel-blue-faux-leather-014.jpg'},
        {src:'assets/img/faux-leather/Navy-classic-faux-leather-010.jpg', label:'Navy Classic', filename:'Navy-classic-faux-leather-010.jpg'},
        {src:'assets/img/faux-leather/Slate-blue-faux-leather-023.jpg', label:'Slate Blue', filename:'Slate-blue-faux-leather-023.jpg'},
        {src:'assets/img/faux-leather/Ink-blue-faux-leather-024.jpg', label:'Ink Blue', filename:'Ink-blue-faux-leather-024.jpg'},
        {src:'assets/img/faux-leather/Forest-green-faux-leather-009.jpg', label:'Forest Green', filename:'Forest-green-faux-leather-009.jpg'},
        {src:'assets/img/faux-leather/Olive-green-faux-leather-026.jpg', label:'Olive Green', filename:'Olive-green-faux-leather-026.jpg'},
        {src:'assets/img/faux-leather/Chestnut-faux-leather-001.jpg', label:'Chestnut', filename:'Chestnut-faux-leather-001.jpg'},
        {src:'assets/img/faux-leather/Burgundy-faux-leather-015.jpg', label:'Burgundy', filename:'Burgundy-faux-leather-015.jpg'},
        {src:'assets/img/faux-leather/Plum-faux-leather-020.jpg', label:'Plum', filename:'Plum-faux-leather-020.jpg'},
        {src:'assets/img/faux-leather/Crimson-faux-leather-007.jpg', label:'Crimson', filename:'Crimson-faux-leather-007.jpg'},
        {src:'assets/img/faux-leather/Midnight-teal-faux-leather-002.jpg', label:'Midnight Teal', filename:'Midnight-teal-faux-leather-002.jpg'},
        {src:'assets/img/faux-leather/Deep-ocean-faux-leather-003.jpg', label:'Deep Ocean', filename:'Deep-ocean-faux-leather-003.jpg'},
        {src:'assets/img/faux-leather/Graphite-faux-leather-019.jpg', label:'Graphite', filename:'Graphite-faux-leather-019.jpg'},
        {src:'assets/img/faux-leather/Charcoal-faux-leather-008.jpg', label:'Charcoal', filename:'Charcoal-faux-leather-008.jpg'},
        {src:'assets/img/faux-leather/Jet-black-faux-leather-011.jpg', label:'Jet Black', filename:'Jet-black-faux-leather-011.jpg'}
      ]
    },
    'suede': {
      title: 'Suede',
      description: 'A softer, velvety material with warmth, richness, and a beautifully tactile presence.',
      files: [
        {src:'assets/img/suede/Snow-faux-suede-018.jpg', label:'Snow', filename:'Snow-faux-suede-018.jpg'},
        {src:'assets/img/suede/Platinum-grey-faux-suede-020.jpg', label:'Platinum Grey', filename:'Platinum-grey-faux-suede-020.jpg'},
        {src:'assets/img/suede/Sandstone-faux-suede-012.jpg', label:'Sandstone', filename:'Sandstone-faux-suede-012.jpg'},
        {src:'assets/img/suede/Desert-tan-faux-suede-002.jpg', label:'Desert Tan', filename:'Desert-tan-faux-suede-002.jpg'},
        {src:'assets/img/suede/Blush-rose-faux-suede-006.jpg', label:'Blush Rose', filename:'Blush-rose-faux-suede-006.jpg'},
        {src:'assets/img/suede/Dusty-rose-faux-suede-019.jpg', label:'Dusty Rose', filename:'Dusty-rose-faux-suede-019.jpg'},
        {src:'assets/img/suede/Mauve-faux-suede-017.jpg', label:'Mauve', filename:'Mauve-faux-suede-017.jpg'},
        {src:'assets/img/suede/Mist-blue-faux-suede-003.jpg', label:'Mist Blue', filename:'Mist-blue-faux-suede-003.jpg'},
        {src:'assets/img/suede/Sage-faux-suede-004.jpg', label:'Sage', filename:'Sage-faux-suede-004.jpg'},
        {src:'assets/img/suede/Amber-brown-faux-suede-010.jpg', label:'Amber Brown', filename:'Amber-brown-faux-suede-010.jpg'},
        {src:'assets/img/suede/Aqua-faux-suede-008.jpg', label:'Aqua', filename:'Aqua-faux-suede-008.jpg'},
        {src:'assets/img/suede/Baltic-blue-faux-suede-007.jpg', label:'Baltic Blue', filename:'Baltic-blue-faux-suede-007.jpg'},
        {src:'assets/img/suede/Indigo-faux-suede-015.jpg', label:'Indigo', filename:'Indigo-faux-suede-015.jpg'},
        {src:'assets/img/suede/Pine-faux-suede-013.jpg', label:'Pine', filename:'Pine-faux-suede-013.jpg'},
        {src:'assets/img/suede/Bordeaux-faux-suede-009.jpg', label:'Bordeaux', filename:'Bordeaux-faux-suede-009.jpg'},
        {src:'assets/img/suede/Fuchsia-faux-suede-014.jpg', label:'Fuchsia', filename:'Fuchsia-faux-suede-014.jpg'},
        {src:'assets/img/suede/Graphite-faux-suede-001.jpg', label:'Graphite', filename:'Graphite-faux-suede-001.jpg'},
        {src:'assets/img/suede/Carbon-faux-suede-011.jpg', label:'Carbon', filename:'Carbon-faux-suede-011.jpg'},
        {src:'assets/img/suede/Midnight-navy-faux-suede-016.jpg', label:'Midnight Navy', filename:'Midnight-navy-faux-suede-016.jpg'},
        {src:'assets/img/suede/Deep-forest-faux-suede-005.jpg', label:'Deep Forest', filename:'Deep-forest-faux-suede-005.jpg'}
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
  const modalPrev = document.getElementById('materialModalPrev');
  const modalNext = document.getElementById('materialModalNext');
  const chooseBtn = document.getElementById('materialChooseBtn');
  const previewStage = document.getElementById('materialPreviewStage');
  const previewBlock = document.getElementById('materialPreviewBlock');
  const previewName = document.getElementById('materialPreviewName');
  const previewText = document.getElementById('materialPreviewText');
  const previewBackgrounds = [
    'assets/img/preview-bg-1.jpg',
    'assets/img/preview-bg-2.jpg',
    'assets/img/preview-bg-3.jpg'
  ];
  let previewBgIndex = 0;
  let currentMaterial = 'linen';
  let currentMaterialFiles = [];
  let currentModalIndex = 0;

  function setPreview(item){
    if(!previewStage || !previewBlock || !previewName || !previewText || !item) return;
    previewStage.style.backgroundImage = `url(${previewBackgrounds[previewBgIndex]})`;
    previewBlock.style.backgroundImage = `url(${item.src})`;
    previewName.textContent = item.label;
    previewText.textContent = `${item.label} — ${materials[currentMaterial]?.title || 'Cover Material'}`;
  }

  function openModalByIndex(index){
    if(!currentMaterialFiles.length) return;
    currentModalIndex = (index + currentMaterialFiles.length) % currentMaterialFiles.length;
    const item = currentMaterialFiles[currentModalIndex];
    modalImg.src = item.src;
    modalImg.alt = item.label;
    modalLabel.textContent = item.label;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  }

  function renderMaterial(key){
    const data = materials[key] || materials['linen'];
    currentMaterial = key;
    currentMaterialFiles = data.files || [];
    titleEl.textContent = data.title;
    descEl.textContent = data.description;
    gridEl.innerHTML = currentMaterialFiles.map((item, index) => `
      <button class="swatch-button ${key === 'faux-leather' ? 'real-swatch' : ''}" type="button" data-index="${index}" data-src="${item.src}" data-label="${item.label}">
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
    if(currentMaterialFiles.length){
      setPreview(currentMaterialFiles[0]);
    }
  }

  function openModal(src,label){
    const idx = currentMaterialFiles.findIndex(item => item.src === src && item.label === label);
    openModalByIndex(idx >= 0 ? idx : 0);
  }

  function closeModal(){
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  }

  const params = new URLSearchParams(window.location.search);
  currentMaterial = params.get('material') || 'linen';
  previewBgIndex = Math.floor(Math.random() * previewBackgrounds.length);
  renderMaterial(currentMaterial);

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
    openModalByIndex(Number(btn.dataset.index || 0));
  });

  if(modalPrev){
    modalPrev.addEventListener('click', function(){ openModalByIndex(currentModalIndex - 1); });
  }
  if(modalNext){
    modalNext.addEventListener('click', function(){ openModalByIndex(currentModalIndex + 1); });
  }
  if(chooseBtn){
    chooseBtn.addEventListener('click', function(){
      const item = currentMaterialFiles[currentModalIndex];
      if(item){
        setPreview(item);
        closeModal();
      }
    });
  }

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