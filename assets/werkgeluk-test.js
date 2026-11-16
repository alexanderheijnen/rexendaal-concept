(function(){
if(!document.getElementById('rx-test'))return;
const KEYS=[
 {id:'meaning',name:'Meaning',nl:'Betekenis',det:'Doel + waarden',stmt:'Mijn werk sluit aan bij mijn waarden, overtuigingen en wat ik belangrijk vind in het leven.',
  brings:'Idealen, ethiek, loyaliteit aan de missie en betrokkenheid.',gets:'Gevoel van zin, betekenis en morele congruentie.',invests:'Duidelijke koers, ethisch leiderschap en maatschappelijke waarde.',receives:'Ambassadeurs, intrinsieke loyaliteit en cultuurdragers.',
  lead:'Ik weet per teamlid wat hij of zij in dit werk zinvol vindt, en waar het schuurt met eigen waarden.'},
 {id:'drive',name:'Drive',nl:'Energie & talent',det:'Interesses + talenten',stmt:'Mijn werk benut mijn interesses, energie en natuurlijke talenten.',
  brings:'Natuurlijke energie, passie en unieke kernkwaliteiten.',gets:'Focus, werkplezier en de ervaring van flow.',invests:'Talentgerichte cultuur, passend takenpakket en rollenmobiliteit.',receives:'Hoge productiviteit, innovatiekracht en proactieve inzet.',
  lead:'Ik weet per teamlid welke taken energie geven, en welke energie kosten.'},
 {id:'growth',name:'Growth',nl:'Groei & ontwikkeling',det:'Uitdaging + ontwikkeling',stmt:'Mijn werk biedt uitdaging en mogelijkheden om te leren en te groeien.',
  brings:'Leerbereidheid, stretch-capaciteit en groeimotivatie.',gets:'Nieuwe kennis, competenties en perspectief.',invests:'Ontwikkelbudget, loopbaanbegeleiding en uitdagend werk.',receives:'Toekomstbestendigheid, wendbaarheid en behoud van vakkennis.',
  lead:'Ik weet wie wil groeien, en wie juist liever stabiel vakwerk levert.'},
 {id:'impact',name:'Impact',nl:'Invloed & autonomie',det:'Vaardigheden + autonomie',stmt:'Ik heb invloed, autonomie en ruimte om mijn expertise in te zetten.',
  brings:'Expertise, vakmanschap en probleemoplossend vermogen.',gets:'Invloed, eigenaarschap en ruimte om het verschil te maken.',invests:'Mandaat, minder bureaucratie, geen micromanagement.',receives:'Snelle besluitvorming, kwaliteit en strakke uitvoering.',
  lead:'Ik weet wie meer ruimte en mandaat wil, en voor wie te veel vrijheid juist onrust geeft.'},
 {id:'connection',name:'Connection',nl:'Verbondenheid',det:'Verbondenheid + erkenning',stmt:'Ik voel mij verbonden met collega’s, leidinggevenden en de organisatie.',
  brings:'Samenwerking, open feedback en collegiale steun.',gets:'Psychologische veiligheid, erkenning en erbij horen.',invests:'Inclusief klimaat, teamontwikkeling en expliciete waardering.',receives:'Synergie, weinig onderlinge frictie, sterk psychologisch contract.',
  lead:'Ik weet per teamlid hoeveel verbinding en zichtbare erkenning hij of zij nodig heeft.'},
 {id:'reward',name:'Reward',nl:'Beloning & zekerheid',det:'Zekerheid + beloning',stmt:'De beloning, waardering en zekerheid passen bij mijn verwachtingen en behoeften.',
  brings:'Tijd, betrouwbaarheid en langdurige commitment.',gets:'Financiële rust, stabiliteit en voorspelbaarheid.',invests:'Marktconform salaris, goede voorwaarden en contracthelderheid.',receives:'Continuïteit, lage wervingskosten en rust in de bezetting.',
  lead:'Ik weet wat zekerheid en beloning voor ieder teamlid betekenen in deze levensfase.'},
 {id:'fit',name:'Personal Fit',nl:'Werkstijl & leven',det:'Werkstijl + levensintegratie',stmt:'Mijn werk sluit aan bij mijn gewenste werkstijl, levensfase en privéleven.',
  brings:'Flexibiliteit, focus op resultaat en inzet naar situatie.',gets:'Flexibiliteit, eigen werkstijl en passendheid bij de levensfase.',invests:'Flexibele kaders, sturen op output, begrip voor privé.',receives:'Duurzame inzetbaarheid, laag verzuim en focus tijdens werktijd.',
  lead:'Ik weet hoe werkstijl en privésituatie van ieder teamlid passen bij hoe wij werken.'}
];
/* ---------- werkgeluk-test ---------- */
const DET={
 doel:{k:0,l:'Zingeving'}, waarden:{k:0,l:'Waarden'},
 interesses:{k:1,l:'Interesses'}, talenten:{k:1,l:'Talenten'},
 uitdaging:{k:2,l:'Uitdaging'}, ontwikkeling:{k:2,l:'Ontwikkeling'},
 vakmanschap:{k:3,l:'Vakmanschap'}, autonomie:{k:3,l:'Autonomie'},
 verbondenheid:{k:4,l:'Verbondenheid'}, erkenning:{k:4,l:'Erkenning'},
 zekerheid:{k:5,l:'Zekerheid'}, beloning:{k:5,l:'Beloning'},
 werkstijl:{k:6,l:'Werkstijl'}, levensbalans:{k:6,l:'Levensbalans'}
};
// Ronde 1: dilemma's. Elke kant telt mee voor (of tegen) één of meer determinanten.
const DIL=[
 ['Werk waarin je steeds iets nieuws moet leren',{ontwikkeling:1},'Werk dat je tot in de perfectie beheerst',{vakmanschap:1,ontwikkeling:-.5}],
 ['Een leidinggevende die je volledig vrijlaat',{autonomie:1},'Een leidinggevende die met je meedenkt en bijstuurt',{autonomie:-1}],
 ['Een team waar je je echt thuis voelt',{verbondenheid:1},'Een team van topprofessionals, met weinig persoonlijk contact',{vakmanschap:.5,verbondenheid:-1}],
 ['Een vast contract en een voorspelbare toekomst',{zekerheid:1},'Een avontuurlijke rol in een organisatie die snel groeit en snel verandert',{uitdaging:1,zekerheid:-1}],
 ['10% meer salaris',{beloning:1},'Werk dat echt bijdraagt aan iets wat jij belangrijk vindt',{doel:1}],
 ['Elke week een vrije vrijdag',{levensbalans:1},'Een sleutelrol in het belangrijkste project van de organisatie',{uitdaging:1,levensbalans:-.5}],
 ['Een directeur die jouw werk persoonlijk noemt in de nieuwjaarsspeech',{erkenning:1},'Rustig je werk doen, zonder op de voorgrond te treden',{erkenning:-1}],
 ['Werk dat precies aansluit bij waar je van nature goed in bent',{talenten:1},'Werk over onderwerpen die je fascineren, ook als het je niet vanzelf afgaat',{interesses:1}],
 ['Een organisatie die vasthoudt aan haar principes, ook als dat geld kost',{waarden:1},'Een organisatie die pragmatisch is en snel resultaat boekt',{waarden:-1}],
 ['Zelf je werktijden en werkplek bepalen',{werkstijl:1},'Een vast ritme met duidelijke afspraken en structuur',{werkstijl:-.5,zekerheid:.5}],
 ['Elke dag je vakkennis tot het uiterste inzetten',{vakmanschap:1},'Veel afwisseling, ook in taken buiten je vak',{interesses:.5,ontwikkeling:.5}],
 ['Een flinke bonus voor een uitzonderlijke prestatie',{beloning:1},'Een collega die zegt: “zonder jou was dit niet gelukt”',{erkenning:1}],
 ['Werk dat je nooit mee naar huis neemt',{levensbalans:1},'Werk dat je zo boeit dat je er ’s avonds nog over nadenkt',{interesses:1,levensbalans:-.5}],
 ['Een baan voor de lange termijn',{zekerheid:1},'Een tijdelijke rol waarin je echt het verschil maakt',{doel:1,zekerheid:-.5}],
 ['Taken die je moeiteloos afgaan',{talenten:1,uitdaging:-.5},'Taken waar je flink voor moet zweten',{uitdaging:1}],
 ['Werken bij een organisatie waar je trots over vertelt op een verjaardag',{waarden:1},'Werken bij de werkgever met de beste arbeidsvoorwaarden',{beloning:1}]
];
// Ronde 2: kaartjes
const CARDS={doel:'Het gevoel dat mijn werk ergens toe doet',waarden:'Een organisatie die handelt zoals ik het fatsoenlijk vind',interesses:'Onderwerpen die me echt boeien',talenten:'Taken waar ik van nature goed in ben',uitdaging:'Werk dat me scherp houdt',ontwikkeling:'De kans om nieuwe dingen te leren',vakmanschap:'Mijn vakkennis volop kunnen inzetten',autonomie:'Zelf bepalen hoe ik mijn werk aanpak',verbondenheid:'Mijn collega’s',erkenning:'Dat mijn werk gezien wordt',zekerheid:'Weten waar ik aan toe ben',beloning:'Mijn salaris en voorwaarden',werkstijl:'Een manier van werken die bij mij past',levensbalans:'Ruimte voor mijn privéleven'};
const OVER={uitdaging:'Druk en hoge verwachtingen',ontwikkeling:'Verandering en steeds weer iets nieuws',autonomie:'Vrijheid en eigen verantwoordelijkheid',verbondenheid:'Overleg en sociale verplichtingen',erkenning:'Zichtbaarheid en op de voorgrond staan',vakmanschap:'Diepgang in steeds hetzelfde vakgebied',zekerheid:'Vastigheid en routine',doel:'Idealen en missie-praat'};
const CARDQ=[
 {id:'mis',n:3,q:'Stel: je krijgt morgen een vergelijkbare baan elders aangeboden, met hetzelfde salaris. Wat zou je het meest <b>missen</b> als je vertrekt?',sub:'Kies er precies 3.',src:CARDS},
 {id:'gap',n:3,q:'En als je tóch zou overstappen: wat zou je bij die nieuwe werkgever vooral <b>beter</b> willen hebben dan nu?',sub:'Kies er precies 3.',src:CARDS},
 {id:'over',n:2,min:0,q:'Waar krijg je in je huidige werk eigenlijk <b>meer van dan je nodig hebt</b>?',sub:'Kies er maximaal 2, of geen.',src:OVER}
];
// Ronde 3: ruilvragen
const TRADES=[
 {q:'Zou je 5% salaris inleveren voor een vaste vrije vrijdag?',give:'salaris',get:'tijd voor je privéleven',d:'levensbalans'},
 {q:'Zou je meer verantwoordelijkheid op je nemen, als je daar meer zeggenschap voor terugkrijgt?',give:'extra verantwoordelijkheid',get:'zeggenschap',d:'autonomie'},
 {q:'Zou je je twee jaar aan je organisatie verbinden, in ruil voor een opleiding naar keuze?',give:'je commitment voor langere tijd',get:'ontwikkeling',d:'ontwikkeling'},
 {q:'Zou je vaker buiten je comfortzone werken, als dat zichtbaar gewaardeerd wordt?',give:'stretch buiten je comfortzone',get:'zichtbare waardering',d:'erkenning'},
 {q:'Zou je bij drukte flexibel inspringen, als je organisatie net zo flexibel is met jouw privéverplichtingen?',give:'flexibiliteit bij drukte',get:'flexibiliteit voor privé',d:'werkstijl'},
 {q:'Zou je een stap terug in salaris accepteren voor werk dat beter past bij wat jij belangrijk vindt?',give:'salaris',get:'zinvol werk',d:'doel'},
 {q:'Zou je je kennis actief delen en collega’s inwerken, als je daar echt tijd voor krijgt in je takenpakket?',give:'je kennis en tijd',get:'ruimte om je vak te laten zien',d:'vakmanschap'}
];
const BANK=[['rood','Ik sta rood','Ik geef meer dan ik terugkrijg'],['quitte','Ik sta quitte','Geven en krijgen zijn in balans'],['tegoed','Ik heb nog tegoed','Ik krijg meer dan ik geef']];
const TALK=[['ja','Ja, uitgebreid'],['beetje','Een beetje, terloops'],['nee','Nee, nooit']];

let W;
function wInit(){W={step:0,dil:Array(DIL.length).fill(null),cards:{mis:[],gap:[],over:[]},tr:Array(TRADES.length).fill(null),bank:null,talk:null};}
wInit();
const STEPS=[{t:'intro'},{t:'r1intro'},...DIL.map((_,i)=>({t:'dil',i})),{t:'r2intro'},...CARDQ.map((_,i)=>({t:'cards',i})),{t:'r3intro'},...TRADES.map((_,i)=>({t:'trade',i})),{t:'bank'},{t:'talk'}];
const TOTAL=DIL.length+CARDQ.length+TRADES.length+2;
function done(){return W.dil.filter(x=>x!==null).length+CARDQ.filter((c,i)=>c.min===0?W.step>STEPS.findIndex(x=>x.t==='cards'&&x.i===i):W.cards[c.id].length===c.n).length+W.tr.filter(x=>x!==null).length+(W.bank?1:0)+(W.talk?1:0);}
const back=`<button class="btn ghost" type="button" data-nav="prev">Vorige</button>`;
function wRender(){
 const s=STEPS[W.step], st=document.getElementById('w-stage');
 document.getElementById('w-progress').style.display=s.t==='intro'?'none':'block';
 const a=done(); document.getElementById('w-bar').style.width=(a/TOTAL*100)+'%'; document.getElementById('w-prog').textContent=`${a} van ${TOTAL} keuzes gemaakt`;
 let h='';
 if(s.t==='intro') h=`<div class="card" style="padding:34px"><h3>Zo werkt het</h3>
   <ul class="check"><li><b>Ronde 1, dilemma’s:</b> 16 keer kiezen tussen twee aantrekkelijke situaties.</li>
   <li><b>Ronde 2, vertrekken of blijven:</b> drie keer kaartjes kiezen over je huidige werk.</li>
   <li><b>Ronde 3, de ruil:</b> wat zou je inruilen, en waarvoor?</li></ul>
   <p class="muted" style="margin-top:16px">Er zijn geen goede of foute antwoorden: beide opties zijn steeds aantrekkelijk. Ga af op je eerste ingeving. Je antwoorden blijven in je eigen browser.</p>
   <button class="btn primary" type="button" data-nav="next">Start de test</button></div>`;
 else if(s.t==='r1intro') h=intro('Ronde 1 van 3','Dilemma’s','Je ziet steeds twee situaties. Allebei aantrekkelijk, maar je kunt er maar één kiezen. Klik op de situatie die jou het meest aantrekt.');
 else if(s.t==='dil'){const d=DIL[s.i],v=W.dil[s.i];
  h=`<span class="eyebrow">Ronde 1 · Dilemma ${s.i+1} van ${DIL.length}</span><h3 style="font-size:1.5rem">Wat zou jij kiezen?</h3>
   <div class="dil"><button type="button" class="opt${v===0?' on':''}" data-dil="0"><span>A</span>${d[0]}</button><div class="vs">of</div><button type="button" class="opt${v===1?' on':''}" data-dil="1"><span>B</span>${d[2]}</button></div>
   <div class="btns">${back}</div>`;}
 else if(s.t==='r2intro') h=intro('Ronde 2 van 3','Vertrekken of blijven?','Nu gaat het over je huidige werk. Stel je even voor dat je zou kunnen overstappen. Wat zou je meenemen, en wat laat je graag achter?');
 else if(s.t==='cards'){const c=CARDQ[s.i],sel=W.cards[c.id],ok=c.min===0?true:sel.length===c.n;
  h=`<span class="eyebrow">Ronde 2 · Vraag ${s.i+1} van ${CARDQ.length}</span><h3 style="font-size:1.4rem;line-height:1.3">${c.q}</h3><p class="muted">${c.sub} <b id="c-count">${sel.length}/${c.n}</b></p>
   <div class="cardgrid">${Object.entries(c.src).map(([id,t])=>`<button type="button" class="ccard${sel.includes(id)?' on':''}" data-card="${id}">${t}</button>`).join('')}</div>
   <div class="btns">${back}<button class="btn primary" type="button" data-nav="next" ${ok?'':'disabled'} style="${ok?'':'opacity:.45;cursor:not-allowed'}">${c.min===0&&sel.length===0?'Niets van dit alles':'Volgende'}</button></div>`;}
 else if(s.t==='r3intro') h=intro('Ronde 3 van 3','De ruil','Werk is altijd een ruil: je geeft iets en je krijgt iets terug. Zou jij deze ruil aangaan? Er is geen goed antwoord, alleen jouw antwoord.');
 else if(s.t==='trade'){const t=TRADES[s.i],v=W.tr[s.i];
  h=`<span class="eyebrow">Ronde 3 · Ruil ${s.i+1} van ${TRADES.length}</span><h3 style="font-size:1.5rem;line-height:1.3">${t.q}</h3>
   <div class="scale4" style="grid-template-columns:repeat(3,1fr)">${[['ja','Ja, zeker'],['twijfel','Ik twijfel'],['nee','Nee']].map(([k,l])=>`<button type="button" data-trade="${k}" class="${v===k?'on':''}">${l}</button>`).join('')}</div><div class="btns">${back}</div>`;}
 else if(s.t==='bank') h=`<span class="eyebrow">Ronde 3 · Bijna klaar</span><h3 style="font-size:1.5rem;line-height:1.3">Als je werk een bankrekening was, waar alles wat je geeft en alles wat je terugkrijgt op staat: hoe staat je saldo er dan voor?</h3>
   <div class="choices">${BANK.map(([k,l,x])=>`<button type="button" class="choice${W.bank===k?' on':''}" data-bank="${k}">${l}<small style="display:block;font-weight:500;color:var(--muted)">${x}</small></button>`).join('')}</div><div class="btns">${back}</div>`;
 else if(s.t==='talk') h=`<span class="eyebrow">Ronde 3 · Laatste vraag</span><h3 style="font-size:1.5rem;line-height:1.3">Heb je ooit met je leidinggevende besproken wat jij nodig hebt, en wat je daar zelf tegenover stelt?</h3>
   <div class="choices">${TALK.map(([k,l])=>`<button type="button" class="choice${W.talk===k?' on':''}" data-talk="${k}">${l}</button>`).join('')}</div><div class="btns">${back}</div>`;
 st.innerHTML=h;
}
function intro(e,t,x){return `<div class="card" style="padding:34px"><span class="eyebrow">${e}</span><h3 style="font-size:1.6rem">${t}</h3><p class="muted">${x}</p><div class="btns">${back}<button class="btn primary" type="button" data-nav="next">Verder</button></div></div>`;}
function wGo(d){
 if(d==='next'&&W.step===STEPS.length-1){wResult();return;}
 W.step=Math.max(0,Math.min(STEPS.length-1,W.step+(d==='next'?1:-1)));
 wRender(); document.getElementById('w-progress').scrollIntoView({behavior:'smooth',block:'start'});
}
const auto=()=>setTimeout(()=>wGo('next'),280);
document.getElementById('w-stage').addEventListener('click',e=>{
 const s=STEPS[W.step], t=e.target.closest('button'); if(!t) return;
 if(t.dataset.nav){if(!t.disabled)wGo(t.dataset.nav);return;}
 if(t.dataset.dil!==undefined){W.dil[s.i]=+t.dataset.dil;wRender();auto();return;}
 if(t.dataset.card){const c=CARDQ[s.i],sel=W.cards[c.id],id=t.dataset.card,ix=sel.indexOf(id);
   if(ix>-1)sel.splice(ix,1);else if(sel.length<c.n)sel.push(id);else{sel.shift();sel.push(id);} wRender();return;}
 if(t.dataset.trade){W.tr[s.i]=t.dataset.trade;wRender();auto();return;}
 if(t.dataset.bank){W.bank=t.dataset.bank;wRender();auto();return;}
 if(t.dataset.talk){W.talk=t.dataset.talk;wRender();setTimeout(wResult,280);return;}
});
document.getElementById('w-restart').onclick=()=>{wInit();document.getElementById('w-result').classList.remove('show');wRender();document.getElementById('rx-test').scrollIntoView();};
function wResult(){
 const ids=Object.keys(DET), raw={}, max={};
 ids.forEach(id=>{raw[id]=0;max[id]=0;});
 DIL.forEach((d,i)=>{const side=W.dil[i]??0, str=1;
  [[d[1],0],[d[3],1]].forEach(([m,sd])=>Object.entries(m).forEach(([id,w])=>{max[id]+=Math.abs(w); if(sd===side) raw[id]+=w*str;}));});
 const need={}; ids.forEach(id=>need[id]=max[id]?(raw[id]/max[id]+1)/2:.5); // 0..1
 // werkelijkheid uit kaartjes
 const real={}; ids.forEach(id=>{real[id]=.5; if(W.cards.mis.includes(id))real[id]=1; if(W.cards.gap.includes(id))real[id]=W.cards.mis.includes(id)?.5:0;});
 const over=W.cards.over.slice();
 const fitOf=id=>over.includes(id)&&need[id]<.5?.3:real[id];
 const wsum=ids.reduce((a,id)=>a+need[id]+.15,0);
 const fit=ids.reduce((a,id)=>a+(need[id]+.15)*fitOf(id),0)/wsum;
 const score=Math.round(Math.max(0,Math.min(1,(fit-.2)/.6))*100);
 document.getElementById('w-score').textContent=score;
 document.getElementById('w-verdict').textContent=score>=70?'Je werk levert grotendeels wat voor jou het zwaarst weegt. Weet wat je hier houdt, en houd het gesprek erover gaande.':score>=45?'Op een aantal punten past je werk goed, maar juist op sommige dingen die voor jou zwaar wegen, schuurt het.':'Wat voor jou het zwaarst weegt, krijg je nu te weinig. Dat kost energie, en vraagt om een gesprek over de ruil.';
 const L=a=>a.map(id=>DET[id].l).join(' & ');
 const byNeed=[...ids].sort((a,b)=>need[b]-need[a]);
 const tekort=W.cards.gap.slice().sort((a,b)=>need[b]-need[a]);
 const kracht=W.cards.mis.filter(id=>!W.cards.gap.includes(id)).sort((a,b)=>need[b]-need[a]);
 const overLow=over.filter(id=>need[id]<.55);
 document.getElementById('w-cards').innerHTML=`
  <div class="card"><span class="eyebrow">Weegt voor jou het zwaarst</span><h3>${L(byNeed.slice(0,3))}</h3><p class="muted" style="margin:0">Dit trok je het sterkst in je dilemma’s. Hier moet je werk kloppen.</p></div>
  <div class="card" style="border:2px solid var(--petrol)"><span class="eyebrow">Grootste tekort</span><h3>${L(tekort.slice(0,2))}</h3><p class="muted" style="margin:0">${need[tekort[0]]>=.55?'Wat je elders beter zou willen, én wat voor jou zwaar weegt. Hier zit de grootste frictie.':'Wat je elders beter zou willen. Het weegt voor jou minder zwaar dan je misschien denkt: kijk eerst naar wat je echt drijft.'}</p></div>
  <div class="card"><span class="eyebrow">${overLow.length?'Mogelijk overschot':'Wat je hier houdt'}</span><h3>${overLow.length?overLow.map(id=>OVER[id]).join(' & '):L(kracht.slice(0,2))}</h3><p class="muted" style="margin:0">${overLow.length?'Hier krijg je meer van dan je nodig hebt, terwijl het voor jou weinig weegt. Meer is niet altijd beter: dit kost je mogelijk energie.':'Dit zou je missen als je vertrekt. Dat is je anker in dit werk.'}</p></div>`;
 // ruil
 const tv={ja:1,twijfel:.5,nee:0}; const bereid=W.tr.reduce((a,x)=>a+(tv[x]??.5),0)/TRADES.length;
 const hiX=bereid>=.5, hiY=fit>=.52; let t,x;
 if(hiX&&hiY){t='Een gezonde ruil';x='Je werk levert veel van wat je nodig hebt, en jij bent bereid daar iets tegenover te zetten. Dat is de basis voor duurzaam werkgeluk.';}
 else if(hiX&&!hiY){t='Je wilt geven, maar krijgt te weinig terug';x='Je bent bereid flink te investeren, maar je werk levert nu te weinig van wat voor jou zwaar weegt. Dat is een ruil die je kunt verbeteren: maak expliciet wat je biedt én wat je vraagt.';}
 else if(!hiX&&hiY){t='Veel ontvangen, weinig ruimte om te ruilen';x='Je werk levert je veel. Tegelijk ben je terughoudend in wat je ervoor wilt inleveren. Dat kan prima, zolang beide kanten het eerlijk vinden.';}
 else {t='De ruil zit vast';x='Je werk levert weinig van wat je nodig hebt, en je bent ook weinig bereid om te ruilen. Dat is een signaal om de afspraken opnieuw tegen het licht te houden, van beide kanten.';}
 const quad=hiX&&!hiY?'geven':!hiX&&hiY?'ontvangen':hiX&&hiY?'gezond':'vast';
 const bankTxt=W.bank==='rood'?(quad==='geven'||quad==='vast'?' Je eigen gevoel bevestigt dat: je staat rood. Dat houdt niemand lang vol.':' Opvallend: zelf ervaar je dat je rood staat. Dat verschil tussen je antwoorden en je gevoel is het bespreken waard.')
  :W.bank==='tegoed'?(quad==='ontvangen'||quad==='gezond'?' Je ervaart zelf ook dat je meer krijgt dan je geeft: dat is ruimte om te investeren.':' Opvallend: zelf ervaar je dat je nog tegoed hebt, terwijl je werk weinig levert van wat voor jou zwaar weegt.')
  :' Zelf ervaar je de ruil als in balans.';
 document.getElementById('w-ruil-t').textContent=t; document.getElementById('w-ruil-x').textContent=x+bankTxt;
 document.getElementById('w-ruil-tip').innerHTML=W.talk==='nee'?'<b>Let op:</b> deze ruil is nog nooit uitgesproken. Jij en je leidinggevende werken allebei met een deal die alleen in jullie hoofd bestaat.':W.talk==='beetje'?'De ruil is terloops ter sprake gekomen. Het wordt pas een afspraak als je hem expliciet maakt.':'Goed: je hebt de ruil besproken. Is die afspraak nog actueel?';
 const px=v=>30+v*200, py=v=>230-v*200, sx=px(.5), sy=py(.52);
 document.getElementById('w-quad').innerHTML=`<svg viewBox="0 0 260 260" style="width:100%;max-width:300px">
  <rect x="30" y="30" width="${sx-30}" height="${sy-30}" fill="#e3f0f1"/><rect x="${sx}" y="30" width="${230-sx}" height="${sy-30}" fill="#cfe6e9"/>
  <rect x="30" y="${sy}" width="${sx-30}" height="${230-sy}" fill="#f4f7f8"/><rect x="${sx}" y="${sy}" width="${230-sx}" height="${230-sy}" fill="#fbe7c4"/>
  <text x="${(30+sx)/2}" y="60" font-size="9" text-anchor="middle" fill="#5b7076">veel ontvangen,</text><text x="${(30+sx)/2}" y="71" font-size="9" text-anchor="middle" fill="#5b7076">weinig ruilruimte</text>
  <text x="${(sx+230)/2}" y="66" font-size="9" text-anchor="middle" fill="#0b4f5c">gezonde ruil</text>
  <text x="${(30+sx)/2}" y="190" font-size="9" text-anchor="middle" fill="#5b7076">ruil zit vast</text>
  <text x="${(sx+230)/2}" y="184" font-size="9" text-anchor="middle" fill="#7a5306">wil geven,</text><text x="${(sx+230)/2}" y="195" font-size="9" text-anchor="middle" fill="#7a5306">krijgt te weinig</text>
  <line x1="30" y1="230" x2="235" y2="230" stroke="#0b4f5c"/><line x1="30" y1="230" x2="30" y2="25" stroke="#0b4f5c"/>
  <text x="130" y="250" font-size="10" text-anchor="middle" fill="#0f2e35" font-weight="700">Bereid om te ruilen →</text>
  <text x="12" y="130" font-size="10" text-anchor="middle" fill="#0f2e35" font-weight="700" transform="rotate(-90 12 130)">Wat je werk je levert →</text>
  <circle cx="${px(bereid)}" cy="${py(Math.max(0,Math.min(1,fit)))}" r="9" fill="#e8641b" stroke="#fff" stroke-width="3"/></svg>`;
 const yes=TRADES.filter((_,i)=>W.tr[i]==='ja'), no=TRADES.filter((_,i)=>W.tr[i]==='nee');
 document.getElementById('w-trades').innerHTML=`<div class="grid g2" style="gap:18px">
  <div class="note"><b>Hier wil jij voor ruilen</b><ul style="margin:8px 0 0;padding-left:18px">${yes.length?yes.map(t=>`<li>${t.give[0].toUpperCase()+t.give.slice(1)} → ${t.get}</li>`).join(''):'<li>Geen van de voorgelegde ruilen</li>'}</ul></div>
  <div class="note" style="background:var(--paper-2)"><b>Hier ruil je niet voor</b><ul style="margin:8px 0 0;padding-left:18px">${no.length?no.map(t=>`<li>${t.give[0].toUpperCase()+t.give.slice(1)} → ${t.get}</li>`).join(''):'<li>Je staat open voor elke ruil</li>'}</ul></div></div>`;
 // per key
 document.getElementById('w-chart').innerHTML=KEYS.map((k,i)=>{const ds=ids.filter(id=>DET[id].k===i);const n=ds.reduce((a,id)=>a+need[id],0)/2;const r=ds.reduce((a,id)=>a+fitOf(id),0)/2;
  const chip=n>=.55&&r<.5?'<span class="flag-chip chip-low">tekort</span>':ds.some(id=>overLow.includes(id))?'<span class="flag-chip chip-high">overschot</span>':n>=.55&&r>=.5?'<span class="flag-chip chip-ok">kracht</span>':'<span class="flag-chip" style="background:var(--paper-2)">neutraal</span>';
  return `<div class="crow"><b>${k.name}<small style="display:block;font-weight:500;color:var(--muted);font-size:.78rem">${ds.map(id=>DET[id].l).join(' + ')}</small></b><div class="tracks"><div class="track b"><i style="width:${Math.max(4,n*100)}%"></i></div><div class="track m"><i style="width:${Math.max(4,r*100)}%"></i></div></div>${chip}</div>`;}).join('');
 document.getElementById('w-stage').innerHTML=''; document.getElementById('w-progress').style.display='none';
 const res=document.getElementById('w-result'); res.classList.add('show'); res.scrollIntoView({behavior:'smooth'});
}
wRender();


document.addEventListener('submit',function(e){var f=e.target.closest&&e.target.closest('#rx-test .lead-form');if(!f)return;e.preventDefault();var ok=f.querySelector('.ok');ok.textContent=f.dataset.msg;ok.classList.add('show');});
})();
