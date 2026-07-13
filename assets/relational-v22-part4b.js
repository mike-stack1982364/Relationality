/* DIVISION · infer a lawful arbitrary partition */
function v22PartitionRule(bits,rule){if(rule===0)return bits[0];if(rule===1)return bits[1];if(rule===2)return bits[2];return bits[0]^bits[1]^bits[2]}
function v22GenDivision(cell,demand){
  const level=v22Level(),rule=level<7?v22Rnd(3):v22Rnd(4),items=v22Shuffle(Array.from({length:8},(_,i)=>({id:v22Token(i),bits:v22Bits(i)}))),target=items[0],same=items.filter(x=>x.id!==target.id&&v22PartitionRule(x.bits,rule)===v22PartitionRule(target.bits,rule)),diff=items.filter(x=>v22PartitionRule(x.bits,rule)!==v22PartitionRule(target.bits,rule));
  const correct=v22Pick(same),trainSame=v22Pick(same.filter(x=>x.id!==correct.id).length?same.filter(x=>x.id!==correct.id):same),trainDiff=v22Pick(diff);
  const pool=v22Shuffle([correct,...diff.slice(0,3)]).slice(0,4),answer=pool.findIndex(x=>x.id===correct.id);
  const opts=pool.map(x=>v22Card(x.id,v22Feature(x.bits,v22Pick(V22_HUES)),'candidate partition member'));
  const q=v22Choice(opts,answer,v22TrialBase(cell,demand));
  q.rule='The symbol <b>∥</b> means “same hidden partition”; <b>⊥</b> means “separate partition”. Ignore decorative hue. '+v22FrameInstruction(cell.p);
  q.witness='<div class="v22-law">'+v22RelationLine(target.id+' '+v22Feature(target.bits,''),'∥',trainSame.id+' '+v22Feature(trainSame.bits,''))+v22RelationLine(target.id+' '+v22Feature(target.bits,''),'⊥',trainDiff.id+' '+v22Feature(trainDiff.bits,''))+'</div>';
  q.prompt='Which candidate must share '+v22Esc(target.id)+'’s hidden DIVISION?';
  q.explanation='<b>DIVISION</b> is lawful partitioning. The demonstrations reveal which structural coordinate—or at higher levels, which parity relation—defines the groups. The correct candidate preserves that latent partition, not the most visually similar surface.';
  q.skillTags=v22Unique([demand,'abstraction','interference']);q.lureKeys=['surface','wrong-coordinate','opposite-class'];return q;
}

/* CONNECTION · multi-step graph and transformation of consequence */
function v22GenConnection(cell,demand){
  const level=v22Level(),nodes=v22Shuffle(['A','B','C','D','E','F']),len=level<6?3:level<11?4:5,chain=nodes.slice(0,len),gF=v22Pick(V22_OP_GLYPHS),gR=v22Pick(V22_OP_GLYPHS.filter(x=>x!==gF)),lines=[];
  for(let i=0;i<chain.length-1;i++)lines.push(v22RelationLine(chain[i],gF,chain[i+1]));
  lines.unshift(v22RelationLine(chain[1],gR,chain[0]));
  const reverse=cell.p==='i'||demand==='mutual',from=reverse?chain[len-1]:chain[0],to=reverse?chain[0]:chain[len-1],rel=reverse?gR:gF;
  const options=[rel,gF===rel?gR:gF,'∥','?'].map(x=>v22Card(x,'derived relation','between '+from+' and '+to));
  const q=v22Choice(options,0,v22TrialBase(cell,demand));
  const consequence=level>=10?'<div class="v22-consequence">Function transfer: '+chain[len-1]+' is marked HIGH PRIORITY. Priority follows the reverse of '+v22Esc(gF)+'.</div>':'';
  q.rule='<b>'+v22Esc(gF)+'</b> is a directional relation; <b>'+v22Esc(gR)+'</b> is its inverse. Compose every edge. '+v22FrameInstruction(cell.p);
  q.witness='<div class="v22-law">'+lines.join('')+consequence+'</div>';
  q.prompt='Which relation is necessarily true from <b>'+from+'</b> to <b>'+to+'</b>?';
  q.explanation='<b>CONNECTION</b> is not visible in a single edge: it is derived through the path. The answer composes the entire chain and reverses the relation when the focal perspective changes.';
  q.skillTags=v22Unique([demand,'combine','mutual'].concat(level>=10?['transform']:[]));q.lureKeys=['inverse-confusion','local-edge','underdetermined'];return q;
}

/* MULTIPLICATION · recursion, cycle and fixed point */
function v22GenRecursion(cell,demand){
  const level=v22Level(),m=level<8?3:4,op=v22Pick([1,2,3,4]),glyph=v22Pick(V22_OP_GLYPHS),start=[v22Rnd(m),v22Rnd(m)],steps=level<5?2:level<11?3:5;
  const trace=[start];for(let i=0;i<steps;i++)trace.push(v22ApplyOp(trace[trace.length-1],op,m));
  const result=trace[steps],prev=trace[steps-1],oneMore=v22ApplyOp(result,op,m),wrong=v22ApplyOp(start,op===1?2:1,m);
  let vals=v22Unique([v22StateText(result),v22StateText(prev),v22StateText(oneMore),v22StateText(wrong)]);while(vals.length<4)vals.push(v22StateText([v22Rnd(m),v22Rnd(m)]));vals=v22Unique(vals).slice(0,4);while(vals.length<4)vals.push(v22StateText([vals.length%m,(vals.length+1)%m]));
  const opts=vals.map((x,i)=>v22Card('ITERATE '+(i+1),x,i?'cycle lure':'derived state'));
  const q=v22Choice(opts,vals.indexOf(v22StateText(result)),v22TrialBase(cell,demand));
  const demoStart=[0,1],demoNext=v22ApplyOp(demoStart,op,m);
  q.rule='The contextual operator repeats itself. Count iterations, preserve order, and detect recurrence. '+v22FrameInstruction(cell.p);
  q.witness='<div class="v22-law">'+v22RelationLine(v22StateText(demoStart),glyph,v22StateText(demoNext))+'<hr><span>Start '+v22StateText(start)+'; apply '+v22Esc(glyph)+' exactly <b>'+steps+'</b> times.</span></div>';
  q.prompt='Which state is produced by recursive MULTIPLICATION?';
  q.explanation='<b>MULTIPLICATION</b> is iteration of one generator. The correct state is reached after exactly '+steps+' applications; the neighbouring cycle states represent stopping early or overrunning the bound.';
  q.skillTags=v22Unique([demand,'combine','bounds']);q.lureKeys=['frozen','overrun','operator-substitution'];return q;
}

/* PROJECTION · higher-order structural analogy */
function v22GenAnalogy(cell,demand){
  const level=v22Level(),src=['A','B','C'],dst=['X','Y','Z'],r1=v22Pick(V22_OP_GLYPHS),r2=v22Pick(V22_OP_GLYPHS.filter(x=>x!==r1)),roles=v22Shuffle(['hub','left','right']);
  const source=[v22RelationLine(src[0],r1,src[1]),v22RelationLine(src[0],r2,src[2]),level>=9?v22RelationLine(src[1],r2,src[2]):''].join('');
  const correct=[v22RelationLine(dst[0],r1,dst[1]),v22RelationLine(dst[0],r2,dst[2]),level>=9?v22RelationLine(dst[1],r2,dst[2]):''].join('');
  const swap=[v22RelationLine(dst[0],r2,dst[1]),v22RelationLine(dst[0],r1,dst[2]),level>=9?v22RelationLine(dst[1],r2,dst[2]):''].join('');
  const reverse=[v22RelationLine(dst[1],r1,dst[0]),v22RelationLine(dst[2],r2,dst[0]),level>=9?v22RelationLine(dst[2],r2,dst[1]):''].join('');
  const broken=[v22RelationLine(dst[0],r1,dst[1]),v22RelationLine(dst[2],r2,dst[0]),level>=9?v22RelationLine(dst[1],r1,dst[2]):''].join('');
  const opts=[correct,swap,reverse,broken].map((x,i)=>v22Card('PROJECTION '+(i+1),x,'surface family '+v22Pick(V22_HUES)));
  const q=v22Choice(opts,0,v22TrialBase(cell,demand));
  q.rule='Map <b>roles and relations</b>, not letters, positions or colours. '+v22FrameInstruction(cell.p);
  q.witness='<div class="v22-law"><span>Source structure:</span>'+source+'<small>Role labels are withheld; infer the relational topology.</small></div>';
  q.prompt='Which unlike surface is an exact structural PROJECTION of the source?';
  q.explanation='<b>PROJECTION</b> preserves relational topology across a new register. The correct option retains direction, operator identity and—at advanced levels—the relation between the dependent nodes.';
  q.skillTags=v22Unique([demand,'transform','abstraction']);q.lureKeys=['relation-swap','global-reversal','partial-match'];return q;
}

/* ENCOMPASSMENT · nested scope and perspective */
function v22GenScope(cell,demand){
  const level=v22Level(),outer='Ω',inner='Q',deep='R',objects=['a','b','c','d'],target=v22Pick(objects),insideInner=new Set(v22Shuffle(objects).slice(0,2)),insideDeep=new Set(level>=10?[v22Pick([...insideInner])]:[]),initial={};objects.forEach(x=>initial[x]=v22Rnd(2));
  const affected=insideDeep.size?insideDeep:insideInner,final=Object.assign({},initial);affected.forEach(x=>final[x]=1-final[x]);
  const answer=final[target],options=[0,1,'BOTH','UNDETERMINED'].map(x=>v22Card(String(x),x===0?'inactive':x===1?'active':'scope claim','final state of '+target));
  const q=v22Choice(options,answer,v22TrialBase(cell,demand));
  const place=objects.map(x=>x+'='+initial[x]+' '+(insideDeep.has(x)?'inside R':insideInner.has(x)?'inside Q':'inside Ω only')).join(' · ');
  q.rule='The flip rule applies only inside <b>'+(insideDeep.size?deep:inner)+'</b>. A container’s law does not leak across its boundary. '+v22FrameInstruction(cell.p);
  q.witness='<div class="v22-law"><div class="v22-nest"><b>'+outer+'</b> contains <b>'+inner+'</b>'+(insideDeep.size?', which contains <b>'+deep+'</b>':'')+'.</div><span>'+place+'</span></div>';
  q.prompt='After the local rule flips 0↔1, what is <b>'+target+'</b>’s state?';
  q.explanation='<b>ENCOMPASSMENT</b> controls scope. First locate '+target+' in the nested hierarchy; then apply the transformation only if the object lies inside the active boundary. Perspective changes wording, not containment truth.';
  q.skillTags=v22Unique([demand,'interference','transform','bounds']);q.lureKeys=['scope-leak','container-confusion','underdetermined'];return q;
}

/* COMPLETION · exact constraint satisfaction */
function v22SubsetText(s){return '{ '+s.join(' · ')+' }'}
function v22GenConstraints(cell,demand){
  const level=v22Level(),U=['A','B','C','D','E','F'],k=level<6?3:level<11?4:5,correct=v22Shuffle(U).slice(0,k).sort(),required=correct[0],pair=v22Shuffle(U.filter(x=>x!==required)).slice(0,2),pairCount=correct.filter(x=>pair.includes(x)).length;
  const exactly=Math.max(0,Math.min(2,pairCount)),excluded=v22Pick(U.filter(x=>!correct.includes(x)).length?U.filter(x=>!correct.includes(x)):U.slice(-1));
  function valid(s){return s.length===k&&s.includes(required)&&!s.includes(excluded)&&s.filter(x=>pair.includes(x)).length===exactly}
  const lures=[];
  const all=[];for(let mask=1;mask<(1<<U.length);mask++){const s=U.filter((_,i)=>mask&(1<<i));if(v22SubsetText(s)!==v22SubsetText(correct))all.push(s)}
  for(const s of v22Shuffle(all)){if(!valid(s)&&!lures.some(x=>v22SubsetText(x)===v22SubsetText(s)))lures.push(s);if(lures.length===3)break}
  const opts=[correct,...lures].map((s,i)=>v22Card('SET '+(i+1),v22SubsetText(s),s.length+' members'));
  const q=v22Choice(opts,0,v22TrialBase(cell,demand));
  q.rule='A completion must satisfy <b>every</b> lower bound, upper bound and exclusion—without surplus. '+v22FrameInstruction(cell.p);
  q.witness='<div class="v22-law"><ul><li>Exactly <b>'+k+'</b> members.</li><li><b>'+required+'</b> is required.</li><li><b>'+excluded+'</b> is forbidden.</li><li>Exactly <b>'+exactly+'</b> of '+pair.join(' / ')+'.</li></ul></div>';
  q.prompt='Which set achieves exact COMPLETION?';
  q.explanation='<b>COMPLETION</b> is conjunctive closure: the answer meets all constraints simultaneously. Each lure either remains incomplete, exceeds a bound, violates an exclusion or satisfies only the most salient condition.';
  q.skillTags=v22Unique([demand,'bounds','interference']);q.lureKeys=['lower-bound','upper-bound','exclusion'];return q;
}

function v22Generate(cell,demand){
  const gens={all:v22GenEquivalence,difference:v22GenDifference,action:v22GenAction,division:v22GenDivision,connection:v22GenConnection,multiplication:v22GenRecursion,projection:v22GenAnalogy,encompassment:v22GenScope,completion:v22GenConstraints};
  const t=(gens[cell.base]||v22GenEquivalence)(cell,demand);
  t.key=v22Key(cell.base,cell.p,cell.family);t.askKey=V22_FAMILY_NAME[cell.family];t.categoryMeaning=V22_CATEGORY_MEANING[cell.base];
  return t;
}
function v22ValidateTrial(t){
  if(!t||!t.v22)throw new Error('V22 generator returned no trial.');
  if(!Array.isArray(t.options)||t.options.length!==4)throw new Error('V22 trial must expose four options.');
  if(!Number.isInteger(t.answer)||t.answer<0||t.answer>=t.options.length)throw new Error('V22 answer index is invalid.');
  if(!t.prompt||!t.explanation||!t.rule)throw new Error('V22 trial is missing instructional content.');
  if(!V22_BASES.includes(t.base)||!V22_FRAMES[t.p])throw new Error('V22 ontology address is invalid.');
  return true;
}
function v22Finish(k){
  const t=state.trial;if(!t||!t.v22||state.phase!=='ask')return;state.phase='feedback';try{stopClock()}catch(e){}
  const ok=k===t.answer,buttons=$('answer-zone').querySelectorAll('.v22-option');
  buttons.forEach((b,i)=>{b.disabled=true;if(i===t.answer)b.classList.add(i===k?'picked-right':'reveal-right');else if(i===k)b.classList.add('picked-wrong')});
  const fb=$('feedback');fb.className='feedback '+(ok?'good':'bad');fb.textContent=k===null?'⌛ RELATION UNRESOLVED':ok?'◆ STRUCTURE PRESERVED':'✕ SURFACE DECEIVED';
  $('explain').innerHTML=t.explanation+' <span class="address-chip" title="category · operation · frame">'+t.ontologyCode.join('·')+'</span>';
  try{recordResult(ok)}catch(e){console.warn('V22 result fallback',e);v22RecordEvidence(ok,t)}
  v22ClampLevelAndSync();v22ScheduleSave();try{showNext()}catch(e){setTimeout(()=>runTrial(),700)}
}
function v22Run(t){
  v22ValidateTrial(t);clearTrialUI();state.form='v22';state.trial=t;state.phase='ask';state._askAt=Date.now();state._ontologyTargetBase=t.base;state._ontologyTargetP=t.p;state._relDemand=t.demand;state.ontology={base:t.base,p:t.p};
  $('rule-banner').innerHTML='<span class="v22-category">'+t.base.toUpperCase()+' · '+V22_FRAMES[t.p]+'</span><br>'+t.rule;
  $('task-zone').innerHTML='<div class="v22-prompt">'+t.prompt+'</div>'+t.witness;
  $('answer-zone').innerHTML='<div class="v22-options">'+t.options.map((x,i)=>'<button class="v22-option" data-i="'+i+'">'+x+'</button>').join('')+'</div>';
  $('answer-zone').querySelectorAll('.v22-option').forEach(b=>b.onclick=()=>v22Finish(Number(b.dataset.i)));
  try{startClock(t.t,()=>v22Finish(null))}catch(e){}
}
function v22RecordEvidence(ok,t){
  if(!t||!t.v22)return;const z=v22Stat(t.key),rt=state._askAt?Date.now()-state._askAt:0;v22Clock++;z.a++;if(ok)z.c++;z.last=v22Clock;if(rt)z.rt=z.rt?Math.round(z.rt*.75+rt*.25):rt;
  if(!ok&&t.lureKeys&&t.lureKeys.length){const k=t.lureKeys[0];z.errors[k]=(z.errors[k]||0)+1}
  v22RenderPanel();
}
