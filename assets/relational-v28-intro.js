'use strict';
(()=>{
const report={intro:false,start:false,returnToIntro:false,createdBegin:false,cleanedPairLabels:0,hiddenVowDuplicates:0,errors:[]};
function assert(ok,message){if(!ok)throw new Error(message)}
function visible(el){if(!el)return false;const s=getComputedStyle(el),r=el.getBoundingClientRect();return s.display!=='none'&&s.visibility!=='hidden'&&r.width>0&&r.height>0}
function text(el){return String(el&&el.textContent||'').replace(/\s+/g,' ').trim()}
function installStyle(){
  const style=document.createElement('style');
  style.id='v28-intro-style';
  style.textContent=`
  body.v28-idle #rule-banner{display:flex!important;align-items:center;justify-content:space-between;min-height:24px;padding:0 2px!important;background:transparent!important;border:0!important;box-shadow:none!important;color:#5b3fd6!important;font-size:.69rem!important;font-weight:900!important;letter-spacing:1.8px!important}
  body.v28-idle #task-zone{display:flex!important;align-items:flex-start!important;justify-content:center!important;min-height:250px!important;padding:28px 18px 10px!important;background:transparent!important;border:0!important;box-shadow:none!important;overflow:visible!important}
  body.v28-idle #answer-zone{display:none!important}
  body.v28-idle #feedback,body.v28-idle #explain{display:none!important}
  .v28-intro-copy{max-width:880px;margin:0 auto;text-align:center;color:#565071;font-size:clamp(.9rem,.76rem + .36vw,1.12rem);font-weight:700;line-height:1.62}
  .v28-intro-copy strong{color:#9a6b0a;font-weight:900}
  .v28-intro-copy .v28-lead{display:block;margin-bottom:10px;color:#3f3861;font-size:1.05em}
  body.v28-idle #begin-btn{display:flex!important;width:100%!important;min-height:52px!important;align-items:center!important;justify-content:center!important;font-weight:900!important;letter-spacing:1.4px!important}
  #begin-btn.v28-created-begin{border:0;border-radius:12px;background:linear-gradient(90deg,#5b35df,#6737d8);color:#fff;padding:13px 18px;cursor:pointer;font:inherit;box-shadow:0 8px 18px rgba(91,53,223,.2)}
  #begin-btn.v28-created-begin:hover{filter:brightness(1.04)}
  body.v28-idle #next-btn,body.v28-idle #stop-btn{display:none!important}
  body.v28-idle .feedback{display:none!important}
  body.v28-idle .arena{align-items:stretch!important}
  body.v28-idle .trial-panel{min-height:min(670px,72vh)!important}
  [data-v28-pair-label="1"],[data-v28-redundant-vow="1"],[data-v28-intro-duplicate="1"]{display:none!important}
  .v28-pair-card{gap:0!important}
  .v28-pair-card>.v25-card-visual{flex:1 1 auto!important}
  @media(max-width:760px){body.v28-idle #task-zone{min-height:210px!important;padding:20px 8px 8px!important}.v28-intro-copy{font-size:.88rem;line-height:1.5}body.v28-idle .trial-panel{min-height:auto!important}}
  `;
  document.head.appendChild(style);
}
function clearMarker(el,name){
  if(!el)return;
  delete el.dataset[name];
  el.removeAttribute('aria-hidden');
  el.removeAttribute('tabindex');
}
function markHidden(el,name){
  if(!el)return;
  el.dataset[name]='1';
  el.setAttribute('aria-hidden','true');
  if(el.matches&&el.matches('button,a,input,select,textarea,[tabindex]'))el.setAttribute('tabindex','-1');
}
function cleanPairLabels(root=document){
  const candidates=[...root.querySelectorAll('.v22-option .v25-card>b,.v22-option b,.v22-option strong')];
  let count=0;
  for(const el of candidates){
    if(/^PAIR\s+\d+$/i.test(text(el))){
      if(el.dataset.v28PairLabel!=='1')count++;
      markHidden(el,'v28PairLabel');
      const card=el.closest('.v25-card');
      if(card)card.classList.add('v28-pair-card');
    }
  }
  report.cleanedPairLabels=Math.max(report.cleanedPairLabels,count);
}
function cleanVowButtons(preferred){
  const previously=[...document.querySelectorAll('[data-v28-redundant-vow="1"]')];
  for(const el of previously){
    if(text(el)!=='TAKE THE VOWS')clearMarker(el,'v28RedundantVow');
  }
  const vows=[...document.querySelectorAll('button')].filter(el=>text(el)==='TAKE THE VOWS');
  if(!vows.length)return null;
  let keep=preferred&&vows.includes(preferred)?preferred:null;
  if(!keep)keep=vows.find(el=>el.id==='begin-btn')||vows[0];
  clearMarker(keep,'v28RedundantVow');
  let hidden=0;
  for(const el of vows){
    if(el===keep)continue;
    markHidden(el,'v28RedundantVow');
    hidden++;
  }
  report.hiddenVowDuplicates=Math.max(report.hiddenVowDuplicates,hidden);
  return keep;
}
function restoreIntroLabels(){
  for(const el of document.querySelectorAll('[data-v28-intro-duplicate="1"]'))clearMarker(el,'v28IntroDuplicate');
}
function cleanIntroLabels(){
  restoreIntroLabels();
  if(!document.body.classList.contains('v28-idle'))return;
  const leaves=[...document.querySelectorAll('.trial-panel *')].filter(el=>el.children.length===0);
  const trial=leaves.filter(el=>text(el)==='THE TRIAL');
  const levels=leaves.filter(el=>/^LV\s+\d+$/i.test(text(el)));
  const banner=document.querySelector('#rule-banner');
  const keepTrial=trial.find(el=>banner&&banner.contains(el))||trial[0];
  const keepLevel=levels.find(el=>banner&&banner.contains(el))||levels[0];
  for(const el of trial)if(el!==keepTrial)markHidden(el,'v28IntroDuplicate');
  for(const el of levels)if(el!==keepLevel)markHidden(el,'v28IntroDuplicate');
}
let cleanupQueued=false;
function queueCleanup(){
  if(cleanupQueued)return;
  cleanupQueued=true;
  requestAnimationFrame(()=>{
    cleanupQueued=false;
    cleanPairLabels();
    cleanVowButtons(document.getElementById('begin-btn'));
    cleanIntroLabels();
  });
}
function ensureBeginButton(){
  let begin=document.getElementById('begin-btn');
  if(begin){cleanVowButtons(begin);return begin}
  const existingVow=[...document.querySelectorAll('button')].find(el=>text(el)==='TAKE THE VOWS');
  if(existingVow){
    existingVow.id='begin-btn';
    cleanVowButtons(existingVow);
    return existingVow;
  }
  const next=document.getElementById('next-btn');
  const stop=document.getElementById('stop-btn');
  const auto=document.getElementById('auto-chk');
  const autoRow=auto&&(auto.closest('label')||auto.closest('.auto-row')||auto.parentElement);
  begin=document.createElement('button');
  begin.id='begin-btn';begin.type='button';begin.textContent='TAKE THE VOWS';
  begin.className=(next&&next.className)||(stop&&stop.className)||'v28-created-begin';
  if(!begin.className)begin.className='v28-created-begin';
  begin.dataset.v28Created='1';
  begin.addEventListener('click',e=>{
    e.preventDefault();
    if(state.running)return;
    document.body.classList.remove('v28-idle');
    restoreIntroLabels();
    begin.style.display='none';
    state.running=true;state.phase='ask';
    runTrial();
    queueCleanup();
  });
  if(next&&next.parentElement)next.parentElement.insertBefore(begin,next);
  else if(autoRow&&autoRow.parentElement)autoRow.insertAdjacentElement('afterend',begin);
  else {
    const host=document.querySelector('.controls,.control-panel,.side-panel,.right-panel,.hud')||document.body;
    host.appendChild(begin);
  }
  report.createdBegin=true;
  cleanVowButtons(begin);
  return begin;
}
function ensureIntro(){
  if(state&&state.running)return false;
  document.body.classList.add('v28-idle');
  const rule=document.getElementById('rule-banner');
  const task=document.getElementById('task-zone');
  const answers=document.getElementById('answer-zone');
  const feedback=document.getElementById('feedback');
  const explain=document.getElementById('explain');
  const next=document.getElementById('next-btn');
  const stop=document.getElementById('stop-btn');
  if(rule)rule.innerHTML='<span>THE TRIAL</span><span>LV '+Math.max(1,Math.min(15,Number(state.level)||1))+'</span>';
  if(task)task.innerHTML='<div class="v28-intro-copy"><span class="v28-lead">One practice: a fabric of figures, and somewhere in it a <strong>deception</strong>.</span>A false pair, a lying testimony, a broken thread, a mirrored code, an invalid partition or a projection that does not preserve its structure. Resolve each trial with one answer. Its presentation changes as you rise; the hidden 27-fold curriculum determines which relation, observer frame and transfer demand the next trial must strengthen.</div>';
  const begin=ensureBeginButton();
  if(answers)answers.innerHTML='';
  if(feedback){feedback.textContent='';feedback.className='feedback'}
  if(explain)explain.innerHTML='';
  if(begin){begin.textContent='TAKE THE VOWS';begin.style.display=''}
  if(next)next.style.display='none';
  if(stop)stop.style.display='none';
  cleanVowButtons(begin);
  cleanIntroLabels();
  try{renderStats();renderMastery();renderOntologyPanel()}catch(e){}
  queueCleanup();
  return true;
}
installStyle();
const originalRenderIdle=renderIdle;
renderIdle=function(){
  const result=originalRenderIdle.apply(this,arguments);
  ensureIntro();
  return result;
};
const originalRunTrial=runTrial;
runTrial=function(){
  document.body.classList.remove('v28-idle');
  restoreIntroLabels();
  const begin=document.getElementById('begin-btn');if(begin)begin.style.display='none';
  const result=originalRunTrial.apply(this,arguments);
  queueCleanup();
  return result;
};
const observer=new MutationObserver(queueCleanup);
observer.observe(document.body,{subtree:true,childList:true,characterData:true});
function audit(){
  const snapshot={running:state.running,phase:state.phase,level:state.level,auto:state.auto,trial:state.trial,askAt:state._askAt,ontology:state.ontology};
  const oldRecord=recordResult,auto=document.getElementById('auto-chk'),oldAuto=auto?auto.checked:null;
  try{
    recordResult=function(){return null};state.auto=false;if(auto)auto.checked=false;
    state.running=false;state.phase='idle';renderIdle();
    const rule=document.getElementById('rule-banner'),task=document.getElementById('task-zone'),begin=ensureBeginButton();
    cleanVowButtons(begin);cleanIntroLabels();
    assert(document.body.classList.contains('v28-idle'),'Idle body state was not installed.');
    assert(rule&&/THE TRIAL/.test(rule.textContent),'THE TRIAL heading was not restored.');
    assert(task&&/One practice: a fabric of figures/.test(task.textContent),'Introductory trial copy was not restored.');
    assert(begin&&visible(begin)&&/TAKE THE VOWS/.test(begin.textContent),'TAKE THE VOWS control was not restored.');
    assert([...document.querySelectorAll('button')].filter(el=>text(el)==='TAKE THE VOWS'&&visible(el)).length===1,'More than one TAKE THE VOWS control is visible.');
    report.intro=true;
    begin.click();
    assert(state.phase==='ask'&&state.running,'The restored intro could not start the game.');
    cleanPairLabels();
    assert(document.querySelectorAll('#answer-zone .v22-option').length===4,'Starting from the intro did not render four answers.');
    assert([...document.querySelectorAll('.v22-option b,.v22-option strong')].filter(el=>/^PAIR\s+\d+$/i.test(text(el))&&visible(el)).length===0,'Redundant pair titles remain visible.');
    report.start=true;
    try{stopClock()}catch(e){}
    state.running=false;state.phase='idle';renderIdle();
    assert(document.body.classList.contains('v28-idle')&&/THE TRIAL/.test(document.getElementById('rule-banner').textContent),'The intro did not return after leaving play.');
    assert(visible(ensureBeginButton()),'The start control did not return with the intro.');
    report.returnToIntro=true;
  }finally{
    try{stopClock()}catch(e){}recordResult=oldRecord;Object.assign(state,snapshot);if(auto&&oldAuto!==null)auto.checked=oldAuto;
    state.running=false;state.phase='idle';renderIdle();
  }
}
try{audit()}catch(e){report.errors.push(String(e&&e.stack||e));window.__V28_INTRO_TEST__=report;throw e}
window.__V28_INTRO_TEST__=report;
window.__RELATIONAL_V28__=true;
const badge=document.querySelector('.module-badge');if(badge)badge.textContent='RELATIONALITY V28';
renderIdle();
queueCleanup();
console.log('RELATIONALITY V28 intro restored · duplicate labels removed · single start control enforced');
})();
