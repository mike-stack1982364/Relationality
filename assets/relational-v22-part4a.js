'use strict';
{
/* ============================================================
   V22 · ONTOLOGICAL RELATIONAL LAB
   One modality, fifteen selectable levels, persistent progress,
   and category-generative relational reasoning.
   ============================================================ */
window.__RELATIONAL_V22__=false;

const V22_VERSION=22;
const V22_MAX_LEVEL=15;
const V22_STORE='ontological-deception-v22-progress';
const V22_FRAMES={a:'ARCHETYPAL',i:'INNER',o:'OUTER'};
const V22_BASES=['all','difference','action','division','connection','multiplication','projection','encompassment','completion'];
const V22_UNLOCK={all:1,difference:1,action:2,division:3,connection:4,multiplication:5,projection:6,encompassment:8,completion:9};
const V22_FAMILY={
  all:'equivalence',difference:'counterexample',action:'operator',division:'partition',connection:'graph',
  multiplication:'recursion',projection:'analogy',encompassment:'scope',completion:'constraints'
};
const V22_FAMILY_NAME={
  equivalence:'INVARIANT CLASS',counterexample:'MINIMAL DIFFERENCE',operator:'ORDERED ACTION',partition:'VALID PARTITION',
  graph:'DERIVED CONNECTION',recursion:'RECURSIVE MULTIPLICATION',analogy:'STRUCTURAL PROJECTION',scope:'NESTED SCOPE',constraints:'EXACT COMPLETION'
};
const V22_CATEGORY_MEANING={
  all:'identity and invariance across a whole',difference:'the boundary that makes a distinction real',action:'an ordered transformation of state',
  division:'a lawful partition or isolation',connection:'a relation derived through intermediate nodes',multiplication:'iteration, recurrence and self-similar growth',
  projection:'one structure preserved across unlike representations',encompassment:'containment, nesting and local scope',completion:'the minimally sufficient configuration satisfying every bound'
};
const V22_FRAME_MEANING={
  a:'Infer the relation itself, independent of a privileged observer.',
  i:'Reason from the receiving, contained or affected element.',
  o:'Reason from the acting, containing or projecting element.'
};
const V22_REL_HINT={
  mutual:'reverse the relation without changing its truth',combine:'compose several trained relations into a new relation',
  transform:'preserve structure while the visible register changes',inversion:'undo or reverse the operative transformation',
  abstraction:'recover the latent rule from unlike instances',interference:'exclude a salient but irrelevant variation',
  bounds:'satisfy the exact lower and upper limits without overrun'
};
const V22_GLYPHS=['◆','◇','●','○','▲','△','■','□','✦','✧','⬟','⬢','✚','✦','◈','◎'];
const V22_OP_GLYPHS=['⌁','⋈','⟲','⤧','⊙','⧖','⟐','⫷','⫸','⋉','⋊','⧉'];
const V22_HUES=['VIOLET','GOLD','CYAN','GREEN','ROSE','AMBER'];
const v22Stats={};
let v22Clock=0,v22SaveTimer=0,v22Restoring=false,v22LastCell='';

function v22Clamp(n,a,b){n=Number(n);return Number.isFinite(n)?Math.max(a,Math.min(b,Math.round(n))):a}
function v22Rnd(n){return Math.floor(Math.random()*n)}
function v22Pick(a){return a[v22Rnd(a.length)]}
function v22Shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=v22Rnd(i+1);[a[i],a[j]]=[a[j],a[i]]}return a}
function v22Unique(a){return [...new Set(a)]}
function v22Esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function v22Token(i){return String.fromCharCode(65+(i%26))}
function v22StateText(s){return '['+s.join(' · ')+']'}
function v22Key(base,p,family){return base+'|'+p+'|'+family}
function v22Stat(key){return v22Stats[key]||(v22Stats[key]={a:0,c:0,last:-99,rt:0,errors:{}})}
function v22Mastery(z){return ((z.c||0)+1)/((z.a||0)+2)}
function v22Weakness(z){return (1-v22Mastery(z))*100+45/Math.sqrt((z.a||0)+1)+Math.min(32,Math.max(0,v22Clock-(z.last||-99))*1.7)}
function v22Choice(options,answer,extra){
  const tagged=options.map((html,i)=>({html,correct:i===answer}));
  const mixed=v22Shuffle(tagged),idx=mixed.findIndex(x=>x.correct);
  return Object.assign({options:mixed.map(x=>x.html),answer:idx},extra||{});
}
function v22Card(title,body,sub){return '<div class="v22-card"><b>'+v22Esc(title)+'</b><span>'+body+'</span>'+(sub?'<small>'+sub+'</small>':'')+'</div>'}
function v22RelationLine(a,g,b){return '<div class="v22-relation"><strong>'+v22Esc(a)+'</strong><em>'+v22Esc(g)+'</em><strong>'+v22Esc(b)+'</strong></div>'}
function v22Level(){state.level=v22Clamp(state.level||1,1,V22_MAX_LEVEL);return state.level}
function v22Time(level){return Math.max(24,62-Math.floor(level*2.35))}
function v22DemandFor(base,p){
  try{return chooseRelDemand(base,p)}catch(e){
    const map={all:['abstraction','mutual'],difference:['interference','abstraction'],action:['combine','inversion'],division:['interference','bounds'],connection:['combine','mutual'],multiplication:['combine','bounds'],projection:['transform','abstraction'],encompassment:['bounds','interference'],completion:['bounds','inversion']};
    return v22Pick(map[base]||['abstraction']);
  }
}
function v22ChooseCell(){
  const level=v22Level(),frames=level<3?['a']:level<5?['a','i']:['a','i','o'];
  const cells=[];
  for(const base of V22_BASES){if(V22_UNLOCK[base]>level)continue;for(const p of frames){
    const family=V22_FAMILY[base],key=v22Key(base,p,family),z=v22Stat(key);
    let w=v22Weakness(z)+(p==='a'?2:5)+(v22LastCell===base+'|'+p?-32:0);
    if(level>=12&&(base==='projection'||base==='connection'||base==='completion'))w+=10;
    cells.push({base,p,family,key,w});
  }}
  cells.sort((x,y)=>y.w-x.w);const top=cells.slice(0,Math.min(7,cells.length));
  let r=Math.random()*top.reduce((s,x)=>s+Math.max(1,x.w),0);
  for(const x of top){r-=Math.max(1,x.w);if(r<=0){v22LastCell=x.base+'|'+x.p;return x}}
  return top[0];
}
function v22FrameInstruction(p){return V22_FRAME_MEANING[p]||V22_FRAME_MEANING.a}
function v22TrialBase(cell,demand){return {v22:true,base:cell.base,p:cell.p,family:cell.family,demand,ontologyCode:ontAddress(cell.base,cell.p),t:v22Time(v22Level()),skillTags:v22Unique([demand].filter(Boolean))}}

/* ALL · arbitrary equivalence and invariant class */
function v22GenEquivalence(cell,demand){
  const level=v22Level(),n=Math.min(5,2+Math.floor(level/4)),nodes=v22Shuffle(Array.from({length:9},(_,i)=>v22Token(i)));
  const same=v22Pick(V22_OP_GLYPHS),reverse=v22Pick(V22_OP_GLYPHS.filter(x=>x!==same));
  const chain=nodes.slice(0,n+1),outsiders=nodes.slice(n+1,n+4),lines=[];
  for(let i=0;i<chain.length-1;i++)lines.push(v22RelationLine(chain[i],same,chain[i+1]));
  lines.push(v22RelationLine(outsiders[0],same,outsiders[1]));
  if(level>=7)lines.splice(1,0,v22RelationLine(chain[1],reverse,chain[0]));
  const askFrom=cell.p==='i'?chain[chain.length-1]:chain[0],answer=cell.p==='i'?chain[0]:chain[chain.length-1];
  const opts=[answer,outsiders[0],outsiders[1],outsiders[2]||v22Token(10)].map(x=>v22Card(x,'candidate member','surface mark '+v22Pick(V22_HUES)));
  const q=v22Choice(opts,0,v22TrialBase(cell,demand));
  q.rule='The glyph <b>'+v22Esc(same)+'</b> binds one invariant class. '+v22FrameInstruction(cell.p);
  q.witness='<div class="v22-law"><span>Context key learned here:</span>'+lines.join('')+'</div>';
  q.prompt='Which candidate is derivably in the same whole as <b>'+v22Esc(askFrom)+'</b>?';
  q.explanation='<b>ALL</b> is trained as invariant identity: the chain places '+v22Esc(askFrom)+' and '+v22Esc(answer)+' in one equivalence class. The unrelated pair and decorative colour labels do not alter class membership.';
  q.lureKeys=['disconnected','local-only','surface'];return q;
}

/* DIFFERENCE · minimal counterexample / boundary */
function v22Bits(x){return [(x>>2)&1,(x>>1)&1,x&1]}
function v22Feature(bits,tag){const shapes=['▲','●'],fills=['solid','hollow'],turns=['left','right'];return '<span class="v22-feature">'+shapes[bits[0]]+' · '+fills[bits[1]]+' · '+turns[bits[2]]+(tag?' · '+tag:'')+'</span>'}
function v22Hamming(a,b){let d=0;for(let i=0;i<a.length;i++)if(a[i]!==b[i])d++;return d}
function v22GenDifference(cell,demand){
  const level=v22Level(),base=v22Bits(v22Rnd(8)),dims=level<6?2:3,decor=v22Pick(V22_HUES);
  function mutated(distance){let b=base.slice(),idx=v22Shuffle([0,1,2]).slice(0,distance);idx.forEach(i=>b[i]=1-b[i]);return b}
  const candidates=[mutated(1),mutated(0),mutated(2),mutated(3)];
  if(dims===2)candidates[3]=mutated(2);
  const opts=candidates.map((b,i)=>v22Card('PAIR '+(i+1),v22Feature(base,decor)+' ↔ '+v22Feature(b,i===0?v22Pick(V22_HUES):decor),v22Hamming(base,b)+' structural changes'));
  const q=v22Choice(opts,0,v22TrialBase(cell,demand));
  q.rule='A valid boundary changes <b>exactly one structural coordinate</b>. Colour words are interference, not structure. '+v22FrameInstruction(cell.p);
  q.witness='<div class="v22-law">Find the smallest difference that is still a real distinction.</div>';
  q.prompt='Which pair instantiates the minimal lawful DIFFERENCE?';
  q.explanation='<b>DIFFERENCE</b> is the minimum discriminating boundary. The correct pair changes one of shape, fill or direction—no fewer and no more. Decorative hue is deliberately irrelevant.';
  q.skillTags=v22Unique([demand,'interference','abstraction']);q.lureKeys=['identity','overdifference','surface'];return q;
}

/* ACTION · arbitrary non-commutative operator sequence */
function v22ApplyOp(s,op,m){s=s.slice();if(op===0)[s[0],s[1]]=[s[1],s[0]];else if(op===1)s[0]=(s[0]+1)%m;else if(op===2)s[1]=(s[1]+1)%m;else if(op===3){s[0]=(m-1)-s[0];s[1]=(m-1)-s[1]}else{s=[(s[0]+s[1])%m,s[0]]}return s}
function v22ApplySeq(start,seq,m){return seq.reduce((s,o)=>v22ApplyOp(s,o,m),start.slice())}
function v22GenAction(cell,demand){
  const level=v22Level(),m=level<8?3:4,ops=v22Shuffle([0,1,2,3,4]).slice(0,level<5?2:3),glyphs=v22Shuffle(V22_OP_GLYPHS).slice(0,ops.length),start=[v22Rnd(m),v22Rnd(m)];
  const seqLen=level<4?2:level<10?3:4,seq=Array.from({length:seqLen},()=>v22Rnd(ops.length));
  const result=v22ApplySeq(start,seq.map(i=>ops[i]),m),wrongOrder=v22ApplySeq(start,seq.slice().reverse().map(i=>ops[i]),m),omit=v22ApplySeq(start,seq.slice(0,-1).map(i=>ops[i]),m),inverse=v22ApplySeq(result,seq.map(i=>ops[i]),m);
  let alternatives=v22Unique([v22StateText(result),v22StateText(wrongOrder),v22StateText(omit),v22StateText(inverse)]);
  while(alternatives.length<4)alternatives.push(v22StateText([v22Rnd(m),v22Rnd(m)]));alternatives=v22Unique(alternatives).slice(0,4);while(alternatives.length<4)alternatives.push(v22StateText([(alternatives.length+1)%m,(alternatives.length+2)%m]));
  const opts=alternatives.map((x,i)=>v22Card('STATE '+(i+1),x,i?'plausible action trace':'complete trace'));
  const q=v22Choice(opts,alternatives.indexOf(v22StateText(result)),v22TrialBase(cell,demand));
  const demos=ops.map((op,i)=>{const s=[i%m,(i+1)%m];return v22RelationLine(v22StateText(s),glyphs[i],v22StateText(v22ApplyOp(s,op,m)))}).join('');
  q.rule='Operators act <b>left to right</b>; their order is not interchangeable. '+v22FrameInstruction(cell.p);
  q.witness='<div class="v22-law"><span>Infer each operator from its demonstration:</span>'+demos+'<hr>'+v22StateText(start)+' &nbsp; '+seq.map(i=>glyphs[i]).join(' &nbsp; ')+'</div>';
  q.prompt='Which final state results from the complete ordered ACTION?';
  q.explanation='<b>ACTION</b> is an ordered state transition. The correct answer applies every contextual operator in sequence. Reversing the order, freezing early or replaying the sequence from the result produces the principal lures.';
  q.skillTags=v22Unique([demand,'combine','inversion']);q.lureKeys=['wrong-order','frozen','overrun'];return q;
}
