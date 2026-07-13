v22InstallStyle();v22InstallControls();v22InstallCodex();v22PatchReset();
const v22Restored=v22Restore();v22ClampLevelAndSync();v22RenderPanel();
const v22TestReport=v22SelfTest(8);
const title=document.querySelector('.module-badge');if(title)title.textContent='RELATIONALITY V22';
const tagV22=document.querySelector('.tagline');if(tagV22)tagV22.innerHTML='One practice · 15 persistent levels · derive the invariant, expose the deception <span style="opacity:.45">· V22</span>';
window.addEventListener('beforeunload',v22Save);document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')v22Save()});
const _v22BridgeValidate=v22ValidateTrial,_v22BridgeGenerate=v22Generate;
let _v22BridgeGenerateWrapped=false;
window.__V22_RENDER_BRIDGE__={
  install(r){
    if(r&&typeof r.card==='function')v22Card=r.card;
    if(r&&typeof r.relationLine==='function')v22RelationLine=r.relationLine;
    if(r&&typeof r.feature==='function')v22Feature=r.feature;
    if(r&&typeof r.validate==='function')v22ValidateTrial=function(t){_v22BridgeValidate(t);return r.validate(t)};
    if(!_v22BridgeGenerateWrapped){
      v22Generate=function(cell,demand){
        let lastError=null;
        for(let attempt=0;attempt<32;attempt++){
          const trial=_v22BridgeGenerate(cell,demand);
          try{v22ValidateTrial(trial);return trial}catch(e){lastError=e}
        }
        throw lastError||new Error('Unable to generate a unique valid visual trial.');
      };
      _v22BridgeGenerateWrapped=true;
    }
  },
  runSelfTest(rounds){return v22SelfTest(Math.max(1,Number(rounds)||1))},
  regenerate(){if(state.running)runTrial();else renderIdle()},
  validateTrial(t){return v22ValidateTrial(t)},
  generateAt(level,base,p,demand){
    const prior=state.level;
    try{
      state.level=v22Clamp(level,1,V22_MAX_LEVEL);
      const family=V22_FAMILY[base],cell={base,p,family,key:v22Key(base,p,family)};
      return v22Generate(cell,demand||v22DemandFor(base,p));
    }finally{state.level=prior}
  },
  bases:V22_BASES.slice(),frames:['a','i','o']
};
window.__RELATIONAL_V22__=true;
try{console.log('RELATIONALITY V22 active · '+v22TestReport.trials+' generator simulations passed · persistent level '+state.level+(v22Restored?' restored':''))}catch(e){}
renderIdle();try{renderMastery();renderStats();renderOntologyPanel()}catch(e){}
}
