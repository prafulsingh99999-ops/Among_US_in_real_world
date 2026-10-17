/**
 * CAMPUS MAP MODULE (The Skeld: IIIT Bhopal Edition)
 * SPARK - IIIT Bhopal 2026
 */

const CAMPUS_ROOMS = {
  cafeteria: {
    title: 'CAFETERIA',
    tag: 'HAZARD LEVEL: LOW • SAFE ZONE',
    icon: 'fa-mug-hot',
    color: '#F59E0B',
    bgColor: 'rgba(245, 158, 11, 0.2)',
    desc: 'Located at the College Canteen & Central Assembly Grounds. The central hub where the physical Emergency Meeting buzzer is installed. Players spawn here at the start of each round and after voting.',
    taskName: 'Empty Garbage Chute & Table Clearing',
    hardware: 'Ultrasonic Trash Compactor + SPARK Buzzer',
    vent: 'None (Safe Zone)',
    taskKey: 'wires'
  },
  electrical: {
    title: 'ELECTRICAL',
    tag: 'HAZARD LEVEL: EXTREME DANGER',
    icon: 'fa-bolt',
    color: '#EF4444',
    bgColor: 'rgba(239, 68, 68, 0.2)',
    desc: 'Situated inside the Robotics & IoT Hardware Lab. Infamous for sudden campus blackouts and blind corners behind equipment racks. Always move in groups of two!',
    taskName: 'Fix 4-Wire Circuit & Reset Relays',
    hardware: 'Arduino Uno + 4-Channel 5V Relay Board',
    vent: 'Direct vent to MedBay & Security Room',
    taskKey: 'wires'
  },
  medbay: {
    title: 'MEDBAY',
    tag: 'HAZARD LEVEL: LOW • SCAN PROVING',
    icon: 'fa-heart-pulse',
    color: '#38FEDC',
    bgColor: 'rgba(56, 254, 220, 0.2)',
    desc: 'Located at the Student Health Wing. Contains the iconic visual biometric scanner that visually confirms 100% crewmate innocence with holographic rings.',
    taskName: 'Biometric Full-Body Scan',
    hardware: 'Load Cell + Infrared Distance Telemetry',
    vent: 'Vent leads to Electrical Room',
    taskKey: 'medbay'
  },
  admin: {
    title: 'ADMIN BLOCK',
    tag: 'HAZARD LEVEL: MEDIUM',
    icon: 'fa-id-badge',
    color: '#A855F7',
    bgColor: 'rgba(168, 85, 247, 0.2)',
    desc: 'Located in the Academic Administration Wing. Features the digital personnel scanner where crewmates swipe their RFID clearance cards to register activity logs.',
    taskName: 'Swipe Card & Download Student Logs',
    hardware: 'RC522 13.56MHz RFID Reader + LCD Display',
    vent: 'Secret vent tunnel behind filing cabinets',
    taskKey: 'card'
  },
  security: {
    title: 'SECURITY',
    tag: 'HAZARD LEVEL: HIGH VULNERABILITY',
    icon: 'fa-video',
    color: '#10B981',
    bgColor: 'rgba(16, 185, 129, 0.2)',
    desc: 'Housed in the Network Server Room. Crewmates can view real-time live CCTV camera streams of campus corridors. When the camera red light blinks, someone is watching you!',
    taskName: 'Monitor Campus Security Cameras',
    hardware: 'ESP32-CAM Quad Stream Hub',
    vent: 'Vent connection directly to Electrical',
    taskKey: 'card'
  },
  reactor: {
    title: 'REACTOR',
    tag: 'HAZARD LEVEL: CRITICAL FACILITY',
    icon: 'fa-radiation',
    color: '#F97316',
    bgColor: 'rgba(249, 115, 22, 0.2)',
    desc: 'Located in the High-Performance Computing / AI Cluster. If the Impostors trigger a Reactor Meltdown sabotage, two crewmates must concurrently press biometric handplates within 45 seconds or the ship is lost!',
    taskName: 'Unlock Manifolds (1-10 Sequence)',
    hardware: 'Capacitive Dual Hand-Sensor + Siren Relays',
    vent: 'Upper & Lower Engine Vents',
    taskKey: 'manifolds'
  }
};

class CampusMap {
  constructor() {
    this.currentRoom = 'electrical';
    this.init();
  }

  init() {
    const roomBtns = document.querySelectorAll('.room-btn');
    roomBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        window.soundEngine.playClick();
        const roomKey = btn.dataset.room;
        this.selectRoom(roomKey);
      });
    });

    const simulateBtn = document.getElementById('simulateTaskBtn');
    if (simulateBtn) {
      simulateBtn.addEventListener('click', () => {
        window.soundEngine.playClick();
        const targetTask = CAMPUS_ROOMS[this.currentRoom].taskKey;
        // Scroll smoothly to terminal
        const term = document.getElementById('task-terminal');
        if (term) {
          term.scrollIntoView({ behavior: 'smooth' });
        }
        // Activate task tab
        const tabBtn = document.querySelector(`.task-tab-btn[data-task="${targetTask}"]`);
        if (tabBtn) {
          tabBtn.click();
        }
      });
    }

    // Default select electrical
    this.selectRoom('electrical');
  }

  selectRoom(roomKey) {
    const data = CAMPUS_ROOMS[roomKey];
    if (!data) return;
    this.currentRoom = roomKey;

    // Update active highlight on buttons
    document.querySelectorAll('.room-btn').forEach(b => {
      if (b.dataset.room === roomKey) {
        b.classList.add('ring-4', 'ring-cyan-400', 'scale-[1.02]');
      } else {
        b.classList.remove('ring-4', 'ring-cyan-400', 'scale-[1.02]');
      }
    });

    // Update sidebar content
    const titleEl = document.getElementById('roomTitle');
    const tagEl = document.getElementById('roomTag');
    const iconBox = document.getElementById('roomIconBox');
    const descEl = document.getElementById('roomDesc');
    const taskNameEl = document.getElementById('roomTaskName');
    const hardwareEl = document.getElementById('roomHardware');
    const ventEl = document.getElementById('roomVent');

    if (titleEl) titleEl.textContent = data.title;
    if (tagEl) {
      tagEl.textContent = data.tag;
      tagEl.style.color = data.color;
    }
    if (iconBox) {
      iconBox.innerHTML = `<i class="fa-solid ${data.icon}"></i>`;
      iconBox.style.color = data.color;
      iconBox.style.backgroundColor = data.bgColor;
      iconBox.style.borderColor = data.color;
    }
    if (descEl) descEl.textContent = data.desc;
    if (taskNameEl) taskNameEl.textContent = data.taskName;
    if (hardwareEl) hardwareEl.textContent = data.hardware;
    if (ventEl) ventEl.textContent = data.vent;
  }
}

// Global instance
window.campusMap = null;
window.addEventListener('DOMContentLoaded', () => {
  window.campusMap = new CampusMap();
});
