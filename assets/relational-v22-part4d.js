v22InstallStyle();v22InstallControls();v22InstallCodex();v22PatchReset();
const v22Restored=v22Restore();v22ClampLevelAndSync();v22RenderPanel();
const v22TestReport=v22SelfTest(8);
const title=document.querySelector('.module-badge');if(title)title.textContent='RELATIONALITY V22';
const tagV22=document.querySelector('.tagline');if(tagV22)tagV22.innerHTML='One practice · 15 persistent levels · derive the invariant, expose the deception <span style="opacity:.45">· V22</span>';
window.addEventListener('beforeunload',v22Save);document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')v22Save()});
window.__RELATIONAL_V22__=true;
try{console.log('RELATIONALITY V22 active · '+v22TestReport.trials+' generator simulations passed · persistent level '+state.level+(v22Restored?' restored':''))}catch(e){}
renderIdle();try{renderMastery();renderStats();renderOntologyPanel()}catch(e){}
}
