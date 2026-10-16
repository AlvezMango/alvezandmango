window.addEventListener('scroll', function(){
  const header = document.getElementById('siteHeader');
  if(window.scrollY > 40) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
});


(function(){
  const materialDisplay = document.getElementById('materialDisplay');
  if(!materialDisplay) return;

  const materials = {
  linen: {
    title: "Linen",
    description: "A relaxed woven texture with a soft, tactile finish and a timeless natural feel.",
    files: [
      {
        src: "assets/img/materials/linen/Deep-charcoal-linen-001.jpg",
        label: "Deep Charcoal 001"
      },
      {
        src: "assets/img/materials/linen/Harvest-wheat-linen-002.jpg",
        label: "Harvest Wheat 002"
      },
      {
        src: "assets/img/materials/linen/Natural-beige-linen-003.jpg",
        label: "Natural Beige 003"
      },
      {
        src: "assets/img/materials/linen/Stone-grey-linen-004.jpg",
        label: "Stone Grey 004"
      },
      {
        src: "assets/img/materials/linen/Dusty-rose-linen-005.jpg",
        label: "Dusty Rose 005"
      },
      {
        src: "assets/img/materials/linen/Desert-sand-linen-006.jpg",
        label: "Desert Sand 006"
      }
    ]
  },
  "premium-cloth": {
    title: "Premium Cloth",
    description: "A smooth, clean cloth finish with a light softness and understated character.",
    files: [
      {
        src: "assets/img/materials/premium-cloth/SAVANNA-5990-black.jpg",
        label: "SAVANNA Black"
      },
      {
        src: "assets/img/materials/premium-cloth/SAVANNA-5950-grey.jpg",
        label: "SAVANNA Grey"
      },
      {
        src: "assets/img/materials/premium-cloth/Burgundy-cloth-001.jpg",
        label: "Burgundy 001"
      },
      {
        src: "assets/img/materials/premium-cloth/Charcoal-cloth-002.jpg",
        label: "Charcoal 002"
      },
      {
        src: "assets/img/materials/premium-cloth/Mustard-cloth-003.jpg",
        label: "Mustard 003"
      },
      {
        src: "assets/img/materials/premium-cloth/Pine-cloth-004.jpg",
        label: "Pine 004"
      },
      {
        src: "assets/img/materials/premium-cloth/Berry-cloth-005.jpg",
        label: "Berry 005"
      },
      {
        src: "assets/img/materials/premium-cloth/Teal-cloth-006.jpg",
        label: "Teal 006"
      },
      {
        src: "assets/img/materials/premium-cloth/Midnight-blue-cloth-007.jpg",
        label: "Midnight Blue 007"
      },
      {
        src: "assets/img/materials/premium-cloth/Deep-black-cloth-008.jpg",
        label: "Deep Black 008"
      },
      {
        src: "assets/img/materials/premium-cloth/Carbon-black-cloth-009.jpg",
        label: "Carbon Black 009"
      },
      {
        src: "assets/img/materials/premium-cloth/Warm-grey-cloth-010.jpg",
        label: "Warm Grey 010"
      },
      {
        src: "assets/img/materials/premium-cloth/Latte-cloth-011.jpg",
        label: "Latte 011"
      },
      {
        src: "assets/img/materials/premium-cloth/Pure-white-cloth-012.jpg",
        label: "Pure White 012"
      },
      {
        src: "assets/img/materials/premium-cloth/Soft-ivory-cloth-013.jpg",
        label: "Soft Ivory 013"
      },
      {
        src: "assets/img/materials/premium-cloth/Camel-cloth-014.jpg",
        label: "Camel 014"
      },
      {
        src: "assets/img/materials/premium-cloth/Amber-cloth-015.jpg",
        label: "Amber 015"
      },
      {
        src: "assets/img/materials/premium-cloth/Nude-beige-cloth-016.jpg",
        label: "Nude Beige 016"
      },
      {
        src: "assets/img/materials/premium-cloth/Golden-sand-cloth-017.jpg",
        label: "Golden Sand 017"
      },
      {
        src: "assets/img/materials/premium-cloth/Desert-sand-cloth-018.jpg",
        label: "Desert Sand 018"
      },
      {
        src: "assets/img/materials/premium-cloth/Forest-green-fabric-019.jpg",
        label: "Forest Green 019"
      },
      {
        src: "assets/img/materials/premium-cloth/Lime-fabric-020.jpg",
        label: "Lime 020"
      },
      {
        src: "assets/img/materials/premium-cloth/Fresh-mint-fabric-021.jpg",
        label: "Fresh Mint 021"
      },
      {
        src: "assets/img/materials/premium-cloth/Chocolate-brown-fabric-022.jpg",
        label: "Chocolate Brown 022"
      },
      {
        src: "assets/img/materials/premium-cloth/Blossom-pink-fabric-023.jpg",
        label: "Blossom Pink 023"
      },
      {
        src: "assets/img/materials/premium-cloth/Grape-fabric-024.jpg",
        label: "Grape 024"
      },
      {
        src: "assets/img/materials/premium-cloth/Soft-lilac-fabric-025.jpg",
        label: "Soft Lilac 025"
      },
      {
        src: "assets/img/materials/premium-cloth/Aqua-fabric-026.jpg",
        label: "Aqua 026"
      },
      {
        src: "assets/img/materials/premium-cloth/Sky-blue-fabric-027.jpg",
        label: "Sky Blue 027"
      },
      {
        src: "assets/img/materials/premium-cloth/Silver-fabric-028.jpg",
        label: "Silver 028"
      }
    ]
  },
  "faux-leather": {
    title: "Faux Leather",
    description: "A refined leather-look surface with structure, depth, and a more formal finish.",
    files: [
      {
        src: "assets/img/materials/faux-leather/Chestnut-faux-leather-001.jpg",
        label: "Chestnut 001"
      },
      {
        src: "assets/img/materials/faux-leather/Midnight-teal-faux-leather-002.jpg",
        label: "Midnight Teal 002"
      },
      {
        src: "assets/img/materials/faux-leather/Deep-ocean-faux-leather-003.jpg",
        label: "Deep Ocean 003"
      },
      {
        src: "assets/img/materials/faux-leather/Warm-stone-faux-leather-004.jpg",
        label: "Warm Stone 004"
      },
      {
        src: "assets/img/materials/faux-leather/Saddle-tan-faux-leather-005.jpg",
        label: "Saddle Tan 005"
      },
      {
        src: "assets/img/materials/faux-leather/Ivory-faux-leather-006.jpg",
        label: "Ivory 006"
      },
      {
        src: "assets/img/materials/faux-leather/Crimson-faux-leather-007.jpg",
        label: "Crimson 007"
      },
      {
        src: "assets/img/materials/faux-leather/Charcoal-faux-leather-008.jpg",
        label: "Charcoal 008"
      },
      {
        src: "assets/img/materials/faux-leather/Forest-green-faux-leather-009.jpg",
        label: "Forest Green 009"
      },
      {
        src: "assets/img/materials/faux-leather/Navy-classic-faux-leather-010.jpg",
        label: "Navy Classic 010"
      },
      {
        src: "assets/img/materials/faux-leather/Jet-black-faux-leather-011.jpg",
        label: "Jet Black 011"
      },
      {
        src: "assets/img/materials/faux-leather/Powder-blue-faux-leather-012.jpg",
        label: "Powder Blue 012"
      },
      {
        src: "assets/img/materials/faux-leather/Coral-blush-faux-leather-013.jpg",
        label: "Coral Blush 013"
      },
      {
        src: "assets/img/materials/faux-leather/Steel-blue-faux-leather-014.jpg",
        label: "Steel Blue 014"
      },
      {
        src: "assets/img/materials/faux-leather/Burgundy-faux-leather-015.jpg",
        label: "Burgundy 015"
      },
      {
        src: "assets/img/materials/faux-leather/Champagne-faux-leather-016.jpg",
        label: "Champagne 016"
      },
      {
        src: "assets/img/materials/faux-leather/Cocoa-brown-faux-leather-017.jpg",
        label: "Cocoa Brown 017"
      },
      {
        src: "assets/img/materials/faux-leather/Ash-grey-faux-leather-018.jpg",
        label: "Ash Grey 018"
      },
      {
        src: "assets/img/materials/faux-leather/Graphite-faux-leather-019.jpg",
        label: "Graphite 019"
      },
      {
        src: "assets/img/materials/faux-leather/Plum-faux-leather-020.jpg",
        label: "Plum 020"
      },
      {
        src: "assets/img/materials/faux-leather/Pure-white-faux-leather-021.jpg",
        label: "Pure White 021"
      },
      {
        src: "assets/img/materials/faux-leather/Dark-mocha-faux-leather-022.jpg",
        label: "Dark Mocha 022"
      },
      {
        src: "assets/img/materials/faux-leather/Slate-blue-faux-leather-023.jpg",
        label: "Slate Blue 023"
      },
      {
        src: "assets/img/materials/faux-leather/Ink-blue-faux-leather-024.jpg",
        label: "Ink Blue 024"
      },
      {
        src: "assets/img/materials/faux-leather/Taupe-faux-leather-025.jpg",
        label: "Taupe 025"
      },
      {
        src: "assets/img/materials/faux-leather/Olive-green-faux-leather-026.jpg",
        label: "Olive Green 026"
      }
    ]
  },
  suede: {
    title: "Suede",
    description: "A softer, velvety material with warmth, richness, and a beautifully tactile presence.",
    files: [
      {
        src: "assets/img/materials/suede/Graphite-faux-suede-001.jpg",
        label: "Graphite 001"
      },
      {
        src: "assets/img/materials/suede/Desert-tan-faux-suede-002.jpg",
        label: "Desert Tan 002"
      },
      {
        src: "assets/img/materials/suede/Mist-blue-faux-suede-003.jpg",
        label: "Mist Blue 003"
      },
      {
        src: "assets/img/materials/suede/Sage-faux-suede-004.jpg",
        label: "Sage 004"
      },
      {
        src: "assets/img/materials/suede/Deep-forest-faux-suede-005.jpg",
        label: "Deep Forest 005"
      },
      {
        src: "assets/img/materials/suede/Blush-rose-faux-suede-006.jpg",
        label: "Blush Rose 006"
      },
      {
        src: "assets/img/materials/suede/Baltic-blue-faux-suede-007.jpg",
        label: "Baltic Blue 007"
      },
      {
        src: "assets/img/materials/suede/Aqua-faux-suede-008.jpg",
        label: "Aqua 008"
      },
      {
        src: "assets/img/materials/suede/Bordeaux-faux-suede-009.jpg",
        label: "Bordeaux 009"
      },
      {
        src: "assets/img/materials/suede/Amber-brown-faux-suede-010.jpg",
        label: "Amber Brown 010"
      },
      {
        src: "assets/img/materials/suede/Carbon-faux-suede-011.jpg",
        label: "Carbon 011"
      },
      {
        src: "assets/img/materials/suede/Sandstone-faux-suede-012.jpg",
        label: "Sandstone 012"
      },
      {
        src: "assets/img/materials/suede/Pine-faux-suede-013.jpg",
        label: "Pine 013"
      },
      {
        src: "assets/img/materials/suede/Fuchsia-faux-suede-014.jpg",
        label: "Fuchsia 014"
      },
      {
        src: "assets/img/materials/suede/Indigo-faux-suede-015.jpg",
        label: "Indigo 015"
      },
      {
        src: "assets/img/materials/suede/Midnight-navy-faux-suede-016.jpg",
        label: "Midnight Navy 016"
      },
      {
        src: "assets/img/materials/suede/Mauve-faux-suede-017.jpg",
        label: "Mauve 017"
      },
      {
        src: "assets/img/materials/suede/Snow-faux-suede-018.jpg",
        label: "Snow 018"
      },
      {
        src: "assets/img/materials/suede/Dusty-rose-faux-suede-019.jpg",
        label: "Dusty Rose 019"
      },
      {
        src: "assets/img/materials/suede/Platinum-grey-faux-suede-020.jpg",
        label: "Platinum Grey 020"
      }
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