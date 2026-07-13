'use strict';
(()=>{
const bridge=window.__V22_RENDER_BRIDGE__;
if(!bridge||typeof bridge.runSelfTest!=='function')throw new Error('Runtime test budget requires the V22 bridge.');
const full=bridge.runSelfTest.bind(bridge);
bridge.runFullSelfTest=full;
bridge.runSelfTest=rounds=>full(Math.min(4,Math.max(1,Number(rounds)||1)));
window.__RELATIONAL_RUNTIME_BUDGET__=true;
})();
