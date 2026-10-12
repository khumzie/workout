const $=s=>document.querySelector(s);
const STORAGE_KEY='pulse-workout-v1';
const defaultState={profile:{weight:'',height:'',units:'kg',experience:'beginner',goal:'strength',duration:'45',focus:'balanced',startWeights:{}},logs:[],current:{date:'',done:[],entries:{}},settings:{rest:60}};
let state=loadState();
const names=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const catalog=[
{id:'squat',name:'Goblet squat',muscle:'LEGS',kind:'weight',base:3,reps:'8–12',rest:75,desc:'Hold one dumbbell close to your chest. Sit between your hips, keep your chest proud, then stand through your whole foot.',gear:'Dumbbell',pattern:'squat'},
{id:'pushup',name:'Push-up',muscle:'CHEST',kind:'body',base:3,reps:'6–12',rest:60,desc:'Keep your body in a straight line. Lower your chest under control, then push the floor away. Elevate your hands if needed.',gear:'Bodyweight',pattern:'push'},
{id:'row',name:'Bench-supported dumbbell row',muscle:'BACK',kind:'weight',base:2,reps:'8–12 / side',rest:75,desc:'Support one hand and knee on the bench. Keep your back neutral and pull your elbow towards your hip without rotating your torso.',gear:'Dumbbell + bench',pattern:'row'},
{id:'chestrow',name:'Chest-supported dumbbell row',muscle:'UPPER BACK',kind:'weight',base:2,reps:'8–12',rest:75,desc:'Set the bench to a low incline, lie chest-down and row both dumbbells towards your hips. Use a light load and keep your neck relaxed.',gear:'Dumbbells + incline bench',pattern:'row'},
{id:'inclinepress',name:'Incline dumbbell press',muscle:'UPPER CHEST',kind:'weight',base:2,reps:'8–12',rest:75,desc:'Set the bench to a modest incline. Keep feet planted, lower the dumbbells under control and press without bouncing or forcing your shoulders.',gear:'Dumbbells + incline bench',pattern:'press'},
{id:'hinge',name:'Dumbbell Romanian deadlift',muscle:'POSTERIOR',kind:'weight',base:3,reps:'8–12',rest:75,desc:'Soften your knees and push your hips back. Keep weights close to your legs and stop when you feel a hamstring stretch.',gear:'Dumbbells',pattern:'hinge'},
{id:'press',name:'Seated dumbbell shoulder press',muscle:'SHOULDERS',kind:'weight',base:2,reps:'8–12',rest:75,desc:'Sit with the bench upright or nearly upright. Start with dumbbells around shoulder height and press smoothly without arching your lower back.',gear:'Dumbbells + bench',pattern:'press'},
{id:'plank',name:'Forearm plank',muscle:'CORE',kind:'time',base:3,reps:'20–40 sec',rest:45,desc:'Elbows under shoulders, squeeze glutes and keep ribs down. Stop before your lower back sags.',gear:'Bodyweight',pattern:'plank'},
{id:'lunge',name:'Reverse lunge',muscle:'LEGS',kind:'weight',base:2,reps:'8–10 / side',rest:60,desc:'Step back softly, lower both knees under control, then drive through the front foot. Use bodyweight until balanced.',gear:'Bodyweight / dumbbells',pattern:'lunge'},
{id:'floorpress',name:'Flat dumbbell bench press',muscle:'CHEST',kind:'weight',base:2,reps:'8–12',rest:75,desc:'Lie securely on a flat bench with feet planted. Lower the dumbbells slowly to a comfortable depth and press up; start light while learning the movement.',gear:'Dumbbells + bench',pattern:'press'},
{id:'deadbug',name:'Dead bug',muscle:'CORE',kind:'body',base:2,reps:'8–10 / side',rest:45,desc:'Keep your lower back gently against the floor. Slowly extend opposite arm and leg, then return and switch.',gear:'Bodyweight',pattern:'core'},
{id:'curl',name:'Dumbbell curl',muscle:'ARMS',kind:'weight',base:2,reps:'10–15',rest:45,desc:'Keep elbows near your sides and avoid swinging. Lower slowly for a controlled return.',gear:'Dumbbells',pattern:'curl'},
{id:'bridge',name:'Glute bridge',muscle:'GLUTES',kind:'body',base:3,reps:'12–15',rest:45,desc:'Feet flat and hip-width. Squeeze your glutes to lift your hips without arching your lower back.',gear:'Bodyweight',pattern:'bridge'},
{id:'bird',name:'Bird dog',muscle:'CORE / BACK',kind:'body',base:2,reps:'8 / side',rest:45,desc:'From hands and knees, extend opposite arm and leg. Keep hips level and move slowly.',gear:'Bodyweight',pattern:'core'},
{id:'lateralraise',name:'Lateral raise',muscle:'SIDE DELTS',kind:'weight',base:3,reps:'12–15',rest:45,desc:'Raise light dumbbells out to the sides to about shoulder height. Keep a soft elbow bend and avoid swinging.',gear:'Light dumbbells',pattern:'press'},
{id:'reardelt',name:'Rear-delt fly',muscle:'REAR SHOULDERS',kind:'weight',base:3,reps:'12–15',rest:45,desc:'Hinge forward with a neutral back and open your arms wide. Use a light load and control every rep.',gear:'Light dumbbells',pattern:'row'},
{id:'latpulldown',name:'Lat pulldown / band pulldown',muscle:'LATS',kind:'weight',base:3,reps:'8–12',rest:60,desc:'Pull elbows down toward your sides without leaning far back. Use a resistance band alternative if you do not have a cable machine.',gear:'Cable or resistance band',pattern:'row'},
{id:'sideplank',name:'Side plank',muscle:'OBLIQUES',kind:'time',base:2,reps:'20–35 sec / side',rest:45,desc:'Keep shoulder stacked over elbow and hips lifted. Shorten the lever by bending your knees if needed.',gear:'Bodyweight',pattern:'plank'},
{id:'bicycle',name:'Slow bicycle crunch',muscle:'ABS',kind:'body',base:2,reps:'10–16 / side',rest:45,desc:'Rotate your rib cage toward the opposite knee; do not pull your neck. Move slowly and keep your lower back controlled.',gear:'Bodyweight',pattern:'core'},
{id:'calfraise',name:'Calf raise',muscle:'CALVES',kind:'body',base:3,reps:'12–20',rest:45,desc:'Rise onto the balls of your feet, pause at the top, and lower slowly through a comfortable range.',gear:'Bodyweight or dumbbells',pattern:'squat'},
{id:'superman',name:'Prone back extension',muscle:'BACK EXTENSORS',kind:'body',base:2,reps:'8–12',rest:45,desc:'Lift your chest slightly from the floor while keeping your neck neutral. Use a small, controlled range; avoid forcing your lower back.',gear:'Bodyweight',pattern:'hinge'},
{id:'walk',name:'Comfortable brisk walk',muscle:'ACTIVE RECOVERY',kind:'time',base:1,reps:'20–30 min',rest:0,desc:'Walk at a comfortable pace where you can still speak in full sentences. This is recovery, not a fitness test; shorten it if you feel tired.',gear:'No equipment',pattern:'bridge'},
{id:'mobility',name:'Gentle full-body mobility',muscle:'MOBILITY',kind:'time',base:1,reps:'8–10 min',rest:0,desc:'Move gently through comfortable shoulder circles, hip hinges, ankle rocks and easy thoracic rotations. No painful stretches or forcing range.',gear:'No equipment',pattern:'core'},
{id:'easycore',name:'Easy dead bug practice',muscle:'CORE CONTROL',kind:'body',base:2,reps:'6–8 / side',rest:30,desc:'Move slowly and stop well before fatigue. Keep your lower back gently against the floor; this should feel easy on recovery days.',gear:'Bodyweight + mat',pattern:'core'},
{id:'inclinepush',name:'Incline push-up',muscle:'CHEST / TRICEPS',kind:'body',base:3,reps:'8–15',rest:45,desc:'Place hands on a stable raised surface and keep your body straight. Lower your chest toward the edge and press away.',gear:'Stable bench or counter',pattern:'push'},
{id:'facepull',name:'Band face pull',muscle:'REAR SHOULDERS / UPPER BACK',kind:'body',base:3,reps:'12–15',rest:45,desc:'Anchor a resistance band securely at face height. Pull toward your face with elbows out and shoulder blades moving naturally.',gear:'Resistance band',pattern:'row'}
];
const dayTemplates=[
['inclinepress','chestrow','press','curl','reardelt','deadbug'], // Monday: upper A
['squat','hinge','lunge','bridge','calfraise','plank'], // Tuesday: legs + core
['walk','mobility','easycore'], // Wednesday: active recovery
['floorpress','row','lateralraise','reardelt','curl','sideplank'], // Thursday: upper B
['squat','hinge','lunge','bridge','calfraise','bicycle'], // Friday: legs + core B
['walk','mobility'], // Saturday: optional easy cardio + mobility
['mobility'] // Sunday: gentle rest-day mobility
];
const dayTypes=['Upper body A','Legs & core A','Active recovery','Upper body B','Legs & core B','Optional easy cardio','Rest & mobility'];

// GIFs are loaded from a public, open-source exercise library when online.
// Alias matching is deliberately exact to avoid showing the wrong movement.
const DEMO_BASE='https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0';
const demoAliases={
 squat:['Dumbbell Goblet Squat','Goblet Squat'],
 pushup:['Push-Up','Push Up'],
 row:['Dumbbell Bent-Over Row','Dumbbell One Arm Row','Dumbbell Single Arm Row'],
 chestrow:['Dumbbell Incline Row','Dumbbell Hammer Grip Incline Bench Row','Dumbbell Incline Bench Row'],
 inclinepress:['Dumbbell Incline Bench Press','Dumbbell Incline Press'],
 hinge:['Dumbbell Romanian Deadlift','Dumbbell Deadlift','Dumbbell Straight Leg Deadlift'],
 press:['Dumbbell Seated Shoulder Press','Dumbbell Shoulder Press','Dumbbell Alternating Shoulder Press'],
 plank:['Forearm Plank','Plank'],
 lunge:['Dumbbell Reverse Lunge','Dumbbell Lunge','Reverse Lunge'],
 floorpress:['Dumbbell Bench Press','Dumbbell Flat Bench Press'],
 deadbug:['Dead Bug','Deadbug'],
 curl:['Dumbbell Biceps Curl','Dumbbell Curl'],
 bridge:['Glute Bridge','Bridge Pose'],
 bird:['Bird Dog'],
 lateralraise:['Dumbbell Lateral Raise'],
 reardelt:['Dumbbell Incline Rear Lateral Raise','Dumbbell Rear Delt Fly','Dumbbell Bent Over Lateral Raise'],
 sideplank:['Side Plank'],
 bicycle:['Bicycle Crunch','Air Bike'],
 calfraise:['Dumbbell Standing Calf Raise','Standing Calf Raise'],
 superman:['Superman','Prone Back Extension'],
 easycore:['Dead Bug','Deadbug'],
 inclinepush:['Incline Push-Up','Incline Push Up']
};
const exerciseSteps={
 squat:['Stand with feet about shoulder-width apart and hold one dumbbell close to your chest.','Brace your stomach and sit your hips down and slightly back; keep your whole foot planted.','Lower only as far as you can while keeping balance and your back comfortable.','Push through the floor to stand tall. Breathe out as you rise.'],
 pushup:['Place hands slightly wider than shoulder-width on the floor, or on a stable raised bench to make it easier.','Make a straight line from head to heels and tighten your stomach.','Bend your elbows and lower your chest under control.','Push the surface away to return. Stop if your shoulders or wrists hurt.'],
 row:['Place one hand and the same-side knee on the bench; keep your other foot planted.','Hold the dumbbell below your shoulder and keep your back flat.','Pull your elbow towards your hip without twisting your torso.','Lower slowly, finish the reps, then switch sides.'],
 chestrow:['Set the bench to a low incline and lie chest-down with a dumbbell in each hand.','Let the arms hang and keep your neck in line with your spine.','Pull your elbows back, bringing the weights towards your lower ribs.','Lower slowly without shrugging or jerking. Start very light.'],
 inclinepress:['Set the bench to a modest incline and sit with dumbbells resting on your thighs.','Lie back carefully and bring the weights beside your upper chest; keep feet planted.','Press up smoothly without banging the weights together or locking your elbows hard.','Lower under control. Use a weight you can safely position and return to the floor.'],
 hinge:['Stand tall with a dumbbell in each hand, knees softly bent.','Push your hips backwards as if closing a drawer with them; keep the weights close to your legs.','Lower until you feel a comfortable hamstring stretch while keeping your back neutral.','Drive your hips forward to stand. This is a hip hinge, not a squat.'],
 press:['Sit upright with back support and feet flat. Start with light dumbbells around shoulder height.','Brace your midsection and keep your ribs stacked over your hips.','Press the weights upward in a comfortable path without leaning back.','Lower slowly to shoulder height. Stop short of painful shoulder range.'],
 plank:['Place elbows directly below shoulders and extend legs behind you; bend knees to make it easier.','Keep your head, ribs, hips and legs aligned.','Gently squeeze your glutes and stomach and breathe normally.','Stop the hold before your hips sag or your lower back feels strained.'],
 lunge:['Stand tall near a wall or sturdy support if balance is uncertain.','Step one foot backwards and lower both knees in a controlled way.','Keep your front foot planted and front knee tracking in the direction of your toes.','Push through the front foot to return. Start bodyweight-only until steady.'],
 floorpress:['Sit on the flat bench with dumbbells resting on your thighs, then lie back carefully.','Keep feet planted and wrists stacked over elbows.','Lower the weights to a comfortable depth beside your chest.','Press up smoothly. If getting into position feels awkward, use lighter weights or ask for help.'],
 deadbug:['Lie on your back with arms pointing up and hips and knees bent to about 90 degrees.','Gently brace your stomach so your lower back stays comfortably against the floor.','Slowly extend one arm and the opposite leg without letting your back arch.','Return to the start and alternate sides; make the movement smaller if needed.'],
 curl:['Stand or sit tall with one dumbbell in each hand and palms facing forwards.','Keep elbows close to your sides and shoulders relaxed.','Bend your elbows to curl the weights without swinging your body.','Lower slowly until arms are nearly straight.'],
 bridge:['Lie on your back with knees bent and feet flat about hip-width apart.','Brace gently and squeeze your glutes.','Lift hips until shoulders, hips and knees form a comfortable line.','Pause briefly, then lower slowly; do not over-arch your lower back.'],
 bird:['Start on hands and knees with hands under shoulders and knees under hips.','Brace your stomach and keep your hips facing the floor.','Reach one arm forward and the opposite leg back without twisting.','Return slowly and switch sides. Use a smaller reach if balance is difficult.'],
 lateralraise:['Stand tall with very light dumbbells at your sides and elbows softly bent.','Keep shoulders relaxed and raise arms out to the sides.','Stop around shoulder height or sooner if uncomfortable; do not swing.','Lower slowly. This exercise usually needs much lighter weights than a press.'],
 reardelt:['Hold light dumbbells, hinge at the hips and keep your back neutral.','Let the weights hang beneath your chest with elbows slightly bent.','Open your arms out to the sides, squeezing the back of your shoulders gently.','Lower slowly without using momentum; choose very light weights.'],
 sideplank:['Lie on your side with elbow under shoulder; bend knees to make the exercise easier.','Lift your hips so your body forms a straight line from shoulder to knee or feet.','Keep your top shoulder stacked and breathe normally.','Hold only while you can maintain alignment, then switch sides.'],
 bicycle:['Lie on your back with knees bent and fingertips lightly supporting your head.','Lift shoulders slightly and rotate your rib cage towards the opposite knee.','Extend the other leg only as far as you can keep your lower back controlled.','Alternate slowly; do not pull on your neck or rush the reps.'],
 calfraise:['Stand near the bench or wall for balance, feet about hip-width apart.','Rise onto the balls of your feet as high as comfortable.','Pause briefly at the top.','Lower slowly. Add a dumbbell only when balance and control are secure.'],
 superman:['Lie face-down with arms by your sides or reaching forwards, and keep your neck neutral.','Gently lift your chest a small amount without forcing your lower back.','Pause briefly while breathing normally.','Lower slowly. Skip this if it causes back discomfort.'],
 walk:['Walk at a pace where you can still speak in full sentences.','Keep your shoulders relaxed and use a comfortable stride.','Slow down or stop if you feel dizzy, unwell or unusually breathless.','This is recovery work; it should leave you feeling refreshed rather than exhausted.'],
 mobility:['Move gently through shoulder circles, ankle rocks and comfortable hip hinges.','Try slow upper-back rotations without forcing your range.','Keep breathing normally and stay within a pain-free range.','This should feel easy. Avoid bouncing or forcing a stretch.'],
 easycore:['Lie on your back with arms up and hips and knees bent.','Gently brace your stomach so your lower back stays comfortable.','Slowly reach one arm back while extending the opposite leg only as far as you can control.','Return and switch sides; keep this easy on recovery days.'],
 inclinepush:['Place your hands on a stable bench or counter that will not slide.','Walk your feet back so your body forms a straight line.','Lower your chest towards the edge with elbows angled slightly back.','Push away smoothly. The higher the hand position, the easier the movement.']
};
let exerciseLibraryPromise=null;
function normaliseExerciseName(s){return String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim().replace(/\s+/g,' ')}
async function getExerciseLibrary(){
 if(!exerciseLibraryPromise){
  exerciseLibraryPromise=fetch(`${DEMO_BASE}/api/en/exercises.json`,{cache:'force-cache'})
   .then(r=>{if(!r.ok)throw new Error('Exercise library unavailable');return r.json()})
   .then(j=>Array.isArray(j)?j:(j.exercises||j.data?.exercises||j.data||[]))
   .catch(()=>[]);
 }
 return exerciseLibraryPromise;
}
async function findExerciseDemo(ex){
 const aliases=(demoAliases[ex.id]||[]).map(normaliseExerciseName);
 if(!aliases.length)return null;
 const library=await getExerciseLibrary();
 for(const alias of aliases){
  const match=library.find(item=>normaliseExerciseName(item.name)===alias);
  if(match && (match.gifUrl||match.file)){
   const url=match.gifUrl || `${DEMO_BASE}/${match.file}`;
   return {url,name:match.name,instructions:Array.isArray(match.instructions)?match.instructions:[]};
  }
 }
 return null;
}
function safeText(s){return String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function renderExerciseSteps(ex, remoteInstructions=[]){
 const steps=remoteInstructions.length?remoteInstructions:(exerciseSteps[ex.id]||[ex.desc]);
 return `<ol class="exercise-steps">${steps.slice(0,6).map(s=>`<li>${safeText(s)}</li>`).join('')}</ol>`;
}
async function loadExerciseDemo(ex){
 const slot=$('#demoMedia');
 if(!slot)return;
 const result=await findExerciseDemo(ex);
 if(!document.body.contains(slot))return;
 if(result){
  slot.innerHTML=`<img class="real-exercise-gif" src="${result.url}" alt="Animated demonstration of ${safeText(ex.name)}" loading="eager"><div class="demo-caption">Animated movement demonstration · ${safeText(result.name)}</div>`;
  const steps=$('#exerciseSteps'); if(steps && result.instructions.length)steps.innerHTML=renderExerciseSteps(ex,result.instructions);
  const img=slot.querySelector('img');
  img.onerror=()=>{slot.innerHTML=`<div class="demo-fallback"><strong>Animation unavailable right now</strong><p>Use the step-by-step guide below or open a video demonstration.</p><a class="demo-link" href="https://www.youtube.com/results?search_query=${encodeURIComponent(ex.name+' exercise proper form')} " target="_blank" rel="noopener">Watch video demonstrations ↗</a></div>`};
 }else{
  slot.innerHTML=`<div class="demo-fallback"><div class="demo-fallback-icon">▶</div><strong>No matching GIF found for this movement</strong><p>Open a video search for this exact exercise and follow a clear demonstration before trying it.</p><a class="demo-link" href="https://www.youtube.com/results?search_query=${encodeURIComponent(ex.name+' exercise proper form')} " target="_blank" rel="noopener">Watch video demonstrations ↗</a></div>`;
 }
}

function loadState(){try{const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}');return {...structuredClone(defaultState),...saved,profile:{...structuredClone(defaultState.profile),...(saved.profile||{})},settings:{...structuredClone(defaultState.settings),...(saved.settings||{})},current:{...structuredClone(defaultState.current),...(saved.current||{})}}}catch(e){return structuredClone(defaultState)}}
function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state))}
function iso(d=new Date()){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
function dayIndex(d=new Date()){return (d.getDay()+6)%7}
function ensureToday(){const today=iso();if(state.current.date!==today){state.current={date:today,done:[],entries:{}};save()}}
function currentExercises(){
 const day=dayIndex();
 const focus=state.profile.focus||'balanced', duration=Number(state.profile.duration||45);
 let base=dayTemplates[day].map(id=>catalog.find(x=>x.id===id)).filter(Boolean);
 // Recovery days remain intentionally easy and short; they are not turned into extra lifting days.
 if([2,5,6].includes(day)) return base;
 const focusExtras={
  balanced:[],
  abs:['deadbug','sideplank'],
  back:['chestrow','row'],
  shoulders:['lateralraise','reardelt'],
  legs:['calfraise','bridge'],
  chestarms:['curl','inclinepress']
 };
 const target=duration<=30?5:duration<=45?6:7;
 for(const id of (focusExtras[focus]||[])){
   const ex=catalog.find(x=>x.id===id);
   if(ex && !base.some(y=>y.id===id) && base.length<target) base.push(ex);
 }
 return base.slice(0,target);
}
function roundWeight(n){if(!Number.isFinite(n)||n<=0)return 0;return Math.round(n*2)/2}
function progression(ex){const hist=state.logs.filter(l=>l.entries&&l.entries[ex.id]).slice(-3);let add=0;if(hist.length>=2&&hist.slice(-2).every(h=>h.entries[ex.id].completed&&h.entries[ex.id].success))add=1;return add}
function targetWeight(ex){
 let base=Number(state.profile.startWeights[ex.id]||0);
 if(!base)return 0;
 const history=state.logs.filter(l=>l.entries&&l.entries[ex.id]&&l.entries[ex.id].completed);
 // Only progress after two successful exposures; cap the app's recommendation at 24kg per dumbbell (or equivalent in lb).
 let increments=0, run=0;
 for(const log of history.slice(-6)){ if(log.entries[ex.id].success) run++; else run=0; }
 increments=Math.floor(run/2);
 const step=state.profile.units==='kg'?1:2.5;
 const cap=state.profile.units==='kg'?24:52.9;
 return roundWeight(Math.min(cap,base+increments*step));
}
function prescription(ex){let sets=ex.base;let weight=targetWeight(ex);let unit=state.profile.units==='kg'?'kg':'lb';let rep=ex.reps;if(ex.kind==='time')return `${sets} sets · ${rep}`;return `${sets} sets · ${rep}${weight?` · ${weight} ${unit}`:''}`}
function artSVG(pattern){let move='';const common=`stroke="#5f58e8" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"`;const body=`<circle cx="70" cy="22" r="9" fill="#ffcfad" stroke="#5f58e8" stroke-width="3"/>`;const torso=`<path ${common} d="M70 33 L70 58"/>`;const legs=`<path ${common} d="M70 58 L55 78 M70 58 L84 78"/>`;const arms=`<path ${common} d="M70 38 L51 49 M70 38 L89 49"/>`;
if(pattern==='squat')move=`${body}${torso}<path ${common} d="M70 38 L51 45 L54 59 M70 38 L89 45 L86 59 M70 58 L55 66 L47 78 M70 58 L84 66 L94 77"/><path ${common} d="M59 35 L81 35"/><rect x="58" y="28" width="24" height="7" rx="3" fill="#a9a3ff"/>`;
else if(pattern==='push')move=`${body}<path ${common} d="M38 54 L65 43 L90 49 M50 54 L44 73 M84 49 L93 72 M38 54 L29 61"/><path d="M20 77 H103" stroke="#b5b2d9" stroke-width="3" stroke-linecap="round"/>`;
else if(pattern==='row')move=`${body}<path ${common} d="M70 33 L62 55 L44 60 L33 75 M62 55 L80 64 L92 76 M64 40 L47 52 L38 48 M64 40 L82 46 L88 39"/><rect x="31" y="43" width="12" height="5" rx="2" fill="#a9a3ff"/>`;
else if(pattern==='hinge')move=`${body}<path ${common} d="M64 34 L80 51 L69 66 L52 78 M80 51 L94 65 L98 78 M66 39 L50 51 M66 39 L84 44"/><rect x="43" y="47" width="11" height="5" rx="2" fill="#a9a3ff"/>`;
else if(pattern==='press')move=`${body}${torso}<path ${common} d="M70 38 L52 29 L50 13 M70 38 L88 29 L90 13"/> <path ${common} d="M70 58 L57 78 M70 58 L83 78"/><rect x="43" y="9" width="14" height="5" rx="2" fill="#a9a3ff"/><rect x="83" y="9" width="14" height="5" rx="2" fill="#a9a3ff"/>`;
else if(pattern==='plank')move=`${body}<path ${common} d="M38 54 L66 48 L88 54 L98 72 M43 54 L31 72 M66 48 L74 65"/><path d="M20 77 H103" stroke="#b5b2d9" stroke-width="3" stroke-linecap="round"/>`;
else if(pattern==='lunge')move=`${body}${torso}<path ${common} d="M70 38 L51 46 L48 59 M70 38 L89 46 L88 59 M70 58 L52 65 L40 76 M70 58 L85 65 L96 76"/>`;
else if(pattern==='curl')move=`${body}${torso}<path ${common} d="M70 38 L52 47 L58 57 M70 38 L88 47 L82 57 M70 58 L57 78 M70 58 L83 78"/><rect x="51" y="55" width="14" height="5" rx="2" fill="#a9a3ff"/><rect x="75" y="55" width="14" height="5" rx="2" fill="#a9a3ff"/>`;
else if(pattern==='bridge')move=`${body}<path ${common} d="M36 66 L55 58 L76 60 L91 75 M55 58 L48 76 M76 60 L83 76"/><path d="M20 78 H103" stroke="#b5b2d9" stroke-width="3" stroke-linecap="round"/>`;
else if(pattern==='core')move=`${body}<path ${common} d="M69 34 L67 55 L52 66 L38 61 M67 55 L82 64 L96 56 M67 55 L52 42 L41 43"/> <path d="M24 78 H104" stroke="#b5b2d9" stroke-width="3" stroke-linecap="round"/>`;
return `<svg viewBox="0 0 125 95" aria-hidden="true"><circle cx="63" cy="47" r="38" fill="#e7e5ff"/> <g>${move}</g><circle cx="96" cy="22" r="3" fill="#a7e5ca"/><circle cx="25" cy="26" r="2" fill="#aaa4ff"/></svg>`}
function render(){ensureToday();const exs=currentExercises();const heroNum=document.querySelector('.hero-time strong');if(heroNum)heroNum.textContent=state.profile.duration||45;$('#todayLabel').textContent=new Date().toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric'}).toUpperCase();$('#sessionName').textContent=dayTypes[dayIndex()];$('#sessionMeta').textContent=[2,5,6].includes(dayIndex())?`${exs.length} gentle recovery activities · no hard lifting`:`${exs.length} exercises · ${state.profile.duration||45}-minute target · beginner progression`;$('#streakCount').textContent=streak();$('#workoutsValue').textContent=state.logs.length;$('#minutesValue').innerHTML=`${state.logs.reduce((s,l)=>s+(l.minutes||0),0)}<span class="unit">m</span>`;$('#volumeValue').innerHTML=`${Math.round(state.logs.reduce((s,l)=>s+(l.volume||0),0)).toLocaleString()}<span class="unit">${state.profile.units}</span>`;const done=state.current.done.length;$('#progressText').textContent=`${done} of ${exs.length} complete`;$(`#progressBar`).style.width=`${exs.length?done/exs.length*100:0}%`;$('#exerciseList').innerHTML=exs.map(ex=>{const d=state.current.done.includes(ex.id);return `<article class="exercise-card ${d?'done':''}"><div class="exercise-art">${artSVG(ex.pattern)}</div><div class="exercise-main"><div class="exercise-topline"><div class="exercise-name">${ex.name}</div><span class="muscle-tag">${ex.muscle}</span></div><p class="exercise-prescription">${prescription(ex)}</p><div class="exercise-detail">${ex.gear} · ${ex.rest}s rest</div></div><button class="check-button ${d?'checked':''}" data-check="${ex.id}" aria-label="${d?'Mark incomplete':'Mark complete'}">${d?'✓':'✓'}</button></article>`}).join('');$('#weekCount').textContent=`${weekLogs().length}/7`;$('#weekDots').innerHTML=names.map((n,i)=>{let dt=new Date();dt.setDate(dt.getDate()-dayIndex()+i);let key=iso(dt);let log=state.logs.find(l=>l.date===key);return `<div class="day-dot ${log?'done':''} ${i===dayIndex()?'today':''}"><i>${log?'✓':n.slice(0,1)}</i><span>${n.slice(0,3)}</span></div>`}).join('')}
function weekLogs(){let start=new Date();start.setDate(start.getDate()-dayIndex());let keys=Array.from({length:7},(_,i)=>{let d=new Date(start);d.setDate(d.getDate()+i);return iso(d)});return state.logs.filter(l=>keys.includes(l.date))}
function streak(){let s=0,d=new Date();let set=new Set(state.logs.map(l=>l.date));if(!set.has(iso(d)))d.setDate(d.getDate()-1);while(set.has(iso(d))){s++;d.setDate(d.getDate()-1)}return s}
function toast(t){let el=$('#toast');el.textContent=t;el.classList.add('show');clearTimeout(window.toastTimeout);window.toastTimeout=setTimeout(()=>el.classList.remove('show'),2200)}
function openModal(title,eyebrow,html){$('#modalTitle').textContent=title;$('#modalEyebrow').textContent=eyebrow;$('#modalContent').innerHTML=html;$('#modalBackdrop').hidden=false;document.body.style.overflow='hidden'}
function closeModal(){$('#modalBackdrop').hidden=true;document.body.style.overflow=''}
function profileModal(){let p=state.profile;openModal('Your training profile','PERSONALISE PULSE',`<form id="profileForm"><div class="form-grid"><div class="field"><label for="weight">Current weight (${p.units})</label><input id="weight" name="weight" type="number" min="1" step=".1" value="${p.weight}" placeholder="e.g. 78" required></div><div class="field"><label for="height">Height (cm)</label><input id="height" name="height" type="number" min="80" max="250" step="1" value="${p.height}" placeholder="e.g. 175" required></div></div><div class="form-grid"><div class="field"><label for="units">Weight units</label><select id="units" name="units"><option value="kg" ${p.units==='kg'?'selected':''}>Kilograms (kg)</option><option value="lb" ${p.units==='lb'?'selected':''}>Pounds (lb)</option></select></div><div class="field"><label for="experience">Experience</label><select id="experience" name="experience"><option value="beginner" ${p.experience==='beginner'?'selected':''}>Beginner</option><option value="intermediate" ${p.experience==='intermediate'?'selected':''}>Intermediate</option><option value="advanced" ${p.experience==='advanced'?'selected':''}>Advanced</option></select></div></div><div class="field"><label for="goal">Main goal</label><select id="goal" name="goal"><option value="strength" ${p.goal==='strength'?'selected':''}>Build strength</option><option value="fitness" ${p.goal==='fitness'?'selected':''}>General fitness</option><option value="muscle" ${p.goal==='muscle'?'selected':''}>Build muscle</option></select></div><div class="form-grid"><div class="field"><label for="duration">Workout length</label><select id="duration" name="duration"><option value="30" ${p.duration==='30'?'selected':''}>30 minutes · concise session</option><option value="45" ${p.duration==='45'?'selected':''}>45 minutes · standard session</option><option value="60" ${p.duration==='60'?'selected':''}>60 minutes · extended session</option><option value="75" ${p.duration==='75'?'selected':''}>75 minutes · extended session</option></select></div><div class="field"><label for="focus">Extra focus</label><select id="focus" name="focus"><option value="balanced" ${p.focus==='balanced'?'selected':''}>Balanced full body</option><option value="abs" ${p.focus==='abs'?'selected':''}>Abs & obliques</option><option value="back" ${p.focus==='back'?'selected':''}>Back & lats</option><option value="shoulders" ${p.focus==='shoulders'?'selected':''}>Shoulders</option><option value="legs" ${p.focus==='legs'?'selected':''}>Legs & glutes</option><option value="chestarms" ${p.focus==='chestarms'?'selected':''}>Chest & arms</option></select></div></div><p class="helper">Plan designed for beginner home training with adjustable dumbbells (up to 24kg each) and an adjustable bench. Height and body weight do not determine your lifting loads.</p><div class="section-head"><div><p class="eyebrow">STARTING LOADS</p><h2 style="font-size:17px">Your comfortable weights</h2></div></div><p class="helper">Enter a comfortable starting load that lets you finish every rep with control and about 2–3 reps left in reserve. For safety, start lighter than you think you need. Your dumbbells go up to 24kg each; recovery days are intentionally easy.</p><div class="form-grid">${catalog.filter(x=>x.kind==='weight').map(x=>`<div class="field"><label for="w_${x.id}">${x.name} (${p.units})</label><input id="w_${x.id}" name="w_${x.id}" type="number" min="0" step=".5" value="${p.startWeights[x.id]||''}" placeholder="e.g. 5"></div>`).join('')}</div><button class="wide-button" type="submit">Save my plan</button><button class="secondary-button" type="button" id="resetData">Reset all saved data</button></form>`);$('#profileForm').onsubmit=e=>{e.preventDefault();let fd=new FormData(e.target);state.profile.weight=fd.get('weight');state.profile.height=fd.get('height');state.profile.units=fd.get('units');state.profile.experience=fd.get('experience');state.profile.goal=fd.get('goal');state.profile.duration=fd.get('duration')||'45';state.profile.focus=fd.get('focus')||'balanced';state.profile.startWeights={};catalog.filter(x=>x.kind==='weight').forEach(x=>{let v=Number(fd.get('w_'+x.id));if(v>0)state.profile.startWeights[x.id]=v});save();closeModal();render();toast('Your plan is saved on this device')};$('#resetData').onclick=()=>{if(confirm('Delete your profile and all workout history from this device?')){localStorage.removeItem(STORAGE_KEY);state=structuredClone(defaultState);ensureToday();closeModal();render();toast('All saved data cleared')}}}
function exerciseModal(ex){
 let done=state.current.done.includes(ex.id);
 openModal(ex.name,`${ex.muscle} · EXERCISE GUIDE`, `<div class="demo-media" id="demoMedia"><div class="demo-loading"><span class="demo-spinner"></span><strong>Loading real exercise demonstration…</strong><p>GIFs need an internet connection the first time.</p></div></div><div class="exercise-guide-heading">How to do it</div><div id="exerciseSteps">${renderExerciseSteps(ex)}</div><p class="modal-copy">${safeText(ex.desc)}</p><div class="timer-row"><span>Suggested rest between sets</span><strong>${ex.rest} sec</strong></div><div class="setting-note">Begin with a comfortable load and controlled repetitions. Stop if you feel sharp pain, dizziness or unusual symptoms. Progress only when you can complete all reps with good technique.</div><div class="set-inputs"><div class="field"><label>Sets completed</label><input id="logSets" type="number" min="0" max="6" value="${ex.base}"></div><div class="field"><label>Reps per set</label><input id="logReps" type="number" min="0" max="50" value="${parseInt(ex.reps)||10}"></div><div class="field"><label>Weight (${state.profile.units})</label><input id="logWeight" type="number" min="0" step=".5" value="${targetWeight(ex)||state.profile.startWeights[ex.id]||0}"></div></div><label style="display:flex;gap:9px;align-items:center;font-size:11px;margin:4px 0 14px"><input type="checkbox" id="logSuccess" checked> Completed with good form and target reps</label><button class="wide-button" id="saveExercise">${done?'Update exercise log':'Save and mark complete'}</button>`);
 loadExerciseDemo(ex);
 $('#saveExercise').onclick=()=>{let sets=Number($('#logSets').value)||0,reps=Number($('#logReps').value)||0,w=Number($('#logWeight').value)||0;state.current.entries[ex.id]={sets,reps,weight:w,completed:true,success:$('#logSuccess').checked};if(!state.current.done.includes(ex.id))state.current.done.push(ex.id);save();closeModal();render();toast('Exercise logged ✓');if(state.current.done.length===currentExercises().length)finishWorkoutPrompt()}
}
function finishWorkoutPrompt(){if(state.logs.some(l=>l.date===iso()))return;openModal('You showed up. That counts.','SESSION COMPLETE',`<div class="exercise-modal-art"><div style="font-size:50px;color:#5f58e8">✦</div></div><p class="modal-copy">Great work finishing today's full-body session. Log how long you trained to keep your progress accurate.</p><div class="field"><label for="duration">Workout duration (minutes)</label><input id="duration" type="number" min="1" max="180" value="35"></div><button class="wide-button" id="finishSave">Save completed workout</button>`);$('#finishSave').onclick=()=>{let entries=state.current.entries||{};let volume=Object.values(entries).reduce((s,e)=>s+(e.weight||0)*(e.reps||0)*(e.sets||0),0);state.logs.push({date:iso(),minutes:Number($('#duration').value)||35,volume,entries,completed:state.current.done.length});save();closeModal();render();toast('Workout saved to your history')}}
function startWorkout(){let exs=currentExercises();openModal(dayTypes[dayIndex()],'LET’S GET MOVING',`<div class="setting-note">${[2,5,6].includes(dayIndex())?'Keep this session genuinely easy. Walking and gentle mobility should leave you feeling better, not exhausted.':'Start with 4–5 minutes of easy movement and a light warm-up set. Use controlled technique, leave 2–3 reps in reserve, and rest 60–90 seconds on compound lifts.'}</div>${exs.map((x,i)=>`<div class="history-item"><div><strong>${i+1}. ${x.name}</strong><p>${prescription(x)} · rest ${x.rest}s</p></div><button class="text-button" data-guide="${x.id}">Guide ↗</button></div>`).join('')}<button class="wide-button" id="beginSession">Start checklist</button>`);document.querySelectorAll('[data-guide]').forEach(b=>b.onclick=()=>exerciseModal(catalog.find(x=>x.id===b.dataset.guide)));$('#beginSession').onclick=()=>{closeModal();document.querySelector('#exerciseList').scrollIntoView({behavior:'smooth',block:'start'});toast('Tap an exercise to log it, or ✓ to mark it done')}}
function historyModal(){let logs=[...state.logs].reverse();openModal('Your training history','YOUR PROGRESS',logs.length?logs.map(l=>`<div class="history-item"><div><strong>${new Date(l.date+'T12:00:00').toLocaleDateString(undefined,{weekday:'short',month:'short',day:'numeric'})}</strong><p>${l.completed||0} exercises · ${l.minutes||0} minutes</p></div><div class="history-total">${Math.round(l.volume||0)} ${state.profile.units}</div></div>`).join('')+`<button class="secondary-button" id="exportData">Export my data (JSON)</button>`:`<div class="empty-state">Your completed workouts will appear here.<br>Start with today's session to begin your streak.</div>`);if($('#exportData'))$('#exportData').onclick=()=>{let blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});let url=URL.createObjectURL(blob);let a=document.createElement('a');a.href=url;a.download='pulse-workout-backup.json';a.click();URL.revokeObjectURL(url);toast('Backup exported')}}
function progressModal(){historyModal()}
function bind(){document.addEventListener('click',e=>{let b=e.target.closest('[data-check]');if(b){let id=b.dataset.check;let ex=catalog.find(x=>x.id===id);if(state.current.done.includes(id)){state.current.done=state.current.done.filter(x=>x!==id);delete state.current.entries[id];save();render()}else exerciseModal(ex);return}let card=e.target.closest('.exercise-card');if(card&&!e.target.closest('button')){let ex=catalog.find(x=>x.id===card.querySelector('[data-check]').dataset.check);exerciseModal(ex)}});$('#settingsBtn').onclick=profileModal;$('#editPlanBtn').onclick=profileModal;$('#startBtn').onclick=startWorkout;$('#historyBtn').onclick=historyModal;$('#closeModal').onclick=closeModal;$('#modalBackdrop').addEventListener('click',e=>{if(e.target===$('#modalBackdrop'))closeModal()});document.querySelectorAll('.tab').forEach(t=>t.onclick=()=>{document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));t.classList.add('active');if(t.dataset.tab==='profile')profileModal();if(t.dataset.tab==='progress')progressModal();if(t.dataset.tab==='today')window.scrollTo({top:0,behavior:'smooth'})})}
ensureToday();bind();render();if(!state.profile.weight||!state.profile.height)setTimeout(profileModal,450);
if('serviceWorker' in navigator && location.protocol.startsWith('http'))navigator.serviceWorker.register('./sw.js').catch(()=>{});
