const fs = require('node:fs'), vm = require('node:vm'), assert = require('node:assert/strict');
const dir = require('node:path').join(__dirname, '../extension/');
const core = fs.readFileSync(dir+'core.js','utf8'), content = fs.readFileSync(dir+'content.js','utf8');
const context = { URL }; vm.runInNewContext(core, context); const Q = context.Quanta;
const relay = 'https://quanta.bits-pilani.ac.in/auth/saml2/login.php?wants&idp=abc&passive=off';
function flow(r=relay, id='C042gmm8v') { const next=new URL('https://accounts.google.com/o/saml2/continue'); next.searchParams.set('idpid',id); next.searchParams.set('RelayState',r); const u=new URL('https://accounts.google.com/v3/signin/accountchooser'); u.searchParams.set('continue',next.href); return u.href; }
const valid=flow(); let count=0;
function test(name, fn){ fn(); count++; console.log('PASS '+name); }
const one='f20260000@goa.bits-pilani.ac.in', two='f20260001@hyd.bits-pilani.ac.in';
test('Quanta SAML accepted',()=>assert.equal(Q.quantaFlow(valid),true));
for(const [name,url] of Object.entries({ordinary:'https://accounts.google.com/v3/signin/accountchooser?continue=https://mail.google.com',otherSite:flow('https://example.com/auth/saml2/login.php'),lookalike:flow('https://quanta.bits-pilani.ac.in.evil.test/auth/saml2/login.php'),http:flow(relay.replace('https:','http:')),wrongPath:flow('https://quanta.bits-pilani.ac.in/my/'),wrongIdp:flow(relay,'other'),password:valid.replace('accountchooser','challenge/pwd'),malformed:'garbage'})) test('Reject '+name,()=>assert.equal(Q.quantaFlow(url),false));
test('One student selected',()=>assert.equal(Q.choose(['person@gmail.com',one]),one));
test('Multiple students left manual',()=>assert.equal(Q.choose([one,two]),null));
test('Preferred account selected',()=>assert.equal(Q.choose([one,two],two),two));
test('Missing preferred account never substitutes',()=>assert.equal(Q.choose([one],two),null));
test('Duplicate account markers deduplicated',()=>assert.equal(Q.choose([one,one]),one));
test('Future campus accepted',()=>assert.equal(Q.student('f20261234@newcampus.bits-pilani.ac.in'),true));
test('Suffix spoof rejected',()=>assert.equal(Q.college('f20260000@goa.bits-pilani.ac.in.evil.test'),false));
async function run(url,emails,settings={}, extra={}) {
 let clicks=0; const location=new URL(url); const cards=emails.map(email=>({getAttribute:k=>k==='data-identifier'?email:null,closest:()=>({getClientRects:()=>[1],getAttribute:()=>null,click:()=>clicks++})}));
 const button={href:'https://quanta.bits-pilani.ac.in/auth/saml2/login.php?idp=abc',textContent:'Login via BITS Gmail',getClientRects:()=>[1],click:()=>clicks++};
 const ctx={URL,location,window:{},chrome:{storage:{local:{get:async()=>({enabled:true,preferredEmail:'',...settings})},onChanged:{addListener:()=>{}}}},document:{documentElement:{},querySelector:()=>null,querySelectorAll:s=>s.startsWith('a.')?[button]:cards},MutationObserver:class{observe(){} disconnect(){}},setTimeout:()=>1,clearTimeout:()=>{},addEventListener:()=>{},sessionStorage:{getItem:()=>null,setItem:()=>{}},Date,...extra}; ctx.window.top=ctx.window;
 vm.runInNewContext(core,ctx);vm.runInNewContext(content,ctx); await new Promise(resolve=>setImmediate(resolve)); return clicks;
}
(async()=>{
 for(const [name,url,emails,settings,expected] of [['Clicks valid chooser once',valid,[one],{},1],['Unrelated Google untouched','https://accounts.google.com/v3/signin/accountchooser',[one],{},0],['Disabled untouched',valid,[one],{enabled:false},0],['Ambiguous chooser untouched',valid,[one,two],{},0],['Preferred chooser works',valid,[one,two],{preferredEmail:two},1],['Quanta login button works','https://quanta.bits-pilani.ac.in/login/index.php?loginredirect=1',[],{},1],['Dashboard untouched','https://quanta.bits-pilani.ac.in/my/',[],{},0],['Logout untouched','https://quanta.bits-pilani.ac.in/login/index.php?logout=1',[],{},0]]) {assert.equal(await run(url,emails,settings),expected,name); count++; console.log('PASS '+name);}
 assert.equal(await run(valid,[one],{}, {sessionStorage:{getItem:()=>String(Date.now()),setItem:()=>{}}}),0);count++;
 console.log(`${count} checks passed`);
})().catch(e=>{console.error(e);process.exitCode=1;});

