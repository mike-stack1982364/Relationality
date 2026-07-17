'use strict';
(()=>{
const style=document.createElement('style');
style.id='v28-child-readable-instruction';
style.textContent=`
/* Keep the active trial instruction unmistakable at a glance. */
body:not(.v28-idle) #task-zone{
  display:flex!important;
  align-items:center!important;
  justify-content:center!important;
  min-height:72px!important;
  padding:14px 24px!important;
  box-sizing:border-box!important;
  background:#fff!important;
  border:2px solid #d4c590!important;
  border-radius:16px!important;
  box-shadow:0 5px 14px rgba(49,39,92,.08)!important;
  color:#31275c!important;
  font-size:clamp(1.45rem,1.05rem + 1.05vw,2.05rem)!important;
  font-weight:850!important;
  line-height:1.25!important;
  letter-spacing:.005em!important;
  text-align:center!important;
  text-wrap:balance!important;
}
body:not(.v28-idle) #task-zone *{
  color:inherit!important;
  font-size:inherit!important;
  font-weight:inherit!important;
  line-height:inherit!important;
  letter-spacing:inherit!important;
}
@media(max-width:760px){
  body:not(.v28-idle) #task-zone{
    min-height:64px!important;
    padding:12px 14px!important;
    border-radius:13px!important;
    font-size:clamp(1.2rem,5vw,1.55rem)!important;
    line-height:1.28!important;
  }
}
`;
document.head.appendChild(style);
window.__RELATIONAL_V28_READABILITY__=true;
console.log('RELATIONALITY V28 instruction readability active');
})();
