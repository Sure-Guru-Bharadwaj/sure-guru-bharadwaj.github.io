/**
 * Sure Guru Bharadwaj - Portfolio Interactive Script
 * Specialized in VLSI Design, FPGA, & Embedded Systems
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Current Year in Footer
  const yearSpan = document.getElementById('currentYear');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // 2. Initialize Circuit / Particle Canvas Animation
  initCircuitCanvas();

  // 3. Dynamic Typewriter Effect
  initTypewriter();

  // 4. Mobile Menu Toggle
  initMobileMenu();

  // 5. Theme Toggle (Dark / Light)
  initThemeToggle();

  // 6. Project Filter Functionality
  initProjectFilters();

  // 7. Stat Counters on Scroll
  initStatCounters();

  // 8. Active Nav Link on Scroll (ScrollSpy)
  initScrollSpy();

  // 9. Copy Email Helper
  initCopyEmail();
});

/* ==========================================================================
   Interactive Circuit Canvas Background
   ========================================================================== */
function initCircuitCanvas() {
  const canvas = document.getElementById('circuitCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Nodes for circuit traces
  const nodeCount = Math.floor((width * height) / 22000);
  const nodes = [];

  for (let i = 0; i < nodeCount; i++) {
    nodes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 2 + 1,
    });
  }

  let mouse = { x: null, y: null, maxDist: 120 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Update and draw nodes
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      node.x += node.vx;
      node.y += node.vy;

      // Bounce on edges
      if (node.x < 0 || node.x > width) node.vx *= -1;
      if (node.y < 0 || node.y > height) node.vy *= -1;

      // Draw node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 242, 254, 0.5)';
      ctx.fill();

      // Connect near nodes with orthogonal/subtle lines (PCB trace feel)
      for (let j = i + 1; j < nodes.length; j++) {
        const other = nodes[j];
        const dx = node.x - other.x;
        const dy = node.y - other.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(other.x, other.y);
          const alpha = 1 - dist / 110;
          ctx.strokeStyle = `rgba(0, 242, 254, ${alpha * 0.15})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Mouse interactivity
      if (mouse.x !== null && mouse.y !== null) {
        const mdx = node.x - mouse.x;
        const mdy = node.y - mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

        if (mdist < mouse.maxDist) {
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(79, 172, 254, ${1 - mdist / mouse.maxDist})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   Typewriter Effect
   ========================================================================== */
function initTypewriter() {
  const element = document.getElementById('typewriter');
  if (!element) return;

  const phrases = [
    'FPGA Architectures & Cryptography',
    'Edge-Intelligent CAN-IoT Systems',
    'Digital VLSI & RTL Designs',
    'Smart ESP32 & STM32 Firmware',
    'Robust Hardware-Software Solutions',
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let delay = 100;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      element.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      delay = 45;
    } else {
      element.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      delay = 95;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      delay = 1800; // Pause at end of phrase
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 400; // Pause before new word
    }

    setTimeout(type, delay);
  }

  type();
}

/* ==========================================================================
   Mobile Navigation Menu
   ========================================================================== */
function initMobileMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!menuToggle || !navMenu) return;

  menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    menuToggle.classList.toggle('open');
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      menuToggle.classList.remove('open');
    });
  });
}

/* ==========================================================================
   Theme Toggle (Dark / Light)
   ========================================================================== */
function initThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  if (!themeToggle) return;

  const savedTheme = localStorage.getItem('sgb_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('sgb_theme', newTheme);
    updateThemeIcon(newTheme);
  });

  function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    if (theme === 'light') {
      icon.className = 'fa-solid fa-sun';
    } else {
      icon.className = 'fa-solid fa-moon';
    }
  }
}

/* ==========================================================================
   Project Filter Handling
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* ==========================================================================
   Stat Counters with Intersection Observer
   ========================================================================== */
function initStatCounters() {
  const counters = document.querySelectorAll('.stat-num');
  if (!counters.length) return;

  let animated = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          counters.forEach((counter) => {
            const target = +counter.getAttribute('data-target');
            let current = 0;
            const increment = target / 35;

            const timer = setInterval(() => {
              current += increment;
              if (current >= target) {
                counter.textContent = target;
                clearInterval(timer);
              } else {
                counter.textContent = Math.ceil(current);
              }
            }, 30);
          });
        }
      });
    },
    { threshold: 0.5 }
  );

  const statsStrip = document.querySelector('.stats-strip');
  if (statsStrip) {
    observer.observe(statsStrip);
  }
}

/* ==========================================================================
   ScrollSpy for Active Nav Link
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let scrollY = window.pageYOffset + 150;

    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

/* ==========================================================================
   Copy Email Helper & Toast
   ========================================================================== */
function initCopyEmail() {
  const copyBtn = document.getElementById('copyEmailBtn');
  if (!copyBtn) return;

  copyBtn.addEventListener('click', () => {
    const email = 'suregurubharadwaj@gmail.com';
    navigator.clipboard
      .writeText(email)
      .then(() => {
        showToast('Email copied to clipboard: ' + email);
      })
      .catch(() => {
        showToast('suregurubharadwaj@gmail.com');
      });
  });
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

/* ==========================================================================
   Project Architecture Modal Data & Handlers
   ========================================================================== */
const projectDetails = {
  'fpga-project': {
    title: 'Image Encryption & Decryption using FPGA',
    category: 'VLSI & FPGA Security',
    content: `
      <p>This project implements a hardware-accelerated image cryptography engine synthesized for FPGA architectures using Verilog HDL.</p>
      <h4>Key Architectural Pillars:</h4>
      <ul>
        <li><strong>Hybrid AES & Chaos Mapping:</strong> Employs 128-bit AES block cipher combined with discrete chaotic maps (Logistic/Arnold Cat Map) for non-linear pixel diffusion and confusion.</li>
        <li><strong>Pipelined RTL Datapath:</strong> Designed fully pipelined SubBytes, ShiftRows, MixColumns, and AddRoundKey stages to achieve high clock frequency and line-rate image processing.</li>
        <li><strong>Synthesis & Resource Utilization:</strong> Optimized on Xilinx Vivado targeting low LUT footprint, optimal Block RAM buffer allocation, and maximum clock frequency timing closure.</li>
        <li><strong>Resistance:</strong> Passed statistical randomness tests (NIST), adjacent pixel correlation analysis, and differential attack evaluations (NPCR/UACI).</li>
      </ul>
      <h4>Tools & Frameworks:</h4>
      <p>Verilog HDL, Xilinx Vivado, FPGA Evaluation Board, MATLAB (Verification & Image Conversion).</p>
    `,
  },
  'ev-project': {
    title: 'Edge-Intelligent CAN-IoT EV Battery Architecture',
    category: 'Automotive & Embedded Systems',
    content: `
      <p>An intelligent telemetry system bridging the physical CAN-bus of an Electric Vehicle (EV) to an edge anomaly detection and thermal safety module.</p>
      <h4>System Architecture:</h4>
      <ul>
        <li><strong>CAN Bus Interfacing:</strong> Captured ISO 11898 standard CAN packets for high-voltage battery pack parameters (individual cell voltages, module temperature, SoC, SoH, charge/discharge rates).</li>
        <li><strong>Edge Anomaly Detection:</strong> Implemented real-time boundary checks and gradient tracking algorithms on MCU to identify sudden voltage drops or abnormal thermal rise.</li>
        <li><strong>Thermal Management Actuation:</strong> Automated auxiliary coolant pump and fan triggers before cell temperature reaches critical thermal runaway thresholds.</li>
        <li><strong>IoT Gateway:</strong> Uploads synchronized diagnostics to an automotive fleet dashboard with alert telemetry.</li>
      </ul>
      <h4>Tech Stack:</h4>
      <p>Embedded C, CAN-bus Transceiver (MCP2515/TJA1050), STM32 / ESP32, FreeRTOS concepts, IoT protocols.</p>
    `,
  },
  'irrigation-project': {
    title: 'GUI-Driven Smart Irrigation with Decision Support',
    category: 'AgroTech & Embedded IoT',
    content: `
      <p>Autonomous wireless irrigation infrastructure powered by ESP32 microcontrollers with integrated web dashboard and sensor telemetry.</p>
      <h4>Highlights:</h4>
      <ul>
        <li><strong>Decision Logic:</strong> Multi-threshold algorithm weighing soil moisture, ambient humidity, temperature, and sun exposure to prevent over-irrigation.</li>
        <li><strong>Embedded GUI Dashboard:</strong> Hosted a lightweight asynchronous web server directly on the ESP32 allowing farmers to monitor and control solenoid valves from any phone/laptop.</li>
        <li><strong>Energy Efficiency:</strong> Integrated deep-sleep routines waking periodically for sensor reads, optimizing battery longevity for remote deployments.</li>
      </ul>
      <h4>Tech Stack:</h4>
      <p>ESP32, Embedded C++, HTML/CSS embedded webserver, Capacitive soil moisture sensors, Relays.</p>
    `,
  },
  'weather-project': {
    title: 'Smart Weather Monitoring System',
    category: 'Environmental IoT',
    content: `
      <p>A multi-parameter environmental telemetry station monitoring local micro-climate metrics in real time.</p>
      <h4>Highlights:</h4>
      <ul>
        <li><strong>Multi-Sensor Bus:</strong> Interfaced temperature, humidity, barometric pressure, and atmospheric sensors using standard I2C and digital protocols.</li>
        <li><strong>Data Logging & Visualization:</strong> Transmitted metrics to a cloud dashboard for real-time graphs, anomaly alerts, and historic trending.</li>
        <li><strong>Fail-safe Communication:</strong> Implemented automatic reconnect buffers for network outages.</li>
      </ul>
      <h4>Tech Stack:</h4>
      <p>Arduino / NodeMCU, Embedded C, I2C/SPI Protocols, BMP280, DHT22 sensors.</p>
    `,
  },
  'chatbot-project': {
    title: 'Offline Conversational Assistant',
    category: 'Software & NLP',
    content: `
      <p>A self-contained desktop chatbot designed to function without an active internet connection, prioritizing data privacy and instant execution.</p>
      <h4>Highlights:</h4>
      <ul>
        <li><strong>Offline Intent Matching:</strong> Utilized pattern matching, rule-based heuristics, and tokenized NLP algorithms to classify user intent locally.</li>
        <li><strong>Interactive GUI:</strong> Clean, responsive graphical user interface featuring conversation bubbles, command history, and instant reply generation.</li>
        <li><strong>Extensibility:</strong> Modular dictionary architecture allowing easy knowledge base expansion.</li>
      </ul>
      <h4>Tech Stack:</h4>
      <p>Python, Tkinter / PyQt GUI, Rule-based NLP heuristics, Local JSON datastores.</p>
    `,
  },
};

function openModal(projectId) {
  const modal = document.getElementById('projectModal');
  const title = document.getElementById('modalTitle');
  const category = document.getElementById('modalCategory');
  const body = document.getElementById('modalBody');

  if (!modal || !projectDetails[projectId]) return;

  const data = projectDetails[projectId];
  title.textContent = data.title;
  category.textContent = data.category;
  body.innerHTML = data.content;

  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('projectModal');
  if (!modal) return;

  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = 'auto';
}

// Close modal on click outside box
window.addEventListener('click', (e) => {
  const modal = document.getElementById('projectModal');
  if (e.target === modal) {
    closeModal();
  }
});

// Close modal on Escape key
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
  }
});

/* ==========================================================================
   Contact Form Handler
   ========================================================================== */
function handleFormSubmit(e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const message = document.getElementById('message').value.trim();
  const feedback = document.getElementById('formFeedback');

  if (!name || !email || !message) {
    alert('Please fill out all required fields.');
    return;
  }

  // Construct mailto link as practical fallback so user can send immediately
  const mailtoLink = `mailto:suregurubharadwaj@gmail.com?subject=${encodeURIComponent(
    subject || 'Inquiry from ' + name
  )}&body=${encodeURIComponent(
    `From: ${name} (${email})\n\nMessage:\n${message}`
  )}`;

  // Show immediate feedback to the user
  feedback.className = 'form-feedback success';
  feedback.innerHTML = `<strong>Thank you, ${name}!</strong> Opening your email client to dispatch the message directly to Sure Guru Bharadwaj.`;

  // Trigger mailto dispatch
  setTimeout(() => {
    window.location.href = mailtoLink;
  }, 900);
}
