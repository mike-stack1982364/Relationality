'use strict';
/* Generalised combinatorial entailment and cross-register transformation. */
const DERIVED_AXES=['count','size','depth','orient'];
const AXIS_WORD_V21={count:'NUMBER',size:'SIZE',depth:'DEPTH',orient:'TURN'};
function axisTemplate(axis,tag){
  const kind=axis==='orient'?'tri':pick(KINDS.filter(k=>k!=='tri'||axis==='orient'));
  return {kind,hue:(tag*2+rnd(HUES.length))%HUES.length,count:2,size:2,chir:CHIRAL[kind]?(tag%2?1:-1):1,depth:0,orient:kind==='tri'?0:0};
}
function axisSet(s,a,v){s=clone(s);s[a]=v;return s}
function axisStart(a,span){if(a==='count')return 1+rnd(span===2?2:3);if(a==='size')return 1;if(a==='depth')return 0;if(a==='orient')return rnd(span===2?2:3);return 0}
function axisMax(a){return a==='count'?4:a==='size'?3:a==='depth'?2:3}
function pairMeta(grid){const ln={},lk={};grid.forEach((s,i)=>{if(s._l)ln[i]=s._l;if(s._k)lk[i]=s._k});return[ln,lk]}
function genDerivedSightTrial(cfg){
  const code=cfg.ontologyCode||[0,0,0],axes=DERIVED_AXES.slice(0,state.level<8?3:4);
  if(cfg.derived==='combine'){
    const axis=axes[(code[0]+code[1]+code[2])%axes.length],start=axisStart(axis,2),baseW=axisTemplate(axis,0),baseT=axisTemplate(axis,1);
    const witness=[axisSet(baseW,axis,start),axisSet(baseW,axis,start+1),axisSet(baseW,axis,start+2)];
    const ts=axisStart(axis,2),target=[axisSet(baseT,axis,ts),axisSet(baseT,axis,ts+2)];
    const baseF=axisTemplate(axis,2),fs=axisStart(axis,1),frozen=[axisSet(baseF,axis,fs),axisSet(baseF,axis,fs+1)];
    frozen.forEach(x=>{x._l='Frozen composition — only one step was carried';x._k='frozen'});
    const wrongAxis=pick(axes.filter(x=>x!==axis)),baseR=axisTemplate(wrongAxis,3),rs=axisStart(wrongAxis,2),wrong=[axisSet(baseR,wrongAxis,rs),axisSet(baseR,wrongAxis,rs+2)];
    wrong.forEach(x=>{x._l='Register substitution — the stride occurred on the wrong dimension';x._k='label'});
    const tw=axisTemplate(axis,4),twins=[tw,clone(tw)];twins.forEach(x=>{x._l='Twin collapse — no relation was composed';x._k='twin'});
    let grid=[...target,...frozen,...wrong,...twins];grid=shuffle(grid).slice(0,cfg.cells||8);const ans=[];target.forEach(t=>ans.push(grid.indexOf(t)));
    if(ans.some(i=>i<0))return genDerivedSightTrial(cfg);
    const [ln,lk]=pairMeta(grid),rel='SPAN·'+axis.toUpperCase();REL_GLYPH[rel]='»';REL_HINT[rel]='two unit-relations composed into one '+AXIS_WORD_V21[axis].toLowerCase()+' stride';
    return {form:'pair',rel,grid,answer:ans.sort((a,b)=>a-b),witness,mode:'derived',span:true,spanAxis:axis,derivedKind:'combine',lureNames:ln,lureKeys:lk,lieKey:'frozen',pickN:2,t:cfg.t,skillTags:['combine']};
  }
  const from=axes[(code[0]+code[2])%axes.length],to=axes[(axes.indexOf(from)+1+code[1])%axes.length];
  const bW=axisTemplate(from,0),ws=axisStart(from,1),witness=[axisSet(bW,from,ws),axisSet(bW,from,ws+1)];
  const bT=axisTemplate(to,1),ts=axisStart(to,1),target=[axisSet(bT,to,ts),axisSet(bT,to,ts+1)];
  const bR=axisTemplate(from,2),rs=axisStart(from,1),wrongReg=[axisSet(bR,from,rs),axisSet(bR,from,rs+1)];
  wrongReg.forEach(x=>{x._l='Right motion, wrong register — the witness was copied instead of transformed';x._k='label'});
  const bM=axisTemplate(to,3),ms=axisStart(to,2),wrongMag=[axisSet(bM,to,ms),axisSet(bM,to,ms+2)];
  wrongMag.forEach(x=>{x._l='Over-transformation — the relation changed magnitude during transfer';x._k='overrun'});
  const tw=axisTemplate(to,4),twins=[tw,clone(tw)];twins.forEach(x=>{x._l='Frozen transfer — the relation disappeared';x._k='frozen'});
  let grid=shuffle([...target,...wrongReg,...wrongMag,...twins]).slice(0,cfg.cells||8),ans=[];target.forEach(t=>ans.push(grid.indexOf(t)));
  if(ans.some(i=>i<0))return genDerivedSightTrial(cfg);
  const [ln,lk]=pairMeta(grid),rel='ECHO·'+to.toUpperCase();REL_GLYPH[rel]='≈';REL_HINT[rel]='the witness relation transformed from '+AXIS_WORD_V21[from].toLowerCase()+' into '+AXIS_WORD_V21[to].toLowerCase();
  return {form:'pair',rel,grid,answer:ans.sort((a,b)=>a-b),witness,mode:'derived',echo:'generic',sourceAxis:from,targetAxis:to,derivedKind:'transform',lureNames:ln,lureKeys:lk,lieKey:'label',pickN:2,t:cfg.t,skillTags:['transform']};
}
const _genSightTrialV20=genSightTrial;
genSightTrial=function(cfg){return cfg&&cfg.mode==='derived'?genDerivedSightTrial(cfg):_genSightTrialV20(cfg)};

/* Ternary address trials: one of several explicit base-three operators. */
const TERNARY_OPS={
 reverse:{name:'FRONT–BACK REVERSAL',short:'REVERSE',fn:c=>c.slice().reverse()},
 complement:{name:'BASE-3 COMPLEMENT',short:'COMPLEMENT',fn:c=>c.map(d=>2-d)},
 revcomp:{name:'REVERSED COMPLEMENT',short:'REV·COMP',fn:c=>c.slice().reverse().map(d=>2-d)},
 rotate:{name:'CYCLIC COORDINATE TURN',short:'ROTATE',fn:c=>[c[2],c[0],c[1]]},
 turn:{name:'DIGIT TURN +1',short:'TURN',fn:c=>c.map(d=>(d+1)%3)}
};
function codeKey(c){return c.join('')}
function chooseTernaryOp(code,demand){
  const pref=demand==='inversion'?['complement','revcomp','reverse']:demand==='transform'?['rotate','turn','revcomp']:demand==='mutual'?['reverse','complement','revcomp']:['revcomp','reverse','rotate','complement','turn'];
  return pref.find(k=>codeKey(TERNARY_OPS[k].fn(code))!==codeKey(code))||'turn';
}
function genOntologyBeadTrial(cfg){
  const code=(cfg.ontologyCode||[0,0,0]).slice(),opKey=chooseTernaryOp(code,cfg.demand),op=TERNARY_OPS[opKey],partner=op.fn(code),hue=(code[0]*3+code[1]+code[2])%HUES.length;
  const cells=[{code,hue,_role:'source'},{code:partner,hue,_role:'answer'}],used=new Set([codeKey(code),codeKey(partner)]);
  const alternatives=Object.keys(TERNARY_OPS).filter(k=>k!==opKey).map(k=>TERNARY_OPS[k].fn(code));
  for(const c of alternatives){if(!used.has(codeKey(c))){used.add(codeKey(c));cells.push({code:c,hue,_l:'Operator substitution — a different symmetry answered',_k:'polarity'});break}}
  const off=partner.slice();off[(code[0]+code[2])%3]=(off[(code[0]+code[2])%3]+1)%3;if(!used.has(codeKey(off))){used.add(codeKey(off));cells.push({code:off,hue,_l:'Off-code — one ternary coordinate slipped',_k:'offbyone'})}
  const ana=[code[1],code[0],code[2]];if(!used.has(codeKey(ana))){used.add(codeKey(ana));cells.push({code:ana,hue,_l:'Anagram — right coordinates, wrong order',_k:'anagram'})}
  while(cells.length<(cfg.cells||6)){let c;do{c=[rnd(3),rnd(3),rnd(3)]}while(used.has(codeKey(c)));used.add(codeKey(c));cells.push({code:c,hue})}
  const g=shuffle(cells),answer=[g.findIndex(x=>x._role==='source'),g.findIndex(x=>x._role==='answer')].sort((a,b)=>a-b),ln={},lk={};g.forEach((x,i)=>{if(x._l)ln[i]=x._l;if(x._k)lk[i]=x._k});
  return {form:'bead',mode:'ontology',cells:g,answer,lureNames:ln,lureKeys:lk,lieKey:'polarity',pickN:2,t:cfg.t,operator:opKey,opName:op.name,address:code,skillTags:[cfg.demand==='inversion'?'inversion':cfg.demand==='transform'?'transform':'mutual']};
}
const _genBeadTrialV20=genBeadTrial;
genBeadTrial=function(cfg){return cfg&&cfg.mode==='ontology'?genOntologyBeadTrial(cfg):_genBeadTrialV20(cfg)};

/* One generator, unlike projections: abstract pattern survives a change of register. */
const ABSTRACT_PATTERNS={rise:[0,1,2],pulse:[0,1,0],fall:[2,1,0],hold:[1,1,1]};
function projectionStrip(pattern,axis,tag){
  const base=axisTemplate(axis,tag),vals=ABSTRACT_PATTERNS[pattern],min=axis==='count'||axis==='size'?1:0;
  return vals.map(v=>axisSet(base,axis,v+min));
}
function genAbstractShadows(cfg){
  const patterns=['rise','pulse','fall'],law=pick(patterns),other=pick(patterns.filter(x=>x!==law)),axes=shuffle(DERIVED_AXES).slice(0,4);
  const strips=[projectionStrip(law,axes[0],0),projectionStrip(law,axes[1],1),projectionStrip(law,axes[2],2),projectionStrip(other,axes[3],3)],order=shuffle([0,1,2,3]);
  return {form:'shadows',abstract:true,abstractLaw:law,abstractStranger:other,strips:order.map(i=>strips[i]),answer:order.indexOf(3),lieKey:'stranger',t:cfg.t,skillTags:['abstraction','transform']};
}
const _genShadowsTrialV20=genShadowsTrial;
genShadowsTrial=function(cfg){return cfg&&cfg.abstract?genAbstractShadows(cfg):_genShadowsTrialV20(cfg)};
