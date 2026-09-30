'use strict';
// Insert session-specific quiz URLs here when supplied by the teacher.
const WAYGROUND = {s6s1:'',s6s2:'',s6s3:'',s6s4:'',s6s5:''};
for (const button of document.querySelectorAll('[data-wayground]')) {
  const url=WAYGROUND[button.dataset.wayground];
  if(url){const a=document.createElement('a');a.className='btn';a.href=url;a.target='_blank';a.rel='noopener';a.textContent='🎮 À toi de jouer ! · Wayground';button.replaceWith(a);}
}
for (const container of document.querySelectorAll('[data-cards]')) {
  for (const [front,back] of JSON.parse(container.dataset.cards)) {
    const card=document.createElement('button');card.type='button';card.className='flip';card.setAttribute('aria-pressed','false');
    const inner=document.createElement('span');inner.className='flip-inner';
    const f=document.createElement('span');f.className='face front';f.textContent=front;
    const b=document.createElement('span');b.className='face back';b.textContent=back;b.setAttribute('aria-hidden','true');
    inner.append(f,b);card.append(inner);card.setAttribute('aria-label',front+' — afficher la réponse');
    card.addEventListener('click',()=>{const open=card.classList.toggle('open');card.setAttribute('aria-pressed',String(open));f.setAttribute('aria-hidden',String(open));b.setAttribute('aria-hidden',String(!open));card.setAttribute('aria-label',open?back+' — revoir la question':front+' — afficher la réponse');});container.append(card);
  }
}
for (const container of document.querySelectorAll('[data-quiz]')) {
  const data=JSON.parse(container.dataset.quiz);const score=document.createElement('p');score.className='score';score.setAttribute('aria-live','polite');
  let attempts=0,correct=0;const update=()=>{score.textContent=`Score : ${correct} / ${data.length} · ${attempts} réponse${attempts>1?'s':''} donnée${attempts>1?'s':''}`;};
  const render=()=>{container.replaceChildren(score);attempts=0;correct=0;update();data.forEach(([prompt,options,answer,explanation],i)=>{
    const field=document.createElement('fieldset');const legend=document.createElement('legend');legend.textContent=`${i+1}. ${prompt}`;const choices=document.createElement('div');choices.className='choices';
    const feedback=document.createElement('p');feedback.className='feedback';feedback.setAttribute('aria-live','polite');
    options.forEach((option,j)=>{const btn=document.createElement('button');btn.type='button';btn.className='choice';btn.textContent=option;btn.addEventListener('click',()=>{attempts++;const ok=j===answer;if(ok)correct++;for(const [k,b] of [...choices.children].entries()){b.disabled=true;if(k===answer)b.classList.add('good');}if(!ok)btn.classList.add('bad');feedback.textContent=(ok?'✓ Bonne réponse. ':'✗ Réponse attendue : '+options[answer]+'. ')+explanation;feedback.classList.add(ok?'good':'bad');update();});choices.append(btn);});field.append(legend,choices,feedback);container.append(field);
  });const reset=document.createElement('button');reset.type='button';reset.className='reset';reset.textContent='↻ Recommencer le quiz';reset.addEventListener('click',render);container.append(reset);};render();
}
const normalize=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[.!?]/g,'').trim().replace(/\s+/g,' ');
for(const [group,container] of [...document.querySelectorAll('[data-practice]')].entries()){
  JSON.parse(container.dataset.practice).forEach(([prompt,answers,explanation],i)=>{
    const row=document.createElement('div');row.className='practice-row';const label=document.createElement('label');const id=`practice-${group}-${i}`;label.htmlFor=id;label.textContent=prompt;
    const input=document.createElement('input');input.id=id;input.type='text';input.autocomplete='off';input.spellcheck=false;
    const check=document.createElement('button');check.type='button';check.className='check';check.textContent='Vérifier';const feedback=document.createElement('p');feedback.className='feedback';feedback.id=id+'-feedback';feedback.setAttribute('aria-live','polite');input.setAttribute('aria-describedby',feedback.id);
    const verify=()=>{if(!input.value.trim()){feedback.textContent='Écris une réponse avant de vérifier.';return;}const good=answers.some(a=>normalize(a)===normalize(input.value));feedback.textContent=good?'✓ Exact ! '+explanation:'✗ Réponse attendue : '+answers[0]+'. '+explanation;feedback.className='feedback '+(good?'good':'bad');};check.addEventListener('click',verify);input.addEventListener('keydown',e=>{if(e.key==='Enter')verify();});row.append(label,input,check,feedback);container.append(row);
  });
}
const boxes=[...document.querySelectorAll('[data-done]')];
let saved={};try{saved=JSON.parse(localStorage.getItem('latin-s6-progress')||'{}');if(!saved||typeof saved!=='object')saved={};}catch{}
const progress=()=>{const count=boxes.filter(b=>b.checked).length;document.getElementById('progressText').textContent=`${count} séance${count>1?'s':''} sur 5`;document.getElementById('progressFill').style.width=(count*20)+'%';document.querySelector('[role=progressbar]').setAttribute('aria-valuenow',count);};
boxes.forEach(box=>{box.checked=Boolean(saved[box.dataset.done]);box.addEventListener('change',()=>{saved[box.dataset.done]=box.checked;try{localStorage.setItem('latin-s6-progress',JSON.stringify(saved));}catch{}progress();});});progress();
