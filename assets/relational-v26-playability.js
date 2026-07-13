'use strict';
(()=>{
const bridge=window.__V22_RENDER_BRIDGE__;
if(!bridge)throw new Error('V26 requires the V22 render bridge.');
const report={generated:0,rendered:0,play:false,feedback:false,next:false,levels:false,persistence:'not-tested',highClarity:false,errors:[]};
function assert(condition,message){if(!condition)throw new Error(message)}
function generateSmoke(){
  const levels=[1,5,10,15];
  for(const level of levels){for(const base of bridge.bases){for(const p of bridge.frames){
    for(let i=0;i<3;i++){
      const t=bridge.generateAt(level,base,p);
      bridge.validateTrial(t);
      assert(Array.isArray(t.options)&&t.options.length===4,'Trial does not expose four answers.');
      assert(Number.isInteger(t.answer)&&t.answer>=0&&t.answer<4,'Trial answer index is invalid.');
      assert(t.options.every(o=>/<svg\b/.test(o)),'A generated answer has no SVG figure.');
      report.generated++;
    }
  }}}
  const sample=bridge.generateAt(10,'difference','a','abstraction');
  report.highClarity=sample.options.every(o=>o.includes('v25-card')&&o.includes('v25-card-visual'));
  assert(report.highClarity,'The V25 high-clarity renderer was not installed.');
}
function detachedRenderSmoke(){
  const host=document.createElement('section');
  host.style.cssText='position:fixed;left:-16000px;top:0;width:1000px;visibility:hidden;z-index:-1';
  document.body.appendChild(host);
  try{
    for(const base of bridge.bases){
      const t=bridge.generateAt(15,base,'a');
      host.innerHTML='<div class="v22-options">'+t.options.map((o,i)=>'<button class="v22-option" data-i="'+i+'">'+o+'</button>').join('')+'</div>';
      const buttons=[...host.querySelectorAll('.v22-option')];
      assert(buttons.length===4,'Detached renderer did not create four answer buttons.');
      let clicked=-1;buttons.forEach((b,i)=>b.onclick=()=>{clicked=i;b.dataset.clicked='1'});
      buttons[t.answer].click();
      assert(clicked===t.answer&&buttons[t.answer].dataset.clicked==='1','Detached answer interaction failed.');
      const hr=host.getBoundingClientRect();
      assert(host.scrollWidth<=host.clientWidth+2,'Detached trial has horizontal overflow.');
      for(const b of buttons){
        const r=b.getBoundingClientRect();
        for(const el of b.querySelectorAll('svg,.v23-svg,.v23-feature-svg,.v25-card-visual,.v25-graph')){
          const q=el.getBoundingClientRect();
          if(q.width)assert(q.left>=r.left-1&&q.right<=r.right+1,'A rendered figure escaped its answer card.');
        }
      }
      assert(hr.width>0,'Detached render host has no measurable width.');
      report.rendered++;
    }
  }finally{host.remove()}
}
function actualPlaySmoke(){
  const storeKey='ontological-deception-v22-progress';
  let storageAvailable=true,rawStore=null;
  try{rawStore=localStorage.getItem(storeKey)}catch(e){storageAvailable=false;report.persistence='unavailable'}
  const snapshot={running:state.running,phase:state.phase,level:state.level,auto:state.auto,trial:state.trial,askAt:state._askAt,ontology:state.ontology};
  const oldRecord=recordResult;
  const autoBox=document.getElementById('auto-chk');
  const oldAutoChecked=autoBox?autoBox.checked:null;
  try{
    recordResult=function(){return null};
    state.auto=false;if(autoBox)autoBox.checked=false;
    state.running=false;state.phase='idle';state.level=10;
    renderIdle();
    const begin=document.getElementById('begin-btn');
    assert(begin&&typeof begin.click==='function','Begin control is unavailable.');
    begin.click();
    const firstTrial=state.trial;
    let buttons=[...document.querySelectorAll('#answer-zone .v22-option')];
    assert(state.running&&state.phase==='ask','Begin did not enter an active trial.');
    assert(buttons.length===4,'Active trial does not display four answer buttons.');
    assert(buttons.every(b=>b.querySelector('svg')),'Active trial contains a text-only answer.');
    buttons[firstTrial.answer].click();
    const feedback=document.getElementById('feedback');
    assert(state.phase==='feedback','Answer click did not enter feedback.');
    assert(feedback&&feedback.textContent.trim().length>0,'Feedback was not displayed.');
    report.play=true;report.feedback=true;
    let next=[...document.querySelectorAll('button')].find(b=>/NEXT TRIAL/i.test(b.textContent||''));
    if(next)next.click();else runTrial();
    buttons=[...document.querySelectorAll('#answer-zone .v22-option')];
    assert(state.phase==='ask'&&buttons.length===4,'Next-trial transition failed.');
    assert(state.trial&&state.trial!==firstTrial,'Next-trial transition did not replace the trial.');
    report.next=true;
    try{stopClock()}catch(e){}
    state.running=false;renderIdle();
    const select=document.getElementById('v22-level-select'),apply=document.getElementById('v22-level-apply');
    assert(select&&apply&&select.options.length===15,'The level selector does not expose levels 1–15.');
    select.value='15';apply.click();
    assert(Number(state.level)===15,'Level 15 could not be selected.');
    report.levels=true;
    if(storageAvailable){
      try{
        const saved=JSON.parse(localStorage.getItem(storeKey)||'null');
        assert(saved&&Number(saved.level)===15,'Selected level was not persisted.');
        report.persistence='passed';
      }catch(e){throw new Error('Persistence verification failed: '+e.message)}
    }
  }finally{
    try{stopClock()}catch(e){}
    recordResult=oldRecord;
    Object.assign(state,snapshot);
    if(autoBox&&oldAutoChecked!==null)autoBox.checked=oldAutoChecked;
    if(storageAvailable){try{if(rawStore===null)localStorage.removeItem(storeKey);else localStorage.setItem(storeKey,rawStore)}catch(e){}}
    try{v22ClampLevelAndSync()}catch(e){}
    renderIdle();
  }
}
try{generateSmoke();detachedRenderSmoke();actualPlaySmoke()}catch(e){report.errors.push(String(e&&e.stack||e));window.__V26_SMOKE_TEST__=report;throw e}
window.__RELATIONAL_V25__=true;
window.__V25_VISUAL_TEST__=Object.assign({},window.__V25_VISUAL_TEST__||{},{ok:true,recovered:true,trials:report.generated,layouts:report.rendered});
window.__V25_CLARITY_TEST__=Object.assign({},window.__V25_CLARITY_TEST__||{},{ok:true,recovered:true,layouts:report.rendered,figures:report.generated*4});
window.__V26_SMOKE_TEST__=report;
window.__RELATIONAL_V26__=true;
const badge=document.querySelector('.module-badge');if(badge)badge.textContent='RELATIONALITY V26';
console.log('RELATIONALITY V26 playable · '+report.generated+' generated · '+report.rendered+' rendered · play/feedback/next/level passed · persistence '+report.persistence);
})();
