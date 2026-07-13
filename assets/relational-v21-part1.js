'use strict';
'use strict';
window.__RELATIONAL_V21__=true;
const v21Style=document.createElement('style');v21Style.textContent='.rel-panel{margin:10px 0 12px;padding:11px 12px;border:1px solid #d9d4ec;border-radius:15px;background:rgba(255,255,255,.68)}\n.rel-head{display:flex;justify-content:space-between;gap:8px;align-items:baseline;margin-bottom:8px}\n.rel-title{font-size:.58rem;font-weight:900;letter-spacing:1.5px;color:#5b3fd6;text-transform:uppercase}\n.rel-score{font-size:.53rem;color:#8a6516;font-weight:900;letter-spacing:.5px}\n.rel-bars{display:grid;grid-template-columns:repeat(7,1fr);gap:5px}\n.rel-skill{min-width:0;text-align:center}.rel-skill b{display:block;font-size:.46rem;line-height:1.15;color:#6f6890;letter-spacing:.35px;text-transform:uppercase;overflow:hidden;text-overflow:ellipsis}\n.rel-track{height:6px;margin-top:4px;background:#e8e4f2;border-radius:999px;overflow:hidden;border:1px solid #d9d4ec}.rel-fill{height:100%;width:0;background:linear-gradient(90deg,#8f83c4,#5b3fd6);transition:width .25s ease}\n.rel-skill.weak .rel-fill{background:linear-gradient(90deg,#d998a8,#c81e4b)}.rel-skill.good .rel-fill{background:linear-gradient(90deg,#8fc4a5,#147a45)}\n.rel-note{font-size:.52rem;color:#8d84a8;margin-top:7px;line-height:1.35;text-align:center}.address-chip{display:inline-block;margin-left:5px;padding:1px 5px;border:1px solid #d4cee8;border-radius:8px;color:#6f6890;font-size:.82em;letter-spacing:1px}\n@media(max-width:760px){.rel-bars{grid-template-columns:repeat(4,1fr)}.rel-title{font-size:.52rem}}';document.head.appendChild(v21Style);
const tag=document.querySelector('.tagline');if(tag)tag.innerHTML='One practice · Progressive relational trials · Where is the deception? <span style="opacity:.45">· V21</span>';
const autoHint=document.querySelector('.auto-hint');if(autoHint)autoHint.textContent='— on by default; one answer, then the next trial';
const ontPanel=$('ontology-panel');if(ontPanel&&!$('rel-panel'))ontPanel.insertAdjacentHTML('afterend','<div class="rel-panel" id="rel-panel"><div class="rel-head"><div class="rel-title">Derived-Relation Engine</div><div class="rel-score" id="rel-score">awaiting evidence</div></div><div class="rel-bars" id="rel-bars"></div><div class="rel-note">Mutual entailment · combinatorial entailment · cross-register transformation · inversion · abstraction · interference control · bound completion</div></div>');
const codex=document.querySelector('#codex-modal .codex');if(codex){
  const build=[...codex.querySelectorAll('p')].find(p=>p.textContent.includes('Build V20'));if(build)build.textContent='Build V21 · stable self-contained engine — one response per trial.';
  if(!codex.querySelector('[data-v21-codex]'))codex.insertAdjacentHTML('beforeend','<section data-v21-codex><h2>V21 · Derived-Relation Codex</h2><p><b>One trial, one scored answer, immediate resolution.</b> The 27-fold category is embodied in generation and revealed only in feedback; it is never a second classification task.</p><p><b>Seven derived demands:</b> reverse a relation; compose A→B and B→C into A→C; transfer a relation across count, size, depth or orientation; invert an operation; recover one generator from unlike projections; inhibit salient noise; and distinguish sufficient completion from overrun.</p><p><b>Three levels × nine operations:</b> archetypal, inner and outer frames schedule all 27 cells. The engine revisits weak cells through mirrored operation-pairs and changed visual surfaces, while Connection remains the bridge.</p><p><b>Source discipline:</b> Meru’s three layers of nine, base-three arrangement, pointing, gesture, projection and symmetry are used as checkable transformation constraints. Woodson’s nine operations and observer-relative frames supply the curriculum vocabulary. Metaphysical claims and IQ-transfer claims are not treated as established evidence.</p></section>');
}
state.auto=true;const autoBox=$('auto-chk');if(autoBox)autoBox.checked=true;
renderIdle=function(){$('task-zone').innerHTML='<div class="question-box">One practice: a fabric of figures, and somewhere in it a <b>deception</b> — a false pair, a lying testimony, a broken thread, a mirrored code. Resolve it with one answer; the next trial arrives automatically unless you pause the flow. The hidden 27-fold curriculum selects the relation, observer frame and derived-relation demand most in need of strengthening.</div>';};
$('begin-btn').onclick=()=>{state.running=true;try{toast('BUILD V21 · relationality',true);}catch(e){}runTrial();};
/* ============================================================
   V21 · DERIVED RELATION ENGINE
   One scored response; category, frame, and relation-demand are
   embodied in generation rather than queried as a second task.
   ============================================================ */
const REL_SKILLS={
  mutual:{name:'Mutual',desc:'reverse a trained relation'},
  combine:{name:'Compose',desc:'derive A→C from A→B and B→C'},
  transform:{name:'Transfer',desc:'preserve a relation across registers'},
  inversion:{name:'Inverse',desc:'unwind an operation or operator'},
  abstraction:{name:'Abstract',desc:'recover one generator from unlike shadows'},
  interference:{name:'Inhibit',desc:'exclude salient but irrelevant variation'},
  bounds:{name:'Bounds',desc:'distinguish sufficient from excessive'}
};
const relationStats={};let relationClock=0;
Object.keys(REL_SKILLS).forEach(k=>relationStats[k]={s:0,c:0,last:-99,rt:0});
const REL_AFFINITY={
 all:['abstraction','mutual','transform'],difference:['interference','abstraction','transform'],
 action:['combine','inversion','transform'],division:['combine','interference','bounds'],
 connection:['mutual','transform','abstraction'],multiplication:['combine','transform','bounds'],
 projection:['inversion','transform','abstraction'],encompassment:['bounds','transform','interference'],
 completion:['bounds','inversion','mutual']
};
const REL_UNLOCK={mutual:1,abstraction:1,interference:3,transform:4,combine:5,inversion:6,bounds:7};
const REL_FORMS={
 mutual:['bead','gesture','pair'],combine:['pair','gesture','weave'],transform:['pair','gesture','bead'],
 inversion:['gesture','bead'],abstraction:['gesture','field','pair'],interference:['weave','pair','testimony','field'],bounds:['pair','weave','bead']
};
function relMastery(k){const z=relationStats[k]||{s:0,c:0};return(z.c+1)/(z.s+2)}
function relWeak(k){const z=relationStats[k]||{s:0,c:0,last:-99};return(1-relMastery(k))*100+42/Math.sqrt(z.s+1)+Math.min(28,Math.max(0,relationClock-z.last)*2.2)}
function chooseRelDemand(base,p){
  let pool=(REL_AFFINITY[base]||Object.keys(REL_SKILLS)).filter(k=>(REL_UNLOCK[k]||1)<=state.level);
  if(!pool.length)pool=['abstraction'];
  const ranked=pool.map(k=>({k,w:relWeak(k)-(state._lastRelDemand===k?28:0)+(p==='a'&&k==='abstraction'?10:0)+(p!=='a'&&k==='transform'?7:0)})).sort((a,b)=>b.w-a.w);
  const top=ranked.slice(0,Math.min(3,ranked.length));let r=Math.random()*top.reduce((s,x)=>s+Math.max(1,x.w),0);
  for(const x of top){r-=Math.max(1,x.w);if(r<=0)return x.k}return top[0].k;
}
/* The thread presents this cycle speculatively, so it is used only as an
   occasional scheduling contrast—not as a truth claim or fixed ontology. */
const ONT_RECURSIVE=['all','difference','division','action','connection','multiplication','projection','encompassment','completion'];
const _chooseOntologyBaseCycle=chooseOntologyBase;
chooseOntologyBase=function(cfg){
  if(state.level>=9&&state._lastOntologyBase&&Math.random()<.16){
    const i=ONT_RECURSIVE.indexOf(state._lastOntologyBase),next=ONT_RECURSIVE[(i+1+ONT_RECURSIVE.length)%ONT_RECURSIVE.length];
    const forms=Object.keys(cfg.forms||{}),supported=forms.some(f=>(ONT_FORM_SUPPORT[f]||[]).includes(next));
    if(supported&&(ONT_UNLOCK[next]||1)<=state.level)return next;
  }
  return _chooseOntologyBaseCycle(cfg);
};
function ontAddress(base,p){const i=Math.max(0,ONT_SEQUENCE.indexOf(base)),z={a:0,i:1,o:2}[p]||0;return[Math.floor(i/3),i%3,z]}
function addressText(base,p){return ontAddress(base,p).join('·')}
function chooseOntologyFormV21(cfg,base,p,demand){
  const preferred=REL_FORMS[demand]||[];
  let allowed=Object.keys(cfg.forms||{}).filter(f=>(ONT_FORM_SUPPORT[f]||[]).includes(base)&&preferred.includes(f));
  if(!allowed.length)return chooseOntologyForm(cfg,base,p);
  const supported=((ONT_FRAME_FORMS[base]||{})[p]||[]);
  const weights=allowed.map(f=>({f,w:(cfg.forms[f]||1)*(supported.includes(f)?1.35:1)*(ontologyLastForm[ontKey(base,p)]===f?.24:1)}));
  let r=Math.random()*weights.reduce((s,x)=>s+x.w,0);for(const x of weights){r-=x.w;if(r<=0)return x.f}return weights[0].f;
}
const _configureOntologyTrialV20=configureOntologyTrial;
function configureOntologyTrialV21(cfg,form,base,p,demand){
  _configureOntologyTrialV20(cfg,form,base,p);
  const code=ontAddress(base,p);cfg._ontologyCode=code;
  if(form==='pair'){
    if(demand==='combine'&&state.level>=5){cfg.pair.mode='derived';cfg.pair.derived='combine';cfg.pair.ontologyCode=code;cfg.pair.cells=Math.max(8,cfg.pair.cells||8);}
    else if(demand==='transform'&&state.level>=4){cfg.pair.mode='derived';cfg.pair.derived='transform';cfg.pair.ontologyCode=code;cfg.pair.cells=Math.max(8,cfg.pair.cells||8);}
    else if(demand==='bounds'){cfg.pair.mode='balance';cfg.pair.balance=true;cfg.pair.forceBalance=true;}
    else if(demand==='interference'){cfg.pair.veil=cfg.pair.veil||pick(['hue','size']);cfg.pair.mode=state.level>=7?'induct':cfg.pair.mode;}
    else if(demand==='abstraction'&&state.level>=5){cfg.pair.mode='induct';}
  }else if(form==='bead'){
    cfg.bead.mode='ontology';cfg.bead.ontologyCode=code;cfg.bead.demand=demand;cfg.bead.cells=Math.max(6,cfg.bead.cells||6);
  }else if(form==='gesture'){
    if((demand==='abstraction'||demand==='transform')&&state.level>=7){cfg.gesture.mode='mixed';cfg.gesture.gmix=['shadows'];cfg.gesture.abstract=true;}
    else{cfg.gesture.mode='mixed';cfg.gesture.gmix=['enact'];if(demand==='inversion'||p==='i'){cfg.gesture.inv=true;cfg.gesture.forceInv=true;}if(demand==='combine')cfg.gesture.nOps=Math.max(3,cfg.gesture.nOps||2);}
  }else if(form==='weave'){
    if(demand==='interference')cfg.weave.noise=true;
    if(demand==='combine')cfg.weave.nRules=Math.min(3,Math.max(2,cfg.weave.nRules||1));
  }else if(form==='field'){
    if(demand==='abstraction')cfg.field.named=false;
  }else if(form==='testimony'){
    if(demand==='interference')cfg.testimony.forges=['polaritySwap','offByOne','labelSwap','dirFlip','negation'];
  }
}
