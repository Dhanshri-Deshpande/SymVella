// Symvella Background Daily Check-in Alarm Service
// Continuously monitors whether the patient has completed their daily 1-minute checkup
// If the configured reminder time has arrived and the checkup is not done,
// sounds a continuous audio alarm and vibrates on the mobile device until checkup is completed.

export function getTodayDateString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function hasCompletedTodayCheckIn(symptomLogs = []) {
  if (!symptomLogs || symptomLogs.length === 0) return false;
  const todayStr = getTodayDateString();
  return symptomLogs.some(log => log.date === todayStr);
}

export function isCheckInTimePassed(scheduledTime = "") {
  if (!scheduledTime || typeof scheduledTime !== "string" || !scheduledTime.trim()) return false;
  const now = new Date();
  const [schedH, schedM] = scheduledTime.split(":").map(Number);
  if (isNaN(schedH) || isNaN(schedM)) return false;

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const scheduledMinutes = schedH * 60 + schedM;

  return currentMinutes >= scheduledMinutes;
}

export function shouldAlarmRing({ symptomLogs = [], alarmSettings = {}, snoozeUntil = 0 }) {
  // If no time is configured by the user, do not ring
  if (!alarmSettings?.time || !alarmSettings.time.trim()) return false;

  // If alarms are explicitly disabled by the user
  if (alarmSettings?.enabled === false) return false;

  // If currently in snooze window
  if (snoozeUntil && Date.now() < snoozeUntil) return false;

  // If the user already completed today's 1-minute check-in
  if (hasCompletedTodayCheckIn(symptomLogs)) return false;

  // Check if scheduled time has passed
  return isCheckInTimePassed(alarmSettings.time);
}

export const ALARM_SOUND_OPTIONS = [
  { id: "gentle", name: "Gentle Chime", desc: "Soothing harmonic bells", icon: "🎵" },
  { id: "zen", name: "Morning Zen", desc: "Peaceful singing bowl", icon: "🧘" },
  { id: "pulse", name: "Upbeat Pulse", desc: "Bright melodic pulse", icon: "✨" },
  { id: "bell", name: "Classic Bell", desc: "Clear rhythmic chime", icon: "🔔" }
];

export function playAlarmSoundSample(soundType = "gentle", providedCtx = null) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = providedCtx || new AudioCtx();
    if (ctx.state === "suspended") ctx.resume();
    const now = ctx.currentTime;

    if (soundType === "zen") {
      // Singing bowl / Zen tone: deep warm fundamental with shimmering harmonic
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = "sine";
      osc1.frequency.setValueAtTime(293.66, now); // D4
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(587.33, now); // D5

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.35, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 1.8);
      osc2.stop(now + 1.8);
    } else if (soundType === "pulse") {
      // Upbeat marimba / cheerful melodic pulse: 3 crisp notes
      const notes = [659.25, 880, 1174.66]; // E5, A5, D6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const noteStart = now + idx * 0.12;

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, noteStart);

        gain.gain.setValueAtTime(0.3, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(noteStart);
        osc.stop(noteStart + 0.35);
      });
    } else if (soundType === "bell") {
      // Classic Bell: dual chime Ding-Dong
      const dings = [
        { freq: 783.99, start: 0, dur: 0.5 }, // G5
        { freq: 1046.50, start: 0.28, dur: 0.7 } // C6
      ];
      dings.forEach(({ freq, start, dur }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const noteStart = now + start;

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, noteStart);

        gain.gain.setValueAtTime(0.35, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(noteStart);
        osc.stop(noteStart + dur);
      });
    } else {
      // Default: Gentle Chime (ascending soft harmonic bell: C5 -> E5 -> G5)
      const freqs = [523.25, 659.25, 783.99];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const noteStart = now + idx * 0.15;

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, noteStart);

        gain.gain.setValueAtTime(0.28, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(noteStart);
        osc.stop(noteStart + 0.6);
      });
    }

    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }
  } catch (e) {
    console.warn("Alarm sound preview error:", e);
  }
}

// Looping High-Priority Alarm Tone Synthesizer for Mobile & Web
export class AlarmAudioEngine {
  constructor() {
    this.audioCtx = null;
    this.intervalId = null;
    this.isPlaying = false;
    this.currentSound = "gentle";
  }

  setSound(soundType) {
    this.currentSound = soundType || "gentle";
  }

  start(soundType) {
    if (soundType) this.currentSound = soundType;
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.playTone();
    // Repeat every 3.2 seconds until explicitly stopped
    this.intervalId = setInterval(() => {
      this.playTone();
    }, 3200);
  }

  playTone() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;

      if (!this.audioCtx || this.audioCtx.state === "closed") {
        this.audioCtx = new AudioCtx();
      }

      if (this.audioCtx.state === "suspended") {
        this.audioCtx.resume();
      }

      playAlarmSoundSample(this.currentSound, this.audioCtx);
    } catch (e) {
      console.warn("Alarm audio tone failed:", e);
    }
  }

  stop() {
    this.isPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

export const alarmAudioEngineInstance = new AlarmAudioEngine();
