/**
 * SORRY SRI PAVANI - Interactive Experience
 * Web Audio Synthesizer, Confetti Engine, Interactive Teddy Hug Machine,
 * Runaway No Button, and Floating Background Particle System.
 */

// ==========================================================================
// 1. WEB AUDIO API SYNTHESIZER (Gentle Lofi Music Box / Piano)
// ==========================================================================
let audioCtx = null;
let isMusicPlaying = false;
let musicInterval = null;
let currentNoteIndex = 0;

// Sweet, gentle lullaby melody notes (frequencies in Hz)
// C Major / A Minor pentatonic gentle chord progression
const melodyNotes = [
  { note: 261.63, dur: 0.6 }, // C4
  { note: 329.63, dur: 0.6 }, // E4
  { note: 392.00, dur: 0.8 }, // G4
  { note: 523.25, dur: 1.2 }, // C5
  { note: 440.00, dur: 0.6 }, // A4
  { note: 392.00, dur: 0.6 }, // G4
  { note: 329.63, dur: 0.8 }, // E4
  { note: 293.66, dur: 1.2 }, // D4

  { note: 261.63, dur: 0.6 }, // C4
  { note: 329.63, dur: 0.6 }, // E4
  { note: 440.00, dur: 0.8 }, // A4
  { note: 493.88, dur: 0.6 }, // B4
  { note: 523.25, dur: 1.4 }, // C5
  { note: 392.00, dur: 1.0 }, // G4
  { note: 329.63, dur: 1.4 }, // E4
];

function initAudio() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

// Play a single soft bell / music box tone
function playTone(freq, duration = 0.5, type = 'sine', gainLevel = 0.08) {
  if (!audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    // Warm envelope (soft attack, slow decay like a music box or kalimba)
    gain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(gainLevel, audioCtx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    console.log('Audio note error:', e);
  }
}

function playNextMelodyStep() {
  if (!isMusicPlaying) return;
  const current = melodyNotes[currentNoteIndex];
  
  // Play main note
  playTone(current.note, current.dur * 1.5, 'sine', 0.08);

  // Soft octave harmonic / chord pad
  if (currentNoteIndex % 2 === 0) {
    playTone(current.note / 2, current.dur * 2, 'triangle', 0.04);
  }

  currentNoteIndex = (currentNoteIndex + 1) % melodyNotes.length;
  musicInterval = setTimeout(playNextMelodyStep, current.dur * 750);
}

function toggleMusic() {
  initAudio();
  const musicBtn = document.getElementById('music-toggle-btn');
  
  if (isMusicPlaying) {
    isMusicPlaying = false;
    clearTimeout(musicInterval);
    if (musicBtn) {
      musicBtn.innerHTML = '🎵 Play Gentle Music';
      musicBtn.style.background = 'rgba(255, 255, 255, 0.85)';
      musicBtn.style.color = 'var(--deep-pink)';
    }
  } else {
    isMusicPlaying = true;
    currentNoteIndex = 0;
    playNextMelodyStep();
    if (musicBtn) {
      musicBtn.innerHTML = '🎶 Music Playing... (Click to Pause)';
      musicBtn.style.background = 'var(--deep-pink)';
      musicBtn.style.color = '#fff';
    }
  }
}

// Sound Effects for UI interaction
function playCuteChime() {
  initAudio();
  if (!audioCtx) return;
  playTone(523.25, 0.4, 'sine', 0.07); // C5
  setTimeout(() => playTone(659.25, 0.4, 'sine', 0.07), 80); // E5
  setTimeout(() => playTone(783.99, 0.5, 'sine', 0.07), 160); // G5
}

function playHugSound() {
  initAudio();
  if (!audioCtx) return;
  playTone(392.00, 0.3, 'triangle', 0.1);
  setTimeout(() => playTone(523.25, 0.5, 'sine', 0.1), 100);
}

function playCelebrationHarp() {
  initAudio();
  if (!audioCtx) return;
  const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
  notes.forEach((freq, idx) => {
    setTimeout(() => {
      playTone(freq, 0.8, 'sine', 0.09);
    }, idx * 100);
  });
}


// ==========================================================================
// 2. BACKGROUND CANVAS PARTICLES (Floating hearts, blossoms & sparkles)
// ==========================================================================
const canvas = document.getElementById('canvas-particles');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class FloatingParticle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + 20 + Math.random() * 50;
    this.size = Math.random() * 14 + 10;
    this.speedY = Math.random() * 1.2 + 0.5;
    this.speedX = Math.sin(Math.random() * Math.PI) * 0.8;
    this.rotation = Math.random() * 360;
    this.rotSpeed = (Math.random() - 0.5) * 2;
    this.opacity = Math.random() * 0.4 + 0.3;
    // Types: 'heart', 'star', 'sparkle'
    const types = ['heart', 'heart', 'star', 'sparkle'];
    this.type = types[Math.floor(Math.random() * types.length)];
    this.color = ['#ff758f', '#ff4d6d', '#ff8fab', '#ffd166'][Math.floor(Math.random() * 4)];
  }

  update() {
    this.y -= this.speedY;
    this.x += Math.sin(this.y * 0.02) * 0.7;
    this.rotation += this.rotSpeed;

    if (this.y < -30) {
      this.reset();
    }
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;

    if (this.type === 'heart') {
      const s = this.size / 15;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-10 * s, -10 * s, -20 * s, 5 * s, 0, 20 * s);
      ctx.bezierCurveTo(20 * s, 5 * s, 10 * s, -10 * s, 0, 0);
      ctx.fill();
    } else if (this.type === 'star') {
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        ctx.lineTo(Math.cos((18 + i * 72) * 0.0174) * (this.size * 0.6), -Math.sin((18 + i * 72) * 0.0174) * (this.size * 0.6));
        ctx.lineTo(Math.cos((54 + i * 72) * 0.0174) * (this.size * 0.3), -Math.sin((54 + i * 72) * 0.0174) * (this.size * 0.3));
      }
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, this.size * 0.25, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

// Populate particles
for (let i = 0; i < 35; i++) {
  particles.push(new FloatingParticle());
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();


// ==========================================================================
// 3. TEDDY BEAR HUG MACHINE
// ==========================================================================
let hugCount = 0;
const hugMessages = [
  "🧸 Hug delivered! Wrapping Sri Pavani in the warmest, coziest teddy embrace!",
  "💖 Big teddy squeeze dispatched! No sadness allowed in Sri Pavani's world!",
  "✨ Shinchan brought hot chocolate and a warm fluffy blanket!",
  "🥺 Shinchan is wiping away every single worry from Sri Pavani's mind!",
  "🌸 Infinite love and apologies sent directly to Sri Pavani's heart!",
  "🧸 Extra fluffy bear hug! You deserve all the peace, joy, and smiles in the world!"
];

function sendTeddyHug(event) {
  hugCount++;
  playHugSound();

  const countBadge = document.getElementById('hug-counter');
  if (countBadge) {
    countBadge.innerText = `${hugCount} Hugs Delivered to Sri Pavani! 🧸`;
  }

  const msgBox = document.getElementById('hug-message');
  if (msgBox) {
    const randomMsg = hugMessages[hugCount % hugMessages.length];
    msgBox.style.opacity = '0';
    setTimeout(() => {
      msgBox.innerText = randomMsg;
      msgBox.style.opacity = '1';
    }, 150);
  }

  // Spawn visual floating burst at button position
  const rect = event.target.getBoundingClientRect();
  const burstX = rect.left + rect.width / 2;
  const burstY = rect.top;

  for (let i = 0; i < 10; i++) {
    spawnFloatingHeart(burstX, burstY);
  }
}

function spawnFloatingHeart(x, y) {
  const el = document.createElement('div');
  el.innerText = ['🧸', '❤️', '💖', '✨', '🌸'][Math.floor(Math.random() * 5)];
  el.style.position = 'fixed';
  el.style.left = `${x + (Math.random() - 0.5) * 80}px`;
  el.style.top = `${y}px`;
  el.style.fontSize = `${Math.random() * 20 + 24}px`;
  el.style.pointerEvents = 'none';
  el.style.zIndex = '9999';
  el.style.transition = 'all 1.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
  el.style.transform = `translate(0, 0) scale(0.5)`;
  el.style.opacity = '1';

  document.body.appendChild(el);

  requestAnimationFrame(() => {
    const moveX = (Math.random() - 0.5) * 200;
    const moveY = -180 - Math.random() * 150;
    el.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.4) rotate(${(Math.random() - 0.5) * 60}deg)`;
    el.style.opacity = '0';
  });

  setTimeout(() => el.remove(), 1600);
}


// ==========================================================================
// 4. PROMISES INTERACTIVE CHECKLIST
// ==========================================================================
function togglePromise(element) {
  element.classList.toggle('accepted');
  playCuteChime();

  const rect = element.getBoundingClientRect();
  for (let i = 0; i < 6; i++) {
    spawnFloatingHeart(rect.right - 40, rect.top + rect.height / 2);
  }
}


// ==========================================================================
// 5. REASONS / CUTE BUBBLES INTERACTION
// ==========================================================================
function popBubble(element) {
  playCuteChime();
  element.style.transform = 'scale(1.2) rotate(4deg)';
  setTimeout(() => {
    element.style.transform = '';
  }, 250);

  const rect = element.getBoundingClientRect();
  spawnFloatingHeart(rect.left + rect.width / 2, rect.top + rect.height / 2);
}


// ==========================================================================
// 6. RUNAWAY 'NO' BUTTON (Playful & Gentle Pleading)
// ==========================================================================
let noClickAttempts = 0;
const noButtonPleadings = [
  "Are you really sure Sri Pavani? 🥺",
  "Shinchan will cry buckets! 😭",
  "Look at teddy's sad puppy eyes! 🧸💧",
  "Pretty please with sprinkles on top? 🍒",
  "Shinchan promises to do 50 pushups! 🙇‍♂️",
  "Just one tiny chance for Sri Pavani? 👉👈",
  "Teddy is holding his breath! 🥺",
  "You know you want to click YES! ❤️"
];

function dodgeNoButton(e) {
  const noBtn = document.getElementById('btn-no');
  if (!noBtn) return;

  noClickAttempts++;
  playCuteChime();

  // Pick random coordinates within parent container
  const parent = noBtn.parentElement;
  const parentRect = parent.getBoundingClientRect();
  
  const maxX = parentRect.width - noBtn.offsetWidth - 20;
  const maxY = 120;

  const randomX = (Math.random() - 0.5) * 250;
  const randomY = (Math.random() - 0.5) * 90;

  noBtn.style.transition = 'all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
  noBtn.style.transform = `translate(${randomX}px, ${randomY}px)`;

  // Change message
  const nextMsg = noButtonPleadings[noClickAttempts % noButtonPleadings.length];
  noBtn.innerText = nextMsg;

  // Make the YES button grow bigger and more irresistible!
  const yesBtn = document.getElementById('btn-yes');
  if (yesBtn) {
    const currentScale = 1 + Math.min(noClickAttempts * 0.08, 0.5);
    yesBtn.style.transform = `scale(${currentScale})`;
  }
}


// ==========================================================================
// 7. CONFETTI CANNON & FORGIVENESS CELEBRATION
// ==========================================================================
function acceptForgiveness() {
  playCelebrationHarp();
  launchConfetti();

  const modal = document.getElementById('celebration-modal');
  if (modal) {
    modal.classList.add('active');
  }
}

function closeModal() {
  const modal = document.getElementById('celebration-modal');
  if (modal) {
    modal.classList.remove('active');
  }
}

// Rich full-screen confetti effect
function launchConfetti() {
  const colors = ['#ff4d6d', '#ffd166', '#06d6a0', '#118ab2', '#7209b7', '#ff8fab'];
  const confettiCount = 120;

  for (let i = 0; i < confettiCount; i++) {
    const piece = document.createElement('div');
    const size = Math.random() * 12 + 6;
    piece.style.position = 'fixed';
    piece.style.width = `${size}px`;
    piece.style.height = `${size * (Math.random() > 0.5 ? 1 : 1.6)}px`;
    piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    piece.style.borderRadius = Math.random() > 0.4 ? '50%' : '2px';
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.top = '-20px';
    piece.style.zIndex = '99999';
    piece.style.pointerEvents = 'none';
    piece.style.opacity = '1';

    const endLeft = parseFloat(piece.style.left) + (Math.random() - 0.5) * 30;
    const duration = Math.random() * 3 + 2.5;

    piece.style.transition = `top ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94), left ${duration}s ease, transform ${duration}s linear, opacity 1s ease ${duration - 1}s`;

    document.body.appendChild(piece);

    requestAnimationFrame(() => {
      piece.style.top = '105vh';
      piece.style.left = `${endLeft}vw`;
      piece.style.transform = `rotate(${Math.random() * 1000}deg)`;
      piece.style.opacity = '0';
    });

    setTimeout(() => piece.remove(), duration * 1000);
  }
}

// Auto prompt audio on first user click anywhere if they like
document.addEventListener('click', function once() {
  initAudio();
  document.removeEventListener('click', once);
}, { once: true });

