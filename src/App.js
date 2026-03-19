import { useState, useEffect, useCallback } from "react";

// Semanas de entrenamiento
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

// Funciones para obtener la progresión de repeticiones y pesos
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

// Definición de los entrenamientos
const WO = {
  lunes: { title: "PECHO + HOMBRO + TRÍCEPS", icon: "💪", warmup: "5 min bici suave + 10 rotaciones hombro + 10 aperturas brazos", exercises: ["l1", "l2", "l3", "l4", "l5", "l6"] },
  miercoles: { title: "ESPALDA + BÍCEPS + CORE", icon: "🏋️", warmup: "5 min remo/bici + 10 rotaciones tronco + estirar espalda", exercises: ["m1", "m2", "m3", "m4", "m5", "m6", "m7", "m8"] },
  viernes: { title: "PIERNA + CORE + CARDIO", icon: "🦵", warmup: "5 min bici + 10 sentadillas sin peso + movilidad cadera", exercises: ["v1", "v2", "v3", "v4", "v5", "v6", "v7", "v8", "v9"] },
};

// Preguntas de feedback
const FBQ = [
  { id: "feeling", q: "¿Cómo te encuentras?", opts: ["💪 A tope", "😊 Bien", "😐 Normal", "😩 Cansado"] },
  { id: "weights", q: "¿Los pesos?", opts: ["Fácil, subir", "Bien así", "Me costó", "Demasiado"] },
  { id: "pain", q: "¿Molestias?", opts: ["Nada", "Hombro", "Rodilla", "Espalda", "Otro"] },
];

export default function App() {
  const [page, setPage] = useState("home");
  const [wk, setWk] = useState(1);
  const [day, setDay] = useState(null);
  const [comp, setComp] = useState({});
  const [fb, setFb] = useState({});
  const [fbTxt, setFbTxt] = useState({});
  const [localTxt, setLocalTxt] = useState("");
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState(null);

  // Recuperar datos guardados al cargar la app
  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get("pt-v5");
        if (r?.value) {
          const d = JSON.parse(r.value);
          setComp(d.c || {});
          setFb(d.f || {});
          setFbTxt(d.t || {});
        }
      } catch (e) {
        console.error("Error al recuperar los datos de localStorage", e);
      }
      setReady(true);
    })();
  }, []);

  // Función para guardar datos en localStorage
  const persist = useCallback(async (c, f, t) => {
    try {
      await window.storage.set("pt-v5", JSON.stringify({ c, f, t }));
    } catch (e) {
      console.error("Error al guardar los datos en localStorage", e);
    }
  }, []);

  // Función para mostrar el toast
  const flash = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 2200);
  };

  // Función para alternar el estado de los entrenamientos
  const tog = (w, d, id) => {
    const k = `${w}_${d}_${id}`;
    const updatedComp = { ...comp, [k]: !comp[k] };
    setComp(updatedComp);
    persist(updatedComp, fb, fbTxt);
  };

  // Guardar comentarios del feedback
  const saveTxt = () => {
    const k = `${wk}_${day}_txt`;
    const updatedFbTxt = { ...fbTxt, [k]: localTxt };
    setFbTxt(updatedFbTxt);
    persist(comp, fb, updatedFbTxt);
    flash("✅ Feedback guardado correctamente");
  };

  // Verificar cuántos ejercicios se completaron
  const cnt = (w, d) => WO[d].exercises.filter((id) => comp[`${w}_${d}_${id}`]).length;

  // Calcular el porcentaje de progreso de los entrenamientos
  const wpct = (w) => {
    let total = 0, completed = 0;
    Object.keys(WO).forEach((d) => {
      total += WO[d].exercises.length;
      completed += WO[d].exercises.filter((id) => comp[`${w}_${d}_${id}`]).length;
    });
    return total ? Math.round((completed / total) * 100) : 0;
  };

  const hasFb = (w, d) => {
    return (
      FBQ.some((q) => fb[`${w}_${d}_${q.id}`]) ||
      (fbTxt[`${w}_${d}_txt`] || "").trim().length > 0
    );
  };

  useEffect(() => {
    if (day) {
      setLocalTxt(fbTxt[`${wk}_${day}_txt`] || "");
    }
  }, [day, wk, fbTxt]);

  if (!ready) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0e14",
          color: "#4ECDC4",
          fontFamily: "monospace",
        }}
      >
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0a0e14", color: "#e0ddd5", fontFamily: "'Outfit', 'Segoe UI', sans-serif" }}>
      {/* Header */}
      <div style={{ 
        background: "linear-gradient(135deg, #0f1419 0%, #1a1f2e 100%)", 
        padding: "20px", 
        borderBottom: "2px solid #4ECDC4",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 100
      }}>
        <h1 style={{ margin: 0, color: "#4ECDC4", fontSize: "24px", fontWeight: "bold" }}>💪 Pablo's Training</h1>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => { setPage("home"); setDay(null); }} style={{ 
            padding: "10px 15px", 
            background: page === "home" ? "#4ECDC4" : "transparent", 
            color: page === "home" ? "#0a0e14" : "#4ECDC4", 
            border: "1px solid #4ECDC4",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold"
          }}>📊 Inicio</button>
          <button onClick={() => setPage("info")} style={{ 
            padding: "10px 15px", 
            background: page === "info" ? "#4ECDC4" : "transparent", 
            color: page === "info" ? "#0a0e14" : "#4ECDC4", 
            border: "1px solid #4ECDC4",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold"
          }}>ℹ️ Info</button>
        </div>
      </div>

      {/* Toast */}
      {toast && <div style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        background: "#4ECDC4",
        color: "#0a0e14",
        padding: "15px 20px",
        borderRadius: "8px",
        fontWeight: "bold",
        zIndex: 1000,
        animation: "slideIn 0.3s ease"
      }}>{toast}</div>}

      {/* Página de Inicio */}
      {page === "home" && !day && (
        <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
          {/* Selector de Semana */}
          <div style={{ marginBottom: "30px" }}>
            <h2 style={{ color: "#4ECDC4", marginBottom: "15px" }}>📅 Semana {wk}</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "10px", marginBottom: "20px" }}>
              {WEEKS_DATA.map((w) => (
                <button
                  key={w.num}
                  onClick={() => setWk(w.num)}
                  style={{
                    padding: "15px",
                    background: wk === w.num ? w.color : "#1a1f2e",
                    color: wk === w.num ? "#0a0e14" : "#e0ddd5",
                    border: `2px solid ${w.color}`,
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    transition: "all 0.3s ease"
                  }}
                >
                  <div>SEM {w.num}</div>
                  <div style={{ fontSize: "12px", marginTop: "5px" }}>{w.phase}</div>
                </button>
              ))}
            </div>
            {WEEKS_DATA[wk - 1] && (
              <div style={{
                background: "#1a1f2e",
                border: `2px solid ${WEEKS_DATA[wk - 1].color}`,
                borderRadius: "8px",
                padding: "20px",
                marginBottom: "20px"
              }}>
                <h3 style={{ color: WEEKS_DATA[wk - 1].color, margin: "0 0 10px 0" }}>{WEEKS_DATA[wk - 1].phase}</h3>
                <p style={{ margin: "0 0 10px 0" }}>{WEEKS_DATA[wk - 1].desc}</p>
                <p style={{ margin: "0", color: "#888", fontSize: "14px" }}>📅 {WEEKS_DATA[wk - 1].start} - {WEEKS_DATA[wk - 1].end}</p>
                <div style={{ marginTop: "15px", background: "#0a0e14", borderRadius: "5px", height: "8px", overflow: "hidden" }}>
                  <div style={{
                    height: "100%",
                    width: `${wpct(wk)}%`,
                    background: WEEKS_DATA[wk - 1].color,
                    transition: "width 0.3s ease"
                  }} />
                </div>
                <p style={{ margin: "10px 0 0 0", fontSize: "12px", color: "#888" }}>Progreso: {wpct(wk)}%</p>
              </div>
            )}
          </div>

          {/* Entrenamientos de la Semana */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
            {Object.keys(WO).map((dayKey) => (
              <div
                key={dayKey}
                onClick={() => setDay(dayKey)}
                style={{
                  background: "#1a1f2e",
                  border: "2px solid #4ECDC4",
                  borderRadius: "8px",
                  padding: "20px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  borderColor: hasFb(wk, dayKey) ? "#2ECC71" : "#4ECDC4"
                }}
              >
                <h3 style={{ margin: "0 0 10px 0", color: "#4ECDC4" }}>{WO[dayKey].icon} {WO[dayKey].title}</h3>
                <p style={{ margin: "0 0 10px 0", fontSize: "14px", color: "#888" }}>⏥ {WO[dayKey].warmup}</p>
                <div style={{ marginTop: "15px", paddingTop: "15px", borderTop: "1px solid #333" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "#888" }}>Ejercicios: <strong>{cnt(wk, dayKey)}/{WO[dayKey].exercises.length}</strong></span>
                    {hasFb(wk, dayKey) && <span style={{ color: "#2ECC71", fontWeight: "bold" }}>✓ Feedback</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Página de Entrenamiento */}
      {page === "home" && day && (
        <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
          <button onClick={() => setDay(null)} style={{
            marginBottom: "20px",
            padding: "10px 15px",
            background: "#4ECDC4",
            color: "#0a0e14",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold"
          }}>← Volver</button>

          <div style={{
            background: "linear-gradient(135deg, #0f1419 0%, #1a1f2e 100%)",
            border: "2px solid #4ECDC4",
            borderRadius: "8px",
            padding: "20px",
            marginBottom: "20px"
          }}>
            <h2 style={{ margin: "0 0 10px 0", color: "#4ECDC4" }}>Semana {wk} - {WO[day].title}</h2>
            <p style={{ margin: "0", color: "#888" }}>{WO[day].icon} Calentamiento: {WO[day].warmup}</p>
            {WEEKS_DATA[wk - 1] && (
              <p style={{ margin: "10px 0 0 0", color: WEEKS_DATA[wk - 1].color, fontWeight: "bold" }}>📌 {WEEKS_DATA[wk - 1].phase}: {WEEKS_DATA[wk - 1].desc}</p>
            )}
          </div>

          {/* Progresión */}
          {getRepsProgression(wk) && (
            <div style={{
              background: "#1a1f2e",
              border: "1px solid #333",
              borderRadius: "8px",
              padding: "15px",
              marginBottom: "20px"
            }}>
              <h3 style={{ margin: "0 0 15px 0", color: "#4ECDC4" }}>📊 Progresión de esta Semana</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "15px" }}>
                <div>
                  <p style={{ margin: "0 0 5px 0", color: "#888", fontSize: "12px" }}>SERIES</p>
                  <p style={{ margin: "0", fontSize: "24px", color: "#4ECDC4", fontWeight: "bold" }}>{getRepsProgression(wk).sets}</p>
                </div>
                <div>
                  <p style={{ margin: "0 0 5px 0", color: "#888", fontSize: "12px" }}>REPETICIONES</p>
                  <p style={{ margin: "0", fontSize: "20px", color: "#4ECDC4", fontWeight: "bold" }}>{getRepsProgression(wk).reps}</p>
                </div>
                <div>
                  <p style={{ margin: "0 0 5px 0", color: "#888", fontSize: "12px" }}>DESCANSO</p>
                  <p style={{ margin: "0", fontSize: "20px", color: "#4ECDC4", fontWeight: "bold" }}>{getRepsProgression(wk).rest}</p>
                </div>
                <div>
                  <p style={{ margin: "0 0 5px 0", color: "#888", fontSize: "12px" }}>MÁQUINA</p>
                  <p style={{ margin: "0", fontSize: "20px", color: "#4ECDC4", fontWeight: "bold" }}>{getWeightProgression(wk, "machine")}kg</p>
                </div>
                <div>
                  <p style={{ margin: "0 0 5px 0", color: "#888", fontSize: "12px" }}>MANCUERNA</p>
                  <p style={{ margin: "0", fontSize: "20px", color: "#4ECDC4", fontWeight: "bold" }}>{getWeightProgression(wk, "dumbbell")}kg</p>
                </div>
              </div>
            </div>
          )}

          {/* Ejercicios */}
          <div style={{ marginBottom: "20px" }}>
            <h3 style={{ color: "#4ECDC4", marginBottom: "15px" }}>💪 Ejercicios ({cnt(wk, day)}/{WO[day].exercises.length})</h3>
            <div style={{ display: "grid", gap: "10px" }}>
              {WO[day].exercises.map((exId) => (
                <div
                  key={exId}
                  style={{
                    background: "#1a1f2e",
                    border: `2px solid ${comp[`${wk}_${day}_${exId}`] ? "#2ECC71" : "#333"}`,
                    borderRadius: "8px",
                    padding: "15px",
                    cursor: "pointer",
                    transition: "all 0.3s ease"
                  }}
                  onClick={() => tog(wk, day, exId)}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <p style={{ margin: "0", fontWeight: "bold" }}>
                        {comp[`${wk}_${day}_${exId}`] ? "✅" : "⭕"} Ejercicio {exId.toUpperCase()}
                      </p>
                      <p style={{ margin: "5px 0 0 0", color: "#888", fontSize: "14px" }}>Toca para marcar completado</p>
                    </div>
                    <div style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      background: comp[`${wk}_${day}_${exId}`] ? "#2ECC71" : "#333",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: comp[`${wk}_${day}_${exId}`] ? "#0a0e14" : "#888",
                      fontWeight: "bold",
                      fontSize: "20px"
                    }}>
                      {comp[`${wk}_${day}_${exId}`] ? "✓" : "✕"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feedback */}
          <div style={{
            background: "#1a1f2e",
            border: "2px solid #4ECDC4",
            borderRadius: "8px",
            padding: "20px",
            marginBottom: "20px"
          }}>
            <h3 style={{ margin: "0 0 20px 0", color: "#4ECDC4" }}>📋 Feedback del Entrenamiento</h3>
            {FBQ.map((question) => (
              <div key={question.id} style={{ marginBottom: "20px" }}>
                <p style={{ margin: "0 0 10px 0", fontWeight: "bold" }}>{question.q}</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "10px" }}>
                  {question.opts.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        const updatedFb = { ...fb, [`${wk}_${day}_${question.id}`]: opt };
                        setFb(updatedFb);
                        persist(comp, updatedFb, fbTxt);
                      }}
                      style={{
                        padding: "12px",
                        background: fb[`${wk}_${day}_${question.id}`] === opt ? "#4ECDC4" : "#0a0e14",
                        color: fb[`${wk}_${day}_${question.id}`] === opt ? "#0a0e14" : "#e0ddd5",
                        border: `2px solid ${fb[`${wk}_${day}_${question.id}`] === opt ? "#4ECDC4" : "#333"}`,
                        borderRadius: "5px",
                        cursor: "pointer",
                        fontWeight: "bold",
                        transition: "all 0.3s ease"
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "1px solid #333" }}>
              <p style={{ margin: "0 0 10px 0", fontWeight: "bold" }}>💬 Notas Personales</p>
              <textarea
                value={localTxt}
                onChange={(e) => setLocalTxt(e.target.value)}
                placeholder="Escribe cualquier nota sobre este entrenamiento..."
                style={{
                  width: "100%",
                  padding: "12px",
                  background: "#0a0e14",
                  color: "#e0ddd5",
                  border: "1px solid #333",
                  borderRadius: "5px",
                  fontFamily: "inherit",
                  fontSize: "14px",
                  minHeight: "100px",
                  boxSizing: "border-box"
                }}
              />
              <button
                onClick={saveTxt}
                style={{
                  marginTop: "10px",
                  padding: "12px 20px",
                  background: "#4ECDC4",
                  color: "#0a0e14",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontWeight: "bold"
                }}
              >
                💾 Guardar Notas
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Página de Información */}
      {page === "info" && (
        <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
          <button onClick={() => setPage("home")} style={{
            marginBottom: "20px",
            padding: "10px 15px",
            background: "#4ECDC4",
            color: "#0a0e14",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold"
          }}>← Volver</button>

          <div style={{
            background: "linear-gradient(135deg, #0f1419 0%, #1a1f2e 100%)",
            border: "2px solid #4ECDC4",
            borderRadius: "8px",
            padding: "30px",
          }}>
            <h1 style={{ color: "#4ECDC4", marginTop: "0" }}>💪 Pablo's Team Training</h1>
            <p style={{ color: "#888" }}>Una aplicación progresiva diseñada para track de entrenamientos 8 semanas de entrenamiento intenso y estructurado.</p>

            <h2 style={{ color: "#4ECDC4", marginTop: "30px" }}>🎯 Características</h2>
            <ul style={{ color: "#e0ddd5" }}>
              <li>📱 Funciona sin conexión (PWA)</li>
              <li>💾 Guarda automáticamente tu progreso</li>
              <li>📊 Trackea todas tus sesiones</li>
              <li>📈 Progresión de pesos semana a semana</li>
              <li>📋 Feedback personalizado</li>
              <li>🔄 Sincronización offline-online</li>
            </ul>

            <h2 style={{ color: "#4ECDC4", marginTop: "30px" }}>📅 Estructura del Programa</h2>
            <div style={{ background: "#0a0e14", padding: "15px", borderRadius: "5px", marginTop: "15px" }}>
              {WEEKS_DATA.map((w) => (
                <div key={w.num} style={{ marginBottom: "12px", paddingBottom: "12px", borderBottom: "1px solid #333" }}>
                  <p style={{ margin: "0", color: w.color, fontWeight: "bold" }}>SEM {w.num}: {w.phase}</p>
                  <p style={{ margin: "5px 0 0 0", fontSize: "13px", color: "#888" }}>{w.desc}</p>
                </div>
              ))}
            </div>

            <h2 style={{ color: "#4ECDC4", marginTop: "30px" }}>🏋️ Entrenamientos</h2>
            <div style={{ background: "#0a0e14", padding: "15px", borderRadius: "5px", marginTop: "15px" }}>
              {Object.keys(WO).map((dayKey) => (
                <div key={dayKey} style={{ marginBottom: "12px", paddingBottom: "12px", borderBottom: "1px solid #333" }}>
                  <p style={{ margin: "0", fontWeight: "bold" }}>{WO[dayKey].title}</p>
                  <p style={{ margin: "5px 0 0 0", fontSize: "13px", color: "#888" }}>Ejercicios: {WO[dayKey].exercises.length}</p>
                </div>
              ))}
            </div>

            <h2 style={{ color: "#4ECDC4", marginTop: "30px" }}>📱 Instalación PWA</h2>
            <p style={{ color: "#e0ddd5" }}>
              Para instalar como app en tu móvil o escritorio:
            </p>
            <ol style={{ color: "#e0ddd5" }}>
              <li>En móvil: Toca el ícono de compartir y selecciona "Agregar a pantalla de inicio"</li>
              <li>En desktop: Haz clic en el ícono de instalación en la barra de direcciones</li>
              <li>¡Listo! Ahora puedes usar la app offline</li>
            </ol>

            <h2 style={{ color: "#4ECDC4", marginTop: "30px" }}>⚙️ Información Técnica</h2>
            <p style={{ color: "#888", fontSize: "13px" }}>
              Versión: 1.0.0<br />
              Tecnología: React 18 + PWA<br />
              Almacenamiento: localStorage<br />
              Offline-First: ✓
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}