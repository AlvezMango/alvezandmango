const lightbox=document.querySelector('#lightbox');
const lightboxMedia=lightbox.querySelector('.lightbox-media');
document.querySelectorAll('[data-full]').forEach(button=>button.addEventListener('click',()=>{const img=document.createElement('img');img.src=button.dataset.full;img.alt=button.querySelector('img').alt;lightboxMedia.replaceChildren(img);lightbox.showModal()}));
document.querySelectorAll('dialog').forEach(dialog=>{dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}})});
