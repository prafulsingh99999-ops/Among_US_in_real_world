/**
 * CREWMATES MODULE (SVGs, Customizer, Ejections & Marquee)
 * SPARK - IIIT Bhopal 2026
 */

const CREWMATE_COLORS = [
  { id: 'red', name: 'Red', primary: '#C51111', shadow: '#7A0838', glow: 'rgba(197, 17, 17, 0.4)' },
  { id: 'blue', name: 'Blue', primary: '#132ED1', shadow: '#09158E', glow: 'rgba(19, 46, 209, 0.4)' },
  { id: 'green', name: 'Green', primary: '#117F2D', shadow: '#0A4D1B', glow: 'rgba(17, 127, 45, 0.4)' },
  { id: 'pink', name: 'Pink', primary: '#ED54BA', shadow: '#AB267C', glow: 'rgba(237, 84, 186, 0.4)' },
  { id: 'orange', name: 'Orange', primary: '#EF7D0D', shadow: '#B33E15', glow: 'rgba(239, 125, 13, 0.4)' },
  { id: 'yellow', name: 'Yellow', primary: '#F6F657', shadow: '#C38823', glow: 'rgba(246, 246, 87, 0.4)' },
  { id: 'black', name: 'Black', primary: '#3F474E', shadow: '#1E1F26', glow: 'rgba(63, 71, 78, 0.4)' },
  { id: 'white', name: 'White', primary: '#D6E0F0', shadow: '#8394BF', glow: 'rgba(214, 224, 240, 0.4)' },
  { id: 'purple', name: 'Purple', primary: '#6B2FBC', shadow: '#3B177C', glow: 'rgba(107, 47, 188, 0.4)' },
  { id: 'cyan', name: 'Cyan', primary: '#38FEDC', shadow: '#24989E', glow: 'rgba(56, 254, 220, 0.4)' },
  { id: 'lime', name: 'Lime', primary: '#50EF39', shadow: '#15A722', glow: 'rgba(80, 239, 57, 0.4)' },
  { id: 'brown', name: 'Brown', primary: '#71491E', shadow: '#42280E', glow: 'rgba(113, 73, 30, 0.4)' }
];

const CREWMATE_HATS = [
  { id: 'none', name: 'No Hat', icon: 'fa-ban' },
  { id: 'sprout', name: 'Plant Sprout', icon: 'fa-seedling' },
  { id: 'dum', name: 'DUM Note', icon: 'fa-note-sticky' },
  { id: 'mini', name: 'Mini Crewmate', icon: 'fa-user-astronaut' },
  { id: 'tophat', name: 'Top Hat', icon: 'fa-hat-cowboy' },
  { id: 'crown', name: 'Royal Crown', icon: 'fa-crown' },
  { id: 'party', name: 'Party Cone', icon: 'fa-cake-candles' },
  { id: 'viking', name: 'Viking Horns', icon: 'fa-shield-halved' }
];

class CrewmateManager {
  constructor() {
    this.currentColor = CREWMATE_COLORS[0]; // Red default
    this.currentHat = 'sprout';
    this.isRoleRevealed = false;
    this.secretRole = 'CREWMATE'; // Randomly generated or crewmate
    
    this.init();
  }

  init() {
    this.renderSwatches();
    this.renderHatOptions();
    this.renderPassSwatches();
    this.updatePreview();
    this.populateMarquee();
    this.setupEventListeners();
    this.setupHeroFloats();
  }

  // Generate crisp SVG code for a crewmate with given color and hat
  getSVG(colorObj, hatId = 'none', width = '100%', height = '100%') {
    const c = colorObj || this.currentColor;
    
    // Hats SVG components
    let hatMarkup = '';
    switch (hatId) {
      case 'sprout':
        hatMarkup = `
          <!-- Plant Sprout -->
          <path d="M 62 38 Q 60 18 50 14 Q 68 12 66 36 Z" fill="#22c55e" stroke="#000" stroke-width="3" stroke-linejoin="round" />
          <path d="M 64 36 Q 66 18 78 16 Q 66 26 64 38 Z" fill="#16a34a" stroke="#000" stroke-width="3" stroke-linejoin="round" />
          <path d="M 63 36 L 63 42" stroke="#000" stroke-width="4" stroke-linecap="round" />
        `;
        break;
      case 'dum':
        hatMarkup = `
          <!-- DUM Post-it Note -->
          <g transform="translate(48, 26) rotate(-8)">
            <rect x="0" y="0" width="34" height="28" rx="2" fill="#facc15" stroke="#000" stroke-width="3" />
            <text x="17" y="19" font-family="'Press Start 2P', monospace" font-size="8" font-weight="900" fill="#000" text-anchor="middle">DUM</text>
          </g>
        `;
        break;
      case 'mini':
        hatMarkup = `
          <!-- Mini Crewmate on Head -->
          <g transform="translate(48, 8) scale(0.32)">
            <rect x="0" y="24" width="22" height="38" rx="8" fill="${c.shadow}" stroke="#000" stroke-width="8"/>
            <rect x="15" y="0" width="54" height="74" rx="26" fill="${c.primary}" stroke="#000" stroke-width="8"/>
            <rect x="42" y="18" width="36" height="24" rx="11" fill="#7dd3fc" stroke="#000" stroke-width="8"/>
            <rect x="50" y="22" width="20" height="7" rx="3.5" fill="#ffffff"/>
          </g>
        `;
        break;
      case 'tophat':
        hatMarkup = `
          <!-- Fancy Top Hat -->
          <g transform="translate(42, 10)">
            <ellipse cx="22" cy="30" rx="26" ry="6" fill="#1e293b" stroke="#000" stroke-width="3" />
            <rect x="8" y="2" width="28" height="26" rx="2" fill="#1e293b" stroke="#000" stroke-width="3" />
            <rect x="8" y="22" width="28" height="6" fill="#dc2626" />
          </g>
        `;
        break;
      case 'crown':
        hatMarkup = `
          <!-- Royal Golden Crown -->
          <g transform="translate(46, 16)">
            <path d="M 0 22 L 6 4 L 17 14 L 28 4 L 34 22 Z" fill="#eab308" stroke="#000" stroke-width="3" stroke-linejoin="round" />
            <circle cx="6" cy="4" r="2.5" fill="#ef4444" stroke="#000" stroke-width="1.5" />
            <circle cx="17" cy="14" r="2.5" fill="#06b6d4" stroke="#000" stroke-width="1.5" />
            <circle cx="28" cy="4" r="2.5" fill="#ef4444" stroke="#000" stroke-width="1.5" />
          </g>
        `;
        break;
      case 'party':
        hatMarkup = `
          <!-- Party Cone Hat -->
          <g transform="translate(50, 10)">
            <polygon points="14,0 0,30 28,30" fill="#f43f5e" stroke="#000" stroke-width="3" stroke-linejoin="round" />
            <circle cx="14" cy="0" r="4" fill="#fbbf24" stroke="#000" stroke-width="2" />
            <line x1="5" y1="20" x2="23" y2="20" stroke="#fbbf24" stroke-width="3" />
          </g>
        `;
        break;
      case 'viking':
        hatMarkup = `
          <!-- Viking Horns -->
          <g transform="translate(36, 18)">
            <path d="M 8 18 Q -4 4 -6 -6 Q 0 8 12 14" fill="#f8fafc" stroke="#000" stroke-width="3" stroke-linejoin="round" />
            <path d="M 44 18 Q 56 4 58 -6 Q 52 8 40 14" fill="#f8fafc" stroke="#000" stroke-width="3" stroke-linejoin="round" />
            <rect x="10" y="14" width="32" height="10" rx="3" fill="#64748b" stroke="#000" stroke-width="3" />
          </g>
        `;
        break;
      default:
        hatMarkup = '';
        break;
    }

    return `
      <svg viewBox="0 0 130 150" width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" class="crewmate-svg drop-shadow-[0_12px_20px_rgba(0,0,0,0.6)]">
        <defs>
          <linearGradient id="visorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#a5f3fc" />
            <stop offset="65%" stop-color="#38bdf8" />
            <stop offset="100%" stop-color="#0284c7" />
          </linearGradient>
        </defs>

        <!-- Backpack / Oxygen Tank -->
        <rect x="14" y="52" width="28" height="58" rx="12" fill="${c.shadow}" stroke="#000000" stroke-width="7" />
        <rect x="14" y="52" width="24" height="54" rx="10" fill="${c.primary}" />

        <!-- Main Body Shadow (Lower curve) -->
        <path d="M 44 32 C 72 32, 98 38, 98 64 L 98 116 C 98 132, 88 136, 80 136 C 72 136, 72 126, 70 120 C 68 126, 68 136, 60 136 C 52 136, 42 132, 42 116 L 42 64 C 42 38, 30 32, 44 32 Z" 
              fill="${c.shadow}" stroke="#000000" stroke-width="7" stroke-linejoin="round" />

        <!-- Main Body Primary Highlight Shape -->
        <path d="M 46 34 C 70 34, 96 40, 96 64 L 96 104 C 84 104, 72 98, 54 98 C 46 98, 44 100, 44 106 L 44 64 C 44 40, 34 34, 46 34 Z" 
              fill="${c.primary}" />

        <!-- Visor Outer Border & Base -->
        <rect x="62" y="44" width="48" height="34" rx="16" fill="#1e293b" stroke="#000000" stroke-width="7" stroke-linejoin="round" />
        
        <!-- Visor Glass with Gradient -->
        <rect x="65" y="47" width="42" height="28" rx="13" fill="url(#visorGrad)" />

        <!-- Visor Specular Glass Reflection -->
        <ellipse cx="80" cy="53" rx="14" ry="5" fill="#ffffff" opacity="0.9" transform="rotate(-6, 80, 53)" />

        <!-- Hat Layer -->
        ${hatMarkup}
      </svg>
    `;
  }

  // Populate 12 color swatch buttons
  renderSwatches() {
    const container = document.getElementById('colorSwatches');
    if (!container) return;
    container.innerHTML = '';

    CREWMATE_COLORS.forEach(c => {
      const btn = document.createElement('button');
      const isSelected = c.id === this.currentColor.id;
      btn.className = `h-11 rounded-xl flex items-center justify-center p-1 transition-all duration-200 border-2 ${
        isSelected ? 'border-white scale-110 shadow-lg' : 'border-transparent hover:scale-105'
      }`;
      btn.style.backgroundColor = c.primary;
      btn.title = c.name;
      btn.innerHTML = isSelected ? '<i class="fa-solid fa-check text-black drop-shadow text-sm"></i>' : '';

      btn.addEventListener('click', () => {
        window.soundEngine.playClick();
        this.currentColor = c;
        this.renderSwatches();
        this.renderPassSwatches();
        this.updatePreview();
      });

      container.appendChild(btn);
    });
  }

  // Populate quick color swatches in the registration section
  renderPassSwatches() {
    const container = document.getElementById('passColorSwatches');
    if (!container) return;
    container.innerHTML = '';

    CREWMATE_COLORS.forEach(c => {
      const btn = document.createElement('button');
      const isSelected = c.id === this.currentColor.id;
      btn.className = `w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-all duration-200 border-2 cursor-pointer ${
        isSelected ? 'border-white scale-110 shadow-md ring-2 ring-cyan-400' : 'border-transparent hover:scale-110 opacity-70 hover:opacity-100'
      }`;
      btn.style.backgroundColor = c.primary;
      btn.title = c.name;
      btn.innerHTML = isSelected ? '<i class="fa-solid fa-check text-black drop-shadow text-[10px]"></i>' : '';

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.soundEngine?.playClick();
        this.currentColor = c;
        this.renderSwatches();
        this.renderPassSwatches();
        this.updatePreview();
      });

      container.appendChild(btn);
    });
  }

  // Populate hat buttons
  renderHatOptions() {
    const container = document.getElementById('hatSelector');
    if (!container) return;
    container.innerHTML = '';

    CREWMATE_HATS.forEach(h => {
      const btn = document.createElement('button');
      const isSelected = h.id === this.currentHat;
      btn.className = `p-2.5 rounded-xl border text-left font-orbitron text-xs transition-all flex items-center gap-2 ${
        isSelected
          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
          : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
      }`;

      btn.innerHTML = `<i class="fa-solid ${h.icon} text-sm"></i> <span class="truncate">${h.name}</span>`;

      btn.addEventListener('click', () => {
        window.soundEngine.playClick();
        this.currentHat = h.id;
        this.renderHatOptions();
        this.updatePreview();
      });

      container.appendChild(btn);
    });
  }

  // Update live preview in customizer, registration showcase, etc.
  updatePreview() {
    const previewContainer = document.getElementById('characterPreviewContainer');
    if (previewContainer) {
      previewContainer.innerHTML = this.getSVG(this.currentColor, this.currentHat, '100%', '100%');
    }

    const glow = document.getElementById('avatarGlow');
    if (glow) {
      glow.style.backgroundColor = this.currentColor.glow;
    }

    const badge = document.getElementById('avatarNameBadge');
    if (badge) {
      badge.textContent = `${this.currentColor.name.toUpperCase()} CREWMATE`;
      badge.style.color = this.currentColor.primary;
      badge.style.borderColor = this.currentColor.primary;
    }

    // Update Selected Crewmate in the Registration section
    const selectedAvatar = document.getElementById('selectedCrewmateAvatar') || document.getElementById('badgeAvatarSlot');
    if (selectedAvatar) {
      selectedAvatar.innerHTML = this.getSVG(this.currentColor, this.currentHat, '100%', '100%');
    }

    const selectedTitle = document.getElementById('selectedCrewmateName');
    if (selectedTitle) {
      selectedTitle.textContent = `${this.currentColor.name.toUpperCase()} CREWMATE`;
      selectedTitle.style.color = this.currentColor.primary;
    }

    const selectedHatLabel = document.getElementById('selectedCrewmateHat');
    if (selectedHatLabel) {
      const hatObj = CREWMATE_HATS.find(h => h.id === this.currentHat);
      selectedHatLabel.textContent = `EQUIPPED: ${hatObj ? hatObj.name : 'No Hat'}`;
    }

    const selectedGlow = document.getElementById('selectedCrewmateGlow');
    if (selectedGlow) {
      selectedGlow.style.backgroundColor = this.currentColor.glow;
    }

    // Also update MedBay scanner avatar if currently rendered
    const scanAvatar = document.getElementById('scanCrewmateAvatar');
    if (scanAvatar) {
      scanAvatar.innerHTML = this.getSVG(this.currentColor, this.currentHat, '100%', '100%');
    }
  }

  // Populate continuous marquee banner
  populateMarquee() {
    const marquee = document.getElementById('crewmateMarquee');
    if (!marquee) return;
    marquee.innerHTML = '';

    // Create a 2x strip of all colors for seamless loop
    const fullList = [...CREWMATE_COLORS, ...CREWMATE_COLORS];

    fullList.forEach((col, idx) => {
      const item = document.createElement('div');
      item.className = 'inline-flex items-center gap-3 crewmate-walk cursor-pointer group';
      
      const hat = CREWMATE_HATS[(idx % (CREWMATE_HATS.length - 1)) + 1].id;
      item.innerHTML = `
        <div class="w-12 h-14 group-hover:scale-125 transition-transform">
          ${this.getSVG(col, hat, '100%', '100%')}
        </div>
        <span class="font-orbitron font-bold text-xs tracking-wider" style="color: ${col.primary}">
          ${col.name.toUpperCase()}
        </span>
      `;

      item.addEventListener('click', () => {
        window.soundEngine.playSqueak();
        this.currentColor = col;
        this.currentHat = hat;
        this.renderSwatches();
        this.renderHatOptions();
        this.renderPassSwatches();
        this.updatePreview();
      });

      marquee.appendChild(item);
    });
  }

  // Hero section floating astronauts
  setupHeroFloats() {
    const redContainer = document.getElementById('heroFloatRed');
    if (redContainer) {
      redContainer.innerHTML = this.getSVG(CREWMATE_COLORS[0], 'sprout', '130px', '150px');
    }

    const cyanContainer = document.getElementById('heroFloatCyan');
    if (cyanContainer) {
      cyanContainer.innerHTML = this.getSVG(CREWMATE_COLORS[9], 'dum', '110px', '130px');
    }
  }

  // Event Listeners for actions
  setupEventListeners() {
    // Squeak button
    const squeakBtn = document.getElementById('characterSqueakBtn');
    if (squeakBtn) {
      squeakBtn.addEventListener('click', () => {
        window.soundEngine.playSqueak();
      });
    }

    // Selected crewmate avatar click to squeak & wobble
    const selectedAvatar = document.getElementById('selectedCrewmateAvatar');
    if (selectedAvatar) {
      selectedAvatar.addEventListener('click', () => {
        window.soundEngine?.playSqueak();
        selectedAvatar.classList.remove('crewmate-walk');
        void selectedAvatar.offsetWidth;
        selectedAvatar.classList.add('crewmate-walk');
      });
    }

    // Role reveal button
    const roleBtn = document.getElementById('inspectRoleBtn');
    const roleBox = document.getElementById('roleRevealBox');
    if (roleBtn && roleBox) {
      roleBtn.addEventListener('click', () => {
        this.isRoleRevealed = !this.isRoleRevealed;
        if (this.isRoleRevealed) {
          // 25% chance of Impostor for fun!
          const isImp = Math.random() < 0.25;
          this.secretRole = isImp ? 'IMPOSTOR' : 'CREWMATE';

          if (isImp) {
            window.soundEngine.playKillSting();
            roleBox.className = 'mt-3 p-3 rounded-xl text-center border font-orbitron font-bold text-xs bg-red-950/80 border-red-500 text-red-400 animate-pulse';
            roleBox.innerHTML = `
              <div class="text-sm">⚠️ YOU ARE THE IMPOSTOR!</div>
              <div class="text-[10px] text-slate-300 font-mono mt-1 font-normal">Sabotage campus labs & eliminate crewmates stealthily.</div>
            `;
          } else {
            window.soundEngine.playTaskSuccess();
            roleBox.className = 'mt-3 p-3 rounded-xl text-center border font-orbitron font-bold text-xs bg-cyan-950/80 border-cyan-500 text-cyan-400';
            roleBox.innerHTML = `
              <div class="text-sm">🛡️ YOU ARE A CREWMATE</div>
              <div class="text-[10px] text-slate-300 font-mono mt-1 font-normal">Complete assigned campus tasks & identify impostors!</div>
            `;
          }
          roleBox.classList.remove('hidden');
          document.getElementById('roleBtnText').textContent = 'HIDE ROLE';
          
          // Also reflect role on badge
          const badgeRole = document.getElementById('badgeRole');
          if (badgeRole) {
            badgeRole.textContent = this.secretRole;
            badgeRole.className = isImp ? 'text-red-400 font-bold uppercase tracking-wider' : 'text-cyan-400 font-bold uppercase tracking-wider';
          }
        } else {
          roleBox.classList.add('hidden');
          document.getElementById('roleBtnText').textContent = 'REVEAL SECRET ROLE';
        }
      });
    }

    // Ejection simulator button
    const ejectBtn = document.getElementById('simulateEjectionBtn');
    if (ejectBtn) {
      ejectBtn.addEventListener('click', () => {
        this.triggerEjection(this.currentColor, this.currentHat);
      });
    }

    const closeEjectBtn = document.getElementById('closeEjectionBtn');
    if (closeEjectBtn) {
      closeEjectBtn.addEventListener('click', () => {
        const overlay = document.getElementById('ejectionOverlay');
        overlay.classList.add('opacity-0', 'pointer-events-none');
      });
    }
  }

  // Trigger full-screen authentic ejection sequence
  triggerEjection(colorObj, hatId) {
    const overlay = document.getElementById('ejectionOverlay');
    const container = document.getElementById('ejectedAstronautContainer');
    const mainText = document.getElementById('ejectionMainText');
    const subText = document.getElementById('ejectionSubText');

    if (!overlay || !container || !mainText || !subText) return;

    window.soundEngine.playKillSting();
    container.innerHTML = this.getSVG(colorObj, hatId, '100%', '100%');

    overlay.classList.remove('opacity-0', 'pointer-events-none');
    overlay.classList.add('opacity-100');

    mainText.textContent = '';
    subText.textContent = '';

    // Determine random outcome
    const wasImpostor = Math.random() < 0.3;
    const sentence = `${colorObj.name} was ${wasImpostor ? '' : 'not '}An Impostor.`;
    const remaining = wasImpostor ? '1 Impostor remains.' : '2 Impostors remain.';

    // Typewriter effect
    let charIdx = 0;
    const typeInterval = setInterval(() => {
      if (charIdx < sentence.length) {
        mainText.textContent += sentence.charAt(charIdx);
        charIdx++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => {
          subText.textContent = remaining;
          // Auto close after 4.5s
          setTimeout(() => {
            overlay.classList.remove('opacity-100');
            overlay.classList.add('opacity-0', 'pointer-events-none');
          }, 3500);
        }, 600);
      }
    }, 90);
  }
}

// Global instance
window.crewmateManager = null;
window.addEventListener('DOMContentLoaded', () => {
  window.crewmateManager = new CrewmateManager();
});
