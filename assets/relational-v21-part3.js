'use strict';
/* Custom runners retain exactly one response. */
const _runPairV20=runPair;
runPair=function(cfg){
  if(!cfg||cfg.mode!=='derived')return _runPairV20(cfg);
  clearTrialUI();const trial=state.trial=genSightTrial(cfg);state.form='pair';trial.picked=[];state.phase='ask';
  $('rule-banner').innerHTML=SEAL[1]+(trial.derivedKind==='combine'
    ?'The witness moves one step, then one step again in <span class="gold">'+AXIS_WORD_V21[trial.spanAxis]+'</span> — tap the pair that composes both into one stride'
    :'The witness moves in <span class="gold">'+AXIS_WORD_V21[trial.sourceAxis]+'</span> — tap the pair that preserves the relation after it is recoded into <span class="gold">'+AXIS_WORD_V21[trial.targetAxis]+'</span>');
  const cols=trial.grid.length>4?3:2;
  $('task-zone').innerHTML='<div class="witness-box fade"><div class="witness-label">'+(trial.derivedKind==='combine'?'Witness chain':'Witness relation')+'</div><div class="witness-pair" style="grid-template-columns:repeat('+trial.witness.length+',1fr);max-width:min(360px,70vw)">'+trial.witness.map(w=>'<div class="gcell">'+cellSVG(w)+'</div>').join('')+'</div></div><div class="cell-grid cols-'+cols+'" id="pick-grid">'+trial.grid.map((s,i)=>'<div class="gcell pickable fade" data-i="'+i+'">'+cellSVG(s)+'</div>').join('')+'</div>';
  cellsPickable('#pick-grid .pickable',pickCell);startClock(trial.t,()=>finishPick(null));
};
const _runBeadV20=runBead;
runBead=function(cfg){
  if(!cfg||cfg.mode!=='ontology')return _runBeadV20(cfg);
  clearTrialUI();state.form='bead';const trial=state.trial=genBeadTrial(cfg);trial.picked=[];state.phase='ask';
  $('rule-banner').innerHTML=SEAL[1]+'Each bead is a 3×3×3 address. Find the two codes joined by <span class="gold">'+trial.opName+'</span> — tap both.';
  const cols=trial.cells.length>4?3:2;$('task-zone').innerHTML='<div class="cell-grid cols-'+cols+'" id="pick-grid">'+trial.cells.map((s,i)=>'<div class="gcell pickable fade" data-i="'+i+'">'+cellSVG(s)+'</div>').join('')+'</div>';
  cellsPickable('#pick-grid .pickable',pickCell);startClock(trial.t,()=>finishPick(null));
};
const _runShadowsV20=runShadows;
runShadows=function(cfg){
  if(!cfg||!cfg.abstract)return _runShadowsV20(cfg);
  clearTrialUI();state.form='shadows';const trial=state.trial=genShadowsTrial(cfg);state.phase='ask';
  $('rule-banner').innerHTML=SEAL[2]+'Three threads are unlike <span class="gold">projections of one abstract motion</span> — tap the thread governed by a different motion';
  trial.strips.forEach((st,i)=>{const b=document.createElement('button');b.className='shadow-row';b.dataset.i=i;b.innerHTML=st.map(sp=>'<div class="gcell">'+cellSVG(sp)+'</div>').join('');b.onclick=()=>finishShadows(i);$('answer-zone').appendChild(b)});startClock(trial.t,()=>finishShadows(null));
};
const _finishShadowsV20=finishShadows;
finishShadows=function(k){
  const t=state.trial;if(!t||!t.abstract)return _finishShadowsV20(k);if(state.phase!=='ask')return;state.phase='feedback';stopClock();const ok=k===t.answer,rows=$('answer-zone').querySelectorAll('.shadow-row');
  rows.forEach((b,i)=>{b.disabled=true;if(i===t.answer)b.classList.add(i===k?'picked-right':'reveal-right');else if(i===k)b.classList.add('picked-wrong')});
  const fb=$('feedback');if(k===null){fb.textContent='⌛ THE MOTION PASSED';fb.classList.add('miss')}else{fb.textContent=ok?'👁 GENERATOR SEEN':'✕ SURFACE DECEIVED';fb.classList.add(ok?'good':'bad')}
  $('explain').innerHTML='The true projections share the abstract pattern <b>'+t.abstractLaw.toUpperCase()+'</b> across different attributes. <span class="lie">The stranger enacts '+t.abstractStranger.toUpperCase()+'.</span>';recordResult(ok);showNext();
};

/* Skill evidence, labels, and persistence. */
function trialSkills(t){const s=(t&&t.skillTags?t.skillTags.slice():[]);if(!s.length&&state._relDemand)s.push(state._relDemand);if(t&&t.veil&&!s.includes('interference'))s.push('interference');if(t&&t.inv&&!s.includes('inversion'))s.push('inversion');return[...new Set(s)].filter(k=>REL_SKILLS[k])}
function recordRelationEvidence(ok){const skills=trialSkills(state.trial),rt=state._askAt?Date.now()-state._askAt:0;relationClock++;skills.forEach(k=>{const z=relationStats[k];z.s++;if(ok)z.c++;z.last=relationClock;if(rt)z.rt=z.rt?Math.round(z.rt*.72+rt*.28):rt});state._lastRelDemand=state._relDemand}
const _recordOntologyEvidenceV20=recordOntologyEvidence;
recordOntologyEvidence=function(ok){_recordOntologyEvidenceV20(ok);recordRelationEvidence(ok)};
const _relationalLoadV20=relationalLoad;
relationalLoad=function(t){const a=_relationalLoadV20(t);trialSkills(t).forEach(k=>{const n=REL_SKILLS[k].name.toLowerCase();if(!a.includes(n))a.push(n)});return a.slice(0,4)};
const _appendOntologySealV20=appendOntologySeal;
appendOntologySeal=function(){_appendOntologySealV20();const o=state.ontology,ex=$('explain');if(o&&ex&&!ex.dataset.address){ex.dataset.address='1';ex.innerHTML+=' <span class="address-chip" title="3×3×3 curriculum address">'+addressText(o.base,o.p)+'</span>'}};
function renderRelationPanel(){const g=$('rel-bars');if(!g)return;g.innerHTML='';let total=0,correct=0;Object.keys(REL_SKILLS).forEach(k=>{const z=relationStats[k],q=relMastery(k),d=document.createElement('div');total+=z.s;correct+=z.c;d.className='rel-skill '+(z.s>=3?(q>=.76?'good':q<.5?'weak':''):'');d.title=REL_SKILLS[k].desc+' · '+z.c+'/'+z.s+' · '+Math.round(q*100)+'%';d.innerHTML='<b>'+REL_SKILLS[k].name+'</b><div class="rel-track"><div class="rel-fill" style="width:'+Math.round(q*100)+'%"></div></div>';g.appendChild(d)});$('rel-score').textContent=total?Math.round(100*correct/total)+'% across '+total+' demands':'awaiting evidence'}
const _renderOntologyPanelV20=renderOntologyPanel;
renderOntologyPanel=function(){_renderOntologyPanelV20();renderRelationPanel()};
const _askKeyOfV20=askKeyOf;
askKeyOf=function(){const t=state.trial;if(t&&t.mode==='ontology')return'BEADS · '+TERNARY_OPS[t.operator].short;if(t&&t.abstract)return'PROJECTION · ISOMORPH';if(t&&t.derivedKind==='combine')return'COMPOSE · '+AXIS_WORD_V21[t.spanAxis];if(t&&t.derivedKind==='transform')return'TRANSFER · '+AXIS_WORD_V21[t.sourceAxis]+'→'+AXIS_WORD_V21[t.targetAxis];return _askKeyOfV20()};
const _finishPickV20=finishPick;
finishPick=function(picked){const t=state.trial;_finishPickV20(picked);if(t&&t.form==='bead'&&t.mode==='ontology'){const ex=$('explain'),seal=ex.innerHTML.includes('<br><b>Ontological seal:</b>')?'<br><b>Ontological seal:</b>'+ex.innerHTML.split('<br><b>Ontological seal:</b>')[1]:'';const codes=t.answer.map(i=>t.cells[i].code.join('')).join(' ↔ ');ex.innerHTML=t.opName+': <b>'+codes+'</b>.'+seal}}

/* Rebuild selection around category × frame × weakest relational demand. */
runTrial=function(){
  state._ontologyTargetBase=null;state._ontologyTargetP=null;state._relDemand=null;clearTrialUI();renderStats();renderMastery();
  const cfg=clone(levelCfg(state.level)),target=chooseOntologyBase(cfg),targetP=chooseOntologyFrame(target),demand=chooseRelDemand(target,targetP),form=chooseOntologyFormV21(cfg,target,targetP,demand);
  state._ontologyTargetBase=target;state._ontologyTargetP=targetP;state._relDemand=demand;configureOntologyTrialV21(cfg,form,target,targetP,demand);state.form=form;
  if(form==='pair')runPair(cfg.pair);else if(form==='field')runField(cfg.field);else if(form==='bead')runBead(cfg.bead);else if(form==='testimony')runTestimonyF(cfg.testimony);else if(form==='gesture'){
    const gm0=cfg.gesture.mode||'compare',gm=gm0==='mixed'?pick(cfg.gesture.gmix||['compare','enact']):gm0;if(gm==='enact')runRite(cfg.gesture);else if(gm==='shadows')runShadows(cfg.gesture);else runGesture(cfg.gesture);
  }else runWeaveF(cfg.weave);
};

const _progressCodeV20=progressCode;
progressCode=function(){const o=JSON.parse(atob(_progressCodeV20()));o.rs=relationStats;o.rc=relationClock;return btoa(JSON.stringify(o))};
{const b=$('load-progress'),old=b.onclick;b.onclick=()=>{let savedAuto=null;try{const o=JSON.parse(atob($('progress-text').value.trim()));if(Object.prototype.hasOwnProperty.call(o,'a'))savedAuto=!!o.a;if(o.rs)Object.keys(relationStats).forEach(k=>{if(o.rs[k])relationStats[k]=Object.assign({s:0,c:0,last:-99,rt:0},o.rs[k])});relationClock=+o.rc||Object.values(relationStats).reduce((n,z)=>n+(z.s||0),0)}catch(e){}old();if(savedAuto!==null){state.auto=savedAuto;const c=$('auto-chk');if(c)c.checked=savedAuto;}renderRelationPanel()}}
{const b=$('reset-btn'),old=b.onclick;b.onclick=()=>{Object.keys(relationStats).forEach(k=>relationStats[k]={s:0,c:0,last:-99,rt:0});relationClock=0;old();renderRelationPanel()}}
const _recordResultV20=recordResult;
recordResult=function(ok,fell){const before=LOG.length,d=state._relDemand,r=_recordResultV20(ok,fell);if(LOG.length>before)LOG[LOG.length-1].splice(5,0,d||'',d?Math.round(100*relMastery(d)):'');return r};
$('csv-btn').onclick=()=>{$('progress-text').value='form,level,correct,ontology_cell,cell_mastery_percent,relation_demand,demand_mastery_percent,rt_ms,time\n'+LOG.map(r=>r.join(',')).join('\n')};

renderRelationPanel();
console.log('V21 derived-relation engine active · one answer · 27 addresses · 7 relational demands');

renderIdle();renderMastery();renderStats();renderOntologyPanel();
console.log('RELATIONALITY V21 stable patch loaded');
