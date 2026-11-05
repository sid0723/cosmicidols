
"use strict";

// This version uses a new save file.
// Your previous summon-game progress remains untouched.
const SAVE_KEY = "cosmicIdolsV2";

const planets = [

{
    name: "The Sun",
    icon: "☀️",
    cost: 0,
    output: 2,
    seconds: 3,
    fact: "The Sun is the star at the center of our Solar System. Its energy powers life on Earth."
},

  {
    name: "Mercury",
    icon: "☿️",
    cost: 50,
    output: 5,
    seconds: 12,
    fact: "Mercury is the closest planet to the Sun and the smallest planet in our Solar System."
  },
  {
    name: "Venus",
    icon: "🟡",
    cost: 150,
    output: 12,
    seconds: 18,
    fact: "Venus has an extremely dense atmosphere and is the hottest planet in our Solar System."
  },
  {
    name: "Earth",
    icon: "🌍",
    cost: 350,
    output: 25,
    seconds: 24,
    fact: "Earth is the only planet currently known to support life."
  },
  {
    name: "Mars",
    icon: "🔴",
    cost: 750,
    output: 50,
    seconds: 30,
    fact: "Iron oxide in its surface material gives Mars its reddish color."
  },
  {
    name: "Jupiter",
    icon: "🪐",
    cost: 1500,
    output: 95,
    seconds: 40,
    fact: "Jupiter is the largest planet in our Solar System."
  },
  {
    name: "Saturn",
    icon: "🪐",
    cost: 3000,
    output: 180,
    seconds: 50,
    fact: "Saturn's famous rings consist largely of ice particles."
  },
  {
    name: "Uranus",
    icon: "🔵",
    cost: 6000,
    output: 340,
    seconds: 65,
    fact: "Uranus rotates on its side compared with most planets."
  },
  {
    name: "Neptune",
    icon: "🔵",
    cost: 12000,
    output: 650,
    seconds: 85,
    fact: "Neptune is the farthest planet from the Sun and has extremely fast winds."
  }
];

function freshGame() {
  return {
    stardust: 0,
    crystals: 0,
    owned: 1,
    levels: [1, 0, 0, 0, 0, 0, 0, 0, 0],
    ends: {},
    tutorial: 0,
    achievements: [],
    speedBoost: 0,
    announcement: null
  };
}

function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);

    if (!raw) return freshGame();

    const parsed = JSON.parse(raw);

    if (!parsed || !Array.isArray(parsed.levels)) {
      return freshGame();
    }

    const game = { ...freshGame(), ...parsed };

    game.owned = Math.max(
      1,
      Math.min(planets.length, Math.floor(Number(game.owned) || 1))
    );

    game.levels = planets.map((_, i) =>
      i < game.owned
        ? Math.max(1, Math.floor(Number(game.levels[i]) || 1))
        : 0
    );

    if (!game.ends || typeof game.ends !== "object") {
      game.ends = {};
    }

    if (!Array.isArray(game.achievements)) {
      game.achievements = [];
    }

    return game;
  } catch {
    return freshGame();
  }
}

let game = loadGame();
let screen = "home";
let previousScreen = "play";

const app = document.getElementById("app");

function save() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(game));
  } catch {}
}

function format(n) {
  return Math.floor(n).toLocaleString("en-US");
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[c]));
}

function cosmo(message) {
  return `
    <div class="cosmo-speech">
      <img src="Images/Cosmo.png" class="cosmo-avatar" alt="Cosmo">
      <div class="cosmo-dialogue">${escapeHtml(message)}</div>
    </div>
  `;
}

function header(title) {
  return `
    <header class="topbar">
      <h1>${title}</h1>
      <button class="ghost" data-action="home">← HOME</button>
    </header>
  `;
}

function stats() {
  return `
    <div class="stats">
      <div class="stat">
        <div class="stat-label">✨ STARDUST</div>
        <div class="stat-number" data-stat="stardust">
          ${format(game.stardust)}
        </div>
      </div>
      <div class="stat">
        <div class="stat-label">💎 CRYSTALS</div>
        <div class="stat-number" data-stat="crystals">
          ${format(game.crystals)}
        </div>
      </div>
      <div class="stat">
        <div class="stat-label">🪐 OBJECTS</div>
        <div class="stat-number">
          ${game.owned} / ${planets.length}
        </div>
      </div>
    </div>
  `;
}


function tutorialText() {
  switch (game.tutorial) {
    case 0:
      return "Welcome, Explorer! I'm Cosmo. The Sun is your starting star. Click NEXT and I'll show you how to collect Stardust.";

    case 1:
      return "Click HARVEST SOLAR ENERGY on the Sun. Its glowing bar will fill, and you'll receive Stardust automatically when it finishes.";

    case 2:
      return "Great! Keep harvesting until you have 10 Stardust collected. Then upgrade the Sun to Level 2!";

    case 3:
      return "Amazing! Your Sun is now Level 2 and produces more Stardust! Keep harvesting until you have 50 Stardust, then unlock Mercury!";

    case 4:
      return "Excellent! You've unlocked Mercury! Continue upgrading your celestial objects. At Level 5, production becomes automatic!";

    default:
      return "Click to start each production cycle. Level 5 unlocks automatic Stardust generation!";
  }
}


function tutorialPanel() {
  if (game.tutorial >= 5) return "";

  return `
    <section class="panel tutorial">
      <div class="tutorial-label">
        COSMO'S TUTORIAL · ${Math.min(game.tutorial + 1, 5)} OF 5
      </div>

      ${cosmo(tutorialText())}

      ${
        game.tutorial === 0
          ? '<button data-action="tutorial-next">NEXT →</button>'
          : game.tutorial === 4
            ? '<button data-action="tutorial-finish">FINISH TUTORIAL</button>'
            : '<div class="muted small">Follow Cosmo’s instructions to continue.</div>'
      }
    </section>
  `;
}

function duration(i) {
  return Math.max(
    3,
    Math.round(planets[i].seconds * (1 - game.speedBoost * .1))
  );
}

function upgradeCost(i) {
  return game.levels[i] * 10 * (i + 1);
}

function card(i) {
  const p = planets[i];
  const owned = i < game.owned;
  const next = i === game.owned;
  const level = game.levels[i];
  const auto = level >= 5;

  if (!owned) {
    return `
      <article class="object-card locked ${next ? "next" : ""}">
        <div class="object-head">
          <div class="object-icon">🔒</div>
          <div>
            <h3>${p.name}</h3>
            <span class="tag">
              ${next ? "NEXT UNLOCK" : "LOCKED"}
            </span>
          </div>
        </div>

        <p>
          ${
            next
              ? "Spend Stardust to unlock the next celestial object."
              : "Unlock the previous planet first."
          }
        </p>

        <div class="card-actions">
          <button
            data-action="buy"
            data-id="${i}"
            ${next && game.stardust >= p.cost ? "" : "disabled"}
          >
            UNLOCK · ${format(p.cost)} ✨
          </button>
        </div>
      </article>
    `;
  }

  const active = Number(game.ends[i]) > 0;

  return `
    <article class="object-card" data-object="${i}">
      <div class="object-head">

<div class="object-icon">
  ${i === 0
    ? '<img src="Images/Sun.png" alt="The Sun" class="planet-image">'
    : p.icon}
</div>

        <div>
          <h3>${p.name}</h3>
          <span class="tag">
            LEVEL ${level} · ${auto ? "AUTO UNLOCKED" : "MANUAL START"}
          </span>
        </div>
      </div>

      <p>${p.fact}</p>

      <div class="muted small">
        +${format(p.output * level)} ✨ every ${duration(i)} seconds
      </div>

      <div class="progress-track" data-track="${i}">
        <div class="progress-fill" data-fill="${i}"></div>
      </div>

      <div class="progress-caption" data-timer="${i}">
        ${active ? "Producing..." : auto ? "Automatic production" : "Ready to harvest"}
      </div>

      <div class="card-actions">
        <button
          data-action="harvest"
          data-id="${i}"
          ${active || auto ? "disabled" : ""}
        >
          ${
            auto
              ? "⚡ AUTOMATIC"
              : active
                ? "PRODUCING..."
                : i === 0
                  ? "☀️ HARVEST SOLAR ENERGY"
                  : "✨ START HARVEST"
          }
        </button>

        <button
          data-action="upgrade"
          data-id="${i}"
          ${game.stardust >= upgradeCost(i) ? "" : "disabled"}
        >
          UPGRADE · ${format(upgradeCost(i))} ✨
        </button>
      </div>
    </article>
  `;
}

function render() {
  if (screen === "home") {
    app.innerHTML = `
      <div class="shell home">
        <img
          class="cosmo-large"
          src="Images/Cosmo.png"
          alt="Cosmo the cosmic guide"
        >

        <h1>COSMIC IDOLS</h1>

        <p class="subtitle">
          Collect. Explore. Unlock the Universe.
        </p>

        <div class="cosmo-dialogue">
          Hi, I'm Cosmo! Ready to explore the Solar System?
        </div>

        <nav class="home-menu">
          <button data-action="play">🚀 PLAY</button>
          <button data-action="collection">⭐ COLLECTION</button>
          <button data-action="map">🌌 GALAXY MAP</button>
        </nav>
      </div>
    `;
  }

  else if (screen === "play") {
    app.innerHTML = `
      <div class="shell">
        ${header("🌌 COSMIC IDOLS")}
        ${stats()}
        ${tutorialPanel()}

        ${
          game.tutorial >= 4
            ? cosmo("Harvest Stardust, upgrade your celestial objects, and unlock the planets in order!")
            : ""
        }

        <section class="panel">
          <h2>☀️ Solar System Production</h2>

          <p class="muted">
            Click to begin each harvest. Stardust is added automatically
            when the glowing bar finishes. Reach Level 5 to automate an object.
          </p>

          <div class="grid">
            ${planets.map((_, i) => card(i)).join("")}
          </div>
        </section>

        <section class="panel">
          <h2>💎 Crystal Upgrades</h2>

          <p class="muted">
            Earn crystals for milestones. Spend 5 crystals to make every
            production cycle 10% faster (up to 30%).
          </p>

          <button
            data-action="boost"
            ${game.crystals >= 5 && game.speedBoost < 3 ? "" : "disabled"}
          >
            UPGRADE SPEED · 5 💎 (${game.speedBoost}/3)
          </button>
        </section>
      </div>
    `;
  }

  else if (screen === "collection") {
    app.innerHTML = `
      <div class="shell">
        ${header("⭐ YOUR COLLECTION")}
        ${stats()}

        ${cosmo("Every object you unlock joins your collection. Can you collect all eight planets?")}

        <div class="grid">
          ${
            planets.map((p, i) => `
              <article class="object-card ${i < game.owned ? "" : "locked"}">

<div class="object-icon">
  ${i < game.owned
    ? (i === 0
        ? '<img src="Images/Sun.png" alt="The Sun" class="planet-image">'
        : p.icon)
    : "🔒"}
</div>


                <h3>${p.name}</h3>

                <div class="tag">
                  ${i < game.owned ? "LEVEL " + game.levels[i] : "LOCKED"}
                </div>

                <p>
                  ${
                    i < game.owned
                      ? p.fact
                      : "Unlock this object in the Play screen."
                  }
                </p>
              </article>
            `).join("")
          }
        </div>
      </div>
    `;
  }

  else if (screen === "map") {
    app.innerHTML = `
      <div class="shell">
        ${header("🌌 GALAXY MAP")}
        ${stats()}

        ${cosmo("We begin in the Solar System, inside the Milky Way. Unlock its planets in order to complete this region!")}

        <div class="map-grid">
          <article class="map-node">
            <h2>☀️ Solar System</h2>


<p>${game.owned} of 9 celestial objects unlocked</p>

<div class="map-progress-track">
  <div
    class="map-progress-fill"
    style="width: ${(game.owned / planets.length) * 100}%"
  ></div>
</div>

<p class="muted small">
  ${Math.round((game.owned / planets.length) * 100)}% COMPLETE
</p>


            <p class="muted">
              ${
                game.owned === 9
                  ? "All eight planets unlocked!"
                  : `Next: ${planets[game.owned].name}`
              }
            </p>

            <button data-action="play">EXPLORE</button>
          </article>

          <article class="map-node locked">
            <h2>🌌 Beyond the Solar System</h2>

            <p class="muted">
              Future update: real stars and confirmed exoplanetary systems.
            </p>

            <span class="pill">COMING SOON</span>
          </article>
        </div>
      </div>
    `;
  }

  else if (screen === "announcement") {
    const a = game.announcement;

    app.innerHTML = `
      <div class="shell">
        <section class="panel announcement">
          <h2>
            ✨ ${a.type === "unlock" ? "OBJECT UNLOCKED!" : "LEVEL UP!"}
          </h2>

          <div class="object-icon">${planets[a.id].icon}</div>

          <h1>${planets[a.id].name}</h1>

          <p class="pill">LEVEL ${game.levels[a.id]}</p>

          ${cosmo(
            a.type === "unlock"
              ? `Fantastic! ${planets[a.id].fact}`
              : `Great work! ${planets[a.id].name} now produces more Stardust${
                  game.levels[a.id] === 5
                    ? " and harvests automatically!"
                    : "!"
                }`
          )}

          <button data-action="continue">CONTINUE</button>
        </section>
      </div>
    `;
  }

  updateDisplay();
}

function updateDisplay() {
  document.querySelectorAll('[data-stat="stardust"]').forEach(el => {
    el.textContent = format(game.stardust);
  });

  document.querySelectorAll('[data-stat="crystals"]').forEach(el => {
    el.textContent = format(game.crystals);
  });

  if (screen !== "play") return;

  for (let i = 0; i < game.owned; i++) {
    const end = Number(game.ends[i]) || 0;
    const fill = document.querySelector(`[data-fill="${i}"]`);
    const label = document.querySelector(`[data-timer="${i}"]`);

    if (!fill || !label) continue;

    const auto = game.levels[i] >= 5;

    if (end > 0) {
      const remaining = Math.max(0, end - Date.now());

      const percent = Math.max(
        0,
        Math.min(100, 100 * (1 - remaining / (duration(i) * 1000)))
      );

      fill.style.width = percent + "%";

      label.textContent =
        `${auto ? "Automatic harvest" : "Harvesting"} · ` +
        `${Math.ceil(remaining / 1000)}s remaining`;
    } else {
      fill.style.width = "0%";

      label.textContent = auto
        ? "Automatic production starting..."
        : "Ready to harvest";
    }
  }
}

function award(key, crystals) {
  if (game.achievements.includes(key)) return;

  game.achievements.push(key);
  game.crystals += crystals;
}

function checkAchievements() {
  if (game.owned >= 3) award("three-objects", 2);
  if (game.owned >= 5) award("five-objects", 3);
  if (game.owned >= 9) award("solar-system", 10);

  if (game.levels.some(l => l >= 5)) {
    award("first-auto", 3);
  }
}

function startHarvest(i) {
  if (i >= game.owned || game.ends[i]) return;

  game.ends[i] = Date.now() + duration(i) * 1000;

  save();
  render();
}

function processProduction() {
  const now = Date.now();
  let changed = false;
  let tutorialAdvanced = false;

  for (let i = 0; i < game.owned; i++) {
    const end = Number(game.ends[i]) || 0;
    const auto = game.levels[i] >= 5;
    const cycle = duration(i) * 1000;

    if (!end && auto) {
      game.ends[i] = now + cycle;
      changed = true;
      continue;
    }

    if (end && now >= end) {
      const cycles = auto
        ? Math.floor((now - end) / cycle) + 1
        : 1;

      game.stardust +=
        cycles * planets[i].output * game.levels[i];

      game.ends[i] = auto
        ? end + cycles * cycle
        : 0;

      changed = true;

      if (i === 0 && game.tutorial === 1) {
        game.tutorial = 2;
        tutorialAdvanced = true;
      }
    }
  }

  if (changed) {
    save();

    if (tutorialAdvanced || screen === "play") {
      render();
    } else {
      updateDisplay();
    }
  } else {
    updateDisplay();
  }
}

function buy(i) {
  if (
    i !== game.owned ||
    i >= planets.length ||
    game.stardust < planets[i].cost
  ) {
    return;
  }

  game.stardust -= planets[i].cost;
  game.owned++;
  game.levels[i] = 1;


if (i === 1 && game.tutorial === 3) {
  game.tutorial = 5;
}

  checkAchievements();

  game.announcement = {
    type: "unlock",
    id: i
  };

  previousScreen = "play";
  screen = "announcement";

  save();
  render();
}


function upgrade(i) {
  if (i >= game.owned || game.stardust < upgradeCost(i)) return;

  game.stardust -= upgradeCost(i);
  game.levels[i]++;

  // Advance the tutorial when the Sun reaches Level 2.
  if (i === 0 && game.levels[i] === 2 && game.tutorial === 2) {
    game.tutorial = 3;
  }

  // Active harvests continue until their cycle finishes.
  checkAchievements();

  game.announcement = {
    type: "level",
    id: i
  };

  previousScreen = "play";
  screen = "announcement";

  save();
  render();
}

app.addEventListener("click", event => {
  const button = event.target.closest("button[data-action]");

  if (!button || button.disabled) return;

  const action = button.dataset.action;
  const id = Number(button.dataset.id);

  if (action === "home") {
    screen = "home";
    render();
  }

  else if (["play", "collection", "map"].includes(action)) {
    screen = action;
    processProduction();
    render();
  }

  else if (action === "tutorial-next") {
    if (game.tutorial === 0) {
      game.tutorial = 1;
      save();
      render();
    }
  }

  else if (action === "tutorial-finish") {
    game.tutorial = 5;
    save();
    render();
  }

  else if (action === "harvest") {
    startHarvest(id);
  }

  else if (action === "buy") {
    buy(id);
  }

  else if (action === "upgrade") {
    upgrade(id);
  }

  else if (action === "continue") {
    game.announcement = null;
    screen = previousScreen;
    save();
    render();
  }

  else if (
    action === "boost" &&
    game.crystals >= 5 &&
    game.speedBoost < 3
  ) {
    game.crystals -= 5;
    game.speedBoost++;
    save();
    render();
  }
});

processProduction();
render();

setInterval(processProduction, 250);
