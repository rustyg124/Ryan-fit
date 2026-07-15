
const EMPTY={checkins:[],sets:[],body:[],completed:[],settings:{voice:true,rest:90}};
const clone=x=>JSON.parse(JSON.stringify(x));
function load(){try{return JSON.parse(localStorage.getItem("ryanfit_coach_v1"))||clone(EMPTY)}catch(e){return clone(EMPTY)}}
let state=load(), activeWorkout=null, queue=[], exerciseIndex=0, setIndex=1, selectedSetPain=0, timer=null, seconds=90;
const $=id=>document.getElementById(id);
function save(){try{localStorage.setItem("ryanfit_coach_v1",JSON.stringify(state))}catch(e){}}
function toast(msg="Saved"){const t=$("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1300)}
function speak(text){
 if(!state.settings.voice || !("speechSynthesis" in window))return;
 speechSynthesis.cancel();
 const u=new SpeechSynthesisUtterance(text);u.rate=.92;u.pitch=.95;u.volume=1;
 const voices=speechSynthesis.getVoices();
 const au=voices.find(v=>/en-AU/i.test(v.lang));if(au)u.voice=au;
 speechSynthesis.speak(u);
}
function todayISO(){return new Date().toISOString().slice(0,10)}
function scheduledId(){return WEEK[(new Date().getDay()+6)%7][1]}
function renderHome(){
 const d=new Date();$("todayDate").textContent=d.toLocaleDateString(undefined,{weekday:"long",day:"numeric",month:"long"});
 const hour=d.getHours();$("coachGreeting").textContent=`Good ${hour<12?"morning":hour<18?"afternoon":"evening"}, Ryan.`;
 const id=$("workoutSelect").value||scheduledId(), w=WORKOUTS[id];
 $("workoutTitle").textContent=w.title;$("duration").textContent=w.duration;$("workoutPurpose").textContent=w.purpose;
 const monday=new Date();monday.setDate(d.getDate()-((d.getDay()+6)%7));monday.setHours(0,0,0,0);
 const thisWeekSets=state.sets.filter(x=>new Date(x.date)>=monday);
 const days=new Set(thisWeekSets.map(x=>x.date.slice(0,10)));
 $("weekSessions").textContent=days.size;$("weekSets").textContent=thisWeekSets.length;
 if(state.body.length>1){const delta=state.body.at(-1).weight-state.body[0].weight;$("weightChange").textContent=(delta>0?"+":"")+delta.toFixed(1)+" kg"}else $("weightChange").textContent="—";
 $("accountabilityMessage").textContent=days.size>=4?"You are building consistency. Protect the shoulder and keep the routine.":days.size?`You have logged ${days.size} training day${days.size===1?"":"s"} this week. The next session keeps momentum moving.`:"Start with one controlled session. Consistency begins with today's first set.";
}
function buildSelect(){
 $("workoutSelect").innerHTML=WEEK.map(([day,id])=>`<option value="${id}">${day} · ${WORKOUTS[id].title}</option>`).join("");
 $("workoutSelect").value=scheduledId();
}
$("pain").oninput=e=>$("painLabel").textContent=e.target.value;
$("coachPlan").onclick=()=>{
 const pain=+$("pain").value,range=$("range").value,energy=$("energy").value,sleep=$("sleep").value;
 state.checkins.push({date:new Date().toISOString(),pain,range,energy,sleep});save();
 let msg,cls="callout safe";
 if(pain>=5){msg="No resisted shoulder work today. Use legs or gentle treadmill only, and arrange a physiotherapist or surgeon review if this is new or worsening.";cls="callout danger"}
 else if(pain>=3||range==="below45"){msg="Keep cuff work isometric or extremely light and below the painful arc. No pressing, pulldowns, flyes or overhead work.";cls="callout caution"}
 else{msg="Use the shoulder-rebuild session, but keep pain mild and do not progress load unless symptoms remain settled later today and tomorrow."}
 $("coachAdvice").className=cls;$("coachAdvice").textContent=msg;$("coachBrief").textContent=msg;speak(msg);toast();
};
$("voiceToggle").onclick=()=>{state.settings.voice=!state.settings.voice;save();$("voiceToggle").textContent=state.settings.voice?"🔊":"🔇";toast(state.settings.voice?"Voice coach on":"Voice coach off");if(state.settings.voice)speak("Voice coach is on.")};
$("workoutSelect").onchange=renderHome;
$("startWorkout").onclick=()=>{
 activeWorkout=$("workoutSelect").value;queue=WORKOUTS[activeWorkout].exercises.map(x=>[...x]);exerciseIndex=0;setIndex=1;
 showPage("workoutPage");renderExercise();speak(`Today's session is ${WORKOUTS[activeWorkout].title}. Keep shoulder pain mild and movement controlled. Let's begin.`);
};
function renderExercise(){
 const [id,sets,reps]=queue[exerciseIndex],m=MACHINES.find(x=>x.id===id);
 $("exerciseCounter").textContent=`Exercise ${exerciseIndex+1} of ${queue.length} · Set ${setIndex} of ${sets}`;
 $("exercisePhoto").src=m.photo;$("exerciseName").textContent=m.name;$("exerciseDose").textContent=`${sets} set${sets>1?"s":""} · ${reps}`;
 $("exerciseCues").textContent=m.cues;$("exerciseSafety").textContent=m.safety;
 $("exerciseWhy").textContent=WORKOUTS[activeWorkout].purpose;
 $("coachCue").textContent=coachCue(m);
 const previous=[...state.sets].reverse().find(x=>x.exercise===id);
 $("lastResult").textContent=previous?`Last logged: ${previous.weight||"—"} kg × ${previous.reps||"—"} · shoulder ${previous.setPain}/10`:"No previous result yet. Start conservatively.";
 $("setWeight").value=previous?.weight||"";$("setReps").value="";
 selectedSetPain=0;document.querySelectorAll("[data-setpain]").forEach(b=>b.classList.remove("selected"));resetTimer();
}
function coachCue(m){
 if(["er","iso","scap","serratus"].includes(m.id))return "This is control work, not a test. Finish with plenty in reserve.";
 if(["row","arms"].includes(m.id))return "Keep the upper arm low and the shoulder quiet. Stop before compensation.";
 if(["legpress","plateleg","abductor","glute"].includes(m.id))return "Use the strongest comfortable range without pelvic stretch or breath-holding.";
 return "Smooth effort. Stay below symptoms and keep breathing.";
}
document.querySelectorAll("[data-setpain]").forEach(b=>b.onclick=()=>{selectedSetPain=+b.dataset.setpain;document.querySelectorAll("[data-setpain]").forEach(x=>x.classList.remove("selected"));b.classList.add("selected")});
function resetTimer(){clearInterval(timer);timer=null;seconds=state.settings.rest||90;drawTimer();$("restButton").textContent="Start rest"}
function drawTimer(){$("restTimer").textContent=String(Math.floor(seconds/60)).padStart(2,"0")+":"+String(seconds%60).padStart(2,"0")}
$("restButton").onclick=()=>{
 if(timer){clearInterval(timer);timer=null;$("restButton").textContent="Resume";return}
 $("restButton").textContent="Pause";
 timer=setInterval(()=>{seconds--;drawTimer();if(seconds===45)speak("Halfway through your rest.");if(seconds===10)speak("Ten seconds.");if(seconds<=0){clearInterval(timer);timer=null;$("restButton").textContent="Done";speak("Rest complete. Set up when ready.");navigator.vibrate?.([100,60,100])}},1000);
};
$("completeSet").onclick=()=>{
 const [id,sets]=queue[exerciseIndex];
 const entry={date:new Date().toISOString(),workout:activeWorkout,exercise:id,set:setIndex,weight:+$("setWeight").value||0,reps:+$("setReps").value||0,setPain:selectedSetPain};
 state.sets.push(entry);save();
 if(selectedSetPain>=5)speak("Stop this shoulder exercise. Move to a pain free alternative or finish shoulder loading for today.");
 else if(selectedSetPain>=3)speak("Keep the same or reduce the load. Do not increase range.");
 else speak("Set saved. Nice control.");
 if(setIndex<sets){setIndex++;renderExercise();toast("Set saved")}
 else if(exerciseIndex<queue.length-1){exerciseIndex++;setIndex=1;renderExercise();toast("Exercise complete")}
 else finishWorkout();
};
$("occupied").onclick=()=>{
 const item=queue.splice(exerciseIndex,1)[0];queue.push(item);
 if(exerciseIndex>=queue.length)exerciseIndex=0;setIndex=1;renderExercise();speak("Moved to the end. Let's keep the session flowing.");toast("Moved to end");
};
$("exitWorkout").onclick=()=>{if(confirm("Exit this workout? Your completed sets stay saved.")){showPage("homePage");renderHome()}};
function finishWorkout(){
 state.completed.push({date:new Date().toISOString(),workout:activeWorkout});save();showPage("homePage");renderHome();
 const msg="Workout complete. Good work. Check how the shoulder feels again in two to three hours and tomorrow morning.";speak(msg);$("coachBrief").textContent=msg;toast("Workout complete");
}
function renderPlan(){
 $("planList").innerHTML=WEEK.map(([day,id])=>`<div class="plan-day"><h3>${day} · ${WORKOUTS[id].title}</h3><p class="muted">${WORKOUTS[id].purpose}</p><ul>${WORKOUTS[id].exercises.map(([eid,s,r])=>`<li>${MACHINES.find(m=>m.id===eid).name} — ${s} × ${r}</li>`).join("")}</ul></div>`).join("");
}
function renderMachines(q=""){
 const list=MACHINES.filter(m=>(m.name+" "+m.muscle+" "+m.zone).toLowerCase().includes(q.toLowerCase()));
 $("machineGrid").innerHTML=list.map(m=>`<div class="machine"><img src="${m.photo}" alt="${m.name}"><div><h4>${m.name}</h4><p>${m.zone} · ${m.muscle}</p><details><summary>Instructions</summary><p>${m.cues}</p><p>${m.safety}</p></details></div></div>`).join("");
}
$("machineSearch").oninput=e=>renderMachines(e.target.value);
$("saveBody").onclick=()=>{const weight=+$("bodyWeight").value;if(!weight)return toast("Enter body weight");state.body.push({date:new Date().toISOString(),weight,waist:+$("waist").value||null});save();renderProgress();toast()};
function renderProgress(){
 if(state.body.length){const first=state.body[0],last=state.body.at(-1),change=last.weight-first.weight;$("progressSummary").innerHTML=`<div class="stats" style="margin-top:12px"><div><strong>${last.weight} kg</strong><span>latest</span></div><div><strong>${change>0?"+":""}${change.toFixed(1)} kg</strong><span>change</span></div><div><strong>${Math.max(0,7+change).toFixed(1)} kg</strong><span>goal remaining</span></div></div>`}else $("progressSummary").innerHTML='<p class="muted">No body check-ins yet.</p>';
 const recent=state.checkins.slice(-7);$("shoulderSummary").textContent=recent.length?`Last ${recent.length} check-ins: average pain ${(recent.reduce((a,x)=>a+x.pain,0)/recent.length).toFixed(1)}/10. Track whether pain and comfortable elevation improve together.`:"No shoulder check-ins yet.";
}
$("exportData").onclick=()=>{const b=new Blob([JSON.stringify(state,null,2)],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(b);a.download="ryanfit-backup.json";a.click()};
function showPage(id){document.querySelectorAll(".page,.nav").forEach(x=>x.classList.remove("active"));$(id).classList.add("active");document.querySelector(`.nav[data-page="${id}"]`)?.classList.add("active");window.scrollTo(0,0)}
document.querySelectorAll(".nav").forEach(n=>n.onclick=()=>showPage(n.dataset.page));
buildSelect();renderHome();renderPlan();renderMachines();renderProgress();$("voiceToggle").textContent=state.settings.voice?"🔊":"🔇";
if("serviceWorker"in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
