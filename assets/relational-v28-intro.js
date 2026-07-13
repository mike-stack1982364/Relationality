'use strict';
(()=>{
const report={intro:false,start:false,returnToIntro:false,errors:[]};
function assert(ok,message){if(!ok)throw new Error(message)}
function visible(el){if(!el)return false;const s=getComputedStyle(el),r=el.getBoundingClientRect();return s.display!=='none'&&s.visibility!=='hidden'&&r.width>0&&r.height>0}
function installStyle(){
  const style=document.createElement('style');
  style.id='v28-intro-style';
  style.textContent=`
  body.v28-idle #rule-banner{display:flex!important;align-items:center;justify-content:space-between;min-height:30px;padding:0 2px!important;background:transparent!important;border:0!important;box-shadow:none!important;color:#5b3fd6!important;font-size:.69rem!important;font-weight:900!important;letter-spacing:1.8px!important}
  body.v28-idle #task-zone{display:flex!important;align-items:flex-start!important;justify-content:center!important;min-height:250px!important;padding:28px 18px 10px!important;background:transparent!important;border:0!important;box-shadow:none!important;overflow:visible!important}
  body.v28-idle #answer-zone{display:none!important}
  body.v28-idle #feedback,body.v28-idle #explain{display:none!important}
  .v28-intro-copy{max-width:880px;margin:0 auto;text-align:center;color:#565071;font-size:clamp(.9rem,.76rem + .36vw,1.12rem);font-weight:700;line-height:1.62}
  .v28-intro-copy strong{color:#9a6b0a;font-weight:900}
  .v28-intro-copy .v28-lead{display:block;margin-bottom:10px;color:#3f3861;font-size:1.05em}
  body.v28-idle #begin-btn{display:flex!important;width:100%!important;min-height:52px!important;align-items:center!important;justify-content:center!important;font-weight:900!important;letter-spacing:1.4px!important}
  body.v28-idle #next-btn,body.v28-idle #stop-btn{display:none!important}
  body.v28-idle .feedback{display:none!important}
  body.v28-idle .arena{align-items:stretch!important}
  body.v28-idle .trial-panel{min-height:min(670px,72vh)!important}
  @media(max-width:760px){body.v28-idle #task-zone{min-height:210px!important;padding:20px 8px 8px!important}.v28-intro-copy{font-size:.88rem;line-height:1.5}body.v28-idle .trial-panel{min-height:auto!important}}
  `;
  document.head.appendChild(style);
}
function ensureIntro(){
  if(state&&state.running)return false;
  document.body.classList.add('v28-idle');
  const rule=document.getElementById('rule-banner');
  const task=document.getElementById('task-zone');
  const answers=document.getElementById('answer-zone');
  const feedback=document.getElementById('feedback');
  const explain=document.getElementById('explain');
  const begin=document.getElementById('begin-btn');
  const next=document.getElementById('next-btn');
  const stop=document.getElementById('stop-btn');
  if(rule)rule.innerHTML='<span>THE TRIAL</span><span>LV '+Math.max(1,Math.min(15,Number(state.level)||1))+'</span>';
  if(task)task.innerHTML='<div class="v28-intro-copy"><span class="v28-lead">One practice: a fabric of figures, and somewhere in it a <strong>deception</strong>.</span>A false pair, a lying testimony, a broken thread, a mirrored code, an invalid partition or a projection that does not preserve its structure. Resolve each trial with one answer. Its presentation changes as you rise; the hidden 27-fold curriculum determines which relation, observer frame and transfer demand the next trial must strengthen.</div>';
  if(answers)answers.innerHTML='';
  if(feedback){feedback.textContent='';feedback.className='feedback'}
  if(explain)explain.innerHTML='';
  if(begin){begin.textContent='TAKE THE VOWS';begin.style.display=''}
  if(next)next.style.display='none';
  if(stop)stop.style.display='none';
  try{renderStats();renderMastery();renderOntologyPanel()}catch(e){}
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
runTrial=function(){document.body.classList.remove('v28-idle');return originalRunTrial.apply(this,arguments)};
function audit(){
  const snapshot={running:state.running,phase:state.phase,level:state.level,auto:state.auto,trial:state.trial,askAt:state._askAt,ontology:state.ontology};
  const oldRecord=recordResult,auto=document.getElementById('auto-chk'),oldAuto=auto?auto.checked:null;
  try{
    recordResult=function(){return null};state.auto=false;if(auto)auto.checked=false;
    state.running=false;state.phase='idle';renderIdle();
    const rule=document.getElementById('rule-banner'),task=document.getElementById('task-zone'),begin=document.getElementById('begin-btn');
    assert(document.body.classList.contains('v28-idle'),'Idle body state was not installed.');
    assert(rule&&/THE TRIAL/.test(rule.textContent),'THE TRIAL heading was not restored.');
    assert(task&&/One practice: a fabric of figures/.test(task.textContent),'Introductory trial copy was not restored.');
    assert(begin&&visible(begin)&&/TAKE THE VOWS/.test(begin.textContent),'TAKE THE VOWS control was not restored.');
    report.intro=true;
    begin.click();
    assert(state.phase==='ask'&&state.running,'The restored intro could not start the game.');
    assert(document.querySelectorAll('#answer-zone .v22-option').length===4,'Starting from the intro did not render four answers.');
    report.start=true;
    try{stopClock()}catch(e){}
    state.running=false;state.phase='idle';renderIdle();
    assert(document.body.classList.contains('v28-idle')&&/THE TRIAL/.test(document.getElementById('rule-banner').textContent),'The intro did not return after leaving play.');
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
console.log('RELATIONALITY V28 intro restored · intro/start/return passed');
})();
