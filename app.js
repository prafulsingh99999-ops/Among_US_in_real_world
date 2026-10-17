/**
 * MAIN CONTROLLER & APPLICATION LOGIC
 * SPARK - IIIT Bhopal 2026
 * 
 * Manages:
 * - Event countdown timer (Target: Nov 9, 2026, 19:00 IST)
 * - Emergency Meeting alert modal & klaxon siren trigger
 * - Registration pass generation & dynamic badge updating
 * - Audio controls & UI events
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. COUNTDOWN TIMER (Nov 22, 2026 10:00:00 IST)
  // ==========================================
  const targetDate = new Date('2026-11-22T10:00:00+05:30').getTime();

  const updateCountdown = () => {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      document.getElementById('countDays').textContent = '00';
      document.getElementById('countHours').textContent = '00';
      document.getElementById('countMinutes').textContent = '00';
      document.getElementById('countSeconds').textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const pad = (n) => String(n).padStart(2, '0');

    const daysEl = document.getElementById('countDays');
    const hoursEl = document.getElementById('countHours');
    const minEl = document.getElementById('countMinutes');
    const secEl = document.getElementById('countSeconds');

    if (daysEl) daysEl.textContent = pad(days);
    if (hoursEl) hoursEl.textContent = pad(hours);
    if (minEl) minEl.textContent = pad(minutes);
    if (secEl) secEl.textContent = pad(seconds);
  };

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ==========================================
  // 2. EMERGENCY MEETING MODAL TRIGGER
  // ==========================================
  const modal = document.getElementById('emergencyModal');
  const heroBtn = document.getElementById('heroEmergencyMeetingBtn');
  const headerBtn = document.getElementById('headerEmergencyBtn');
  const closeBtn = document.getElementById('closeEmergencyBtn');

  let inPageMeetingAudio = null;

  const triggerEmergencyMeeting = () => {
    if (!modal) return;
    
    // Play HD Emergency Meeting sound 3 times
    inPageMeetingAudio = window.soundEngine.playEmergencyMeetingFile(3);
    
    // Trigger space hyperspace warp
    if (window.spaceEngine) {
      window.spaceEngine.triggerWarp(3000);
    }

    modal.classList.remove('opacity-0', 'pointer-events-none');
    modal.classList.add('opacity-100');
  };

  const closeEmergencyMeeting = () => {
    if (!modal) return;
    if (inPageMeetingAudio) {
      try {
        inPageMeetingAudio.pause();
        inPageMeetingAudio.currentTime = 0;
      } catch (e) {}
      inPageMeetingAudio = null;
    }
    window.soundEngine.stopEmergencyAlarm();
    window.soundEngine.playClick();
    modal.classList.remove('opacity-100');
    modal.classList.add('opacity-0', 'pointer-events-none');
  };

  if (heroBtn) heroBtn.addEventListener('click', triggerEmergencyMeeting);
  if (headerBtn) headerBtn.addEventListener('click', triggerEmergencyMeeting);
  if (closeBtn) closeBtn.addEventListener('click', closeEmergencyMeeting);

  // ESC to close modal
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeEmergencyMeeting();
      const ejectionOverlay = document.getElementById('ejectionOverlay');
      if (ejectionOverlay) {
        ejectionOverlay.classList.add('opacity-0', 'pointer-events-none');
      }
    }
  });

  // ==========================================
  // 3. AUDIO SYSTEM TOGGLE & "SHH"
  // ==========================================
  const audioBtn = document.getElementById('toggleAudioBtn');
  const audioIcon = document.getElementById('audioIcon');
  const audioText = document.getElementById('audioStatusText');
  const audioPing = document.getElementById('audioPing');

  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      const isEnabled = window.soundEngine.toggle();
      if (isEnabled) {
        audioIcon.className = 'fa-solid fa-volume-high text-sm';
        audioText.textContent = 'SFX: ON';
        audioBtn.classList.remove('text-slate-500');
        audioBtn.classList.add('text-cyan-400');
        audioPing.classList.remove('hidden');
        window.soundEngine.playClick();
      } else {
        audioIcon.className = 'fa-solid fa-volume-xmark text-sm';
        audioText.textContent = 'SFX: OFF';
        audioBtn.classList.remove('text-cyan-400');
        audioBtn.classList.add('text-slate-500');
        audioPing.classList.add('hidden');
      }
    });
  }

  const shhBtn = document.getElementById('playShhBtn');
  if (shhBtn) {
    shhBtn.addEventListener('click', () => {
      window.soundEngine.playShh();
    });
  }

  // ==========================================
  // 4. REGISTRATION FORM & SELECTED CREWMATE
  // ==========================================
  const regForm = document.getElementById('registrationForm');
  if (regForm) {
    regForm.addEventListener('submit', (e) => {
      e.preventDefault();
      window.soundEngine?.playTaskSuccess();

      const nameInput     = document.getElementById('regName');
      const nicknameInput = document.getElementById('regNickname');
      const emailInput    = document.getElementById('regEmail');

      const name     = nameInput     ? nameInput.value.trim()     : '';
      const nickname = nicknameInput ? nicknameInput.value.trim() : '';
      const email    = emailInput    ? emailInput.value.trim()    : '';

      // Update cadet name on the selected crewmate card
      const cadetDisplay = document.getElementById('selectedCadetDisplay') || document.getElementById('badgeName');
      if (cadetDisplay) {
        // Show nickname if provided, otherwise fall back to full name
        cadetDisplay.textContent = (nickname || name).toUpperCase() || 'CADET RECRUIT';
      }

      // Display the crew nickname label on the card
      const nicknameDisplay = document.getElementById('selectedNicknameDisplay');
      if (nicknameDisplay && nickname) {
        nicknameDisplay.textContent = `🎮 "${nickname}"`;
        nicknameDisplay.classList.remove('hidden');
      }

      // Display email on the card
      const emailDisplay = document.getElementById('selectedEmailDisplay');
      if (emailDisplay && email) {
        emailDisplay.textContent = email;
        emailDisplay.classList.remove('hidden');
      }

      // Visual pulse feedback on the selected crewmate card
      const card = document.getElementById('selectedCrewmateCard') || document.getElementById('clearancePassCard');
      if (card) {
        card.classList.add('ring-4', 'ring-cyan-400', 'scale-[1.03]');
        setTimeout(() => {
          card.classList.remove('ring-4', 'ring-cyan-400', 'scale-[1.03]');
        }, 800);
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      // Squeak the customized crewmate
      window.soundEngine?.playSqueak();
    });
  }

  // ==========================================
  // 5. MOBILE MENU TOGGLE
  // ==========================================
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => {
      window.soundEngine.playClick();
      mobileMenu.classList.toggle('hidden');
    });

    // Close when clicking any nav item
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }

});
