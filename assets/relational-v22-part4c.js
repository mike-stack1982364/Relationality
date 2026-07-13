/* Preserve V21 result accounting while adding diagnostic cell evidence. */
const _recordResultV22Base=recordResult;
recordResult=function(ok,fell){
  const t=state.trial,r=_recordResultV22Base(ok,fell);if(t&&t.v22)v22RecordEvidence(!!ok,t);v22ClampLevelAndSync();v22ScheduleSave();return r;
};
const _askKeyV22Base=askKeyOf;
askKeyOf=function(){const t=state.trial;return t&&t.v22?t.askKey:_askKeyV22Base()};
const _relLoadV22Base=relationalLoad;
relationalLoad=function(t){if(t&&t.v22)return v22Unique([t.base,t.demand,t.family,V22_FRAMES[t.p].toLowerCase()]).slice(0,4);return _relLoadV22Base(t)};

/* V22 becomes the single progressive trial stream. V21 remains a safe fallback. */
const _runTrialV22Fallback=runTrial;
runTrial=function(){
  try{
    state._ontologyTargetBase=null;state._ontologyTargetP=null;state._relDemand=null;clearTrialUI();try{renderStats();renderMastery()}catch(e){}
    const cell=v22ChooseCell(),demand=v22DemandFor(cell.base,cell.p),trial=v22Generate(cell,demand);v22Run(trial);
  }catch(e){console.error('V22 trial fallback',e);_runTrialV22Fallback()}
};

/* Fifteen-level control and durable local progress. */
function v22ClampLevelAndSync(){
  state.level=v22Clamp(state.level||1,1,V22_MAX_LEVEL);const sel=$('v22-level-select');if(sel&&String(sel.value)!==String(state.level))sel.value=String(state.level);const out=$('v22-save-state');if(out)out.textContent='Level '+state.level+' · local progress '+(v22StorageAvailable()?'on':'unavailable');
}
function v22StorageAvailable(){try{const k='__v22_test__';localStorage.setItem(k,'1');localStorage.removeItem(k);return true}catch(e){return false}}
function v22Snapshot(){
  let base='';try{base=progressCode()}catch(e){}
  return {version:V22_VERSION,savedAt:new Date().toISOString(),level:v22Level(),base,v22Stats,v22Clock,lastCell:v22LastCell,auto:!!state.auto};
}
function v22Save(){if(v22Restoring||!v22StorageAvailable())return false;try{localStorage.setItem(V22_STORE,JSON.stringify(v22Snapshot()));const s=$('v22-save-state');if(s)s.textContent='Saved · Level '+state.level+' · '+new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});return true}catch(e){return false}}
function v22ScheduleSave(){clearTimeout(v22SaveTimer);v22SaveTimer=setTimeout(v22Save,120)}
function v22Restore(){
  if(!v22StorageAvailable())return false;let o;try{o=JSON.parse(localStorage.getItem(V22_STORE)||'null')}catch(e){return false}if(!o||o.version<22)return false;
  v22Restoring=true;
  try{
    if(o.base&&$('progress-text')&&$('load-progress')){$('progress-text').value=o.base;$('load-progress').click()}
    if(o.v22Stats&&typeof o.v22Stats==='object')for(const k of Object.keys(o.v22Stats))v22Stats[k]=Object.assign({a:0,c:0,last:-99,rt:0,errors:{}},o.v22Stats[k]);
    v22Clock=Number(o.v22Clock)||0;v22LastCell=String(o.lastCell||'');state.level=v22Clamp(o.level||state.level,1,V22_MAX_LEVEL);
    if(Object.prototype.hasOwnProperty.call(o,'auto')){state.auto=!!o.auto;const a=$('auto-chk');if(a)a.checked=state.auto}
    return true;
  }finally{v22Restoring=false;v22ClampLevelAndSync();v22RenderPanel()}
}
const _progressCodeV22Base=progressCode;
progressCode=function(){
  let o;try{o=JSON.parse(atob(_progressCodeV22Base()))}catch(e){o={}}
  o.v22={version:V22_VERSION,level:v22Level(),stats:v22Stats,clock:v22Clock,lastCell:v22LastCell};return btoa(JSON.stringify(o));
};
function v22InstallControls(){
  const anchor=$('rel-panel')||$('ontology-panel');if(anchor&&!$('v22-control-panel'))anchor.insertAdjacentHTML('afterend','<section class="v22-control-panel" id="v22-control-panel"><div><b>TRAINING LEVEL</b><select id="v22-level-select" aria-label="Training level"></select><button id="v22-level-apply">APPLY</button></div><small id="v22-save-state">Persistent progress initialising…</small></section><section class="v22-mastery" id="v22-mastery"><div class="rel-head"><div class="rel-title">Ontological Transfer Matrix</div><div class="rel-score" id="v22-score">awaiting evidence</div></div><div id="v22-bars" class="v22-bars"></div></section>');
  const sel=$('v22-level-select');if(sel){sel.innerHTML=Array.from({length:15},(_,i)=>'<option value="'+(i+1)+'">LEVEL '+(i+1)+'</option>').join('');sel.value=String(v22Level())}
  const apply=$('v22-level-apply');if(apply)apply.onclick=()=>{state.level=v22Clamp(sel.value,1,V22_MAX_LEVEL);v22ClampLevelAndSync();v22Save();if(state.running)runTrial();else renderIdle()};
}
function v22RenderPanel(){
  const g=$('v22-bars');if(!g)return;g.innerHTML='';let attempts=0,correct=0;
  for(const base of V22_BASES){let a=0,c=0;for(const p of ['a','i','o']){const z=v22Stats[v22Key(base,p,V22_FAMILY[base])];if(z){a+=z.a||0;c+=z.c||0}}attempts+=a;correct+=c;const q=(c+1)/(a+2),d=document.createElement('div');d.className='v22-skill '+(a>=3?(q>=.76?'good':q<.5?'weak':''):'');d.title=V22_CATEGORY_MEANING[base]+' · '+c+'/'+a;d.innerHTML='<b>'+base+'</b><div class="rel-track"><div class="rel-fill" style="width:'+Math.round(q*100)+'%"></div></div>';g.appendChild(d)}
  const s=$('v22-score');if(s)s.textContent=attempts?Math.round(100*correct/attempts)+'% across '+attempts+' trials':'awaiting evidence';
}
function v22InstallCodex(){
  const codex=document.querySelector('#codex-modal .codex');if(!codex||codex.querySelector('[data-v22-codex]'))return;
  codex.insertAdjacentHTML('beforeend','<section data-v22-codex><h2>V22 · Instructions Codex</h2><p><b>How to play.</b> Every trial presents a relational law, a witness structure and four candidates. Select the one candidate that preserves the law—or the one minimal counterexample that exposes its failure. There is always one scored response.</p><p><b>The nine generators.</b> ALL trains invariance; DIFFERENCE trains exact discrimination; ACTION trains ordered transformation; DIVISION trains lawful partition; CONNECTION trains path-derived relations; MULTIPLICATION trains iteration and recurrence; PROJECTION trains structural analogy; ENCOMPASSMENT trains containment and local scope; COMPLETION trains exact constraint satisfaction.</p><p><b>The three frames.</b> ARCHETYPAL asks for the observer-independent relation. INNER locates the receiving, contained or affected role. OUTER locates the acting, containing or projecting role. Direction, role and containment are computed separately so that “inner” and “outer” do not collapse into vague metaphors.</p><p><b>Why surfaces change.</b> Symbols, colours, objects and layouts are deliberately varied. Mastery requires the relation to survive an unfamiliar register. Some salient features are noise; some are the rule. The task is to discover which is which.</p><p><b>Difficulty 1–15.</b> Higher levels increase chain length, arbitrariness of contextual cues, nested scope, operator order, relation count, withheld role labels and lure plausibility. Speed is secondary to valid derivation. Choose any level from the persistent level control.</p><p><b>Meru source discipline.</b> Meru’s three layers of nine, gesture, projection, symmetry and base-three address are used here as generative representational constraints. Brandon Woodson’s inner/outer extrapolations inform perspective and category contrasts. Historical, metaphysical and psychometric claims are not treated as established merely because they inspired the design.</p><p><b>What the game measures.</b> The local dashboard estimates performance inside this curriculum. It does not by itself prove an IQ increase. Transfer requires success on withheld symbols, unfamiliar surfaces and independent reasoning measures.</p></section>');
}
function v22InstallStyle(){
  const s=document.createElement('style');s.textContent=`
  .v22-control-panel,.v22-mastery{margin:10px 0 12px;padding:11px 12px;border:1px solid #d9d4ec;border-radius:15px;background:rgba(255,255,255,.72)}
  .v22-control-panel>div{display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap}.v22-control-panel b{font-size:.58rem;letter-spacing:1.4px;color:#5b3fd6}
  .v22-control-panel select,.v22-control-panel button{border:1px solid #bdb5da;border-radius:10px;background:#fff;color:#3a2f66;padding:7px 9px;font-weight:850;font:inherit;font-size:.65rem}.v22-control-panel button{cursor:pointer;background:#5b3fd6;color:#fff}
  .v22-control-panel small{display:block;text-align:center;margin-top:6px;color:#80789c;font-size:.52rem}.v22-bars{display:grid;grid-template-columns:repeat(9,1fr);gap:5px}.v22-skill{text-align:center;min-width:0}.v22-skill>b{display:block;text-transform:uppercase;overflow:hidden;text-overflow:ellipsis;font-size:.42rem;color:#6f6890}.v22-skill.good .rel-fill{background:linear-gradient(90deg,#8fc4a5,#147a45)}.v22-skill.weak .rel-fill{background:linear-gradient(90deg,#d998a8,#c81e4b)}
  .v22-category{font-size:.72em;letter-spacing:1.6px;color:#5b3fd6}.v22-prompt{padding:10px 12px;margin:0 0 9px;border-radius:14px;background:#fff;border:1px solid #d9d4ec;text-align:center;font-weight:850;color:#3a2f66;line-height:1.45}
  .v22-law{padding:11px;margin:0 0 10px;border-radius:15px;border:1px solid rgba(154,107,10,.28);background:rgba(154,107,10,.055);text-align:center}.v22-law>span{display:block;margin:3px 0 8px;color:#6f6890;font-size:.68rem}.v22-law hr{border:0;border-top:1px solid #ddd7ec;margin:9px}.v22-law ul{display:inline-block;text-align:left;line-height:1.6;color:#4a4266;font-size:.75rem}.v22-law small{display:block;color:#8d84a8;margin-top:7px}
  .v22-relation{display:inline-grid;grid-template-columns:minmax(38px,auto) 30px minmax(38px,auto);align-items:center;gap:4px;margin:4px;padding:6px 8px;border-radius:11px;background:#fff;border:1px solid #e3deef}.v22-relation strong{color:#31275c}.v22-relation em{font-style:normal;color:#9a6b0a;font-weight:950;font-size:1.2em}.v22-consequence,.v22-nest{margin-top:7px;color:#5b3fd6;font-weight:800;font-size:.68rem}
  .v22-options{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.v22-option{appearance:none;border:2px solid #d9d4ec;border-radius:16px;background:#fff;padding:9px;min-height:94px;cursor:pointer;font:inherit;color:inherit;text-align:initial}.v22-option:hover:not(:disabled){border-color:#8f83c4}.v22-option:active:not(:disabled){transform:scale(.985)}.v22-option.picked-right,.v22-option.reveal-right{border-color:#147a45!important;box-shadow:0 0 14px rgba(20,122,69,.25)}.v22-option.picked-wrong{border-color:#c81e4b!important;box-shadow:0 0 14px rgba(200,30,75,.22)}.v22-option:disabled{cursor:default}
  .v22-card{display:flex;flex-direction:column;gap:6px;height:100%;justify-content:center;text-align:center}.v22-card>b{font-size:.62rem;letter-spacing:1.1px;color:#5b3fd6}.v22-card>span{font-weight:850;line-height:1.35}.v22-card>small{font-size:.52rem;color:#8d84a8}.v22-feature{display:inline-block;padding:3px 5px;border:1px solid #e3deef;border-radius:8px;background:#f8f7fc;font-size:.68rem}
  @media(max-width:760px){.v22-bars{grid-template-columns:repeat(5,1fr)}.v22-options{grid-template-columns:1fr}.v22-option{min-height:78px}.v22-relation{font-size:.82rem}}
  `;document.head.appendChild(s);
}

/* Reset now means an explicit fresh start, including durable state. */
function v22PatchReset(){const b=$('reset-btn');if(!b||b.dataset.v22)return;b.dataset.v22='1';const old=b.onclick;b.onclick=()=>{try{localStorage.removeItem(V22_STORE)}catch(e){}Object.keys(v22Stats).forEach(k=>delete v22Stats[k]);v22Clock=0;v22LastCell='';if(old)old();state.level=1;v22ClampLevelAndSync();v22RenderPanel()}}

/* Generator simulations: every category × frame × representative level. */
function v22SelfTest(rounds){
  const report={trials:0,levels:new Set(),categories:new Set(),frames:new Set(),failures:[]},levels=[1,3,5,8,10,12,15];
  const prior=state.level;
  try{
    for(const level of levels){state.level=level;for(const base of V22_BASES){if(V22_UNLOCK[base]>level)continue;for(const p of ['a','i','o']){if(level<3&&p!=='a')continue;if(level<5&&p==='o')continue;for(let r=0;r<rounds;r++){
      try{const cell={base,p,family:V22_FAMILY[base],key:v22Key(base,p,V22_FAMILY[base])},t=v22Generate(cell,v22DemandFor(base,p));v22ValidateTrial(t);report.trials++;report.levels.add(level);report.categories.add(base);report.frames.add(p)}catch(e){report.failures.push({level,base,p,error:String(e&&e.message||e)})}
    }}}}
  }finally{state.level=prior}
  const out={trials:report.trials,levels:[...report.levels],categories:[...report.categories],frames:[...report.frames],failures:report.failures,ok:report.failures.length===0};window.__V22_SELF_TEST__=out;if(!out.ok)throw new Error('V22 self-test failed: '+JSON.stringify(out.failures.slice(0,3)));return out;
}
