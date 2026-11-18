/**
 * Motor de audio WebAudio 100% offline y tolerante a Chrome headless.
 * Respeta el estado `muted` y jamás lanza excepciones ni logs de error si AudioContext no está disponible.
 */
export function createSoundEngine(appState) {
  let ctx = null;
  let activeNodes = new Set();

  function getContext() {
    if (typeof window === 'undefined') return null;
    if (appState?.getState?.().muted) return null;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    try {
      if (!ctx) {
        ctx = new AudioCtx();
      }
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
      return ctx;
    } catch {
      return null;
    }
  }

  function playTone({ freq = 440, endFreq = freq, duration = 0.08, type = 'sine', gain = 0.04, delay = 0 } = {}) {
    const audio = getContext();
    if (!audio) return;
    try {
      const now = audio.currentTime + delay;
      const osc = audio.createOscillator();
      const amp = audio.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(Math.max(40, freq), now);
      if (endFreq !== freq) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(40, endFreq), now + duration);
      }
      amp.gain.setValueAtTime(0.0001, now);
      amp.gain.exponentialRampToValueAtTime(Math.max(0.0005, gain), now + Math.min(0.02, duration * 0.25));
      amp.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      osc.connect(amp);
      amp.connect(audio.destination);
      activeNodes.add(osc);
      osc.onended = () => {
        activeNodes.delete(osc);
        try {
          osc.disconnect();
          amp.disconnect();
        } catch {
          // noop
        }
      };
      osc.start(now);
      osc.stop(now + duration + 0.02);
    } catch {
      // Silencio seguro en entornos sin dispositivo de audio
    }
  }

  return {
    playClick() {
      playTone({ freq: 620, endFreq: 420, duration: 0.045, type: 'triangle', gain: 0.025 });
    },
    playIgnition() {
      playTone({ freq: 88, endFreq: 210, duration: 0.28, type: 'sawtooth', gain: 0.03 });
      playTone({ freq: 180, endFreq: 360, duration: 0.22, type: 'triangle', gain: 0.025, delay: 0.12 });
    },
    playStamp() {
      playTone({ freq: 240, endFreq: 130, duration: 0.1, type: 'sine', gain: 0.04 });
      playTone({ freq: 523.25, endFreq: 659.25, duration: 0.16, type: 'triangle', gain: 0.025, delay: 0.07 });
    },
    playWarning() {
      playTone({ freq: 220, endFreq: 165, duration: 0.09, type: 'square', gain: 0.022 });
      playTone({ freq: 185, endFreq: 140, duration: 0.11, type: 'square', gain: 0.02, delay: 0.11 });
    },
    destroy() {
      for (const node of activeNodes) {
        try {
          node.stop();
          node.disconnect();
        } catch {
          // noop
        }
      }
      activeNodes.clear();
      if (ctx) {
        try {
          ctx.close().catch(() => {});
        } catch {
          // noop
        }
        ctx = null;
      }
    },
  };
}
