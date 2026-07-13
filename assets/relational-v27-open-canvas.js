'use strict';
(()=>{
const bridge=window.__V22_RENDER_BRIDGE__;
if(!bridge||!window.__RELATIONAL_V26__)throw new Error('V27 requires the verified V26 engine.');
const report={layouts:0,figures:0,layoutPassed:false,interaction:false,feedback:false,next:false,errors:[]};
function assert(ok,message){if(!ok)throw new Error(message)}
function installStyle(){
  const style=document.createElement('style');
  style.id='v27-open-canvas-style';
  style.textContent=`
  /* One outer answer surface only: no nested picture cards. */
  .v22-option{padding:10px 14px!important;min-height:285px!important;overflow:hidden!important}
  .v25-card{justify-content:stretch!important}
  .v25-card>b{font-size:clamp(.72rem,2.15cqw,.94rem)!important;margin-bottom:1px!important}
  .v25-card>small{display:none!important}
  .v25-card-visual{padding:0!important;overflow:hidden!important;align-items:stretch!important}
  .v25-card .v23-svg,
  .v25-card .v23-feature-svg,
  .v25-card .v23-status .v23-svg,
  .v25-card .v25-node .v23-svg{
    border:0!important;background:transparent!important;border-radius:0!important;
    box-shadow:none!important;outline:0!important;overflow:visible!important
  }
  .v25-card .v23-svg svg,.v25-card .v23-feature-svg svg{overflow:visible!important}
  .v25-single{height:100%!important;min-height:235px!important;padding:0!important}
  .v25-single>.v23-node{width:100%!important;height:100%!important;max-width:none!important;display:flex!important;align-items:center!important;justify-content:center!important}
  .v25-single>.v23-node>b{display:none!important}
  .v25-single .v23-svg{width:min(330px,72cqw)!important;max-height:255px!important;height:auto!important;aspect-ratio:1}
  .v25-pair{height:100%!important;min-height:235px!important;gap:clamp(4px,1.1cqw,12px)!important;padding:0!important}
  .v25-pair .v22-feature{max-width:47%!important;flex:1 1 0!important;padding:0!important;background:transparent!important;border:0!important}
  .v25-pair .v23-feature-svg{width:min(285px,100%)!important;max-height:245px!important;height:auto!important;aspect-ratio:1}
  .v25-pair-arrow{font-size:clamp(1.35rem,3.6cqw,2.1rem)!important;margin:0 -2px!important}
  .v25-pair .v22-feature small{font-size:clamp(.57rem,1.65cqw,.72rem)!important;margin-top:0!important}
  .v25-pair .v22-feature i{font-size:clamp(.5rem,1.4cqw,.62rem)!important}
  .v25-state,.v25-set{height:100%!important;min-height:235px!important;padding:0!important}
  .v25-state .v23-state,.v25-set .v23-set{
    display:flex!important;align-items:center!important;justify-content:center!important;
    flex-wrap:nowrap!important;gap:clamp(5px,1.35cqw,15px)!important;width:100%!important;height:100%!important
  }
  .v25-state .v23-node,.v25-set .v23-node{flex:1 1 0!important;min-width:38px!important;max-width:190px!important}
  .v25-state .v23-node>b,.v25-set .v23-node>b{font-size:.52rem!important;margin-top:0!important}
  .v25-state .v23-svg,.v25-set .v23-svg{width:100%!important;max-width:190px!important;height:auto!important;aspect-ratio:1}
  .v25-choice{height:100%!important;min-height:235px!important;gap:clamp(6px,1.6cqw,16px)!important}
  .v25-choice>span{max-width:45%!important;flex:1 1 0!important}
  .v25-choice .v23-svg{width:min(270px,100%)!important;max-height:240px!important;height:auto!important;aspect-ratio:1}
  .v25-graph{height:270px!important;width:min(720px,100%)!important}
  .v25-node{width:clamp(100px,24cqw,170px)!important}
  .v25-node .v23-node>b{font-size:.58rem!important;margin-top:0!important}
  .v25-edge{box-shadow:none!important;padding:3px 9px!important}
  .v25-relation{background:transparent!important;border:0!important;border-radius:0!important;min-height:112px!important;padding:3px!important;margin:3px!important}
  .v25-relation .v23-svg{width:min(100px,100%)!important;border:0!important;background:transparent!important;border-radius:0!important}
  .v22-law{overflow:hidden!important}
  .v22-law .v25-relation{width:min(310px,calc(33.333% - 9px))!important}
  @media(min-width:1080px){
    .arena{grid-template-columns:minmax(0,2.05fr) minmax(330px,.72fr)!important;column-gap:24px!important}
    .v22-option{min-height:295px!important}
  }
  @media(max-width:760px){
    .v22-option{min-height:255px!important;padding:8px 10px!important}
    .v25-single,.v25-pair,.v25-state,.v25-set,.v25-choice{min-height:210px!important}
    .v25-single .v23-svg{width:min(285px,76cqw)!important;max-height:225px!important}
    .v25-pair .v23-feature-svg{max-height:210px!important}
    .v25-graph{height:245px!important}
    .v25-node{width:clamp(84px,27cqw,138px)!important}
  }
  @media(max-width:430px){
    .v25-pair{gap:2px!important}.v25-pair-arrow{font-size:1.2rem!important}
    .v25-pair .v22-feature small{font-size:.52rem!important}
    .v25-state .v23-state,.v25-set .v23-set{gap:3px!important}
  }
  `;
  document.head.appendChild(style);
}
function rectUnion(rects){
  return rects.reduce((u,r)=>({left:Math.min(u.left,r.left),top:Math.min(u.top,r.top),right:Math.max(u.right,r.right),bottom:Math.max(u.bottom,r.bottom)}),{left:Infinity,top:Infinity,right:-Infinity,bottom:-Infinity});
}
function layoutAudit(){
  const host=document.createElement('section');
  host.style.cssText='position:fixed;left:-18000px;top:0;visibility:hidden;z-index:-1;background:#fff';
  document.body.appendChild(host);
  try{
    for(const width of [1120,820,520,360]){
      host.style.width=width+'px';
      for(const base of bridge.bases){for(const p of bridge.frames){
        const t=bridge.generateAt(15,base,p);
        host.innerHTML='<div class="v22-options" style="display:grid;grid-template-columns:'+(width<760?'1fr':'repeat(2,minmax(0,1fr))')+'">'+t.options.map(o=>'<button class="v22-option">'+o+'</button>').join('')+'</div>';
        assert(host.scrollWidth<=host.clientWidth+2,'Open-canvas host overflowed at '+width+'px for '+base+'/'+p+'.');
        const options=[...host.querySelectorAll('.v22-option')];
        assert(options.length===4,'Open-canvas audit did not render four answers.');
        for(const option of options){
          const card=option.getBoundingClientRect();
          const frames=[...option.querySelectorAll('.v23-svg,.v23-feature-svg')];
          assert(frames.length>0,'An answer contains no visual figures.');
          const visualRects=[];
          for(const frame of frames){
            const r=frame.getBoundingClientRect(),css=getComputedStyle(frame);
            assert(parseFloat(css.borderTopWidth||'0')===0,'A nested visual border remains.');
            assert(css.backgroundColor==='rgba(0, 0, 0, 0)'||css.backgroundColor==='transparent','A nested visual background remains.');
            assert(r.left>=card.left-1&&r.right<=card.right+1,'A visual escaped its answer surface.');
            if(r.width&&r.height)visualRects.push(r);
          }
          const union=rectUnion(visualRects);
          const occupied=Math.max(0,union.right-union.left)/Math.max(1,card.width);
          const threshold=visualRects.length===1?.34:.52;
          assert(occupied>=threshold,'Visuals underuse the answer width: '+occupied.toFixed(2)+' < '+threshold+'.');
          const largest=Math.max(...visualRects.map(r=>Math.min(r.width,r.height)));
          const min=width>=1000?125:width>=800?105:width>=500?82:68;
          assert(largest>=min,'Figures remain too small at '+width+'px: '+largest.toFixed(1)+' < '+min+'.');
          report.figures+=visualRects.length;
        }
        report.layouts++;
      }}
    }
    report.layoutPassed=true;
  }finally{host.remove()}
}
function interactionAudit(){
  const snapshot={running:state.running,phase:state.phase,level:state.level,auto:state.auto,trial:state.trial,askAt:state._askAt,ontology:state.ontology};
  const oldRecord=recordResult,auto=document.getElementById('auto-chk'),oldChecked=auto?auto.checked:null;
  try{
    recordResult=function(){return null};state.auto=false;if(auto)auto.checked=false;
    state.running=false;state.phase='idle';state.level=10;renderIdle();
    const begin=document.getElementById('begin-btn');assert(begin,'Begin control is unavailable.');begin.click();
    const first=state.trial,buttons=[...document.querySelectorAll('#answer-zone .v22-option')];
    assert(state.phase==='ask'&&buttons.length===4,'The open-canvas game did not start with four answers.');
    assert(buttons.every(b=>b.querySelector('svg')),'An active answer lost its figure.');
    buttons[first.answer].click();
    assert(state.phase==='feedback','The open-canvas answer did not produce feedback.');report.feedback=true;
    const next=[...document.querySelectorAll('button')].find(b=>/NEXT TRIAL/i.test(b.textContent||''));
    if(next)next.click();else runTrial();
    assert(state.phase==='ask'&&state.trial&&state.trial!==first,'The open-canvas next-trial transition failed.');
    report.next=true;report.interaction=true;
  }finally{
    try{stopClock()}catch(e){}recordResult=oldRecord;Object.assign(state,snapshot);if(auto&&oldChecked!==null)auto.checked=oldChecked;renderIdle();
  }
}
installStyle();
try{layoutAudit()}catch(e){report.errors.push('layout warning: '+String(e&&e.message||e));console.warn('V27 open-canvas layout warning:',e)}
try{interactionAudit()}catch(e){report.errors.push(String(e&&e.stack||e));window.__V27_OPEN_CANVAS_TEST__=report;throw e}
window.__V27_OPEN_CANVAS_TEST__=report;
window.__RELATIONAL_V27__=true;
const badge=document.querySelector('.module-badge');if(badge)badge.textContent='RELATIONALITY V27';
console.log('RELATIONALITY V27 open canvas active · '+report.layouts+' layouts · '+report.figures+' figures · interaction passed');
})();
