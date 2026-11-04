'use strict';
(() => {
  const $ = (s,root=document) => root.querySelector(s);
  const $$ = (s,root=document) => [...root.querySelectorAll(s)];
  const photos = window.JAY_PHOTOS || {};
  const menu = $('.menu-toggle');
  const nav = $('.nav');
  menu?.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    nav.classList.toggle('is-open',open);
  });
  document.addEventListener('keydown', e => {
    if(e.key==='Escape' && menu?.getAttribute('aria-expanded')==='true') {
      menu.click(); menu.focus();
    }
  });
  $$('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

  let favorites = new Set();
  try { const stored = JSON.parse(localStorage.getItem('inside-jay-favourites') || '[]'); if(Array.isArray(stored)) favorites=new Set(stored.filter(id=>photos[id])); } catch {}
  let toastTimer;
  function toast(message) {
    const el=$('.toast'); el.textContent=message;el.hidden=false;
    clearTimeout(toastTimer);toastTimer=setTimeout(()=>{el.hidden=true;},2500);
  }
  function syncFavorites(){
    $$('[data-favorite]').forEach(button=>{
      const id=button.dataset.favorite, saved=favorites.has(id);
      button.setAttribute('aria-pressed',String(saved));
      button.setAttribute('aria-label',`${saved?'Remove':'Save'} ${photos[id].title} ${saved?'from':'to'} favourites`);
    });
  }
  function toggleFavorite(id){
    if(favorites.has(id)) favorites.delete(id);else favorites.add(id);
    let stored=true;
    try{localStorage.setItem('inside-jay-favourites',JSON.stringify([...favorites]));}catch{stored=false;}
    syncFavorites();
    toast(stored ? (favorites.has(id)?'Saved to your favourites':'Removed from favourites') : 'Favourite updated for this visit; browser storage is unavailable.');
    applyAlbumFilter();
    if(dialog?.open) updateLightboxFavorite();
  }
  $$('[data-favorite]').forEach(b=>b.addEventListener('click',()=>toggleFavorite(b.dataset.favorite)));
  syncFavorites();

  function bindTabs(buttons,activate,vertical=false){
    buttons.forEach((button,index)=>{
      button.addEventListener('click',()=>{
        buttons.forEach(b=>{b.setAttribute('aria-selected',String(b===button));b.tabIndex=b===button?0:-1;});
        activate(button);
      });
      button.addEventListener('keydown',event=>{
        let next=index;
        if(event.key===(vertical?'ArrowDown':'ArrowRight'))next=(index+1)%buttons.length;
        else if(event.key===(vertical?'ArrowUp':'ArrowLeft'))next=(index-1+buttons.length)%buttons.length;
        else if(event.key==='Home')next=0;
        else if(event.key==='End')next=buttons.length-1;
        else return;
        event.preventDefault();buttons[next].focus();buttons[next].click();
      });
    });
  }
  const thoughts={
    brain:{title:'What if we could make this better?',copy:'That question connects my work in AI, my research, and the things I teach.',chips:['Artificial intelligence','Research','Innovation'],href:'brain.html',label:'Follow the curiosity'},
    heart:{title:'There’s always room for the people I love.',copy:'Family, close friends, and six dogs keep my world full — wherever work or adventure takes me.',chips:['Family & friends','Six dogs','Giving back'],href:'heart.html',label:'Meet the people and paws'}
  };
  bindTabs($$('[data-thought]'),button=>{
    const t=thoughts[button.dataset.thought],panel=$('#thought-panel');
    panel.setAttribute('aria-labelledby',button.id);
    $('.thought-title',panel).textContent=t.title;
    $('.thought-copy',panel).textContent=t.copy;
    $('.thought-chips',panel).replaceChildren(...t.chips.map(label=>{const span=document.createElement('span');span.className='chip';span.textContent=label;return span;}));
    const link=$('.thought-link',panel);link.href=t.href;link.childNodes[0].textContent=t.label+' ';
  });
  const careers={
    chevron:{date:'2024 – Present',title:'Data Scientist',company:'Chevron Holdings Inc. · Manila Shared Service Center',points:['Lead enterprise AI delivery across teams in San Ramon, Manila, and Buenos Aires.','Guide OCR, computer vision, signal processing, and machine learning work as an AI subject matter expert.','Connect research, code review, testing, and production implementation.'],history:['2023 – 2024: Digital Scholar','2020 – 2023: Software Engineer']},
    oracle:{date:'May 2019 – November 2019',title:'Senior Applications’ Engineer',company:'Oracle NetSuite Philippines Corporation',points:['Developed solutions for sales and marketing processes, including a multi-subsidiary implementation.','Collaborated with business analysts, business owners, and quality analysts on requirements, delivery, and testing.','Delivered the project before its deadline; received an “Exceeds Expectations” NetSuite training rating.'],history:['SuiteScript · JavaScript · Perforce · Jira · Confluence']},
    anz:{date:'January 2017 – May 2019',title:'Lead Solutions Engineer',company:'Australia and New Zealand (ANZ) Bank Global Services and Operations',points:['Led development of automation solutions for Collections and Fraud teams.','Personally developed payment-processing automation from requirements through implementation.','Introduced development standards, testing procedures, and Agile practices; collaborated with an ML team on a propensity tool.'],history:['C# · SharePoint · VBA · AS400 · Python']},
    avaloq:{date:'July 2014 – January 2017',title:'Software Engineer',company:'Avaloq Philippines Regional Operating Headquarters',points:['Built and maintained solutions for core banking components and legal reporting.','Led regression and acceptance test campaigns and implemented the revamped Country module processes.','Trained and mentored over 20 developers; received the Avaloq Asia-Pacific Star Award in May 2016.'],history:['Avaloq Script · PL/SQL · Avaloq ICE · Jira · Confluence']}
  };
  bindTabs($$('[data-career]'),button=>{
    const c=careers[button.dataset.career],panel=$('#career-panel');
    panel.setAttribute('aria-labelledby',button.id);
    panel.innerHTML=`<div class="eyebrow">${c.date}</div><h3>${c.title}</h3><p class="muted">${c.company}</p><ul>${c.points.map(p=>`<li>${p}</li>`).join('')}</ul><div class="role-history">${c.history.join('<br>')}</div>`;
  },true);

  const facts=[
    'I have six dogs: five Aspins from one family, and one Corgi.',
    'I’ve travelled to several countries — sometimes on my own.',
    'A trip involving water usually gets my vote.',
    'Some of my travels begin with a conference or a university invitation.',
    'Someone dubbed me “From Riles to Riches.” I’m not rich… yet.',
    'I have a handful of friends from different walks of my life.',
    'My adventurous side comes with a few minor-accident stories.'
  ];
  let factIndex=0;
  $('#next-fact')?.addEventListener('click',()=>{factIndex=(factIndex+1)%facts.length;$('#fun-fact').textContent=facts[factIndex];});

  let albumFilter='All photos';
  function applyAlbumFilter(){
    const cards=$$('.gallery-grid .photo-card');if(!cards.length)return;
    let count=0;
    cards.forEach(card=>{
      const show=albumFilter==='All photos'||(albumFilter==='Favourites'?favorites.has(card.dataset.photoId):card.dataset.category===albumFilter);
      card.hidden=!show;if(show)count++;
    });
    $('#album-count').textContent=`${count} ${count===1?'photo':'photos'}`;
    $('.empty-state').hidden=count>0;
  }
  $$('[data-filter-group]').forEach(group=>{
    const buttons=$$('.filter-btn',group);
    buttons.forEach(button=>button.addEventListener('click',()=>{
      const value=button.dataset.filter;
      buttons.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
      if(group.dataset.filterGroup==='album') {albumFilter=value;applyAlbumFilter();}
      if(group.dataset.filterGroup==='research') $$('.research-item').forEach(item=>item.hidden=value!=='all'&&item.dataset.research!==value);
      if(group.dataset.filterGroup==='travel'){
        let count=0;$$('.travel-grid .photo-card').forEach(card=>{const show=value==='all'||card.dataset.travelTag===value;card.hidden=!show;if(show)count++;});
        $('#travel-count').textContent=`${count} ${count===1?'travel memory':'travel memories'}`;
      }
    }));
  });

  const dialog=$('.lightbox');
  let lightboxIds=[],lightboxIndex=0,opener=null;
  function updateLightboxFavorite(){
    const saved=favorites.has(lightboxIds[lightboxIndex]);
    $('.lightbox-save').setAttribute('aria-pressed',String(saved));
    $('.lightbox-save span').textContent=saved?'Saved to favourites':'Save to favourites';
  }
  function showPhoto(index){
    lightboxIndex=(index+lightboxIds.length)%lightboxIds.length;
    const id=lightboxIds[lightboxIndex],p=photos[id];
    const image=$('.lightbox-image');image.src=p.src;image.alt=p.alt||p.title;
    $('.lightbox-counter').textContent=`${String(lightboxIndex+1).padStart(2,'0')} / ${String(lightboxIds.length).padStart(2,'0')} · ${p.category}`;
    $('.lightbox-caption h3').textContent=p.title;
    $('.lightbox-caption p').textContent=p.description;
    $('.prev').disabled=lightboxIds.length<2;$('.next').disabled=lightboxIds.length<2;
    updateLightboxFavorite();
  }
  $$('[data-photo]').forEach(link=>link.addEventListener('click',event=>{
    if(!dialog?.showModal)return;
    event.preventDefault();opener=link;
    const gallery=link.closest('.gallery-grid,.travel-grid,.friends-grid,.dog-photos,.service-grid,.photo-strip')||$('main');
    lightboxIds=[...new Set($$('[data-photo]',gallery).filter(el=>!el.closest('[hidden]')).map(el=>el.dataset.photo))];
    showPhoto(lightboxIds.indexOf(link.dataset.photo));
    document.body.classList.add('modal-open');dialog.showModal();$('.lightbox-close').focus();
  }));
  $('.lightbox-close')?.addEventListener('click',()=>dialog.close());
  $('.prev')?.addEventListener('click',()=>showPhoto(lightboxIndex-1));
  $('.next')?.addEventListener('click',()=>showPhoto(lightboxIndex+1));
  $('.lightbox-save')?.addEventListener('click',()=>toggleFavorite(lightboxIds[lightboxIndex]));
  dialog?.addEventListener('click',event=>{if(event.target===dialog||event.target.classList.contains('lightbox-stage'))dialog.close();});
  dialog?.addEventListener('keydown',event=>{
    if(event.key==='ArrowRight'){event.preventDefault();showPhoto(lightboxIndex+1);}
    if(event.key==='ArrowLeft'){event.preventDefault();showPhoto(lightboxIndex-1);}
  });
  dialog?.addEventListener('close',()=>{
    document.body.classList.remove('modal-open');
    if(opener&&!opener.closest('[hidden]'))opener.focus();
    else $('.filter-btn[aria-pressed="true"]')?.focus();
  });
  window.addEventListener('storage',event=>{
    if(event.key!=='inside-jay-favourites')return;
    try{favorites=new Set(JSON.parse(event.newValue||'[]').filter(id=>photos[id]));}catch{favorites=new Set();}
    syncFavorites();applyAlbumFilter();if(dialog.open)updateLightboxFavorite();
  });
})();
