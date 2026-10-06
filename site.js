/* Proloco Centocelle — script del sito (versione 48).
   Menu sul telefono, sottomenu, slider con pausa, modulo eventi, consenso e Pixel di Meta.
   CFG lo scrive build.py: se pixel è vuoto non compare nessun banner e non si carica niente di Meta. */
(()=>{
const CFG={"pixel": "", "whatsapp": "393520997621"};
const en=document.documentElement.lang==='en';
const t=(it,eng)=>en?eng:it;

/* 1. Menu sul telefono */
const apri=document.querySelector('.apri-menu');
if(apri){apri.addEventListener('click',()=>{const aperto=document.body.classList.toggle('menu-aperto');apri.setAttribute('aria-expanded',String(aperto));});}

/* 2. Sottomenu: sul telefono si aprono con il pulsante, sul computer al passaggio del mouse */
const conFigli=[...document.querySelectorAll('.menu-item-has-children')];
const chiudi=item=>{const b=item.querySelector(':scope > .submenu-toggle'),l=item.querySelector(':scope > a');if(!b)return;item.classList.remove('submenu-open');b.setAttribute('aria-expanded','false');b.setAttribute('aria-label',t('Apri le voci di ','Open ')+l.textContent.trim());};
conFigli.forEach((item,i)=>{
  const link=item.querySelector(':scope > a'),sub=item.querySelector(':scope > .sub-menu');
  if(!link||!sub)return;
  const b=document.createElement('button');b.type='button';b.className='submenu-toggle';b.setAttribute('aria-expanded','false');b.setAttribute('aria-controls','submenu-'+(i+1));b.setAttribute('aria-label',t('Apri le voci di ','Open ')+link.textContent.trim());sub.id='submenu-'+(i+1);b.innerHTML='<span aria-hidden="true">⌄</span>';link.insertAdjacentElement('afterend',b);
  b.addEventListener('click',()=>{const open=!item.classList.contains('submenu-open');conFigli.forEach(o=>{if(o!==item)chiudi(o)});item.classList.toggle('submenu-open',open);b.setAttribute('aria-expanded',String(open));b.setAttribute('aria-label',(open?t('Chiudi le voci di ','Close '):t('Apri le voci di ','Open '))+link.textContent.trim());});
});
document.addEventListener('pointerdown',e=>{conFigli.forEach(item=>{if(item.classList.contains('submenu-open')&&!item.contains(e.target))chiudi(item)})});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){const o=conFigli.find(i=>i.classList.contains('submenu-open'));if(o){chiudi(o);o.querySelector(':scope > .submenu-toggle')?.focus()}}});

/* 3. Slider: scorre da solo ogni 6,5 secondi, si ferma con il pulsante, al passaggio del mouse
      e per chi ha chiesto al sistema di ridurre le animazioni */
const slider=document.querySelector('.home-slider');
if(slider){
  const slides=[...slider.querySelectorAll('.slides li')],dots=[...slider.querySelectorAll('.slide-dots button')],pausa=slider.querySelector('.slider-pausa');
  let at=0,timer=null,fermo=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const go=i=>{if(!slides.length)return;at=(i+slides.length)%slides.length;slides.forEach((s,n)=>s.classList.toggle('active',n===at));dots.forEach((d,n)=>d.setAttribute('aria-pressed',String(n===at)));};
  const avvia=()=>{if(fermo||timer||slides.length<2)return;timer=setInterval(()=>go(at+1),6500);};
  const ferma=()=>{clearInterval(timer);timer=null;};
  const segna=()=>{if(!pausa)return;pausa.setAttribute('aria-pressed',String(fermo));pausa.setAttribute('aria-label',fermo?t('Fai scorrere le immagini','Play the slideshow'):t('Ferma le immagini','Pause the slideshow'));pausa.textContent=fermo?'▶':'❚❚';};
  slider.querySelector('.slider-arrow.prev')?.addEventListener('click',()=>go(at-1));
  slider.querySelector('.slider-arrow.next')?.addEventListener('click',()=>go(at+1));
  dots.forEach((d,n)=>d.addEventListener('click',()=>go(n)));
  pausa?.addEventListener('click',()=>{fermo=!fermo;fermo?ferma():avvia();segna();});
  slider.addEventListener('mouseenter',ferma);slider.addEventListener('mouseleave',avvia);
  slider.addEventListener('focusin',ferma);slider.addEventListener('focusout',avvia);
  go(0);segna();avvia();
}

/* 4. Modulo eventi: prepara il messaggio WhatsApp, il sito non salva niente */
document.querySelector('.event-form')?.addEventListener('submit',ev=>{
  ev.preventDefault();const f=new FormData(ev.currentTarget);
  const msg=['Richiesta evento Proloco','Nome: '+(f.get('nome')||''),'Data: '+(f.get('data')||''),'Ospiti: '+(f.get('ospiti')||''),'Dettagli: '+(f.get('note')||'')].join('\n');
  window.location.href='https://wa.me/'+CFG.whatsapp+'?text='+encodeURIComponent(msg);
});

/* 5. Consenso e Pixel di Meta: niente si carica prima del «sì» */
if(CFG.pixel){
  const KEY='proloco-consenso';
  let scelta=null;try{scelta=JSON.parse(localStorage.getItem(KEY))}catch(e){}
  const caricaPixel=()=>{
    if(window.fbq)return;
    !function(f,b,e,v,n,s,x){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];s=b.createElement(e);s.async=!0;s.src=v;x=b.getElementsByTagName(e)[0];x.parentNode.insertBefore(s,x)}(window,document,'script','https://connect.facebook.net/it_IT/fbevents.js');
    window.fbq('init',CFG.pixel);window.fbq('track','PageView');
  };
  const salva=si=>{try{localStorage.setItem(KEY,JSON.stringify({marketing:si,data:new Date().toISOString()}))}catch(e){}};
  const banner=()=>{
    document.querySelector('.consenso')?.remove();
    const d=document.createElement('div');d.className='consenso';d.setAttribute('role','dialog');d.setAttribute('aria-label',t('Preferenze sui cookie','Cookie preferences'));
    const privacy=document.documentElement.dataset.privacy||'/privacy/';
    d.innerHTML='<p>'+t('Usiamo il Pixel di Meta per sapere quante persone arrivano dagli annunci e prenotano. Lo attiviamo solo se accetti. ','We use the Meta Pixel to measure how many people come from our ads and book. It only runs if you accept. ')+'<a href="'+privacy+'">'+t('Privacy e cookie','Privacy and cookies')+'</a></p><div class="bottoni"><button type="button" class="rifiuta">'+t('Rifiuta','Decline')+'</button><button type="button" class="accetta">'+t('Accetta','Accept')+'</button></div>';
    d.querySelector('.rifiuta').addEventListener('click',()=>{salva(false);d.remove();});
    d.querySelector('.accetta').addEventListener('click',()=>{salva(true);d.remove();caricaPixel();});
    document.body.appendChild(d);
  };
  if(scelta&&scelta.marketing)caricaPixel();else if(!scelta)banner();
  document.querySelectorAll('[data-preferenze-cookie]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();banner();}));
  document.addEventListener('click',e=>{
    const a=e.target.closest('a');if(!a||!window.fbq)return;const h=a.getAttribute('href')||'';
    if(h.startsWith('tel:')||h.includes('wa.me'))window.fbq('track','Contact');
    else if(h.includes('thefork'))window.fbq('track','Schedule');
  });
}
})();
