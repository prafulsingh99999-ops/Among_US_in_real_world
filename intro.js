/**
 * EMERGENCY BUZZER & MEETING INTRO CONTROLLER
 * SPARK - IIIT Bhopal 2026
 * 
 * Flow:
 * 1. Open Website -> Emergency Buzzer with protective glass lid.
 * 2. Press 1: Open protective glass case (flips open in 3D).
 * 3. Press 2: Press exposed red button to call Emergency Meeting.
 * 4. Background turns RED during emergency calling interface.
 * 5. Plays "Among Us (Emergency Meeting) - Sound Effect (HD).mp3".
 * 6. Emergency Meeting Scene:
 *    - Flashing red emergency room with oval table and CSS crewmates (#red, #blue, #green, #yellow, #purple, #pink).
 *    - Typewriter dialogue box and speaking bouncing animation on current speaker.
 *    - Full interactive click/tap or auto-advance conversation.
 *    - Meeting Adjourned -> Enter Ship / Open Website.
 */

class IntroController {
  constructor() {
    this.overlay = document.getElementById('introExperience');
    this.stageBuzzer = document.getElementById('introStageBuzzer');
    this.stageAlert = document.getElementById('introStageAlert');
    this.stageMeeting = document.getElementById('introStageMeeting');

    this.lid = document.getElementById('buzzerLid');
    this.button = document.getElementById('buzzerButton');
    this.buzzerPrompt = document.getElementById('buzzerPromptText');
    this.buzzerSubPrompt = document.getElementById('buzzerSubPromptText');

    this.skipBtn = document.getElementById('skipIntroBtn');
    this.enterSiteBtn = document.getElementById('enterSiteBtn');
    this.replayBtns = document.querySelectorAll('.replay-intro-btn');

    this.charName = document.getElementById('charName');
    this.dialogueText = document.getElementById('dialogueText');
    this.meetingFooterBar = document.getElementById('meetingFooterBar');
    this.meetingInstruction = document.getElementById('meetingInstruction');

    this.isLidOpen = false;
    this.isBuzzerPressed = false;
    this.isIntroFinished = false;
    this.activeMeetingAudio = null;

    // The Conversation Script from User Request
    this.script = [
      { char: "blue", name: "Blue", color: "#132ed1", text: "Why?? What happened??" },
      { char: "green", name: "Green", color: "#117f2d", text: "Where is the body??" },
      { char: "yellow", name: "Yellow", color: "#b3b300", text: "Did anyone see anything?" },
      { char: "red", name: "Red", color: "#c51111", text: "THE SPARK CLUB OF IIIT BHOPAL IS ORGANISING THE REAL LIFE AMONG US!" },
      { char: "red", name: "Red", color: "#c51111", text: "Date: 22 November, Time: 10 AM, Venue: Main Campus." },
      { char: "red", name: "Red", color: "#c51111", text: "There is zero entry fee, plus exciting prizes for the winners!" },
      { char: "pink", name: "Pink", color: "#ed54ba", text: "So who's sus? Anyone who hasn't registered yet. Register now!" }
    ];

    this.currentStep = -1;
    this.isTyping = false;
    this.typeInterval = null;
    this.currentFullText = "";
    this.autoAdvanceTimeout = null;
    this.autoEndInterval = null;

    this.init();
  }

  init() {
    if (!this.overlay) return;

    // 1. Lid Click Listener (Open the case)
    if (this.lid) {
      this.lid.addEventListener('click', (e) => {
        e.stopPropagation();
        this.openLid();
      });
    }

    // 2. Button Click Listener (Call Emergency Meeting)
    if (this.button) {
      this.button.addEventListener('click', (e) => {
        e.stopPropagation();
        this.pressBuzzer();
      });
    }

    // Skip Button
    if (this.skipBtn) {
      this.skipBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.finishIntro();
      });
    }

    // Enter Site from Meeting Table
    if (this.enterSiteBtn) {
      this.enterSiteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.finishIntro();
      });
    }

    // Click anywhere on meeting stage to advance dialogue or enter site
    if (this.stageMeeting) {
      this.stageMeeting.addEventListener('click', (e) => {
        this.handleClick(e);
      });
    }

    // Replay Buttons
    this.replayBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.startIntro();
      });
    });

    // Space / Enter key to advance dialogue, ESC to finish
    window.addEventListener('keydown', (e) => {
      if (this.isIntroFinished) return;
      if (e.key === 'Escape') {
        this.finishIntro();
      } else if (e.code === 'Space' || e.code === 'Enter') {
        if (this.stageMeeting && !this.stageMeeting.classList.contains('hidden')) {
          e.preventDefault();
          this.handleClick();
        }
      }
    });

    // Responsive scene scaler
    window.addEventListener('resize', () => {
      this.fitMeetingScene();
    });
    this.fitMeetingScene();
  }

  fitMeetingScene() {
    const scene = document.getElementById('meetingScene');
    const container = document.getElementById('sceneContainer');
    if (!scene || !container) return;
    const availW = Math.max(280, window.innerWidth - 24);
    const availH = Math.max(280, window.innerHeight - 100);
    const scale = Math.min(1, Math.min(availW / 900, availH / 550));
    scene.style.transform = `scale(${scale})`;
    container.style.width = `${Math.round(900 * scale)}px`;
    container.style.height = `${Math.round(550 * scale)}px`;
  }

  // Step 1: Open Protective Case
  openLid() {
    if (this.isLidOpen) return;
    this.isLidOpen = true;

    window.soundEngine?.playLidOpen();
    this.lid.classList.add('lid-open');

    if (this.buzzerPrompt) {
      this.buzzerPrompt.textContent = 'COVER OPENED • ARMED!';
      this.buzzerPrompt.className = 'font-orbitron font-black text-sm sm:text-base text-yellow-400 uppercase tracking-widest animate-pulse';
    }
    if (this.buzzerSubPrompt) {
      this.buzzerSubPrompt.innerHTML = '🚨 <span class="text-white font-bold underline">HIT THE RED BUTTON</span> TO CALL EMERGENCY MEETING! 🚨';
    }

    this.button.classList.add('cursor-pointer');
    this.button.setAttribute('title', 'Press to Call Emergency Meeting!');
  }

  // Step 2: Press Emergency Button
  pressBuzzer() {
    if (!this.isLidOpen || this.isBuzzerPressed) return;
    this.isBuzzerPressed = true;

    this.button.classList.add('pressed');
    window.soundEngine?.playButtonSlam();

    setTimeout(() => {
      this.triggerRedAlertStage();
    }, 200);
  }

  // Step 3: Red Alert Siren Stage
  triggerRedAlertStage() {
    this.stageBuzzer.classList.add('hidden');
    this.stageAlert.classList.remove('hidden');
    this.overlay.classList.add('red-alert-active', 'screen-shake');

    const alertStatusText = document.getElementById('introAlertStatusText');
    const alertCounterBadge = document.getElementById('introAlertCounterBadge');

    let transitioned = false;
    const doTransition = () => {
      if (transitioned) return;
      transitioned = true;
      if (this.redAlertSafetyTimeout) {
        clearTimeout(this.redAlertSafetyTimeout);
        this.redAlertSafetyTimeout = null;
      }
      this.overlay.classList.remove('screen-shake');
      this.triggerMeetingTableStage();
    };

    // Play attached HD Emergency Meeting MP3 sound effect 3 times
    this.activeMeetingAudio = window.soundEngine?.playEmergencyMeetingFile(
      3,
      (playNum) => {
        this.overlay.classList.remove('screen-shake');
        void this.overlay.offsetWidth; // Force reflow
        this.overlay.classList.add('screen-shake');

        if (alertCounterBadge) {
          alertCounterBadge.textContent = `SIREN ALERT ${playNum} OF 3`;
        }

        if (alertStatusText) {
          if (playNum === 1) {
            alertStatusText.textContent = 'ALARM 1: EMERGENCY MEETING TRIGGERED!';
          } else if (playNum === 2) {
            alertStatusText.textContent = 'ALARM 2: BROADCASTING ACROSS IIIT BHOPAL CAMPUS...';
          } else if (playNum === 3) {
            alertStatusText.textContent = 'ALARM 3: ALL CREWMATES REPORT TO CAFETERIA TABLE!';
          }
        }
      },
      () => {
        setTimeout(doTransition, 400);
      }
    );

    // Safety fallback
    this.redAlertSafetyTimeout = setTimeout(doTransition, 6500);
  }

  // Step 4: Meeting Conversation Stage
  triggerMeetingTableStage() {
    this.stageAlert.classList.add('hidden');
    this.overlay.classList.remove('red-alert-active');
    this.overlay.style.backgroundColor = '#111111';

    this.stageMeeting.classList.remove('hidden');
    this.fitMeetingScene();

    // Reset dialogue states
    this.currentStep = -1;
    this.isTyping = false;
    clearInterval(this.typeInterval);
    if (this.autoAdvanceTimeout) clearTimeout(this.autoAdvanceTimeout);
    if (this.autoEndInterval) clearInterval(this.autoEndInterval);

    if (this.charName) {
      this.charName.innerText = "SYSTEM";
      this.charName.style.color = "#c51111";
    }
    if (this.dialogueText) {
      this.dialogueText.innerText = "Click anywhere to start the EMERGENCY MEETING!";
    }
    if (this.meetingInstruction) {
      this.meetingInstruction.textContent = "CLICK TO CONTINUE";
      this.meetingInstruction.classList.remove('hidden');
    }
    if (this.meetingFooterBar) {
      this.meetingFooterBar.classList.add('hidden');
    }

    document.querySelectorAll('.crewmate').forEach(c => c.classList.remove('speaking'));

    // Dramatic auto-start after 700ms so dialogue rolls automatically or on click
    setTimeout(() => {
      if (this.currentStep === -1 && !this.isIntroFinished) {
        this.nextDialogue();
      }
    }, 700);
  }

  handleClick(e) {
    if (e && e.target && (e.target.closest('#skipIntroBtn') || e.target.closest('#enterSiteBtn'))) {
      return;
    }

    // If meeting is adjourned, clicking enters the site
    if (this.currentStep >= this.script.length) {
      this.finishIntro();
      return;
    }

    if (this.autoAdvanceTimeout) {
      clearTimeout(this.autoAdvanceTimeout);
      this.autoAdvanceTimeout = null;
    }

    // If text is currently typing, clicking finishes text instantly
    if (this.isTyping) {
      clearInterval(this.typeInterval);
      if (this.dialogueText) {
        this.dialogueText.innerText = this.currentFullText;
      }
      this.isTyping = false;
      this.scheduleAutoAdvance(3500);
      return;
    }

    this.nextDialogue();
  }

  nextDialogue() {
    if (this.autoAdvanceTimeout) {
      clearTimeout(this.autoAdvanceTimeout);
      this.autoAdvanceTimeout = null;
    }

    this.currentStep++;

    // Remove speaking bounce from all crewmates
    document.querySelectorAll('.crewmate').forEach(c => c.classList.remove('speaking'));

    if (this.currentStep < this.script.length) {
      const line = this.script[this.currentStep];

      // Set Name and Color
      if (this.charName) {
        this.charName.innerText = line.name;
        this.charName.style.color = line.color;
      }

      // Highlight the speaker with the bounce animation
      const speakerEl = document.getElementById(line.char);
      if (speakerEl) {
        speakerEl.classList.add('speaking');
      }

      // Apply bold letters and appropriate spacing when Red crewmate is speaking!
      if (this.dialogueText) {
        if (line.char === 'red') {
          this.dialogueText.classList.add('dialogue-red-speaker');
          this.dialogueText.style.fontWeight = '800';
          this.dialogueText.style.wordSpacing = '6px';
          this.dialogueText.style.letterSpacing = '0.5px';
        } else {
          this.dialogueText.classList.remove('dialogue-red-speaker');
          this.dialogueText.style.fontWeight = '600';
          this.dialogueText.style.wordSpacing = 'normal';
          this.dialogueText.style.letterSpacing = 'normal';
        }
      }

      // Play subtle chat blip sound
      window.soundEngine?.playChatPop();

      // Start Typewriter Effect
      this.currentFullText = line.text;
      this.typeWriterEffect(this.currentFullText);

    } else {
      // End of script
      if (this.charName) {
        this.charName.innerText = "SYSTEM";
        this.charName.style.color = "#c51111";
      }
      if (this.dialogueText) {
        this.dialogueText.classList.remove('dialogue-red-speaker');
        this.dialogueText.style.fontWeight = '600';
        this.dialogueText.style.wordSpacing = 'normal';
        this.dialogueText.style.letterSpacing = 'normal';
        this.dialogueText.innerText = "Meeting Adjourned. Go Register!";
      }

      window.soundEngine?.playTaskSuccess();

      if (this.meetingFooterBar) {
        this.meetingFooterBar.classList.remove('hidden');
      }
      if (this.meetingInstruction) {
        this.meetingInstruction.textContent = "CLICK ANYWHERE TO ENTER SITE";
      }

      // Auto countdown 5 seconds to enter site automatically
      let remaining = 5;
      const countEl = document.getElementById('meetingAutoTimer');
      if (countEl) countEl.textContent = `${remaining}s`;

      if (this.autoEndInterval) clearInterval(this.autoEndInterval);
      this.autoEndInterval = setInterval(() => {
        remaining--;
        if (countEl) countEl.textContent = `${remaining}s`;
        if (remaining <= 0) {
          clearInterval(this.autoEndInterval);
          this.finishIntro();
        }
      }, 1000);
    }
  }

  typeWriterEffect(text) {
    this.isTyping = true;
    let i = 0;
    if (!this.dialogueText) return;
    this.dialogueText.innerText = "";

    clearInterval(this.typeInterval);

    this.typeInterval = setInterval(() => {
      if (i < text.length) {
        this.dialogueText.innerText += text.charAt(i);
        i++;
      } else {
        clearInterval(this.typeInterval);
        this.isTyping = false;
        // Schedule auto-advance after 3.5 seconds
        this.scheduleAutoAdvance(3500);
      }
    }, 30);
  }

  scheduleAutoAdvance(delayMs) {
    if (this.autoAdvanceTimeout) clearTimeout(this.autoAdvanceTimeout);
    this.autoAdvanceTimeout = setTimeout(() => {
      if (this.currentStep < this.script.length && !this.isTyping && !this.isIntroFinished) {
        this.nextDialogue();
      }
    }, delayMs);
  }

  // Finish intro and reveal the full website
  finishIntro() {
    if (this.isIntroFinished) return;
    this.isIntroFinished = true;

    clearInterval(this.typeInterval);
    if (this.autoAdvanceTimeout) clearTimeout(this.autoAdvanceTimeout);
    if (this.autoEndInterval) clearInterval(this.autoEndInterval);

    if (this.redAlertSafetyTimeout) {
      clearTimeout(this.redAlertSafetyTimeout);
      this.redAlertSafetyTimeout = null;
    }

    if (this.activeMeetingAudio) {
      try {
        this.activeMeetingAudio.pause();
        this.activeMeetingAudio.currentTime = 0;
      } catch (e) {}
    }
    window.soundEngine?.stopEmergencyAlarm();
    window.soundEngine?.playTaskSuccess();

    // Start background music in low/ambient volume when meeting is over and website opens!
    window.soundEngine?.playBackgroundMusic();

    this.overlay.classList.add('opacity-0', 'pointer-events-none');
    setTimeout(() => {
      this.overlay.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }, 700);
  }

  // Replay cutscene from beginning
  startIntro() {
    this.isIntroFinished = false;
    this.isLidOpen = false;
    this.isBuzzerPressed = false;
    this.currentStep = -1;
    this.isTyping = false;

    // Pause background music while intro plays
    window.soundEngine?.stopBackgroundMusic();

    clearInterval(this.typeInterval);
    if (this.autoAdvanceTimeout) clearTimeout(this.autoAdvanceTimeout);
    if (this.autoEndInterval) clearInterval(this.autoEndInterval);

    document.body.classList.add('overflow-hidden');
    this.overlay.classList.remove('hidden', 'opacity-0', 'pointer-events-none', 'red-alert-active', 'screen-shake');
    this.overlay.style.backgroundColor = '#030712';

    this.stageBuzzer.classList.remove('hidden');
    this.stageAlert.classList.add('hidden');
    this.stageMeeting.classList.add('hidden');

    this.lid.classList.remove('lid-open');
    this.button.classList.remove('pressed');

    if (this.buzzerPrompt) {
      this.buzzerPrompt.textContent = 'STEP 1 OF 2: TAP PROTECTIVE CASE TO OPEN';
      this.buzzerPrompt.className = 'text-xl sm:text-2xl md:text-3xl font-orbitron font-black text-white tracking-wide uppercase';
    }
    if (this.buzzerSubPrompt) {
      this.buzzerSubPrompt.innerHTML = '👉 <span class="underline font-bold">CLICK THE GLASS LID</span> TO UNLOCK THE EMERGENCY BUTTON';
    }

    const alertCounterBadge = document.getElementById('introAlertCounterBadge');
    if (alertCounterBadge) alertCounterBadge.textContent = 'SIREN ALERT 1 OF 3';
    const alertStatusText = document.getElementById('introAlertStatusText');
    if (alertStatusText) alertStatusText.textContent = 'ALARM 1: EMERGENCY MEETING TRIGGERED!';

    document.querySelectorAll('.crewmate').forEach(c => c.classList.remove('speaking'));
    if (this.charName) {
      this.charName.innerText = "SYSTEM";
      this.charName.style.color = "#c51111";
    }
    if (this.dialogueText) {
      this.dialogueText.innerText = "Click anywhere to start the EMERGENCY MEETING!";
    }
    if (this.meetingInstruction) {
      this.meetingInstruction.textContent = "CLICK TO CONTINUE";
      this.meetingInstruction.classList.remove('hidden');
    }
    if (this.meetingFooterBar) {
      this.meetingFooterBar.classList.add('hidden');
    }
  }
}

// Instantiate on DOM load
window.introController = null;
window.addEventListener('DOMContentLoaded', () => {
  window.introController = new IntroController();
});
