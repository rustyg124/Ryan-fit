import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import { dailyWorkoutId, quotes, workouts } from './data';
import { loadState, saveState } from './storage';
import type { ActiveSession, AppState, Exercise, Workout } from './types';
import { VoiceCoach } from './voice';

const voiceCoach = new VoiceCoach();

function fmt(seconds:number) {
  return `${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;
}

function App() {
  const [state, setState] = useState<AppState>(() => loadState());
  const [page, setPage] = useState<'coach'|'workout'|'plan'|'settings'>('coach');
  const [workoutId, setWorkoutId] = useState(dailyWorkoutId());
  const [countdown, setCountdown] = useState<number|null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const timerRef = useRef<number|null>(null);

  const workout = useMemo(() => workouts.find(w => w.id === (state.active?.workoutId ?? workoutId))!, [state.active?.workoutId, workoutId]);
  const active = state.active;
  const exercise: Exercise | null = active ? workout.exercises[active.exerciseIndex] : null;

  useEffect(() => {
    saveState(state);
  }, [state]);

  useEffect(() => {
    const refresh = () => setVoices(voiceCoach.refresh());
    refresh();
    if ('speechSynthesis' in window) window.speechSynthesis.onvoiceschanged = refresh;
    return () => { if ('speechSynthesis' in window) window.speechSynthesis.onvoiceschanged = null; };
  }, []);

  useEffect(() => {
    if (!active || !['set','rest'].includes(active.phase)) return;
    timerRef.current = window.setInterval(() => {
      setState(prev => {
        if (!prev.active) return prev;
        const next = { ...prev.active };
        if (next.phase === 'set') next.setSeconds += 1;
        if (next.phase === 'rest') {
          next.restSeconds -= 1;
          if ([60,30,10].includes(next.restSeconds)) {
            voiceCoach.speak(
              next.restSeconds === 60 ? 'One minute remains.' : `${next.restSeconds} seconds.`,
              prev.settings.voice, prev.settings.voiceName, prev.settings.voiceStyle
            );
          }
          if (next.restSeconds <= 0) {
            next.phase = 'ready';
            next.restSeconds = workout.exercises[next.exerciseIndex].restSeconds;
            voiceCoach.speak('Rest complete. Press start set when ready.', prev.settings.voice, prev.settings.voiceName, prev.settings.voiceStyle);
            navigator.vibrate?.([100,60,100]);
          }
        }
        return { ...prev, active: next };
      });
    }, 1000);
    return () => { if (timerRef.current) window.clearInterval(timerRef.current); };
  }, [active?.phase, active?.exerciseIndex, workout.exercises]);

  const updateState = (updater:(previous:AppState)=>AppState) => setState(previous => updater(previous));

  const startWorkout = () => {
    const selected = workouts.find(w => w.id === workoutId)!;
    const first = selected.exercises[0];
    const last = [...state.sets].reverse().find(s => s.exerciseId === first.id);
    const session: ActiveSession = {
      workoutId, exerciseIndex:0, setNumber:1, phase:'ready',
      setSeconds:0, restSeconds:first.restSeconds,
      weight:last?.weight ? String(last.weight) : '',
      reps:last?.reps ? String(last.reps) : '',
      pain:1, savedAt:new Date().toISOString()
    };
    updateState(prev => ({...prev, active:session}));
    setPage('workout');
    voiceCoach.speak(`Today's session is ${selected.title}. Just follow me. First, ${first.name}. ${first.location}.`,
      state.settings.voice, state.settings.voiceName, state.settings.voiceStyle);
  };

  const startSet = async () => {
    for (const value of [3,2,1]) {
      setCountdown(value);
      voiceCoach.speak(String(value), state.settings.voice, state.settings.voiceName, state.settings.voiceStyle);
      await new Promise(r => setTimeout(r, 700));
    }
    setCountdown(0);
    voiceCoach.speak('Go.', state.settings.voice, state.settings.voiceName, state.settings.voiceStyle);
    await new Promise(r => setTimeout(r, 350));
    setCountdown(null);
    updateState(prev => prev.active ? ({...prev, active:{...prev.active, phase:'set', setSeconds:0}}) : prev);
  };

  const finishSet = () => {
    if (!active || !exercise) return;
    const log = {
      date:new Date().toISOString(), workoutId:active.workoutId, exerciseId:exercise.id,
      setNumber:active.setNumber, weight:Number(active.weight)||0, reps:Number(active.reps)||0,
      pain:active.pain, seconds:active.setSeconds
    };
    const isLastSet = active.setNumber >= exercise.sets;
    const isLastExercise = active.exerciseIndex >= workout.exercises.length - 1;
    updateState(prev => {
      if (!prev.active) return prev;
      if (isLastSet && isLastExercise) {
        return {...prev, sets:[...prev.sets,log], completed:[...prev.completed,{date:new Date().toISOString(),workoutId:active.workoutId}], active:null};
      }
      let nextExerciseIndex = active.exerciseIndex;
      let nextSetNumber = active.setNumber + 1;
      if (isLastSet) { nextExerciseIndex += 1; nextSetNumber = 1; }
      const nextExercise = workout.exercises[nextExerciseIndex];
      const prior = [...prev.sets,log].reverse().find(s => s.exerciseId === nextExercise.id);
      return {
        ...prev,
        sets:[...prev.sets,log],
        active:{
          ...prev.active,
          exerciseIndex:nextExerciseIndex,
          setNumber:nextSetNumber,
          phase:'rest',
          setSeconds:0,
          restSeconds:exercise.restSeconds,
          weight:prior?.weight ? String(prior.weight) : '',
          reps:prior?.reps ? String(prior.reps) : '',
          pain:1,
          savedAt:new Date().toISOString()
        }
      };
    });
    if (isLastSet && isLastExercise) {
      setPage('coach');
      voiceCoach.speak('Workout complete. Good work. Check the shoulder again later today.', state.settings.voice, state.settings.voiceName, state.settings.voiceStyle);
    } else {
      voiceCoach.speak('Set complete. Rest starts now.', state.settings.voice, state.settings.voiceName, state.settings.voiceStyle);
    }
  };

  const activeSet = (key:'weight'|'reps'|'pain', value:string|number) => {
    updateState(prev => prev.active ? ({...prev,active:{...prev.active,[key]:value,savedAt:new Date().toISOString()}}) : prev);
  };

  const currentWeek = new Date();
  const quote = quotes[(currentWeek.getDate() + state.sets.length) % quotes.length];

  return (
    <div className="app">
      <header>
        <div><h1>RyanFit</h1><p>Genesis Alpha · Just follow me</p></div>
        <span className="badge">α 0.1</span>
      </header>

      {page === 'coach' && (
        <main>
          <section className="hero card">
            <span className="eyebrow">{new Date().toLocaleDateString(undefined,{weekday:'long',day:'numeric',month:'long'})}</span>
            <h2>Good morning, Ryan.</h2>
            <p>Your coach is ready. Start with one controlled session.</p>
          </section>

          {state.active && (
            <section className="card resume">
              <span className="eyebrow">Interrupted workout found</span>
              <h3>{workouts.find(w=>w.id===state.active!.workoutId)?.title}</h3>
              <p>{workouts.find(w=>w.id===state.active!.workoutId)?.exercises[state.active.exerciseIndex].name} · set {state.active.setNumber}</p>
              <div className="grid2">
                <button className="primary" onClick={()=>setPage('workout')}>Resume</button>
                <button className="quiet" onClick={()=>updateState(prev=>({...prev,active:null}))}>Discard</button>
              </div>
            </section>
          )}

          <section className="card">
            <span className="eyebrow">Today's session</span>
            <h3>{workouts.find(w=>w.id===workoutId)?.title}</h3>
            <p className="muted">{workouts.find(w=>w.id===workoutId)?.purpose}</p>
            <select value={workoutId} onChange={e=>setWorkoutId(e.target.value)}>
              {workouts.map(w=><option key={w.id} value={w.id}>{w.title} · {w.duration}</option>)}
            </select>
            <button className="primary full" onClick={startWorkout}>Start “Just Follow Me”</button>
          </section>

          <section className="card quote">“{quote}”</section>

          <section className="card">
            <h3>Progress so far</h3>
            <div className="stats">
              <div><strong>{state.completed.length}</strong><span>workouts</span></div>
              <div><strong>{state.sets.length}</strong><span>sets logged</span></div>
              <div><strong>{new Set(state.completed.map(c=>c.date.slice(0,10))).size}</strong><span>training days</span></div>
            </div>
          </section>
        </main>
      )}

      {page === 'workout' && active && exercise && (
        <main>
          <section className="card">
            <div className="between"><span className="badge">Exercise {active.exerciseIndex+1}/{workout.exercises.length} · Set {active.setNumber}/{exercise.sets}</span><button className="quiet" onClick={()=>setPage('coach')}>Leave</button></div>
            <img className="machinePhoto" src={exercise.photo} alt={exercise.name}/>
            <h2>{exercise.name}</h2>
            <p className="dose">{exercise.target}</p>
            <div className="coachLine">{exercise.location}. {exercise.setup}</div>
            <details open><summary>Safety</summary><p>{exercise.safety}</p></details>
            <details><summary>Why this is included</summary><p>{exercise.why}</p></details>

            <div className="grid2">
              <div><label>Weight (kg)</label><input value={active.weight} inputMode="decimal" onChange={e=>activeSet('weight',e.target.value)}/></div>
              <div><label>Reps / seconds</label><input value={active.reps} inputMode="numeric" onChange={e=>activeSet('reps',e.target.value)}/></div>
            </div>

            <label>Shoulder response</label>
            <div className="painRow">
              {[1,3,5].map(p=><button key={p} className={active.pain===p?'selected':''} onClick={()=>activeSet('pain',p)}>{p===1?'🙂 0–2':p===3?'😐 3–4':'😣 5+'}</button>)}
            </div>

            <div className="timer set">{fmt(active.setSeconds)}</div>
            {active.phase === 'ready' && <button className="primary full" onClick={startSet}>Start set</button>}
            {active.phase === 'set' && <button className="secondary full" onClick={finishSet}>Finish set</button>}
            {active.phase === 'rest' && <>
              <div className="timer">{fmt(active.restSeconds)}</div>
              <button className="quiet full" onClick={()=>updateState(prev=>prev.active?({...prev,active:{...prev.active,phase:'ready',restSeconds:exercise.restSeconds}}):prev)}>Skip rest</button>
            </>}
          </section>
        </main>
      )}

      {page === 'plan' && (
        <main>{workouts.map(w=><section className="card" key={w.id}><h2>{w.title}</h2><p className="muted">{w.purpose}</p>{w.exercises.map(e=><div className="planItem" key={e.id}><strong>{e.name}</strong><span>{e.sets} × {e.target}</span></div>)}</section>)}</main>
      )}

      {page === 'settings' && (
        <main>
          <section className="card">
            <h2>Coach audio</h2>
            <label>Voice</label>
            <select value={state.settings.voiceName} onChange={e=>updateState(prev=>({...prev,settings:{...prev.settings,voiceName:e.target.value}}))}>
              <option value="">System default</option>
              {voices.filter(v=>/^en/i.test(v.lang)).map(v=><option key={v.name} value={v.name}>{v.name} · {v.lang}</option>)}
            </select>
            <label>Style</label>
            <select value={state.settings.voiceStyle} onChange={e=>updateState(prev=>({...prev,settings:{...prev.settings,voiceStyle:e.target.value as AppState['settings']['voiceStyle']}}))}>
              <option value="calm">Calm</option><option value="direct">Direct</option><option value="gruff">Gruff</option>
            </select>
            <button className="secondary full" onClick={()=>voiceCoach.speak('Morning Ryan. Your Genesis coach is active.',true,state.settings.voiceName,state.settings.voiceStyle)}>Test coach</button>
          </section>
          <section className="card diagnostics">
            <h3>Diagnostics</h3>
            <pre>{JSON.stringify({speech:'speechSynthesis' in window,voices:voices.length,storage:!!window.localStorage,active:!!state.active,version:'0.1.0'},null,2)}</pre>
          </section>
        </main>
      )}

      <nav>
        <button className={page==='coach'?'active':''} onClick={()=>setPage('coach')}>Coach</button>
        <button className={page==='plan'?'active':''} onClick={()=>setPage('plan')}>Plan</button>
        <button className={page==='settings'?'active':''} onClick={()=>setPage('settings')}>Settings</button>
      </nav>
      {countdown !== null && <div className="countdown">{countdown === 0 ? 'GO' : countdown}</div>}
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
