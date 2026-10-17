/**
 * AMONG US AUDIO ENGINE (Web Audio API Synthesizer)
 * SPARK - IIIT Bhopal 2026
 * 
 * Provides 100% self-contained synthesized retro & sci-fi audio effects.
 * No external MP3 files required!
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.ambientOsc1 = null;
    this.ambientOsc2 = null;
    this.ambientGain = null;
    this.isEmergencyAlarmPlaying = false;
    this.emergencyInterval = null;
    this.bgMusic = null;
    this.bgMusicVolume = 0.22; // Low, gentle ambient background music volume
  }

  // Lazy initialize AudioContext on user gesture
  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play background music (bg sound.mp3) in low volume and looping
  playBackgroundMusic() {
    if (!this.enabled) return;
    try {
      if (!this.bgMusic) {
        this.bgMusic = new Audio('bg sound.mp3');
        this.bgMusic.loop = true;
      }
      this.bgMusic.volume = this.bgMusicVolume;
      const playPromise = this.bgMusic.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.log('Background music autoplay deferred pending user interaction:', err);
        });
      }
    } catch (e) {
      console.warn('Could not start bg music:', e);
    }
  }

  // Pause background music
  stopBackgroundMusic() {
    if (this.bgMusic) {
      try {
        this.bgMusic.pause();
      } catch (e) {}
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    if (!this.enabled) {
      if (this.isEmergencyAlarmPlaying) {
        this.stopEmergencyAlarm();
      }
      this.stopBackgroundMusic();
    } else {
      // If website is open, resume background music
      if (window.introController && window.introController.isIntroFinished) {
        this.playBackgroundMusic();
      }
    }
    return this.enabled;
  }

  // Play official Emergency Meeting MP3 sound effect N times continuously (no dead silence between buzzers)
  playEmergencyMeetingFile(times = 3, onEachPlay = null, onAllComplete = null, intervalMs = 1300) {
    if (!this.enabled) {
      if (onAllComplete) onAllComplete();
      return null;
    }

    try {
      const activeAudios = [];
      let currentPlay = 0;
      let isStopped = false;

      const playNextBuzzer = () => {
        if (isStopped) return;
        currentPlay++;

        const audio = new Audio('emergency-meeting.mp3');
        audio.volume = 0.95;
        activeAudios.push(audio);

        if (onEachPlay) onEachPlay(currentPlay);

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.warn('MP3 play failed, falling back to synthesizer:', err);
            this.playEmergencyAlarm();
          });
        }

        if (currentPlay < times) {
          // Play next buzzer in tight, continuous succession
          setTimeout(playNextBuzzer, intervalMs);
        } else {
          // Final buzzer: once it ends or after 1.5s, trigger completion
          audio.addEventListener('ended', () => {
            if (!isStopped && onAllComplete) onAllComplete();
          }, { once: true });

          setTimeout(() => {
            if (!isStopped && onAllComplete) onAllComplete();
          }, 1600);
        }
      };

      playNextBuzzer();

      // Controller object to stop all sounds if skipped or closed
      return {
        pause: () => {
          isStopped = true;
          activeAudios.forEach(a => {
            try {
              a.pause();
              a.currentTime = 0;
            } catch (e) {}
          });
        }
      };
    } catch (e) {
      this.playEmergencyAlarm();
      if (onAllComplete) setTimeout(onAllComplete, 2000);
      return null;
    }
  }

  // Mechanical glass lid unlatch sound
  playLidOpen() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(480, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.12);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.12);

    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(550, now + 0.06);
    osc2.frequency.linearRampToValueAtTime(800, now + 0.22);
    gain2.gain.setValueAtTime(0.08, now + 0.06);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    osc2.connect(gain2);
    gain2.connect(this.ctx.destination);
    osc2.start(now + 0.06);
    osc2.stop(now + 0.22);
  }

  // Heavy mechanical buzzer slam sound
  playButtonSlam() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(35, now + 0.3);

    gain.gain.setValueAtTime(0.55, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.3);
  }

  // Chat message pop sound
  playChatPop() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(540, now);
    osc.frequency.exponentialRampToValueAtTime(920, now + 0.07);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.07);
  }

  // 1. Crewmate Footstep / Pet Squeak
  playSqueak() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(1100, now + 0.08);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.16);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.16);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.16);
  }

  // 2. Emergency Siren Klaxon Alarm
  playEmergencyAlarm() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    this.isEmergencyAlarmPlaying = true;
    let high = true;

    const playTone = () => {
      if (!this.isEmergencyAlarmPlaying || !this.enabled) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      const freq = high ? 880 : 660; // Two-tone klaxon
      high = !high;

      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.linearRampToValueAtTime(freq - 40, now + 0.28);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);

      // Lowpass filter for retro speaker feel
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1600, now);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.28);
    };

    playTone();
    this.emergencyInterval = setInterval(playTone, 320);
  }

  stopEmergencyAlarm() {
    this.isEmergencyAlarmPlaying = false;
    if (this.emergencyInterval) {
      clearInterval(this.emergencyInterval);
      this.emergencyInterval = null;
    }
  }

  // 3. Kill Sting Suspense Chord (Horror brass hit)
  playKillSting() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const frequencies = [110, 116.5, 146.8, 220, 233]; // Harsh dissonant cluster
    const now = this.ctx.currentTime;

    frequencies.forEach(freq => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(200, now + 1.2);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 1.2);
    });
  }

  // 4. Task Success Chime (Bright victory arpeggio)
  playTaskSuccess() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    const now = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      const noteTime = now + (idx * 0.08);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0, noteTime);
      gain.gain.linearRampToValueAtTime(0.2, noteTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.35);
    });
  }

  // 5. Electrical Wire Zap / Connect Sound
  playWireZap() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.12);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.12);
  }

  // 6. Card Swipe Zip Sound & Result
  playCardSwipeZip() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.linearRampToValueAtTime(800, now + 0.2);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  playCardAccepted() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    [659.25, 880].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + (idx * 0.1);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.25);
    });
  }

  playCardDenied() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);

    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  // 7. Click button tick
  playClick() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(950, now);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.04);
  }

  // 8. "SHH!" Mystery intro sound (Filtered white noise + subtle sub-bass)
  playShh() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const bufferSize = this.ctx.sampleRate * 1.5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2200, this.ctx.currentTime);
    filter.Q.setValueAtTime(3.0, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
    noise.stop(now + 1.4);
  }
}

// Global Sound instance
window.soundEngine = new SoundEngine();
