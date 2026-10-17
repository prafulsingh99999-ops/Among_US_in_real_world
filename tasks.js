/**
 * TASK TERMINAL MINI-GAMES MODULE
 * SPARK - IIIT Bhopal 2026
 * 
 * Playable Tasks:
 * 1. Fix Wiring (Drag/Click to connect matching colored terminals)
 * 2. Swipe Card (Speed-based card swipe simulation)
 * 3. Unlock Manifolds (Tap numbers 1 to 10 in sequential order)
 * 4. MedBay Biometric Scan (Holographic scan with diagnostic readout)
 */

class TaskTerminal {
  constructor() {
    this.currentTask = 'wires';
    this.completedTasks = new Set();
    this.init();
  }

  init() {
    this.setupTabs();
    this.loadTask(this.currentTask);

    const resetBtn = document.getElementById('resetTaskBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        window.soundEngine.playClick();
        this.loadTask(this.currentTask);
      });
    }
  }

  setupTabs() {
    const tabBtns = document.querySelectorAll('.task-tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        window.soundEngine.playClick();
        tabBtns.forEach(b => {
          b.className = 'task-tab-btn px-5 py-3 rounded-xl border border-slate-700 bg-slate-900 text-slate-300 hover:text-white hover:border-cyan-400 flex items-center gap-2 transition-all active:scale-95';
        });
        btn.className = 'task-tab-btn px-5 py-3 rounded-xl border border-red-500/50 bg-red-600 text-white shadow-lg shadow-red-600/20 flex items-center gap-2 transition-all active:scale-95';

        const taskKey = btn.getAttribute('data-task');
        this.loadTask(taskKey);
      });
    });
  }

  loadTask(taskKey) {
    this.currentTask = taskKey;
    const stage = document.getElementById('taskStage');
    const title = document.getElementById('currentTaskTitle');
    const hint = document.getElementById('currentTaskHint');
    const badge = document.getElementById('currentTaskBadge');

    if (!stage) return;

    // Update status badge
    const isDone = this.completedTasks.has(taskKey);
    badge.textContent = isDone ? 'COMPLETED' : 'INCOMPLETE';
    badge.className = isDone
      ? 'text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/30'
      : 'text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30';

    switch (taskKey) {
      case 'wires':
        title.textContent = 'FIX WIRING (ELECTRICAL)';
        hint.textContent = 'Click a left terminal then click its matching color terminal on the right.';
        this.renderWiresTask(stage);
        break;
      case 'card':
        title.textContent = 'SWIPE CARD (ADMIN)';
        hint.textContent = 'Drag the ID card across the reader at an optimal steady speed.';
        this.renderCardSwipeTask(stage);
        break;
      case 'manifolds':
        title.textContent = 'UNLOCK MANIFOLDS (REACTOR)';
        hint.textContent = 'Click numeric buttons in ascending order from 1 to 10.';
        this.renderManifoldsTask(stage);
        break;
      case 'medbay':
        title.textContent = 'BIOMETRIC SCAN (MEDBAY)';
        hint.textContent = 'Step onto the scan platform and hold steady for diagnostic readout.';
        this.renderMedbayScanTask(stage);
        break;
    }
  }

  markCompleted(taskKey) {
    this.completedTasks.add(taskKey);
    window.soundEngine.playTaskSuccess();

    const badge = document.getElementById('currentTaskBadge');
    if (badge) {
      badge.textContent = 'COMPLETED';
      badge.className = 'text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/30 animate-pulse';
    }

    const progressEl = document.getElementById('overallTasksCompleted');
    if (progressEl) {
      progressEl.textContent = `${this.completedTasks.size} / 4 Complete`;
      if (this.completedTasks.size === 4) {
        progressEl.className = 'text-emerald-400 font-bold';
      }
    }
  }

  // ==========================================
  // TASK 1: FIX WIRING
  // ==========================================
  renderWiresTask(container) {
    const WIRE_COLORS = [
      { id: 'red', hex: '#EF4444' },
      { id: 'blue', hex: '#3B82F6' },
      { id: 'yellow', hex: '#EAB308' },
      { id: 'magenta', hex: '#EC4899' }
    ];

    // Left is sorted, right is shuffled
    const leftWires = [...WIRE_COLORS];
    const rightWires = [...WIRE_COLORS].sort(() => Math.random() - 0.5);

    let selectedLeft = null;
    const connections = {}; // leftId -> rightId

    container.innerHTML = `
      <div class="w-full max-w-lg bg-slate-950 p-6 rounded-2xl border-2 border-slate-800 relative select-none">
        <svg id="wireSvg" class="absolute inset-0 w-full h-full pointer-events-none z-10"></svg>
        
        <div class="flex justify-between items-center relative z-20 py-4">
          <!-- Left Terminals -->
          <div class="flex flex-col gap-6">
            ${leftWires.map(w => `
              <div class="flex items-center gap-3">
                <div class="wire-left-node w-7 h-7 rounded-full cursor-pointer border-4 border-slate-900 transition-transform hover:scale-125" 
                     data-color="${w.id}" 
                     style="background-color: ${w.hex}; box-shadow: 0 0 10px ${w.hex};"></div>
                <div class="w-10 h-3 rounded-r-md" style="background-color: ${w.hex};"></div>
              </div>
            `).join('')}
          </div>

          <!-- Middle space for wires -->
          <div class="flex-1 text-center text-[11px] font-mono text-slate-600">
            CONNECT MATCHING COLORS
          </div>

          <!-- Right Terminals -->
          <div class="flex flex-col gap-6">
            ${rightWires.map(w => `
              <div class="flex items-center gap-3 flex-row-reverse">
                <div class="wire-right-node w-7 h-7 rounded-full cursor-pointer border-4 border-slate-900 transition-transform hover:scale-125" 
                     data-color="${w.id}" 
                     style="background-color: ${w.hex}; box-shadow: 0 0 10px ${w.hex};"></div>
                <div class="w-10 h-3 rounded-l-md" style="background-color: ${w.hex};"></div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    const svg = container.querySelector('#wireSvg');
    const leftNodes = container.querySelectorAll('.wire-left-node');
    const rightNodes = container.querySelectorAll('.wire-right-node');

    const updateWiresDrawing = () => {
      svg.innerHTML = '';
      const containerRect = container.querySelector('.bg-slate-950').getBoundingClientRect();

      Object.entries(connections).forEach(([leftColor, rightColor]) => {
        const lNode = [...leftNodes].find(n => n.dataset.color === leftColor);
        const rNode = [...rightNodes].find(n => n.dataset.color === rightColor);

        if (lNode && rNode) {
          const lRect = lNode.getBoundingClientRect();
          const rRect = rNode.getBoundingClientRect();

          const x1 = lRect.left + lRect.width / 2 - containerRect.left;
          const y1 = lRect.top + lRect.height / 2 - containerRect.top;
          const x2 = rRect.left + rRect.width / 2 - containerRect.left;
          const y2 = rRect.top + rRect.height / 2 - containerRect.top;

          const wireCol = WIRE_COLORS.find(w => w.id === leftColor).hex;

          // Draw wire line
          const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          line.setAttribute('x1', x1);
          line.setAttribute('y1', y1);
          line.setAttribute('x2', x2);
          line.setAttribute('y2', y2);
          line.setAttribute('stroke', wireCol);
          line.setAttribute('stroke-width', '8');
          line.setAttribute('stroke-linecap', 'round');
          svg.appendChild(line);
        }
      });
    };

    leftNodes.forEach(node => {
      node.addEventListener('click', () => {
        window.soundEngine.playClick();
        selectedLeft = node.dataset.color;
        leftNodes.forEach(n => n.classList.remove('ring-4', 'ring-white'));
        node.classList.add('ring-4', 'ring-white');
      });
    });

    rightNodes.forEach(node => {
      node.addEventListener('click', () => {
        if (!selectedLeft) return;

        const rightColor = node.dataset.color;
        if (selectedLeft === rightColor) {
          // Success match
          window.soundEngine.playWireZap();
          connections[selectedLeft] = rightColor;
          updateWiresDrawing();

          // Reset selection
          leftNodes.forEach(n => n.classList.remove('ring-4', 'ring-white'));
          selectedLeft = null;

          // Check win
          if (Object.keys(connections).length === WIRE_COLORS.length) {
            this.markCompleted('wires');
          }
        } else {
          // Mismatch error
          window.soundEngine.playCardDenied();
          node.classList.add('animate-shake');
          setTimeout(() => node.classList.remove('animate-shake'), 400);
        }
      });
    });
  }

  // ==========================================
  // TASK 2: SWIPE CARD
  // ==========================================
  renderCardSwipeTask(container) {
    container.innerHTML = `
      <div class="w-full max-w-md bg-slate-950 p-6 rounded-2xl border-2 border-slate-800 text-center font-mono">
        
        <!-- Reader Screen Display -->
        <div class="bg-black border-2 border-slate-800 rounded-xl p-3 mb-6 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span id="cardLed" class="w-3 h-3 rounded-full bg-red-500"></span>
            <span id="readerStatus" class="font-orbitron text-xs text-yellow-400 font-bold uppercase">PLEASE SWIPE CARD</span>
          </div>
          <span class="text-[10px] text-slate-500">SPARK-CARD-READER V1.0</span>
        </div>

        <!-- Card Slot Track -->
        <div class="relative h-28 bg-slate-900 rounded-2xl border-2 border-dashed border-slate-700 overflow-hidden flex items-center px-2">
          <div class="absolute inset-x-0 h-1 bg-slate-700"></div>

          <!-- Draggable / Interactive Card -->
          <div id="swipeCardElement" class="relative z-10 w-28 h-20 bg-gradient-to-br from-cyan-600 to-blue-800 rounded-xl border border-cyan-300 p-2 text-left shadow-2xl cursor-grab active:cursor-grabbing flex flex-col justify-between select-none">
            <div class="flex justify-between items-center">
              <span class="text-[9px] font-orbitron font-black text-white">SPARK IIITB</span>
              <div class="w-3 h-2.5 bg-yellow-400 rounded-sm"></div>
            </div>
            <div class="h-1.5 w-16 bg-slate-900 rounded"></div>
            <div class="text-[8px] text-cyan-200">CADET CLEARANCE</div>
          </div>
        </div>

        <!-- Slider Bar for swipe control -->
        <div class="mt-6">
          <label class="block text-[11px] text-slate-400 mb-2">Drag card using the slider below across the slot:</label>
          <input type="range" id="cardSwipeRange" min="0" max="100" value="0" class="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer" />
        </div>

      </div>
    `;

    const slider = container.querySelector('#cardSwipeRange');
    const cardEl = container.querySelector('#swipeCardElement');
    const statusText = container.querySelector('#readerStatus');
    const led = container.querySelector('#cardLed');

    let swipeStartTime = null;

    slider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value);
      // Move card element horizontally
      const maxOffset = 250;
      cardEl.style.transform = `translateX(${(val / 100) * maxOffset}px)`;

      if (val > 5 && swipeStartTime === null) {
        swipeStartTime = performance.now();
        window.soundEngine.playCardSwipeZip();
      }

      if (val === 100) {
        const swipeDuration = performance.now() - swipeStartTime;
        swipeStartTime = null;

        if (swipeDuration < 180) {
          // Too fast
          window.soundEngine.playCardDenied();
          statusText.textContent = 'TOO FAST! TRY AGAIN';
          statusText.className = 'font-orbitron text-xs text-red-500 font-bold uppercase';
          led.className = 'w-3 h-3 rounded-full bg-red-500 animate-ping';
          setTimeout(() => {
            slider.value = 0;
            cardEl.style.transform = 'translateX(0px)';
            statusText.textContent = 'PLEASE SWIPE CARD';
            statusText.className = 'font-orbitron text-xs text-yellow-400 font-bold uppercase';
            led.className = 'w-3 h-3 rounded-full bg-red-500';
          }, 1200);
        } else if (swipeDuration > 1200) {
          // Too slow
          window.soundEngine.playCardDenied();
          statusText.textContent = 'TOO SLOW! TRY AGAIN';
          statusText.className = 'font-orbitron text-xs text-amber-500 font-bold uppercase';
          led.className = 'w-3 h-3 rounded-full bg-amber-500 animate-ping';
          setTimeout(() => {
            slider.value = 0;
            cardEl.style.transform = 'translateX(0px)';
            statusText.textContent = 'PLEASE SWIPE CARD';
            statusText.className = 'font-orbitron text-xs text-yellow-400 font-bold uppercase';
            led.className = 'w-3 h-3 rounded-full bg-red-500';
          }, 1200);
        } else {
          // Perfect swipe
          window.soundEngine.playCardAccepted();
          statusText.textContent = 'CARD ACCEPTED. THANK YOU!';
          statusText.className = 'font-orbitron text-xs text-emerald-400 font-bold uppercase';
          led.className = 'w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]';
          this.markCompleted('card');
        }
      }
    });
  }

  // ==========================================
  // TASK 3: UNLOCK MANIFOLDS (1 to 10)
  // ==========================================
  renderManifoldsTask(container) {
    let currentTarget = 1;
    // Generate numbers 1 to 10 shuffled
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].sort(() => Math.random() - 0.5);

    container.innerHTML = `
      <div class="w-full max-w-md bg-slate-950 p-6 rounded-2xl border-2 border-slate-800 text-center font-mono">
        <div class="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
          <span class="text-xs text-slate-400 font-orbitron">NEXT NUMBER: <strong id="manifoldTarget" class="text-amber-400 text-sm">1</strong></span>
          <span class="text-[10px] text-slate-500">REACTOR PRESSURE MATRIX</span>
        </div>

        <div id="manifoldGrid" class="grid grid-cols-5 gap-3">
          ${numbers.map(num => `
            <button class="manifold-btn h-14 rounded-xl bg-slate-800 border-2 border-slate-700 hover:border-cyan-400 font-orbitron font-black text-lg text-white transition-all active:scale-90" data-num="${num}">
              ${num}
            </button>
          `).join('')}
        </div>
      </div>
    `;

    const targetEl = container.querySelector('#manifoldTarget');
    const buttons = container.querySelectorAll('.manifold-btn');

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const num = parseInt(btn.dataset.num);

        if (num === currentTarget) {
          // Correct click
          window.soundEngine.playClick();
          btn.classList.remove('bg-slate-800', 'border-slate-700');
          btn.classList.add('bg-emerald-600', 'border-emerald-400', 'pointer-events-none', 'text-black');
          
          currentTarget++;

          if (currentTarget > 10) {
            targetEl.textContent = 'UNLOCKED!';
            targetEl.className = 'text-emerald-400 font-bold';
            this.markCompleted('manifolds');
          } else {
            targetEl.textContent = currentTarget;
          }
        } else {
          // Wrong click - reset!
          window.soundEngine.playCardDenied();
          currentTarget = 1;
          targetEl.textContent = '1 (RESET)';
          buttons.forEach(b => {
            b.className = 'manifold-btn h-14 rounded-xl bg-slate-800 border-2 border-slate-700 hover:border-cyan-400 font-orbitron font-black text-lg text-white transition-all active:scale-90';
          });
        }
      });
    });
  }

  // ==========================================
  // TASK 4: MEDBAY BIOMETRIC SCAN
  // ==========================================
  renderMedbayScanTask(container) {
    container.innerHTML = `
      <div class="w-full max-w-lg bg-slate-950 p-6 rounded-2xl border-2 border-slate-800 font-mono text-xs">
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          
          <!-- Scan Pad Viewport -->
          <div class="relative h-64 bg-slate-900 rounded-2xl border-2 border-cyan-500/40 flex items-center justify-center overflow-hidden">
            <!-- Scan Beam Line -->
            <div id="scanBeam" class="hidden absolute inset-x-0 h-1.5 bg-cyan-400 shadow-[0_0_15px_#22d3ee] scan-beam-anim z-20"></div>
            
            <!-- Crewmate avatar in scanner -->
            <div id="scanCrewmateAvatar" class="w-28 h-32 relative z-10">
              ${window.crewmateManager ? window.crewmateManager.getSVG(window.crewmateManager.currentColor, window.crewmateManager.currentHat, '100%', '100%') : ''}
            </div>

            <!-- Platform circle -->
            <div class="absolute bottom-4 w-28 h-8 rounded-full border-2 border-cyan-400/40 bg-cyan-950/60 z-0"></div>
          </div>

          <!-- Telemetry Output Screen -->
          <div class="space-y-3">
            <div class="bg-black p-3 rounded-xl border border-slate-800">
              <span class="text-slate-500 block text-[9px] uppercase">SCANNER STATUS</span>
              <span id="medbayStatusText" class="font-orbitron font-bold text-yellow-400 text-xs">AWAITING SUBJECT</span>
            </div>

            <div class="space-y-1.5 text-slate-300">
              <div class="flex justify-between border-b border-slate-800 pb-1">
                <span>SUBJECT ID:</span>
                <span class="text-cyan-400 font-bold">SPARK-CADET#902</span>
              </div>
              <div class="flex justify-between border-b border-slate-800 pb-1">
                <span>WEIGHT:</span>
                <span class="text-white font-bold">92 lbs (41.7 kg)</span>
              </div>
              <div class="flex justify-between border-b border-slate-800 pb-1">
                <span>BLOOD TYPE:</span>
                <span class="text-white font-bold">O-POSITIVE</span>
              </div>
              <div class="flex justify-between border-b border-slate-800 pb-1">
                <span>IMPOSTOR DETECT:</span>
                <span id="medbayRisk" class="text-emerald-400 font-bold">0.00% (CLEARED)</span>
              </div>
            </div>

            <button id="startScanBtn" class="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-orbitron font-black py-2.5 px-4 rounded-xl border border-cyan-300 transition-all flex items-center justify-center gap-2">
              <i class="fa-solid fa-barcode"></i> START 5s SCAN
            </button>
          </div>

        </div>

      </div>
    `;

    const startBtn = container.querySelector('#startScanBtn');
    const scanBeam = container.querySelector('#scanBeam');
    const statusText = container.querySelector('#medbayStatusText');

    startBtn.addEventListener('click', () => {
      window.soundEngine.playSqueak();
      startBtn.disabled = true;
      startBtn.classList.add('opacity-50');
      scanBeam.classList.remove('hidden');

      statusText.textContent = 'SCANNING IN PROGRESS...';
      statusText.className = 'font-orbitron font-bold text-cyan-400 text-xs animate-pulse';

      // 4-second scan duration
      setTimeout(() => {
        scanBeam.classList.add('hidden');
        statusText.textContent = 'SCAN COMPLETE • CLEARED';
        statusText.className = 'font-orbitron font-bold text-emerald-400 text-xs';
        startBtn.innerHTML = '<i class="fa-solid fa-check"></i> SCAN VERIFIED';
        this.markCompleted('medbay');
      }, 3500);
    });
  }
}

// Global instance
window.taskTerminal = null;
window.addEventListener('DOMContentLoaded', () => {
  window.taskTerminal = new TaskTerminal();
});
