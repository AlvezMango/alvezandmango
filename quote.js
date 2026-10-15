(function(){
  'use strict';
  const model=window.AlbumQuote;
  const dialog=document.getElementById('quote-dialog');
  const form=document.getElementById('quote-form');
  const fields=form.elements;
  const steps=[...form.querySelectorAll('.quote-step')];
  const stepButtons=[...dialog.querySelectorAll('[data-step-target]')];
  const materials=window.ALBUM_MATERIALS||{};
  let currentStep=0;
  function data(){return model.normalise(Object.fromEntries(new FormData(form)));}
  function setGroup(id,visible){const group=document.getElementById(id);group.hidden=!visible;group.querySelectorAll('input,select,textarea').forEach(el=>el.disabled=!visible);}
  function refreshSmallSizes(){
    const previous=fields.smallSize.value;
    const sizes=model.matchingSizes(fields.mainSize.value);
    fields.smallSize.replaceChildren();
    for(const size of sizes)fields.smallSize.add(new Option(size.replace('×',' × ')+' cm',size));
    fields.smallSize.add(new Option('Custom size','custom'));
    fields.smallSize.add(new Option('Help me choose','unsure'));
    fields.smallSize.value=[...sizes,'custom','unsure'].includes(previous)?previous:model.defaultSmallSize(fields.mainSize.value);
  }
  function customField(name,wrap,enabled){const show=enabled&&fields[name.replace('Custom','Size')].value==='custom';document.getElementById(wrap).hidden=!show;fields[name].disabled=!show;fields[name].required=show;}
  function updateFields(){
    const magazine=fields.product.value==='Wedding magazine';
    setGroup('album-size-fields',!magazine);
    setGroup('magazine-fields',magazine);
    setGroup('album-cover-fields',!magazine);
    document.getElementById('main-quantity-label').textContent=magazine?'Number of magazines':'Number of main albums';
    const small=!magazine&&fields.includeSmall.checked;
    const smallGroup=document.getElementById('small-albums');smallGroup.hidden=!small;smallGroup.disabled=!small;
    smallGroup.querySelectorAll('input,select').forEach(el=>el.disabled=!small);
    customField('mainCustom','main-custom-wrap',!magazine);
    customField('smallCustom','small-custom-wrap',small);
    setGroup('studio-wrap',fields.photographer.checked);
    setGroup('box-details',fields.includeBox.checked);
    document.getElementById('main-pages').textContent=model.spreadLabel(fields.spreads.value)+'.';
    const smallSpread=fields.smallSpreads.value==='same'?fields.spreads.value:fields.smallSpreads.value;
    document.getElementById('small-pages').textContent=model.spreadLabel(smallSpread)+'.'+(fields.smallSpreads.value==='same'?' Matches the main album.':'');
    document.getElementById('colour-picker').hidden=magazine||!fields.material.value;
    renderSummary();
  }
  function renderSummary(){
    const wrap=document.getElementById('quote-summary-lines');wrap.replaceChildren();
    for(const row of model.summary(data())){
      const item=document.createElement('div');item.className='summary-row';
      const label=document.createElement('p');label.className='summary-label';label.textContent=row.label;
      const value=document.createElement('p');value.className='summary-value';value.textContent=row.value;
      const detail=document.createElement('p');detail.className='summary-detail';detail.textContent=row.detail;
      item.append(label,value);if(row.detail)item.append(detail);wrap.append(item);
    }
  }
  function renderSwatches(){
    const wrap=document.getElementById('quote-swatches');wrap.replaceChildren();
    const swatches=materials[fields.material.value]||[];
    for(const swatch of swatches){
      const button=document.createElement('button');button.type='button';button.className='quote-swatch';button.dataset.colour=swatch.name;button.setAttribute('aria-pressed',String(swatch.name===fields.colour.value));
      const img=document.createElement('img');img.src=swatch.image;img.alt='';img.loading='lazy';img.width=100;img.height=80;
      const label=document.createElement('span');label.textContent=swatch.name;button.append(img,label);
      button.addEventListener('click',()=>{fields.colour.value=swatch.name;wrap.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));document.getElementById('selected-colour').textContent=swatch.name+' selected.';renderSummary();});
      wrap.append(button);
    }
    document.getElementById('selected-colour').textContent=fields.colour.value?fields.colour.value+' selected.':'Colour to be decided.';
    document.getElementById('colour-picker').hidden=!fields.material.value||fields.product.value==='Wedding magazine';
  }
  function showStep(index,focus=true){
    currentStep=Math.max(0,Math.min(2,index));
    steps.forEach((step,i)=>step.hidden=i!==currentStep);
    stepButtons.forEach((button,i)=>{if(i===currentStep)button.setAttribute('aria-current','step');else button.removeAttribute('aria-current');button.classList.toggle('completed',i<currentStep);});
    dialog.scrollTop=0;
    if(focus&&dialog.open)steps[currentStep].querySelector('h3').focus({preventScroll:true});
  }
  function validateStep(index){
    const inputs=[...steps[index].querySelectorAll('input,select,textarea')];
    const invalid=inputs.find(el=>!el.disabled&&!el.checkValidity());
    if(invalid){showStep(index,false);invalid.reportValidity();invalid.focus();return false;}return true;
  }
  document.querySelectorAll('[data-quote]').forEach(button=>button.addEventListener('click',()=>{
    if(typeof closeMenu==='function')closeMenu();
    const context=button.dataset.quote;
    if(context==='set'){fields.product.value='Wedding album';fields.includeSmall.checked=true;}
    else if(context==='box'){fields.product.value='Wedding album';fields.includeBox.checked=true;}
    else if(context==='magazine')fields.product.value='Wedding magazine';
    else if(context==='wedding'||context==='covers')fields.product.value='Wedding album';
    if(context==='photographer')fields.photographer.checked=true;
    refreshSmallSizes();updateFields();renderSwatches();
    document.getElementById('quote-send-status').hidden=true;
    if(!dialog.open)dialog.showModal();showStep(0);
  }));
  form.querySelectorAll('[data-next]').forEach(button=>button.addEventListener('click',()=>{if(validateStep(currentStep))showStep(currentStep+1);}));
  form.querySelectorAll('[data-back]').forEach(button=>button.addEventListener('click',()=>showStep(currentStep-1)));
  stepButtons.forEach(button=>button.addEventListener('click',()=>{const next=Number(button.dataset.stepTarget);if(next<=currentStep||validateStep(0))showStep(next);}));
  form.addEventListener('change',event=>{
    if(event.target===fields.mainSize)refreshSmallSizes();
    if(event.target===fields.material){fields.colour.value='';renderSwatches();}
    updateFields();document.getElementById('quote-send-status').hidden=true;
  });
  form.addEventListener('input',renderSummary);
  document.getElementById('clear-colour').addEventListener('click',()=>{fields.colour.value='';renderSwatches();renderSummary();});
  document.getElementById('copy-quote').addEventListener('click',async()=>{
    const status=document.getElementById('copy-status');
    try{await navigator.clipboard.writeText(model.message(data()));status.textContent='Enquiry details copied.';}
    catch{status.textContent='Copy the enquiry below.';const textarea=document.createElement('textarea');textarea.readOnly=true;textarea.value=model.message(data());status.append(textarea);textarea.focus();textarea.select();}
  });
  form.addEventListener('submit',event=>{
    event.preventDefault();
    if(currentStep<2){if(validateStep(currentStep))showStep(currentStep+1);return;}
    for(let i=0;i<3;i++)if(!validateStep(i))return;
    const request=model.links(data());
    const email=event.submitter&&event.submitter.value==='email';
    const status=document.getElementById('quote-send-status');status.replaceChildren();status.hidden=false;
    const note=document.createElement('p');note.textContent=email?'Your email app should open with the complete request. Please review it and send it there.':'WhatsApp should open with the complete request. Please review it and send it there.';
    const link=document.createElement('a');link.href=email?request.email:request.whatsapp;link.textContent=email?'Open the email request again ↗':'Open the WhatsApp request again ↗';
    if(!email){link.target='_blank';link.rel='noopener noreferrer';}
    status.append(note,link);
    if(email)window.location.href=request.email;else window.open(request.whatsapp,'_blank','noopener,noreferrer');
  });
  refreshSmallSizes();updateFields();renderSwatches();showStep(0,false);
})();
