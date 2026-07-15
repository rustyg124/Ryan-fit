import type { Workout } from './types';

const machine = (file: string) => `${import.meta.env.BASE_URL}machines/${file}`;

export const workouts: Workout[] = [
  {
    id: 'upper-rebuild',
    title: 'Upper Rebuild',
    duration: '55–70 min',
    purpose: 'Build cuff and scapular control without loading through the painful elevation range.',
    exercises: [
      { id:'treadmill-warm', name:'Treadmill warm-up', photo:machine('treadmill.jpg'), location:'Right side after entry', setup:'Walk tall at an easy pace.', safety:'Stop if pelvic or urethral symptoms increase.', why:'Warm up without shoulder loading.', sets:1, target:'7 minutes', restSeconds:30 },
      { id:'er-isometric', name:'External-rotation isometric', photo:machine('functional-trainer.jpg'), location:'Cable area directly ahead', setup:'Elbow tucked at your side. Press outward gently without moving.', safety:'Use only 20–30% effort. Stop if pain increases.', why:'Build early cuff capacity below the painful arc.', sets:2, target:'20 seconds', restSeconds:45 },
      { id:'external-rotation', name:'Cable external rotation', photo:machine('functional-trainer.jpg'), location:'Stay at the cable area', setup:'Very light cable, elbow tucked, short pain-free range.', safety:'Do not chase range or fatigue.', why:'Restore rotator-cuff endurance.', sets:2, target:'12–15 reps', restSeconds:60 },
      { id:'scapular-row', name:'Low scapular retraction', photo:machine('functional-trainer.jpg'), location:'Stay at the cable area', setup:'Keep arms low. Draw shoulder blades back and gently down.', safety:'Keep the arms below the painful elevation range.', why:'Improve scapular control before stronger pulling.', sets:3, target:'12–15 reps', restSeconds:60 },
      { id:'low-row', name:'Low cable row — short range', photo:machine('low-row.jpg'), location:'Rear strength area', setup:'Neutral grip, elbows low, stop when upper arms reach your sides.', safety:'No shrugging or forceful end range.', why:'Rebuild the back while limiting elevation.', sets:2, target:'12–15 reps', restSeconds:75 },
      { id:'arms', name:'Supported arm machine', photo:machine('arm-machine.jpg'), location:'Pin-loaded area ahead', setup:'Keep the upper arm supported and shoulder quiet.', safety:'Stop if the shoulder rolls forward or aches.', why:'Maintain arm muscle with low shoulder demand.', sets:2, target:'12–15 reps', restSeconds:60 }
    ]
  },
  {
    id: 'legs-glutes',
    title: 'Legs + Glutes',
    duration: '65–80 min',
    purpose: 'Train legs for muscle retention and fat loss without squats or forced pelvic stretch.',
    exercises: [
      { id:'treadmill-leg', name:'Treadmill warm-up', photo:machine('treadmill.jpg'), location:'Right side after entry', setup:'Easy pace and modest incline.', safety:'Stop if pelvic symptoms increase.', why:'Prepare the legs without cycling.', sets:1, target:'8 minutes', restSeconds:30 },
      { id:'leg-press', name:'Pin-loaded leg press — partial depth', photo:machine('leg-press.jpg'), location:'Pin-loaded area directly ahead', setup:'Seat far enough back. Use a controlled partial range.', safety:'Stop before the pelvis tucks or the urethral area feels stretched.', why:'Train quads and glutes without squatting.', sets:3, target:'12–15 reps', restSeconds:90 },
      { id:'leg-extension', name:'Leg extension', photo:machine('leg-extension.jpg'), location:'Pin-loaded area', setup:'Align knee with the machine pivot. Lower slowly.', safety:'Breathe normally and avoid straining.', why:'Direct quadriceps work.', sets:3, target:'12–15 reps', restSeconds:75 },
      { id:'leg-curl', name:'Seated leg curl', photo:machine('leg-curl.jpg'), location:'Pin-loaded area', setup:'Secure the thigh pad comfortably and curl without lifting the hips.', safety:'Adjust pads to avoid groin or pelvic pulling.', why:'Supported hamstring training.', sets:3, target:'12–15 reps', restSeconds:75 },
      { id:'abductor', name:'Hip abductor — modest range', photo:machine('hip-abductor.jpg'), location:'Pin-loaded area', setup:'Open the knees only through a comfortable range.', safety:'Do not force a wide spread.', why:'Train side glutes without squats.', sets:3, target:'15–20 reps', restSeconds:60 },
      { id:'glute', name:'Standing glute machine', photo:machine('glute-machine.jpg'), location:'Pin-loaded area', setup:'Keep torso steady and drive back through a short range.', safety:'Avoid pelvic stretch.', why:'Direct glute work.', sets:3, target:'12–15 reps each', restSeconds:60 }
    ]
  }
];

export const dailyWorkoutId = () => {
  const day = new Date().getDay();
  return [0,3,6].includes(day) ? 'upper-rebuild' : 'legs-glutes';
};

export const quotes = [
  'One controlled session is enough to move forward.',
  'Smooth repetitions build lasting strength.',
  'Beginning creates momentum.',
  'Protect the repair. Train what you can.',
  'A lighter set done well is still progress.',
  'You are rebuilding with experience.'
];
