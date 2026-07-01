/**
 * Адал Азамат — Landing Page v2
 */

(function () {
  "use strict";

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  /* Loading */
  window.addEventListener("load", () => {
    setTimeout(() => $("#loading-screen")?.classList.add("hidden"), 500);
  });

  /* Scroll: progress, header, to-top */
  const progress = $("#scroll-progress");
  const header = $("#site-header");
  const toTop = $("#to-top");

  window.addEventListener("scroll", () => {
    const y = document.documentElement.scrollTop;
    const max = document.documentElement.scrollHeight - document.documentElement.clientHeight;

    if (progress) progress.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
    header?.classList.toggle("scrolled", y > 30);
    toTop?.classList.toggle("visible", y > 450);
  }, { passive: true });

  toTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* Mobile nav */
  const burger = $("#burger-btn");
  const nav = $("#main-nav");

  burger?.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    burger.classList.toggle("active", open);
    burger.setAttribute("aria-expanded", open);
  });

  nav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      burger?.classList.remove("active");
      burger?.setAttribute("aria-expanded", "false");
    });
  });

  /* Nav dropdown: Одарённые · Математика */
  const mathDropdown = $("#math-direction-dropdown");
  const mathDropdownToggle = mathDropdown?.querySelector(".nav-dropdown-toggle");

  mathDropdownToggle?.addEventListener("click", (e) => {
    e.stopPropagation();
    const open = mathDropdown.classList.toggle("open");
    mathDropdownToggle.setAttribute("aria-expanded", open);
  });

  document.addEventListener("click", (e) => {
    if (mathDropdown && !mathDropdown.contains(e.target)) {
      mathDropdown.classList.remove("open");
      mathDropdownToggle?.setAttribute("aria-expanded", "false");
    }
  });

  mathDropdown?.querySelectorAll(".nav-dropdown-item").forEach((item) => {
    item.addEventListener("click", () => {
      mathDropdown.classList.remove("open");
      mathDropdownToggle?.setAttribute("aria-expanded", "false");
      nav?.classList.remove("open");
      burger?.classList.remove("active");
      burger?.setAttribute("aria-expanded", "false");
    });
  });

  /* Reveal on scroll */
  const reveals = $$(".reveal");
  if (reveals.length && "IntersectionObserver" in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -30px 0px" });
    reveals.forEach((el) => obs.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("visible"));
  }

  /* Stat counters */
  function countUp(el, target, ms) {
    const start = performance.now();
    const suffix = el.parentElement?.querySelector(".stat-suffix");
    const isPct = suffix?.textContent.trim() === "%";

    function step(now) {
      const t = Math.min((now - start) / ms, 1);
      const val = Math.round((1 - Math.pow(1 - t, 3)) * target);
      el.textContent = isPct ? val : val.toLocaleString("ru-RU");
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const counters = $$(".stat-number[data-target]");
  if (counters.length && "IntersectionObserver" in window) {
    const cObs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          countUp(e.target, Number(e.target.dataset.target) || 0, 2000);
          cObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach((el) => cObs.observe(el));
  }

  /* Hero parallax (desktop only) */
  const heroArt = $("#hero-art");
  if (heroArt && window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)").matches) {
    document.addEventListener("mousemove", (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 16;
      const y = (e.clientY / window.innerHeight - 0.5) * 10;
      heroArt.style.transform = `translate(${x}px, ${y}px)`;
    }, { passive: true });
  }

  /* Active nav link on scroll */
  const sections = $$("section[id]");
  const navLinks = $$(".nav-link[href^='#']");

  if (sections.length && navLinks.length && "IntersectionObserver" in window) {
    const sObs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const id = e.target.id;
          navLinks.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === "#" + id);
          });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach((s) => sObs.observe(s));
  }

  /* Feedback form */
  $("#feedback-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = {
      name: $("#name").value.trim(),
      email: $("#email").value.trim(),
      message: $("#message").value.trim(),
      date: new Date().toISOString()
    };
    const list = JSON.parse(localStorage.getItem("adalazamat_feedback") || "[]");
    list.push(data);
    localStorage.setItem("adalazamat_feedback", JSON.stringify(list));
    const status = $("#form-status");
    if (status) status.textContent = "Спасибо! Ваше сообщение принято.";
    e.target.reset();
  });

  /* Privacy dialog */
  const dialog = $("#privacy-dialog");
  $$('a[href="#privacy"]').forEach((a) => {
    a.addEventListener("click", (e) => { e.preventDefault(); dialog?.showModal(); });
  });
  $("#close-privacy")?.addEventListener("click", () => dialog?.close());

  /* ── Particle background ── */
  const pCanvas = $("#particle-canvas");
  if (pCanvas && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const ctx = pCanvas.getContext("2d");
    let particles = [];
    const resize = () => {
      pCanvas.width = window.innerWidth;
      pCanvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * pCanvas.width,
        y: Math.random() * pCanvas.height,
        r: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        c: Math.random() > 0.5 ? "0,174,239" : "212,175,55"
      });
    }
    (function drawParticles() {
      ctx.clearRect(0, 0, pCanvas.width, pCanvas.height);
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > pCanvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > pCanvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.c},0.35)`;
        ctx.fill();
        particles.slice(i + 1).forEach((p2) => {
          const d = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (d < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0,174,239,${0.08 * (1 - d / 100)})`;
            ctx.stroke();
          }
        });
      });
      requestAnimationFrame(drawParticles);
    })();
  }

  /* ── Missions & XP ── */
  const MISSION_KEY = "adalazamat_missions";
  const completed = new Set(JSON.parse(localStorage.getItem(MISSION_KEY) || "[]"));
  let xp = Number(localStorage.getItem("adalazamat_xp") || 0);
  const xpEl = $("#missions-xp");

  function saveMissions() {
    localStorage.setItem(MISSION_KEY, JSON.stringify([...completed]));
    localStorage.setItem("adalazamat_xp", String(xp));
    if (xpEl) xpEl.textContent = xp;
  }

  function completeMission(id, btn) {
    if (completed.has(id)) return;
    completed.add(id);
    xp += 50;
    saveMissions();
    $$(`[data-mission="${id}"]`).forEach((el) => {
      el.classList.add("completed");
      if (el.classList.contains("value-mission-btn")) {
        el.textContent = "✓ Миссия выполнена";
        el.classList.add("done");
        el.disabled = true;
      }
    });
    if (btn && !btn.classList.contains("value-mission-btn")) {
      btn.style.transform = "scale(1.1)";
      setTimeout(() => { btn.style.transform = ""; }, 300);
    }
  }

  completed.forEach((id) => {
    $$(`[data-mission="${id}"]`).forEach((el) => {
      el.classList.add("completed");
      if (el.classList.contains("value-mission-btn")) {
        el.textContent = "✓ Миссия выполнена";
        el.classList.add("done");
        el.disabled = true;
      }
    });
  });
  saveMissions();

  $$(".mission-badge, .value-mission-btn").forEach((btn) => {
    btn.addEventListener("click", () => completeMission(btn.dataset.mission, btn));
  });

  /* ── Math AI solver ── */
  function solveMath(input) {
    const s = input.trim().replace(/\s/g, "");
    const quad = s.match(/x[²^2]?\s*([+-]?\d*)x\s*([+-]\d+)\s*=\s*0/i)
      || s.match(/x\^2\s*([+-]?\d*)x\s*([+-]\d+)\s*=\s*0/i);
    if (quad) {
      const b = quad[1] === "" || quad[1] === "+" ? -5 : Number(quad[1]) || -5;
      const c = Number(quad[2]);
      const bb = s.includes("5") ? 5 : Math.abs(b);
      const cc = s.includes("6") ? 6 : Math.abs(c);
      const D = bb * bb - 4 * cc;
      if (D >= 0) {
        const x1 = (-bb + Math.sqrt(D)) / 2;
        const x2 = (-bb - Math.sqrt(D)) / 2;
        return `Квадратное уравнение: x₁ = ${x1}, x₂ = ${x2}\n\nAI-анализ: корни можно найти через разложение: (x + 2)(x + 3) = 0`;
      }
      return `D = ${D} < 0 — действительных корней нет.`;
    }
    const linear = s.match(/y\s*=\s*([\d.]+)x\s*([+-]\s*[\d.]+)/i);
    if (linear) return `Линейная функция: k = ${linear[1]}, b = ${linear[2].replace(/\s/g, "")}.\nГрафик — прямая с угловым коэффициентом ${linear[1]}.`;
    if (/a[²^2].*b[²^2].*c[²^2]/i.test(s)) return "Теорема Пифагора: a² + b² = c²\nДля прямоугольного треугольника гипотенуза c = √(a² + b²).";
    if (/S\s*=\s*πr[²^2]/i.test(s)) return "Площадь круга: S = πr²\nПример: при r = 5, S ≈ 78.54";
    if (/V\s*=\s*abc/i.test(s)) return "Объём прямоугольного параллелепипеда: V = a × b × c";
    try {
      const expr = s.replace(/x/g, "1").replace(/[^0-9+\-*/().]/g, "");
      if (expr) return `Результат: ${Function('"use strict";return(' + expr + ")")()}`;
    } catch (_) { /* ignore */ }
    return "AI-наставник: попробуйте x² + 5x + 6 = 0, y = kx + b или S = πr²";
  }

  $("#math-solve")?.addEventListener("click", () => {
    const input = $("#math-input")?.value || "";
    const out = $("#math-result");
    if (out) out.textContent = solveMath(input);
  });

  /* ── Whiteboard ── */
  const wb = $("#whiteboard");
  if (wb) {
    const wctx = wb.getContext("2d");
    let drawing = false;
    let color = "#00AEEF";
    wctx.lineCap = "round";
    wctx.lineWidth = 2.5;

    const pos = (e) => {
      const r = wb.getBoundingClientRect();
      const scaleX = wb.width / r.width;
      const scaleY = wb.height / r.height;
      const src = e.touches ? e.touches[0] : e;
      return { x: (src.clientX - r.left) * scaleX, y: (src.clientY - r.top) * scaleY };
    };

    const start = (e) => { drawing = true; const p = pos(e); wctx.beginPath(); wctx.moveTo(p.x, p.y); e.preventDefault(); };
    const move = (e) => {
      if (!drawing) return;
      const p = pos(e);
      wctx.strokeStyle = color;
      wctx.lineTo(p.x, p.y);
      wctx.stroke();
      e.preventDefault();
    };
    const stop = () => { drawing = false; };

    wb.addEventListener("mousedown", start);
    wb.addEventListener("mousemove", move);
    wb.addEventListener("mouseup", stop);
    wb.addEventListener("mouseleave", stop);
    wb.addEventListener("touchstart", start, { passive: false });
    wb.addEventListener("touchmove", move, { passive: false });
    wb.addEventListener("touchend", stop);

    $$(".board-tool[data-color]").forEach((btn) => {
      btn.addEventListener("click", () => {
        color = btn.dataset.color;
        $$(".board-tool").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
      });
    });
    $("#board-clear")?.addEventListener("click", () => wctx.clearRect(0, 0, wb.width, wb.height));
  }

  /* ── Function graph ── */
  const gCanvas = $("#graph-canvas");
  const gInput = $("#graph-fn");

  function drawGraph() {
    if (!gCanvas) return;
    const gctx = gCanvas.getContext("2d");
    const w = gCanvas.width;
    const h = gCanvas.height;
    gctx.clearRect(0, 0, w, h);
    gctx.strokeStyle = "rgba(0,174,239,0.2)";
    gctx.lineWidth = 1;
    gctx.beginPath();
    gctx.moveTo(0, h / 2);
    gctx.lineTo(w, h / 2);
    gctx.moveTo(w / 2, 0);
    gctx.lineTo(w / 2, h);
    gctx.stroke();

    const fnStr = (gInput?.value || "x*x").replace(/\^/g, "**");
    const fn = (x) => {
      try { return Function("x", `"use strict";return(${fnStr})`)(x); }
      catch (_) { return 0; }
    };

    gctx.strokeStyle = "#00AEEF";
    gctx.lineWidth = 2.5;
    gctx.shadowColor = "rgba(0,174,239,0.5)";
    gctx.shadowBlur = 6;
    gctx.beginPath();
    let started = false;
    for (let px = 0; px <= w; px++) {
      const x = (px - w / 2) / 30;
      const y = fn(x);
      const py = h / 2 - y * 30;
      if (!started) { gctx.moveTo(px, py); started = true; }
      else gctx.lineTo(px, py);
    }
    gctx.stroke();
    gctx.shadowBlur = 0;
  }

  gInput?.addEventListener("input", drawGraph);
  drawGraph();

  /* ── Geo constructor ── */
  const geoCanvas = $("#geo-canvas");
  let activeShape = "triangle";

  function drawGeo() {
    if (!geoCanvas) return;
    const gctx = geoCanvas.getContext("2d");
    const w = geoCanvas.width;
    const h = geoCanvas.height;
    gctx.clearRect(0, 0, w, h);
    const cx = w / 2;
    const cy = h / 2;
    gctx.strokeStyle = "#00AEEF";
    gctx.fillStyle = "rgba(0,174,239,0.12)";
    gctx.lineWidth = 2;
    gctx.shadowColor = "rgba(0,174,239,0.4)";
    gctx.shadowBlur = 8;

    if (activeShape === "triangle") {
      gctx.beginPath();
      gctx.moveTo(cx, cy - 60);
      gctx.lineTo(cx + 70, cy + 50);
      gctx.lineTo(cx - 70, cy + 50);
      gctx.closePath();
      gctx.fill();
      gctx.stroke();
    } else if (activeShape === "square") {
      gctx.fillRect(cx - 55, cy - 55, 110, 110);
      gctx.strokeRect(cx - 55, cy - 55, 110, 110);
    } else if (activeShape === "circle") {
      gctx.beginPath();
      gctx.arc(cx, cy, 60, 0, Math.PI * 2);
      gctx.fill();
      gctx.stroke();
    } else if (activeShape === "hexagon") {
      gctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i - Math.PI / 6;
        const x = cx + 60 * Math.cos(a);
        const y = cy + 60 * Math.sin(a);
        i === 0 ? gctx.moveTo(x, y) : gctx.lineTo(x, y);
      }
      gctx.closePath();
      gctx.fill();
      gctx.stroke();
    }
    gctx.shadowBlur = 0;
  }

  $$(".geo-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeShape = btn.dataset.shape;
      $$(".geo-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      drawGeo();
    });
  });
  drawGeo();

  /* ── Savings calculator ── */
  function drawSavingsChart(data) {
    const c = $("#savings-chart");
    if (!c || !data.length) return;
    const ctx = c.getContext("2d");
    const w = c.width;
    const h = c.height;
    ctx.clearRect(0, 0, w, h);
    const max = Math.max(...data);
    const step = w / (data.length - 1);
    ctx.strokeStyle = "#D4AF37";
    ctx.lineWidth = 2;
    ctx.beginPath();
    data.forEach((v, i) => {
      const x = i * step;
      const y = h - (v / max) * (h - 10) - 5;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.fillStyle = "rgba(212,175,55,0.15)";
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fill();
  }

  $("#calc-run")?.addEventListener("click", () => {
    const sum = Number($("#calc-sum")?.value) || 0;
    const rate = Number($("#calc-rate")?.value) || 0;
    const months = Number($("#calc-months")?.value) || 12;
    const monthly = rate / 100 / 12;
    let total = sum;
    const data = [sum];
    for (let i = 0; i < months; i++) {
      total = total * (1 + monthly) + sum * 0.1;
      data.push(total);
    }
    const out = $("#calc-result");
    if (out) out.textContent = `Через ${months} мес.: ≈ ${Math.round(total).toLocaleString("ru-RU")} ₸\nЕжемесячное пополнение: 10% от суммы`;
    drawSavingsChart(data);
  });

  /* ── Budget simulator ── */
  function drawBudgetChart(slices) {
    const c = $("#budget-chart");
    if (!c) return;
    const ctx = c.getContext("2d");
    const w = c.width;
    const h = c.height;
    const cx = w / 2;
    const cy = h / 2;
    const r = Math.min(w, h) / 2 - 10;
    const colors = ["#00AEEF", "#D4AF37", "#0A2A66", "#00A8A8", "#4CAF50"];
    const total = slices.reduce((a, s) => a + s.v, 0);
    let angle = -Math.PI / 2;
    ctx.clearRect(0, 0, w, h);
    slices.forEach((s, i) => {
      const slice = (s.v / total) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, angle, angle + slice);
      ctx.closePath();
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();
      angle += slice;
    });
  }

  $("#budget-run")?.addEventListener("click", () => {
    const income = Number($("#budget-income")?.value) || 0;
    const housing = Number($("#budget-housing")?.value) || 0;
    const food = Number($("#budget-food")?.value) || 0;
    const edu = Number($("#budget-edu")?.value) || 0;
    const save = Number($("#budget-save")?.value) || 0;
    const spent = housing + food + edu + save;
    const rest = income - spent;
    const out = $("#budget-result");
    if (out) {
      out.textContent = rest >= 0
        ? `Остаток: ${rest.toLocaleString("ru-RU")} ₸\nРекомендация AI: откладывайте минимум 10% дохода`
        : `Дефицит: ${Math.abs(rest).toLocaleString("ru-RU")} ₸\nAI: сократите расходы на ${Math.abs(rest).toLocaleString("ru-RU")} ₸`;
    }
    drawBudgetChart([
      { v: housing, l: "Жильё" },
      { v: food, l: "Еда" },
      { v: edu, l: "Образование" },
      { v: save, l: "Накопления" },
      { v: Math.max(rest, 0), l: "Свободно" }
    ]);
  });

  /* ── Growth chart (finance section) ── */
  function drawGrowthChart() {
    const c = $("#growth-chart");
    if (!c) return;
    const ctx = c.getContext("2d");
    const w = c.width;
    const h = c.height;
    ctx.clearRect(0, 0, w, h);
    const data = [];
    let v = 100000;
    for (let i = 0; i < 12; i++) {
      v *= 1.01 + Math.random() * 0.02;
      data.push(v);
    }
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    ctx.strokeStyle = "#00AEEF";
    ctx.lineWidth = 2;
    ctx.shadowColor = "rgba(0,174,239,0.5)";
    ctx.shadowBlur = 4;
    ctx.beginPath();
    data.forEach((val, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((val - min) / range) * (h - 20) - 10;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(0,174,239,0.1)";
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fill();
  }
  drawGrowthChart();

  /* ── Holo calculator ── */
  let calcVal = "0";
  let calcPrev = null;
  let calcOp = null;

  function updateCalcDisplay() {
    const d = $("#holo-calc-display");
    if (d) d.textContent = calcVal;
  }

  $$(".calc-key").forEach((key) => {
    key.addEventListener("click", () => {
      const v = key.dataset.val;
      if (v === "C") { calcVal = "0"; calcPrev = null; calcOp = null; }
      else if (v === "=") {
        if (calcPrev !== null && calcOp) {
          const a = Number(calcPrev);
          const b = Number(calcVal);
          calcVal = String(calcOp === "+" ? a + b : a - b);
          calcPrev = null;
          calcOp = null;
        }
      } else if (v === "+" || v === "-") {
        calcPrev = calcVal;
        calcOp = v;
        calcVal = "0";
      } else {
        calcVal = calcVal === "0" ? v : calcVal + v;
      }
      updateCalcDisplay();
    });
  });

  /* ── Edu stat counters ── */
  const eduNums = $$(".edu-num[data-target]");
  if (eduNums.length && "IntersectionObserver" in window) {
    const eObs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          countUp(e.target, Number(e.target.dataset.target) || 0, 1800);
          eObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    eduNums.forEach((el) => eObs.observe(el));
  }

  /* ── Humanoid guide companion ── */
  const guideSpeech = $("#guide-speech");
  const guideSpeechText = $("#guide-speech-text");

  const guideTips = {
    hero: "Сәлеметсіз бе! Добро пожаловать в школу будущего Казахстана!",
    "future-scenes": "Посмотрите 8 сцен — роботы и дети учатся вместе!",
    values: "Примите миссии «Адал Азамат» и получите награды!",
    "math-lab": "Я помогу решить задачу — введите уравнение!",
    "education-2035": "STEM, AI, робототехника — навыки 2035 года!",
    directions: "Выберите направление — финансы уже доступны!",
    "finance-holo": "Изучайте тенге и бюджет с голографическим калькулятором!",
    materials: "Материалы и тренажёры ждут вас!",
    about: "Программа «Адал Азамат» — честный гражданин Казахстана!",
    contact: "Напишите нам — мы всегда на связи!"
  };

  if (sections.length && guideSpeechText && "IntersectionObserver" in window) {
    const gObs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && guideTips[e.target.id]) {
          guideSpeechText.textContent = guideTips[e.target.id];
          guideSpeech?.classList.remove("hidden");
        }
      });
    }, { threshold: 0.25 });
    sections.forEach((s) => { if (guideTips[s.id]) gObs.observe(s); });
  }

  setTimeout(() => guideSpeech?.classList.add("hidden"), 8000);
  $("#ai-assistant-btn")?.addEventListener("click", () => guideSpeech?.classList.add("hidden"));

  /* ── AI Assistant / Guide panel ── */
  const aiBtn = $("#ai-assistant-btn");
  const aiPanel = $("#ai-assistant-panel");
  const aiForm = $("#ai-form");
  const aiMessages = $("#ai-messages");

  const aiResponses = {
    математ: "Откройте Math AI Lab — там AI-решатель, графики и геометрический конструктор!",
    финанс: "Перейдите в раздел «Финансовые голограммы» или тренажёр — там тенге, бюджет и накопления.",
    тенге: "Тенге (₸) — национальная валюта Казахстана. Учитесь управлять бюджетом в тренажёре!",
    честн: "Честность — главная ценность «Адал Азамат». Примите миссию и получите +50 XP!",
    адал: "«Адал Азамат» — программа воспитания честного гражданина Казахстана.",
    ai: "Искусственный интеллект помогает решать задачи в Math AI Lab и анализировать бюджет.",
    привет: "Сәлеметсіз бе! Я AI-наставник. Спрашивайте о математике, финансах и ценностях!",
    здрав: "Сәлеметсіз бе! Я AI-наставник. Спрашивайте о математике, финансах и ценностях!"
  };

  function aiReply(q) {
    const lower = q.toLowerCase();
    for (const [key, ans] of Object.entries(aiResponses)) {
      if (lower.includes(key)) return ans;
    }
    return "Отличный вопрос! Изучите Math AI Lab, финансовый тренажёр и миссии программы «Адал Азамат».";
  }

  aiBtn?.addEventListener("click", () => {
    const open = aiPanel.hidden;
    aiPanel.hidden = !open;
    aiBtn.setAttribute("aria-expanded", open);
  });

  $("#ai-close")?.addEventListener("click", () => {
    aiPanel.hidden = true;
    aiBtn.setAttribute("aria-expanded", "false");
  });

  aiForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = $("#ai-input");
    const q = input?.value.trim();
    if (!q) return;
    const userMsg = document.createElement("div");
    userMsg.className = "ai-msg ai-user";
    userMsg.textContent = q;
    aiMessages.appendChild(userMsg);
    const botMsg = document.createElement("div");
    botMsg.className = "ai-msg ai-bot";
    botMsg.textContent = aiReply(q);
    aiMessages.appendChild(botMsg);
    aiMessages.scrollTop = aiMessages.scrollHeight;
    input.value = "";
  });

  /* ── Button particle burst ── */
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    $$(".btn-holo").forEach((btn) => {
      btn.addEventListener("mouseenter", () => {
        for (let i = 0; i < 6; i++) {
          const p = document.createElement("span");
          p.style.cssText = `position:absolute;width:4px;height:4px;border-radius:50%;background:#00AEEF;pointer-events:none;left:50%;top:50%;animation:particle-burst 0.6s ease-out forwards;--px:${(Math.random()-0.5)*40}px;--py:${(Math.random()-0.5)*40}px`;
          btn.appendChild(p);
          setTimeout(() => p.remove(), 600);
        }
      });
    });
    const style = document.createElement("style");
    style.textContent = "@keyframes particle-burst{to{transform:translate(var(--px),var(--py));opacity:0}}";
    document.head.appendChild(style);
  }

  /* Trigger initial budget & savings charts */
  $("#calc-run")?.click();
  $("#budget-run")?.click();

})();
