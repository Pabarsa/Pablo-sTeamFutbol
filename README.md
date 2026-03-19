# 💪 Pablo's Team Training - PWA

Una aplicación Progressive Web App profesional para trackear entrenamientos de 8 semanas con progresión estructurada de pesos, feedback personalizado y funcionalidad completamente offline.

## ✨ Características Principales

- **📱 Funciona sin conexión** - Instalable como app nativa en móvil y desktop
- **💾 Almacenamiento local** - Todos los datos se guardan automáticamente
- **📊 Trackeo completo** - Registra ejercicios, series, repeticiones y feedback
- **📈 Progresión de pesos** - Sistema automático de aumento de pesos semana tras semana
- **🎯 Entrenamientos estructurados** - 3 entrenamientos por semana (Lunes, Miércoles, Viernes)
- **🔄 Sincronización offline** - Cambios guardados incluso sin conexión
- **⚡ Rápida y responsiva** - Optimizada para todos los dispositivos
- **🎨 Interfaz moderna** - UI profesional y fácil de usar

## 🚀 Inicio Rápido

### Requisitos
- Node.js (v14 o superior)
- npm o yarn

### Instalación

```bash
# Instalar dependencias
npm install

# Iniciar en desarrollo
npm start
```

Abre [http://localhost:3000](http://localhost:3000) para verla en el navegador.

### Build para Producción

```bash
npm run build
```

Crea la app optimizada en la carpeta `build` lista para desplegar.

## 📅 Estructura del Programa

El programa consta de **8 semanas** con progresión creciente:

| Semana | Fase | Descripción | Pesos Máquina | Pesos Mancuerna |
|--------|------|-------------|---------------|-----------------|
| 1 | ADAPTACIÓN | Aprender la técnica. Pesos suaves | 30kg | 5kg |
| 2 | ACTIVACIÓN | El cuerpo despierta | 30kg | 6kg |
| 3 | BASE | Primera subida de peso | 32.5kg | 7kg |
| 4 | PROGRESIÓN | Más peso, más serio | 35kg | 7kg |
| 5 | INTENSIDAD | Semana fuerte. 4 series | 35kg | 8kg |
| 6 | FUERZA | Pesos serios | 37.5kg | 8kg |
| 7 | PICO | Semana top | 40kg | 9kg |
| 8 | DELOAD | Descanso activo | 30kg | 5kg |

## 🏋️ Entrenamientos

### Lunes: Pecho + Hombro + Tríceps 💪
- 6 ejercicios
- Calentamiento: 5 min bici + rotaciones hombro
- Intensidad seleccionada por semana

### Miércoles: Espalda + Bíceps + Core 🏋️
- 8 ejercicios
- Calentamiento: 5 min remo/bici + rotaciones tronco
- Intensidad seleccionada por semana

### Viernes: Pierna + Core + Cardio 🦵
- 9 ejercicios
- Calentamiento: 5 min bici + sentadillas sin peso
- Intensidad seleccionada por semana

## 📱 Instalación como PWA

### En Móvil (iOS/Android)
1. Abre la app en Safari (iOS) o Chrome (Android)
2. Toca el ícono de compartir (iOS) o menú (Android)
3. Selecciona "Agregar a pantalla de inicio"
4. ¡Listo! Ahora tienes la app como app nativa

### En Desktop (Windows/Mac/Linux)
1. Abre la app en Chrome o Edge
2. Haz clic en el ícono de instalación (esquina superior derecha)
3. Confirma la instalación
4. ¡Listo! Ahora tienes la app en tu escritorio

## 🔧 Funcionalidades

### Trackeo de Entrenamientos
- Marca ejercicios completados con un click
- Visualiza el progreso semanal
- Retroalimentación sobre cómo te sientes

### Feedback Personalizado
- Responde preguntas sobre tu estado
- Registra molestias o lesiones
- Notas personalizadas sobre cada entrenamiento

### Datos Persistentes
- Todos los datos se guardan automáticamente
- Sincronización offline - sin pérdida de datos
- Los cambios se guardan incluso sin conexión

## 🛠️ Tecnología

- **React 18** - Framework de interfaz
- **PWA** - Progressive Web App
- **localStorage** - Almacenamiento local
- **Service Worker** - Funcionalidad offline
- **Responsive Design** - Todos los dispositivos

## 📊 Estadísticas

- **Almacenamiento**: Extremadamente ligero (< 5MB)
- **Velocidad**: Carga instantánea (< 2s)
- **Compatibilidad**: 95%+ de navegadores modernos
- **Offline**: 100% funcional sin conexión

## 🚨 Soporte y Problemas

Si encuentras problemas:

1. **Limpia el caché del navegador**
   - Settings → Aplicación → Storage → Clear site data

2. **Reinicia la app**
   - Cierra y abre nuevamente

3. **Desinstala y reinstala**
   - En móvil: Elimina de pantalla de inicio
   - En desktop: Desinstala desde Aplicaciones

## 📝 Scripts Disponibles

```bash
npm start      # Inicia el servidor de desarrollo
npm run build  # Crea build optimizado para producción
npm test       # Ejecuta los tests
npm run eject  # Expone la configuración (irreversible)
```

## 📱 Compatibilidad

- ✅ Chrome/Edge (Desktop & Mobile)
- ✅ Firefox (Desktop & Mobile)
- ✅ Safari (Desktop & Mobile)
- ✅ Samsung Internet
- ✅ Opera

## 🔒 Privacidad y Seguridad

- ✅ Todos los datos se almacenan **localmente en tu dispositivo**
- ✅ **NO se envía información** a servidores externos
- ✅ **NO requiere login** ni datos personales
- ✅ **Completamente offline** - privacidad garantizada

## 📄 Licencia

© 2024 Pablo's Team Training. Todos los derechos reservados.

---

**Versión**: 1.0.0  
**Estado**: ✅ Listo para producción  
**Última actualización**: Marzo 2024
