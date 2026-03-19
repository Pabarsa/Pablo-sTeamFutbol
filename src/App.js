import { useState, useEffect, useCallback } from "react";

const WEEKS_DATA = [
  { num: 1, start: "23 Mar", end: "27 Mar", phase: "ADAPTACIÓN", desc: "Aprender la técnica. Pesos suaves, sin prisa.", color: "#4ECDC4" },
  { num: 2, start: "30 Mar", end: "3 Abr", phase: "ACTIVACIÓN", desc: "El cuerpo despierta. Mismo peso, mejor forma.", color: "#45B7D0" },
  { num: 3, start: "6 Abr", end: "10 Abr", phase: "BASE", desc: "Primera subida de peso. Ya controlas el movimiento.", color: "#3DA5E0" },
  { num: 4, start: "13 Abr", end: "17 Abr", phase: "PROGRESIÓN", desc: "Más peso, más serio. Empiezas a notarte diferente.", color: "#3690D6" },
  { num: 5, start: "20 Abr", end: "24 Abr", phase: "INTENSIDAD", desc: "Semana fuerte. 4 series, más volumen.", color: "#2E7DC8" },
  { num: 6, start: "27 Abr", end: "1 May", phase: "FUERZA", desc: "Pesos serios. Técnica perfecta o no sube.", color: "#2668B5" },
  { num: 7, start: "4 May", end: "8 May", phase: "PICO", desc: "Semana top. Sacamos los 40kg en máquinas.", color: "#1E55A2" },
  { num: 8, start: "11 May", end: "15 May", phase: "DELOAD", desc: "Descanso activo. Bajar peso, mantener técnica.", color: "#174490" },
];

const getWeightProgression = (wk, type = "machine") => {
  if (type === "machine") return [30, 30, 32.5, 35, 35, 37.5, 40, 30][wk - 1] || 30;
  if (type === "dumbbell") return [5, 6, 7, 7, 8, 8, 9, 5][wk - 1] || 5;
  return 0;
};

const getRepsProgression = (wk) => [
  { sets: 3, reps: "12-15", rest: "60s" },
  { sets: 3, reps: "12-15", rest: "60s" },
  { sets: 3, reps: "10-12", rest: "60-75s" },
  { sets: 3, reps: "10-12", rest: "75s" },
  { sets: 4, reps: "10-12", rest: "75s" },
  { sets: 4, reps: "8-10", rest: "75-90s" },
  { sets: 4, reps: "8-10", rest: "90s" },
  { sets: 3, reps: "12-15", rest: "60s" },
][wk - 1] || { sets: 3, reps: "12-15", rest: "60s" };

const ExerciseFigure = ({ type, style: s }) => {
  const c = "#4ECDC4", y = "#FFD93D", w2 = "2", bg = "#ffffff20";
  const figs = {
    "press-banca": <svg viewBox="0 0 120 70" style={s}><rect x="15" y="42" width="90" height="6" rx="2" fill={bg} stroke="#ffffff30"/><circle cx="60" cy="30" r="6" fill="none" stroke={c} strokeWidth={w2}/><line x1="60" y1="36" x2="60" y2="50" stroke={c} strokeWidth={w2}/><line x1="60" y1="50" x2="48" y2="62" stroke={c} strokeWidth={w2}/><line x1="60" y1="50" x2="72" y2="62" stroke={c} strokeWidth={w2}/><line x1="60" y1="40" x2="40" y2="28" stroke={c} strokeWidth={w2}/><line x1="60" y1="40" x2="80" y2="28" stroke={c} strokeWidth={w2}/><line x1="35" y1="26" x2="85" y2="26" stroke={y} strokeWidth="3" strokeLinecap="round"/><circle cx="33" cy="26" r="4" fill={y} opacity="0.7"/><circle cx="87" cy="26" r="4" fill={y} opacity="0.7"/><text x="60" y="8" textAnchor="middle" fill="#ffffff50" fontSize="7" fontFamily="monospace">PUSH</text></svg>,
    "aperturas": <svg viewBox="0 0 120 70" style={s}><circle cx="60" cy="18" r="6" fill="none" stroke={c} strokeWidth={w2}/><line x1="60" y1="24" x2="60" y2="45" stroke={c} strokeWidth={w2}/><line x1="60" y1="45" x2="48" y2="60" stroke={c} strokeWidth={w2}/><line x1="60" y1="45" x2="72" y2="60" stroke={c} strokeWidth={w2}/><path d="M60,32 Q40,20 35,35" fill="none" stroke={c} strokeWidth={w2}/><path d="M60,32 Q80,20 85,35" fill="none" stroke={c} strokeWidth={w2}/><text x="60" y="8" textAnchor="middle" fill="#ffffff50" fontSize="7" fontFamily="monospace">ABRE</text></svg>,
    "press-hombro": <svg viewBox="0 0 120 70" style={s}><circle cx="60" cy="22" r="6" fill="none" stroke={c} strokeWidth={w2}/><line x1="60" y1="28" x2="60" y2="48" stroke={c} strokeWidth={w2}/><line x1="60" y1="48" x2="48" y2="62" stroke={c} strokeWidth={w2}/><line x1="60" y1="48" x2="72" y2="62" stroke={c} strokeWidth={w2}/><line x1="60" y1="34" x2="42" y2="14" stroke={c} strokeWidth={w2}/><line x1="60" y1="34" x2="78" y2="14" stroke={c} strokeWidth={w2}/><line x1="38" y1="12" x2="82" y2="12" stroke={y} strokeWidth="3" strokeLinecap="round"/><text x="60" y="7" textAnchor="middle" fill="#ffffff50" fontSize="7" fontFamily="monospace">SUBE</text></svg>,
    "elevacion-lateral": <svg viewBox="0 0 120 70" style={s}><circle cx="60" cy="16" r="6" fill="none" stroke={c} strokeWidth={w2}/><line x1="60" y1="22" x2="60" y2="46" stroke={c} strokeWidth={w2}/><line x1="60" y1="46" x2="50" y2="62" stroke={c} strokeWidth={w2}/><line x1="60" y1="46" x2="70" y2="62" stroke={c} strokeWidth={w2}/><line x1="60" y1="30" x2="32" y2="30" stroke={c} strokeWidth={w2}/><line x1="60" y1="30" x2="88" y2="30" stroke={c} strokeWidth={w2}/><rect x="27" y="28" width="6" height="8" rx="1" fill={y} opacity="0.7"/><rect x="87" y="28" width="6" height="8" rx="1" fill={y} opacity="0.7"/></svg>,
    "triceps": <svg viewBox="0 0 120 70" style={s}><circle cx="60" cy="14" r="6" fill="none" stroke={c} strokeWidth={w2}/><line x1="60" y1="20" x2="60" y2="44" stroke={c} strokeWidth={w2}/><line x1="60" y1="44" x2="50" y2="60" stroke={c} strokeWidth={w2}/><line x1="60" y1="44" x2="70" y2="60" stroke={c} strokeWidth={w2}/><line x1="60" y1="28" x2="50" y2="18" stroke={c} strokeWidth={w2}/><line x1="60" y1="28" x2="70" y2="18" stroke={c} strokeWidth={w2}/><line x1="50" y1="18" x2="50" y2="38" stroke={c} strokeWidth={w2}/><line x1="70" y1="18" x2="70" y2="38" stroke={c} strokeWidth={w2}/><rect x="45" y="36" width="10" height="5" rx="1" fill={y} opacity="0.6"/><rect x="65" y="36" width="10" height="5" rx="1" fill={y} opacity="0.6"/></svg>,
    "polea-triceps": <svg viewBox="0 0 120 70" style={s}><line x1="85" y1="5" x2="85" y2="55" stroke={bg} strokeWidth={w2}/><circle cx="85" cy="8" r="3" fill={bg}/><line x1="85" y1="8" x2="70" y2="30" stroke={y} strokeWidth="1.5"/><circle cx="60" cy="18" r="6" fill="none" stroke={c} strokeWidth={w2}/><line x1="60" y1="24" x2="60" y2="44" stroke={c} strokeWidth={w2}/><line x1="60" y1="44" x2="50" y2="60" stroke={c} strokeWidth={w2}/><line x1="60" y1="44" x2="70" y2="60" stroke={c} strokeWidth={w2}/><line x1="60" y1="32" x2="68" y2="24" stroke={c} strokeWidth={w2}/><line x1="68" y1="24" x2="70" y2="32" stroke={c} strokeWidth={w2}/><text x="40" y="66" textAnchor="middle" fill="#ffffff40" fontSize="6" fontFamily="monospace">BAJA</text></svg>,
    "jalon": <svg viewBox="0 0 120 70" style={s}><line x1="60" y1="2" x2="60" y2="12" stroke={bg} strokeWidth={w2}/><line x1="38" y1="12" x2="82" y2="12" stroke={y} strokeWidth="2.5" strokeLinecap="round"/><circle cx="60" cy="24" r="6" fill="none" stroke={c} strokeWidth={w2}/><line x1="60" y1="30" x2="60" y2="50" stroke={c} strokeWidth={w2}/><line x1="60" y1="50" x2="50" y2="62" stroke={c} strokeWidth={w2}/><line x1="60" y1="50" x2="70" y2="62" stroke={c} strokeWidth={w2}/><line x1="60" y1="36" x2="42" y2="16" stroke={c} strokeWidth={w2}/><line x1="60" y1="36" x2="78" y2="16" stroke={c} strokeWidth={w2}/><text x="60" y="7" textAnchor="middle" fill="#ffffff40" fontSize="6" fontFamily="monospace">TIRA</text></svg>,
    "remo-sentado": <svg viewBox="0 0 120 70" style={s}><rect x="20" y="40" width="50" height="5" rx="2" fill="#ffffff15"/><circle cx="52" cy="28" r="6" fill="none" stroke={c} strokeWidth={w2}/><line x1="52" y1="34" x2="48" y2="44" stroke={c} strokeWidth={w2}/><line x1="48" y1="44" x2="30" y2="56" stroke={c} strokeWidth={w2}/><line x1="48" y1="44" x2="55" y2="58" stroke={c} strokeWidth={w2}/><line x1="52" y1="38" x2="70" y2="32" stroke={c} strokeWidth={w2}/><line x1="70" y1="32" x2="78" y2="38" stroke={c} strokeWidth={w2}/><text x="90" y="40" fill="#ffffff40" fontSize="6" fontFamily="monospace">TIRA</text></svg>,
    "remo-mancuerna": <svg viewBox="0 0 120 70" style={s}><rect x="25" y="38" width="40" height="5" rx="2" fill="#ffffff15"/><circle cx="65" cy="22" r="6" fill="none" stroke={c} strokeWidth={w2}/><line x1="62" y1="27" x2="50" y2="40" stroke={c} strokeWidth={w2}/><line x1="50" y1="40" x2="38" y2="55" stroke={c} strokeWidth={w2}/><line x1="50" y1="40" x2="62" y2="55" stroke={c} strokeWidth={w2}/><line x1="55" y1="33" x2="72" y2="30" stroke={c} strokeWidth={w2}/><line x1="72" y1="30" x2="76" y2="22" stroke={c} strokeWidth={w2}/><rect x="74" y="18" width="5" height="10" rx="1" fill={y} opacity="0.7"/><text x="92" y="28" fill="#ffffff40" fontSize="6" fontFamily="monospace">SUBE</text></svg>,
    "curl-biceps": <svg viewBox="0 0 120 70" style={s}><circle cx="60" cy="14" r="6" fill="none" stroke={c} strokeWidth={w2}/><line x1="60" y1="20" x2="60" y2="44" stroke={c} strokeWidth={w2}/><line x1="60" y1="44" x2="50" y2="60" stroke={c} strokeWidth={w2}/><line x1="60" y1="44" x2="70" y2="60" stroke={c} strokeWidth={w2}/><line x1="60" y1="30" x2="48" y2="30" stroke={c} strokeWidth={w2}/><line x1="48" y1="30" x2="46" y2="20" stroke={c} strokeWidth={w2}/><line x1="60" y1="30" x2="72" y2="30" stroke={c} strokeWidth={w2}/><line x1="72" y1="30" x2="74" y2="20" stroke={c} strokeWidth={w2}/><rect x="42" y="16" width="7" height="5" rx="1" fill={y} opacity="0.7"/><rect x="71" y="16" width="7" height="5" rx="1" fill={y} opacity="0.7"/></svg>,
    "plancha": <svg viewBox="0 0 120 70" style={s}><circle cx="88" cy="28" r="5" fill="none" stroke={c} strokeWidth={w2}/><line x1="84" y1="32" x2="38" y2="32" stroke={c} strokeWidth="2.5"/><line x1="38" y1="32" x2="30" y2="55" stroke={c} strokeWidth={w2}/><line x1="38" y1="32" x2="45" y2="55" stroke={c} strokeWidth={w2}/><line x1="78" y1="32" x2="78" y2="50" stroke={c} strokeWidth={w2}/><line x1="72" y1="32" x2="72" y2="50" stroke={c} strokeWidth={w2}/><text x="60" y="20" textAnchor="middle" fill={y} fontSize="7" fontFamily="monospace">RECTO!</text></svg>,
    "prensa": <svg viewBox="0 0 120 70" style={s}><rect x="15" y="15" width="60" height="45" rx="3" fill="none" stroke={bg} strokeWidth="1.5"/><line x1="75" y1="15" x2="100" y2="8" stroke={bg} strokeWidth="1.5"/><circle cx="45" cy="38" r="6" fill="none" stroke={c} strokeWidth={w2}/><line x1="45" y1="44" x2="40" y2="52" stroke={c} strokeWidth={w2}/><line x1="40" y1="52" x2="55" y2="26" stroke={c} strokeWidth={w2}/><line x1="55" y1="26" x2="70" y2="18" stroke={c} strokeWidth={w2}/><rect x="68" y="14" width="12" height="8" rx="2" fill={y} opacity="0.5"/></svg>,
    "curl-femoral": <svg viewBox="0 0 120 70" style={s}><rect x="20" y="30" width="60" height="6" rx="2" fill="#ffffff15"/><circle cx="72" cy="24" r="5" fill="none" stroke={c} strokeWidth={w2}/><line x1="68" y1="28" x2="40" y2="34" stroke={c} strokeWidth={w2}/><line x1="40" y1="34" x2="30" y2="50" stroke={c} strokeWidth={w2}/><path d="M30,50 Q25,55 30,58" fill="none" stroke={c} strokeWidth={w2}/><rect x="26" y="44" width="10" height="5" rx="1" fill={y} opacity="0.5"/><text x="60" y="56" textAnchor="middle" fill="#ffffff40" fontSize="6" fontFamily="monospace">FLEXIONA</text></svg>,
    "extension-quad": <svg viewBox="0 0 120 70" style={s}><rect x="30" y="20" width="15" height="35" rx="3" fill="#ffffff10" stroke={bg}/><circle cx="50" cy="22" r="5" fill="none" stroke={c} strokeWidth={w2}/><line x1="50" y1="27" x2="42" y2="38" stroke={c} strokeWidth={w2}/><line x1="42" y1="38" x2="42" y2="50" stroke={c} strokeWidth={w2}/><line x1="42" y1="50" x2="65" y2="40" stroke={c} strokeWidth={w2}/><rect x="62" y="37" width="8" height="6" rx="1" fill={y} opacity="0.5"/></svg>,
    "sentadilla-goblet": <svg viewBox="0 0 120 70" style={s}><circle cx="60" cy="14" r="6" fill="none" stroke={c} strokeWidth={w2}/><line x1="60" y1="20" x2="60" y2="38" stroke={c} strokeWidth={w2}/><line x1="60" y1="38" x2="48" y2="54" stroke={c} strokeWidth={w2}/><line x1="60" y1="38" x2="72" y2="54" stroke={c} strokeWidth={w2}/><line x1="48" y1="54" x2="48" y2="62" stroke={c} strokeWidth={w2}/><line x1="72" y1="54" x2="72" y2="62" stroke={c} strokeWidth={w2}/><rect x="53" y="20" width="14" height="6" rx="2" fill={y} opacity="0.6"/></svg>,
    "zancada": <svg viewBox="0 0 120 70" style={s}><circle cx="60" cy="10" r="6" fill="none" stroke={c} strokeWidth={w2}/><line x1="60" y1="16" x2="60" y2="36" stroke={c} strokeWidth={w2}/><line x1="60" y1="36" x2="40" y2="56" stroke={c} strokeWidth={w2}/><line x1="60" y1="36" x2="78" y2="56" stroke={c} strokeWidth={w2}/><line x1="40" y1="56" x2="40" y2="64" stroke={c} strokeWidth={w2}/><line x1="78" y1="56" x2="82" y2="64" stroke={c} strokeWidth={w2}/><line x1="60" y1="24" x2="52" y2="36" stroke={c} strokeWidth={w2}/><line x1="60" y1="24" x2="68" y2="36" stroke={c} strokeWidth={w2}/><rect x="49" y="34" width="5" height="8" rx="1" fill={y} opacity="0.6"/><rect x="66" y="34" width="5" height="8" rx="1" fill={y} opacity="0.6"/></svg>,
    "gemelos": <svg viewBox="0 0 120 70" style={s}><circle cx="60" cy="10" r="5" fill="none" stroke={c} strokeWidth={w2}/><line x1="60" y1="15" x2="60" y2="40" stroke={c} strokeWidth={w2}/><line x1="60" y1="40" x2="55" y2="52" stroke={c} strokeWidth={w2}/><line x1="60" y1="40" x2="65" y2="52" stroke={c} strokeWidth={w2}/><line x1="55" y1="52" x2="52" y2="56" stroke={c} strokeWidth="2.5"/><line x1="65" y1="52" x2="68" y2="56" stroke={c} strokeWidth="2.5"/><text x="60" y="66" textAnchor="middle" fill="#ffffff40" fontSize="6" fontFamily="monospace">TALONES</text></svg>,
    "bici-crunch": <svg viewBox="0 0 120 70" style={s}><circle cx="72" cy="30" r="5" fill="none" stroke={c} strokeWidth={w2}/><line x1="68" y1="34" x2="50" y2="40" stroke={c} strokeWidth={w2}/><line x1="50" y1="40" x2="38" y2="28" stroke={c} strokeWidth={w2}/><line x1="50" y1="40" x2="55" y2="55" stroke={c} strokeWidth={w2}/><line x1="55" y1="55" x2="45" y2="60" stroke={c} strokeWidth={w2}/><line x1="50" y1="40" x2="35" y2="50" stroke={c} strokeWidth={w2}/><line x1="35" y1="50" x2="42" y2="58" stroke={c} strokeWidth={w2}/></svg>,
    "bici": <svg viewBox="0 0 120 70" style={s}><circle cx="35" cy="45" r="14" fill="none" stroke={bg} strokeWidth="1.5"/><circle cx="85" cy="45" r="14" fill="none" stroke={bg} strokeWidth="1.5"/><line x1="35" y1="45" x2="55" y2="35" stroke="#ffffff30" strokeWidth="1.5"/><line x1="55" y1="35" x2="85" y2="45" stroke="#ffffff30" strokeWidth="1.5"/><line x1="55" y1="35" x2="60" y2="20" stroke="#ffffff30" strokeWidth="1.5"/><circle cx="60" cy="14" r="5" fill="none" stroke={c} strokeWidth={w2}/><text x="60" y="66" textAnchor="middle" fill={c} fontSize="7" fontFamily="monospace">SUAVE</text></svg>,
    "crunch-maquina": <svg viewBox="0 0 120 70" style={s}><rect x="30" y="15" width="12" height="45" rx="3" fill="#ffffff10" stroke={bg}/><circle cx="55" cy="20" r="5" fill="none" stroke={c} strokeWidth={w2}/><line x1="55" y1="25" x2="50" y2="40" stroke={c} strokeWidth={w2}/><line x1="50" y1="40" x2="42" y2="55" stroke={c} strokeWidth={w2}/><line x1="50" y1="40" x2="60" y2="55" stroke={c} strokeWidth={w2}/><line x1="55" y1="30" x2="42" y2="22" stroke={c} strokeWidth={w2}/><text x="75" y="38" fill="#ffffff40" fontSize="6" fontFamily="monospace">CONTRAE</text></svg>,
  };
  return figs[type] || figs["plancha"];
};

const EX = {
  l1: { name: "Press banca máquina", type: "machine", muscle: "Pecho", fig: "press-banca", howTo: "Siéntate con la espalda bien pegada al respaldo. Agarra las asas a la altura del pecho. Empuja hacia delante hasta estirar los brazos (sin bloquear codos). Baja despacio controlando 2 segundos. Suelta aire al empujar, coge al bajar.", tips: "No arquees la espalda. Si te cuesta las últimas reps, es el peso correcto.", yt: "https://www.youtube.com/results?search_query=press+banca+m%C3%A1quina+tutorial" },
  l2: { name: "Aperturas máquina (pec deck)", type: "machine", muscle: "Pecho", fig: "aperturas", howTo: "Siéntate recto, espalda pegada. Brazos abiertos en las almohadillas. Cierra como si abrazaras un árbol. Aprieta 1seg cuando las manos se juntan. Abre despacio.", tips: "Codos ligeramente flexionados siempre.", yt: "https://www.youtube.com/results?search_query=aperturas+pec+deck+tutorial" },
  l3: { name: "Press hombro máquina", type: "machine", muscle: "Hombro", fig: "press-hombro", howTo: "Siéntate recto. Asas a la altura de hombros. Empuja arriba pero NO estires del todo (protege articulación). Baja controlado hasta 90°.", tips: "No subas los hombros a las orejas. Core apretado.", yt: "https://www.youtube.com/results?search_query=press+hombro+m%C3%A1quina+tutorial" },
  l4: { name: "Elevaciones laterales mancuernas", type: "dumbbell", muscle: "Hombro", fig: "elevacion-lateral", howTo: "De pie, mancuerna en cada mano. Sube brazos a los lados hasta la altura del hombro. Baja despacio. Codo ligeramente flexionado.", tips: "Sin impulso. Si te balanceas, baja el peso.", yt: "https://www.youtube.com/results?search_query=elevaciones+laterales+mancuerna+tutorial" },
  l5: { name: "Extensión tríceps máquina/polea", type: "machine", muscle: "Tríceps", fig: "triceps", howTo: "Polea con barra, palmas hacia abajo. Codos pegados al cuerpo. Solo mueve antebrazos: estira abajo apretando tríceps. Sube controlado.", tips: "Los codos NO se mueven. Si se despegan, baja peso.", yt: "https://www.youtube.com/results?search_query=extensi%C3%B3n+tr%C3%ADceps+polea+tutorial" },
  l6: { name: "Extensión tríceps polea cuerda", type: "machine", muscle: "Tríceps", fig: "polea-triceps", howTo: "Polea con cuerda. Agarra cada extremo. Estira abajo y al final abre las manos a los lados. Sube controlado.", tips: "Inclina ligeramente el cuerpo. Separa cuerdas abajo del todo.", yt: "https://www.youtube.com/results?search_query=tr%C3%ADceps+cuerda+polea+tutorial" },
  m1: { name: "Jalón al pecho (polea alta)", type: "machine", muscle: "Espalda", fig: "jalon", howTo: "Rodillas bajo almohadillas. Barra ancha, palmas al frente. Tira al pecho sacando pecho y apretando escápulas. Sube controlado.", tips: "NUNCA a la nuca. Junta los omóplatos. Pecho fuera.", yt: "https://www.youtube.com/results?search_query=jal%C3%B3n+al+pecho+polea+tutorial" },
  m2: { name: "Remo sentado máquina", type: "machine", muscle: "Espalda", fig: "remo-sentado", howTo: "Pecho contra almohadilla. Tira hacia ti apretando escápulas (como sujetar un lápiz entre omóplatos). Extiende despacio.", tips: "Sin impulso con la espalda.", yt: "https://www.youtube.com/results?search_query=remo+sentado+m%C3%A1quina+tutorial" },
  m3: { name: "Remo con mancuerna (1 brazo)", type: "dumbbell", muscle: "Espalda", fig: "remo-mancuerna", howTo: "Rodilla y mano en banco. Otra mano con mancuerna. Tira hacia la cadera como arrancar una moto. Baja controlado. Haz ambos lados.", tips: "Espalda recta como mesa. No gires al subir.", yt: "https://www.youtube.com/results?search_query=remo+mancuerna+un+brazo+tutorial" },
  m4: { name: "Curl bíceps máquina", type: "machine", muscle: "Bíceps", fig: "curl-biceps", howTo: "Codos en almohadilla. Flexiona hasta arriba. Baja DESPACIO (la bajada es donde más trabajas).", tips: "Codos pegados a la almohadilla siempre.", yt: "https://www.youtube.com/results?search_query=curl+b%C3%ADceps+m%C3%A1quina+tutorial" },
  m5: { name: "Curl martillo mancuernas", type: "dumbbell", muscle: "Bíceps", fig: "curl-biceps", howTo: "Palmas mirándose (como martillo). Sube un brazo, baja, sube el otro. Codo pegado al cuerpo.", tips: "Sin balanceo. Trabaja antebrazo también.", yt: "https://www.youtube.com/results?search_query=curl+martillo+mancuernas+tutorial" },
  m6: { name: "Plancha frontal", type: "bodyweight", muscle: "Core", fig: "plancha", howTo: "Antebrazos y puntas de pies. Cuerpo recto: culo ni arriba ni abajo. Aprieta abdomen y glúteos. 30-45 seg.", tips: "Si la cadera se hunde, descansa. 3x20seg bien > 1x60seg mal.", yt: "https://www.youtube.com/results?search_query=plancha+frontal+tutorial+principiante" },
  m7: { name: "Plancha lateral (cada lado)", type: "bodyweight", muscle: "Core", fig: "plancha", howTo: "De lado sobre antebrazo. Cuerpo recto, cadera arriba. 20-30seg cada lado.", tips: "Si cuesta, apoya la rodilla de abajo.", yt: "https://www.youtube.com/results?search_query=plancha+lateral+tutorial" },
  m8: { name: "Crunch en máquina / polea", type: "machine", muscle: "Core", fig: "crunch-maquina", howTo: "Máquina abdominal o de rodillas en polea con cuerda. Flexiona tronco contrayendo abdomen. Movimiento corto. Suelta aire al contraer.", tips: "No tires con brazos. Fuerza del abdomen.", yt: "https://www.youtube.com/results?search_query=crunch+m%C3%A1quina+abdominal+tutorial" },
  v1: { name: "Prensa de piernas", type: "machine", muscle: "Cuádriceps", fig: "prensa", howTo: "Espalda bien apoyada. Pies anchura hombros en plataforma. Baja hasta 90°. Empuja con talones sin bloquear rodillas.", tips: "Rodillas en línea con pies. No bajes mucho al principio.", yt: "https://www.youtube.com/results?search_query=prensa+piernas+m%C3%A1quina+tutorial" },
  v2: { name: "Curl femoral máquina", type: "machine", muscle: "Isquios", fig: "curl-femoral", howTo: "Boca abajo. Almohadilla en tobillos. Flexiona llevando talones al culo. Baja despacio.", tips: "Clave para futbolistas: isquios fuertes = menos lesiones.", yt: "https://www.youtube.com/results?search_query=curl+femoral+m%C3%A1quina+tutorial" },
  v3: { name: "Extensión cuádriceps", type: "machine", muscle: "Cuádriceps", fig: "extension-quad", howTo: "Sentado, almohadilla en espinillas. Estira piernas arriba. No bloquees rodilla. Baja controlado.", tips: "Baja peso antes de partido. No fuerces la rodilla.", yt: "https://www.youtube.com/results?search_query=extensi%C3%B3n+cu%C3%A1driceps+tutorial" },
  v4: { name: "Sentadilla goblet mancuerna", type: "dumbbell", muscle: "Pierna completa", fig: "sentadilla-goblet", howTo: "Mancuerna vertical contra pecho. Pies anchura hombros. Baja como sentarte en silla. Sube con talones.", tips: "Mira al frente, pecho arriba.", yt: "https://www.youtube.com/results?search_query=sentadilla+goblet+mancuerna+tutorial" },
  v5: { name: "Zancadas con mancuernas", type: "dumbbell", muscle: "Pierna + equilibrio", fig: "zancada", howTo: "Mancuerna en cada mano. Paso largo adelante. Baja hasta rodilla trasera casi al suelo. Empuja para volver. Alterna.", tips: "Paso largo = más glúteo. Tronco recto.", yt: "https://www.youtube.com/results?search_query=zancadas+mancuernas+tutorial" },
  v6: { name: "Elevación de gemelos", type: "bodyweight", muscle: "Gemelos", fig: "gemelos", howTo: "Borde de escalón solo con puntas. Sube de puntillas, 1seg arriba. Baja dejando caer talón.", tips: "3x20. Clave para sprints y cambios de dirección.", yt: "https://www.youtube.com/results?search_query=elevaci%C3%B3n+gemelos+tutorial" },
  v7: { name: "Plancha frontal", type: "bodyweight", muscle: "Core", fig: "plancha", howTo: "40-60 seg. Antebrazos y puntas de pies. Cuerpo recto.", tips: "Si dominas 45seg, levanta un pie 5seg.", yt: "https://www.youtube.com/results?search_query=plancha+frontal+avanzada" },
  v8: { name: "Bicicleta (crunch)", type: "bodyweight", muscle: "Core", fig: "bici-crunch", howTo: "Boca arriba, manos detrás de cabeza. Codo derecho a rodilla izquierda, estira pierna derecha. Alterna pedaleando. 3x15.", tips: "No tires del cuello. Fuerza del abdomen.", yt: "https://www.youtube.com/results?search_query=crunch+bicicleta+tutorial" },
  v9: { name: "Bicicleta estática 15-20 min", type: "cardio", muscle: "Cardio", fig: "bici", howTo: "Sillín ajustado. Pedalea suave: que puedas hablar. Sin resistencia alta. Soltar piernas.", tips: "Viernes suave. Mañana partido.", yt: null },
};

const WO = {
  lunes: { title: "PECHO + HOMBRO + TRÍCEPS", icon: "💪", warmup: "5 min bici suave + 10 rotaciones hombro + 10 aperturas brazos", exercises: ["l1","l2","l3","l4","l5","l6"] },
  miercoles: { title: "ESPALDA + BÍCEPS + CORE", icon: "🏋️", warmup: "5 min remo/bici + 10 rotaciones tronco + estirar espalda", exercises: ["m1","m2","m3","m4","m5","m6","m7","m8"] },
  viernes: { title: "PIERNA + CORE + CARDIO", icon: "🦵", warmup: "5 min bici + 10 sentadillas sin peso + movilidad cadera", exercises: ["v1","v2","v3","v4","v5","v6","v7","v8","v9"] },
};
const DN = { lunes: "Lunes", miercoles: "Miércoles", viernes: "Viernes" };
const FBQ = [
  { id: "feeling", q: "¿Cómo te encuentras?", opts: ["💪 A tope","😊 Bien","😐 Normal","😩 Cansado"] },
  { id: "weights", q: "¿Los pesos?", opts: ["Fácil, subir","Bien así","Me costó","Demasiado"] },
  { id: "pain", q: "¿Molestias?", opts: ["Nada","Hombro","Rodilla","Espalda","Otro"] },
];

export default function App() {
  const [page, setPage] = useState("home");
  const [wk, setWk] = useState(1);
  const [day, setDay] = useState(null);
  const [openEx, setOpenEx] = useState(null);
  const [comp, setComp] = useState({});
  const [fb, setFb] = useState({});
  const [fbTxt, setFbTxt] = useState({});
  const [info, setInfo] = useState(false);
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState(null);
  const [localTxt, setLocalTxt] = useState("");

  useEffect(() => { (async()=>{ try { const r = await window.storage.get("pt-v5"); if(r?.value){ const d=JSON.parse(r.value); setComp(d.c||{}); setFb(d.f||{}); setFbTxt(d.t||{}); }} catch(e){} setReady(true); })(); }, []);
  const persist = useCallback(async(c,f,t)=>{ try{ await window.storage.set("pt-v5",JSON.stringify({c,f,t})); }catch(e){} },[]);
  const flash = m => { setToast(m); setTimeout(()=>setToast(null),2200); };
  const tog = (w,d,id) => { const k=`${w}_${d}_${id}`; const n={...comp,[k]:!comp[k]}; setComp(n); persist(n,fb,fbTxt); };
  const setFbO = (w,d,qid,v) => { const k=`${w}_${d}_${qid}`; const n={...fb,[k]:v}; setFb(n); persist(comp,n,fbTxt); };
  const saveTxt = () => { const k=`${wk}_${day}_txt`; const n={...fbTxt,[k]:localTxt}; setFbTxt(n); persist(comp,fb,n); flash("✅ Feedback guardado correctamente"); };
  const cnt = (w,d) => WO[d].exercises.filter(id=>comp[`${w}_${d}_${id}`]).length;
  const wpct = w => { let t=0,d=0; Object.keys(WO).forEach(dy=>{t+=WO[dy].exercises.length; d+=WO[dy].exercises.filter(id=>comp[`${w}_${dy}_${id}`]).length;}); return t?Math.round(d/t*100):0; };
  const hasFb = (w,d) => FBQ.some(q=>fb[`${w}_${d}_${q.id}`]) || (fbTxt[`${w}_${d}_txt`]||"").trim().length>0;
  useEffect(()=>{ if(day) setLocalTxt(fbTxt[`${wk}_${day}_txt`]||""); },[day,wk,fbTxt]);

  const wd = WEEKS_DATA[wk-1]; const rs = getRepsProgression(wk); const ac = wd.color;
  const M = { fontFamily:"'JetBrains Mono',monospace" };
  const C = { background:"#12171f", border:"1px solid #ffffff0a", borderRadius:"12px" };
  const P = a => ({ fontSize:"9.5px", padding:"1px 7px", borderRadius:"5px", background:a?`${ac}12`:"#ffffff08", color:a?ac:"#999",...M });

  if(!ready) return <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#0a0e14",color:"#4ECDC4",fontFamily:"monospace"}}><p>Cargando...</p></div>;

  return (
    <div style={{minHeight:"100vh",background:"#0a0e14",color:"#e0ddd5",fontFamily:"'Outfit','Segoe UI',sans-serif"}}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet"/>
      {toast&&<div style={{position:"fixed",top:16,left:"50%",transform:"translateX(-50%)",zIndex:100,background:"#1a2a1f",border:"1px solid #4ECDC450",borderRadius:10,padding:"10px 20px",fontSize:13,fontWeight:600,color:"#4ECDC4",boxShadow:"0 8px 30px #00000060"}}>{toast}</div>}
      <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,pointerEvents:"none",zIndex:0}}><div style={{position:"absolute",top:"-15%",right:"-8%",width:400,height:400,borderRadius:"50%",background:`radial-gradient(circle,${ac}12,transparent 70%)`}}/></div>

      <div style={{position:"relative",zIndex:1,maxWidth:600,margin:"0 auto",padding:"16px 14px 50px"}}>
        {/* HEADER */}
        <div style={{textAlign:"center",marginBottom:20,paddingTop:10}}>
          <div style={{fontSize:10,...M,color:ac,letterSpacing:4,textTransform:"uppercase",marginBottom:6}}>⚽ 3ª Asturfutbol</div>
          <h1 style={{fontSize:26,fontWeight:900,margin:"0 0 3px",letterSpacing:"-0.5px"}}>PABLO'S <span style={{color:ac}}>TEAM</span></h1>
          <p style={{fontSize:12,color:"#666",margin:0,fontWeight:300}}>Plan de entreno · Aboño · De vuelta a tope</p>
        </div>

        {/* ====== FEEDBACK PANEL ====== */}
        {page==="feedback" ? (
          <div>
            <button onClick={()=>setPage("home")} style={{background:"transparent",border:"none",color:ac,fontSize:13,cursor:"pointer",padding:"0 0 14px",fontWeight:500}}>← Volver al plan</button>
            <h2 style={{fontSize:18,fontWeight:700,margin:"0 0 4px"}}>📊 Panel de Feedback</h2>
            <p style={{fontSize:12,color:"#666",margin:"0 0 16px"}}>Aquí ves todo lo que ha reportado en cada sesión</p>
            {WEEKS_DATA.map(w=>{
              const entries=[];
              Object.keys(WO).forEach(d=>{ if(hasFb(w.num,d)){
                const r={}; FBQ.forEach(q=>{ const v=fb[`${w.num}_${d}_${q.id}`]; if(v) r[q.q]=v; });
                entries.push({d,r,t:fbTxt[`${w.num}_${d}_txt`]||""});
              }});
              if(!entries.length) return null;
              return <div key={w.num} style={{marginBottom:16}}>
                <div style={{fontSize:13,fontWeight:700,color:w.color,marginBottom:8}}>Semana {w.num}: {w.phase} <span style={{fontWeight:400,color:"#555",fontSize:11}}>({w.start}–{w.end})</span></div>
                {entries.map(e=><div key={e.d} style={{...C,padding:"12px 14px",marginBottom:8}}>
                  <div style={{fontSize:12,fontWeight:600,color:"#ccc",marginBottom:8}}>{DN[e.d]} — {WO[e.d].title}</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:e.t?8:0}}>
                    {Object.entries(e.r).map(([q,v])=><span key={q} style={{fontSize:11,background:`${w.color}12`,border:`1px solid ${w.color}20`,borderRadius:6,padding:"3px 8px",color:"#bbb"}}><span style={{color:"#888"}}>{q}</span> {v}</span>)}
                  </div>
                  {e.t&&<div style={{fontSize:12,color:"#aaa",background:"#0a0e1480",borderRadius:8,padding:"8px 10px",lineHeight:1.5,borderLeft:`3px solid ${w.color}40`}}>💬 {e.t}</div>}
                </div>)}
              </div>;
            })}
            {!WEEKS_DATA.some(w=>Object.keys(WO).some(d=>hasFb(w.num,d)))&&<div style={{textAlign:"center",color:"#555",padding:"40px 20px",fontSize:13}}>Todavía no hay feedback. Se irá mostrando aquí cuando complete sesiones.</div>}
          </div>

        /* ====== HOME ====== */
        ) : !day ? (
          <div>
            <button onClick={()=>setInfo(!info)} style={{width:"100%",background:info?`${ac}10`:"#12171f",border:`1px solid ${info?ac+"30":"#ffffff0a"}`,borderRadius:12,padding:"11px 14px",color:"#aaa",fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
              <span>📋</span><span style={{flex:1,textAlign:"left"}}>Cómo funciona</span><span style={{transform:info?"rotate(180deg)":"",transition:"transform 0.3s",fontSize:12}}>▾</span>
            </button>
            {info&&<div style={{...C,padding:14,marginBottom:10,fontSize:12.5,lineHeight:1.8,color:"#999"}}>
              <b style={{color:"#e0ddd5"}}>🗓️</b> <span style={{color:ac}}>Lu</span> Pecho+Hombro+Tríceps | <span style={{color:ac}}>Mi</span> Espalda+Bíceps+Core | <span style={{color:ac}}>Vi</span> Pierna+Core+Cardio<br/>
              <span style={{color:"#FFD93D"}}>Ma</span> Descanso | <span style={{color:"#FFD93D"}}>Ju</span> Core suave | <span style={{color:"#FF6B6B"}}>Sá</span> PARTIDO | <span style={{color:"#FFD93D"}}>Do</span> Descanso<br/>
              <span style={{fontSize:11.5,color:"#777"}}>Máquinas 30→40kg · Mancuernas 5→9kg · Semana 8 descarga · Cada ejercicio tiene tutorial + YouTube</span>
            </div>}

            <button onClick={()=>setPage("feedback")} style={{width:"100%",background:"#1a1520",border:"1px solid #ffffff0a",borderRadius:12,padding:"11px 14px",color:"#aaa",fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
              <span>📊</span><span style={{flex:1,textAlign:"left"}}>Ver todo el feedback</span><span style={{fontSize:12}}>→</span>
            </button>

            <div style={{marginBottom:16}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                <span style={{fontSize:11,...M,color:"#555",letterSpacing:1.5}}>SEMANA</span>
                <span style={{fontSize:10,...M,color:ac,background:`${ac}12`,padding:"2px 10px",borderRadius:20}}>{wd.phase}</span>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(8,1fr)",gap:5}}>
                {WEEKS_DATA.map(w=>{const p=wpct(w.num),a=wk===w.num; return <button key={w.num} onClick={()=>setWk(w.num)} style={{background:a?`${w.color}20`:"#12171f",border:`1.5px solid ${a?w.color:p===100?w.color+"50":"#ffffff08"}`,borderRadius:10,padding:"7px 0",cursor:"pointer"}}><div style={{fontSize:15,fontWeight:700,color:a?w.color:"#666"}}>{w.num}</div>{p>0&&<div style={{width:14,height:2.5,borderRadius:2,background:"#ffffff10",margin:"3px auto 0",overflow:"hidden"}}><div style={{width:`${p}%`,height:"100%",background:w.color}}/></div>}</button>;})}
              </div>
            </div>

            <div style={{background:`linear-gradient(135deg,${ac}0d,${ac}04)`,border:`1px solid ${ac}18`,borderRadius:14,padding:"14px 16px",marginBottom:16}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div><h2 style={{fontSize:17,fontWeight:700,margin:"0 0 2px",color:ac}}>Semana {wd.num}: {wd.phase}</h2><p style={{fontSize:11,color:"#777",margin:"0 0 6px",...M}}>{wd.start} — {wd.end}</p></div>
                <div style={{fontSize:18,fontWeight:800,color:ac,...M}}>{wpct(wk)}%</div>
              </div>
              <p style={{fontSize:12.5,color:"#aaa",margin:"0 0 10px",fontWeight:300}}>{wd.desc}</p>
              <div style={{display:"flex",flexWrap:"wrap",gap:8,paddingTop:10,borderTop:`1px solid ${ac}10`,fontSize:10.5,...M,color:"#777"}}>
                <span>🏋️ {rs.sets}×{rs.reps}</span><span>⏱️ {rs.rest}</span><span>🔩 Máq {getWeightProgression(wk,"machine")}kg</span><span>💪 Manc {getWeightProgression(wk,"dumbbell")}kg</span>
              </div>
            </div>

            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {Object.entries(WO).map(([dk,wo])=>{const dn=cnt(wk,dk),tt=wo.exercises.length,pc=Math.round(dn/tt*100),ok=pc===100,hf=hasFb(wk,dk);
                return <button key={dk} onClick={()=>{setDay(dk);setOpenEx(null);}} style={{background:ok?`${ac}08`:"#12171f",border:`1px solid ${ok?ac+"30":"#ffffff08"}`,borderRadius:14,padding:"14px 16px",cursor:"pointer",display:"flex",alignItems:"center",gap:12}}>
                  <div style={{width:42,height:42,borderRadius:11,background:`${ac}12`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{ok?"✅":wo.icon}</div>
                  <div style={{flex:1,textAlign:"left"}}>
                    <div style={{fontSize:13.5,fontWeight:600,color:"#e0ddd5",marginBottom:1,display:"flex",alignItems:"center",gap:6}}>{DN[dk]}{hf&&<span style={{fontSize:9,background:"#FFD93D20",color:"#FFD93D",padding:"1px 6px",borderRadius:4,...M}}>💬</span>}</div>
                    <div style={{fontSize:11,color:"#777"}}>{wo.title}</div>
                  </div>
                  <div style={{textAlign:"right"}}><div style={{fontSize:16,fontWeight:700,color:ok?ac:"#555",...M}}>{dn}/{tt}</div><div style={{width:36,height:3,borderRadius:2,background:"#ffffff0a",overflow:"hidden",marginTop:3}}><div style={{width:`${pc}%`,height:"100%",background:ac,transition:"width 0.3s"}}/></div></div>
                </button>;})}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:4}}>
                {[{d:"Martes",i:"🚶",t:"Descanso"},{d:"Jueves",i:"🧘",t:"Core suave"},{d:"Sábado",i:"⚽",t:"PARTIDO"},{d:"Domingo",i:"😴",t:"Descanso"}].map(x=><div key={x.d} style={{background:"#12171f80",border:"1px solid #ffffff06",borderRadius:11,padding:10,textAlign:"center"}}><div style={{fontSize:16,marginBottom:3}}>{x.i}</div><div style={{fontSize:11,fontWeight:600,color:"#777"}}>{x.d}</div><div style={{fontSize:9.5,color:"#555"}}>{x.t}</div></div>)}
              </div>
            </div>
          </div>

        /* ====== WORKOUT DAY ====== */
        ) : (
          <div>
            <button onClick={()=>{setDay(null);setOpenEx(null);}} style={{background:"transparent",border:"none",color:ac,fontSize:13,cursor:"pointer",padding:"0 0 10px",fontWeight:500}}>← Volver</button>
            <div style={{background:`${ac}0a`,border:`1px solid ${ac}15`,borderRadius:14,padding:"12px 14px",marginBottom:14}}>
              <div style={{fontSize:10,...M,color:ac,letterSpacing:1,marginBottom:3}}>{DN[day]} — SEMANA {wk}</div>
              <h3 style={{fontSize:16,fontWeight:700,margin:"0 0 8px"}}>{WO[day].icon} {WO[day].title}</h3>
              <div style={{fontSize:11.5,color:"#888",background:"#0a0e1480",borderRadius:8,padding:"8px 10px"}}>🔥 <b style={{color:"#bbb"}}>Calentamiento:</b> {WO[day].warmup}</div>
            </div>

            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {WO[day].exercises.map((eid,i)=>{
                const ex=EX[eid],k=`${wk}_${day}_${eid}`,done=comp[k],open=openEx===eid;
                const wt=ex.type==="machine"?getWeightProgression(wk,"machine"):ex.type==="dumbbell"?getWeightProgression(wk,"dumbbell"):null;
                return <div key={eid} style={{background:done?`${ac}06`:"#12171f",border:`1px solid ${done?ac+"25":open?ac+"20":"#ffffff08"}`,borderRadius:12,overflow:"hidden"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px"}}>
                    <div onClick={e=>{e.stopPropagation();tog(wk,day,eid);}} style={{width:24,height:24,borderRadius:7,flexShrink:0,cursor:"pointer",border:`2px solid ${done?ac:"#ffffff18"}`,background:done?ac:"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:"#0a0e14",fontWeight:700}}>{done?"✓":<span style={{fontSize:10,color:"#444"}}>{i+1}</span>}</div>
                    <div style={{flex:1,cursor:"pointer"}} onClick={()=>setOpenEx(open?null:eid)}>
                      <div style={{fontSize:13,fontWeight:600,textDecoration:done?"line-through":"none",color:done?"#777":"#e0ddd5",marginBottom:3}}>{ex.name}</div>
                      <div style={{display:"flex",flexWrap:"wrap",gap:4}}><span style={P(true)}>{ex.muscle}</span>{wt&&<span style={P(false)}>{wt}kg</span>}{ex.type!=="cardio"&&<span style={P(false)}>{ex.type==="bodyweight"?"Cuerpo":`${rs.sets}×${rs.reps}`}</span>}</div>
                    </div>
                    <button onClick={()=>setOpenEx(open?null:eid)} style={{background:"transparent",border:"none",color:"#555",fontSize:11,cursor:"pointer",padding:"4px 6px",transform:open?"rotate(180deg)":"",transition:"transform 0.2s"}}>▾</button>
                  </div>
                  {open&&<div style={{padding:"0 14px 14px",borderTop:"1px solid #ffffff08"}}>
                    <div style={{display:"flex",justifyContent:"center",padding:"10px 0"}}><ExerciseFigure type={ex.fig} style={{width:110,height:65}}/></div>
                    <div style={{marginBottom:10}}><div style={{fontSize:11,fontWeight:700,color:ac,marginBottom:4}}>📖 CÓMO SE HACE</div><p style={{fontSize:12.5,color:"#bbb",margin:0,lineHeight:1.65}}>{ex.howTo}</p></div>
                    <div style={{background:"#FFD93D0a",border:"1px solid #FFD93D15",borderRadius:8,padding:"8px 10px",marginBottom:10}}><div style={{fontSize:11,fontWeight:600,color:"#FFD93D",marginBottom:2}}>⚠️ OJO</div><p style={{fontSize:12,color:"#bbb",margin:0,lineHeight:1.5}}>{ex.tips}</p></div>
                    {ex.yt&&<a href={ex.yt} target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",gap:8,background:"#FF000012",border:"1px solid #FF000020",borderRadius:8,padding:"8px 12px",textDecoration:"none",color:"#FF6B6B",fontSize:12,fontWeight:500}}>▶️ Ver en YouTube</a>}
                  </div>}
                </div>;})}
            </div>

            {/* FEEDBACK */}
            <div style={{marginTop:20,...C,padding:16}}>
              <div style={{fontSize:14,fontWeight:700,marginBottom:4,display:"flex",alignItems:"center",gap:8}}>📝 ¿Cómo fue la sesión?</div>
              <p style={{fontSize:11,color:"#666",margin:"0 0 14px"}}>Tu entrenador revisa esto en el panel de feedback</p>
              {FBQ.map(fq=>{const fk=`${wk}_${day}_${fq.id}`,cur=fb[fk]; return <div key={fq.id} style={{marginBottom:12}}>
                <div style={{fontSize:12,color:"#aaa",marginBottom:6,fontWeight:500}}>{fq.q}</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:5}}>{fq.opts.map(o=><button key={o} onClick={()=>setFbO(wk,day,fq.id,o)} style={{background:cur===o?`${ac}20`:"#0a0e14",border:`1px solid ${cur===o?ac:"#ffffff10"}`,borderRadius:8,padding:"6px 11px",fontSize:11.5,cursor:"pointer",color:cur===o?ac:"#888",fontWeight:cur===o?600:400,fontFamily:"'Outfit',sans-serif"}}>{o}</button>)}</div>
              </div>;})}
              <div style={{marginBottom:10}}>
                <div style={{fontSize:12,color:"#aaa",marginBottom:6,fontWeight:500}}>Comentarios / Peticiones de cambio:</div>
                <textarea value={localTxt} onChange={e=>setLocalTxt(e.target.value)} placeholder={"Los pesos se me quedan cortos, subir?\nMe molesta el hombro en las laterales\nQuiero añadir más cardio..."} style={{width:"100%",minHeight:80,background:"#0a0e14",border:"1px solid #ffffff10",borderRadius:10,padding:"10px 12px",color:"#ccc",fontSize:12,fontFamily:"'Outfit',sans-serif",resize:"vertical",lineHeight:1.5,outline:"none",boxSizing:"border-box"}}/>
              </div>
              <button onClick={saveTxt} style={{width:"100%",background:`linear-gradient(135deg,${ac},${ac}cc)`,border:"none",borderRadius:10,padding:11,color:"#0a0e14",fontWeight:700,fontSize:13,cursor:"pointer"}}>💾 Guardar feedback</button>
              {hasFb(wk,day)&&<div style={{marginTop:10,fontSize:11,color:"#4ECDC4",textAlign:"center"}}>✅ Tienes feedback guardado para esta sesión</div>}
            </div>

            <div style={{marginTop:12,...C,padding:"12px 14px",fontSize:11.5,color:"#777",lineHeight:1.6,background:"#12171f80",border:"1px solid #ffffff06"}}>
              {day==="viernes"?"🏟️ Mañana partido. Si notas carga, para antes. Estira gemelos e isquios.":day==="lunes"?"👊 Si vienes cargado del partido, baja peso y sube reps. Técnica > peso.":"🧠 Espalda fuerte = menos lesiones. Core = estabilidad en duelos."}
            </div>
          </div>
        )}

        <div style={{marginTop:28,textAlign:"center",fontSize:10.5,color:"#333",borderTop:"1px solid #ffffff06",paddingTop:14}}>
          <div>⚽ Pablo's Team · Aboño · 3ª Asturfutbol</div>
          <div style={{marginTop:2}}>De la recuperación al siguiente nivel 💪</div>
        </div>
      </div>
    </div>
  );
}
