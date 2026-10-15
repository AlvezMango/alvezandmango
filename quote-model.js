(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.AlbumQuote=api;})(typeof window!=='undefined'?window:globalThis,function(){
  'use strict';
  const SIZES=['30×30','40×30','35×25','30×20','20×20','20×15'];
  const DEFAULTS={'30×30':'20×20','40×30':'20×15','35×25':'30×20','30×20':'30×20','20×20':'20×20','20×15':'20×15'};
  const text=value=>String(value??'').trim();
  const count=value=>Math.max(1,Math.trunc(Number(value)||1));
  function matchingSizes(size){
    if(!SIZES.includes(size))return SIZES.slice();
    const [w,h]=size.split('×').map(Number);
    return SIZES.filter(s=>{const [a,b]=s.split('×').map(Number);return (w===h)===(a===b)&&a<=w&&b<=h;});
  }
  function defaultSmallSize(size){return DEFAULTS[size]||'20×20';}
  function sizeLabel(size,custom){return size==='custom'?(text(custom)||'Custom size — please advise'):SIZES.includes(size)?size.replace('×',' × ')+' cm':'Size to be advised';}
  function spreadLabel(value){const n=Number(value);return Number.isInteger(n)&&n>0?`${n} spreads / ${n*2} pages`:'Spreads to be advised';}
  function normalise(raw){
    const product=['Wedding album','Baptism album','Wedding magazine','Other album'].includes(raw.product)?raw.product:'Wedding album';
    const magazine=product==='Wedding magazine';
    const mainSpreads=/^\d+$/.test(text(raw.spreads))?Number(raw.spreads):null;
    const includeSmall=!magazine&&raw.includeSmall==='yes';
    const smallerSpreads=raw.smallSpreads==='same'?mainSpreads:/^\d+$/.test(text(raw.smallSpreads))?Number(raw.smallSpreads):null;
    const finishes=[];
    if(!magazine){if(raw.uvPrint==='yes')finishes.push('UV print on cover');if(raw.pictureWindow==='yes')finishes.push('Picture window');if(raw.foil==='yes')finishes.push('Foil lettering');}
    return {product,magazine,main:{quantity:count(raw.mainQuantity),size:magazine?(text(raw.magazineSize)||'Size to be advised'):sizeLabel(raw.mainSize,raw.mainCustom),spreads:mainSpreads,pages:magazine?text(raw.magazinePages):null},small:includeSmall?{quantity:count(raw.smallQuantity),size:sizeLabel(raw.smallSize,raw.smallCustom),spreads:smallerSpreads}:null,box:raw.includeBox==='yes'?{quantity:count(raw.boxQuantity),finish:text(raw.boxFinish)||'Help me choose',forAlbums:text(raw.boxFor)}:null,cover:{material:magazine?'':text(raw.material),colour:magazine?'':text(raw.colour),finishes,wording:text(raw.wording)},contact:{name:text(raw.name),email:text(raw.email),phone:text(raw.phone),photographer:raw.photographer==='yes',studio:raw.photographer==='yes'?text(raw.studio):'',destination:text(raw.destination),neededBy:text(raw.neededBy)},notes:text(raw.notes)};
  }
  function summary(data){
    const mainDetails=data.magazine?(data.main.pages?`${data.main.pages} pages`:'Page count to be advised'):spreadLabel(data.main.spreads);
    const lines=[{label:data.magazine?'Magazines':'Main albums',value:`${data.main.quantity} × ${data.main.size}`,detail:mainDetails}];
    if(data.small)lines.push({label:'Smaller / matching albums',value:`${data.small.quantity} × ${data.small.size}`,detail:spreadLabel(data.small.spreads)});
    if(data.box)lines.push({label:'Presentation boxes',value:`${data.box.quantity} × ${data.box.finish}`,detail:data.box.forAlbums?`For: ${data.box.forAlbums}`:'Album sizes to be confirmed'});
    if(!data.magazine)lines.push({label:'Cover',value:data.cover.material||'Help me choose',detail:data.cover.colour||'Colour to be advised'});
    if(data.cover.finishes.length)lines.push({label:'Personalisation',value:data.cover.finishes.join(', '),detail:''});
    return lines;
  }
  function message(data){
    const lines=['QUOTE REQUEST — ALVEZ & MANGO','',`Product: ${data.product}`];
    for(const row of summary(data))lines.push(`${row.label}: ${row.value}`,row.detail);
    lines.push('Quantities shown are totals for this enquiry.');
    if(data.cover.wording)lines.push(`Cover / spine wording: ${data.cover.wording}`);
    lines.push('',`Name: ${data.contact.name}`,`Email: ${data.contact.email}`);
    if(data.contact.phone)lines.push(`Phone: ${data.contact.phone}`);
    if(data.contact.photographer)lines.push('I am a photographer.');
    if(data.contact.studio)lines.push(`Studio: ${data.contact.studio}`);
    if(data.contact.destination)lines.push(`Delivery country / town: ${data.contact.destination}`);
    if(data.contact.neededBy)lines.push(`Requested date: ${data.contact.neededBy}`);
    if(data.notes)lines.push('',`Notes: ${data.notes}`);
    lines.push('','Please confirm the specification, price and timing.');
    return lines.filter((l,i,a)=>l!==''||a[i-1]!=='').join('\n');
  }
  function links(data){const body=message(data);return {whatsapp:'https://wa.me/35799890811?text='+encodeURIComponent(body),email:'mailto:hello@alvezandmango.com?subject='+encodeURIComponent(`Album quote — ${data.contact.name||data.product}`)+'&body='+encodeURIComponent(body)};}
  return {SIZES,matchingSizes,defaultSmallSize,sizeLabel,spreadLabel,normalise,summary,message,links};
});
