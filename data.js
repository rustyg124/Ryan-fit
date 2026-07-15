
const MACHINES=[
{id:"treadmill",name:"Treadmill",photo:"assets/machines/treadmill.jpg",zone:"Cardio — right side",muscle:"Cardio",cues:"Walk tall at an easy pace. Add only a modest incline.",safety:"Stop if pelvic or urethral symptoms increase."},
{id:"stairs",name:"StairMill",photo:"assets/machines/stairmill.jpg",zone:"Cardio — right side",muscle:"Legs / cardio",cues:"Steady rhythm with light hand support.",safety:"Avoid hard intervals that make you brace or strain."},
{id:"er",name:"Cable external rotation — elbow tucked",photo:"assets/machines/functional_trainer.jpg",zone:"Cable area — ahead",muscle:"Rotator cuff",cues:"Set pulley around elbow height. Keep elbow gently against a towel at your side. Rotate only through a pain-free short arc.",safety:"Extremely light load. Do not chase fatigue or range."},
{id:"iso",name:"External-rotation isometric",photo:"assets/machines/functional_trainer.jpg",zone:"Cable area — ahead",muscle:"Rotator cuff",cues:"Elbow at side. Press outward gently into a fixed cable handle or wall without moving the arm.",safety:"Submaximal effort only, about 20–30%. Stop if pain rises."},
{id:"scap",name:"Low cable scapular retraction",photo:"assets/machines/functional_trainer.jpg",zone:"Cable area — ahead",muscle:"Mid-back / scapular control",cues:"Arms low and nearly straight. Draw shoulder blades gently back and down without lifting the arm.",safety:"Keep the arm below the painful elevation range."},
{id:"serratus",name:"Supine serratus punch",photo:"assets/machines/bench.jpg",zone:"Rear benches",muscle:"Serratus anterior",cues:"Lie on the bench with arm pointing only as high as comfortable. Reach shoulder blade toward ceiling without bending elbow.",safety:"Use no weight initially. Do not move into the painful arc."},
{id:"row",name:"Low cable row — short range",photo:"assets/machines/functional_trainer.jpg",zone:"Cable area — ahead",muscle:"Back / biceps",cues:"Use a neutral grip. Keep elbows low and pull only until upper arm reaches your side.",safety:"No shrugging or forceful pull. Substitute scapular retraction if painful."},
{id:"arms",name:"Biceps curl / triceps machine",photo:"assets/machines/arm_machine.jpg",zone:"Pin-loaded area — ahead",muscle:"Arms",cues:"Keep upper arm supported and shoulder still.",safety:"Stop if the shoulder rolls forward or aches."},
{id:"legpress",name:"Pin-loaded leg press — partial depth",photo:"assets/machines/leg_press.jpg",zone:"Pin-loaded area — ahead",muscle:"Quads / glutes",cues:"Set seat far enough back and use a controlled partial range.",safety:"Stop before hips tuck or the pelvic/urethral area feels stretched."},
{id:"plateleg",name:"Plate-loaded leg press — partial depth",photo:"assets/machines/plate_leg_press.jpg",zone:"Plate-loaded area",muscle:"Quads / glutes",cues:"Start light. Keep pelvis stable and knees tracking comfortably.",safety:"No deep hip flexion and no breath-holding."},
{id:"legext",name:"Leg extension",photo:"assets/machines/leg_extension.jpg",zone:"Pin-loaded area — ahead",muscle:"Quadriceps",cues:"Align knee with pivot and lower slowly.",safety:"Use normal breathing; do not strain."},
{id:"legcurl",name:"Seated leg curl",photo:"assets/machines/leg_curl.jpg",zone:"Pin-loaded area — ahead",muscle:"Hamstrings",cues:"Secure thigh pad comfortably and curl without lifting hips.",safety:"Adjust pads to avoid groin or pelvic pulling."},
{id:"abductor",name:"Hip abductor — restricted range",photo:"assets/machines/hip_abductor.jpg",zone:"Pin-loaded area — ahead",muscle:"Side glutes",cues:"Open knees through a modest comfortable range and pause.",safety:"Do not force a wide spread."},
{id:"glute",name:"Standing glute machine — short range",photo:"assets/machines/glute_machine.jpg",zone:"Pin-loaded area — ahead",muscle:"Glute max",cues:"Keep torso steady and drive leg back a short distance.",safety:"Use light hand support and avoid pelvic stretch."},
{id:"calf",name:"Plate-loaded calf raise",photo:"assets/machines/calf_raise.jpg",zone:"Plate-loaded area",muscle:"Calves",cues:"Rise, pause and lower slowly.",safety:"Check pad position and avoid straining."},
{id:"pulldown",name:"Lat pulldown — deferred",photo:"assets/machines/lat_pulldown.jpg",zone:"Pin-loaded area — ahead",muscle:"Back",cues:"This remains in the library for later.",safety:"Not currently programmed while elevation above 45° is painful."},
{id:"press",name:"Multi-press — deferred",photo:"assets/machines/multi_press.jpg",zone:"Pin-loaded area — ahead",muscle:"Chest / shoulders",cues:"Chest and shoulder pressing will be reintroduced later.",safety:"Not currently programmed while lifting above 45° remains painful."}
];

const WORKOUTS={
pull:{
 title:"Upper rebuild A",duration:"55–70 min",purpose:"Restore cuff and scapular control without loading through the painful elevation range.",
 exercises:[
  ["treadmill",1,"6–8 min"],["iso",2,"20 sec"],["er",2,"12–15"],["scap",3,"12–15"],["row",2,"12–15"],["arms",2,"12–15"],["treadmill",1,"15–20 min"]
 ]},
legsA:{
 title:"Legs + glutes A",duration:"65–80 min",purpose:"Train hard enough to rebuild muscle while avoiding squats and forced pelvic stretch.",
 exercises:[
  ["treadmill",1,"8 min"],["legpress",3,"12–15"],["legext",3,"12–15"],["legcurl",3,"12–15"],["abductor",3,"15–20"],["calf",3,"12–20"],["treadmill",1,"12–20 min"]
 ]},
recovery:{
 title:"Shoulder mobility + conditioning",duration:"35–50 min",purpose:"A low-load session for movement confidence, cuff activation and fat-loss support.",
 exercises:[
  ["treadmill",1,"10 min"],["iso",2,"20 sec"],["er",2,"12"],["scap",2,"15"],["serratus",2,"10–12"],["treadmill",1,"15–25 min"]
 ]},
upperB:{
 title:"Upper rebuild B",duration:"50–65 min",purpose:"Repeat safe patterns with slightly less volume and assess next-day response.",
 exercises:[
  ["treadmill",1,"6–8 min"],["iso",2,"20 sec"],["er",2,"12–15"],["serratus",2,"10–12"],["row",2,"12–15"],["arms",2,"12–15"],["treadmill",1,"15 min"]
 ]},
legsB:{
 title:"Legs + glutes B",duration:"65–80 min",purpose:"Posterior-chain and glute emphasis without deep hip flexion or wide pelvic positions.",
 exercises:[
  ["treadmill",1,"8 min"],["plateleg",3,"10–15"],["legcurl",4,"10–15"],["glute",3,"12–15 each"],["abductor",2,"15–20"],["calf",4,"12–20"],["stairs",1,"8–12 min easy"]
 ]},
conditioning:{
 title:"Conditioning + optional primer",duration:"35–55 min",purpose:"Support fat loss and recovery without adding shoulder fatigue.",
 exercises:[
  ["treadmill",1,"20–35 min"],["iso",2,"20 sec"],["scap",2,"15"]
 ]}
};
const WEEK=[
 ["Monday","pull"],["Tuesday","legsA"],["Wednesday","recovery"],["Thursday","upperB"],["Friday","legsB"],["Saturday","conditioning"],["Sunday","recovery"]
];
