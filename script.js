let idolCount = 0;
let stars = 100;
const idols = [
    {
        name: "Nova",
        rarity: "RARE",
        icon: "🌟",
        description: "A mysterious idol born from the light of a distant star."
    },
    {
        name: "Luna",
        rarity: "COMMON",
        icon: "🌙",
        description: "A calm idol who watches over the universe at night."
    },
    {
        name: "Comet",
        rarity: "COMMON",
        icon: "☄️",
        description: "A fast-moving idol who travels across the galaxy."
    }
];
function playGame() {
    document.querySelector(".home-screen").innerHTML = `
        <div class="game-screen">

            <h1>🌌 COSMIC IDOLS</h1>

            <p class="game-subtitle">
                Welcome, Cosmic Collector
            </p>

            <div class="game-stats">

                <div class="stat">
                    <div class="stat-title">⭐ STARS</div>
                    <div class="stat-value" id="starsCount">100</div>
                </div>

                <div class="stat">
                    <div class="stat-title">💎 CRYSTALS</div>
                    <div class="stat-value">25</div>
                </div>

                <div class="stat">
                    <div class="stat-title">🌌 IDOLS</div>
                    <div class="stat-value" id="idolCount">0</div>
                </div>

            </div>

            <div class="collect-area">

                <h2>✨ SUMMON A COSMIC IDOL</h2>

                <p>
                    Use your stars to discover a new idol
                    somewhere in the universe.
                </p>

                <button class="summon-button" id="summonButton">
                    ✨ SUMMON
                </button>

            </div>

            <button class="back-button" id="backButton">
                ← BACK TO HOME
            </button>

        </div>
    `;

    document
        .getElementById("backButton")
        .addEventListener("click", goHome);

    document
        .getElementById("summonButton")
        .addEventListener("click", summonIdol);
}


function summonIdol() {
    if (stars < 10) {
    alert("⭐ You don't have enough stars!");
    return;
}
    idolCount++;
    stars -= 10;
const randomIndex = Math.floor(Math.random() * idols.length);
const idol = idols[randomIndex];
    const collectArea = document.querySelector(".collect-area");

    collectArea.innerHTML = `
    <div class="idol-card">

<div class="idol-icon">${idol.icon}</div>

<h2>${idol.name}</h2>

<p class="idol-rarity">★ ${idol.rarity} ★</p>

<p>
    ${idol.description}
</p>

    </div>

    <button class="summon-button" id="summonButton">
        ✨ SUMMON AGAIN
    </button>
`;
document.getElementById("idolCount").textContent = idolCount;
document.getElementById("starsCount").textContent = stars;

document
    .getElementById("summonButton")
    .addEventListener("click", summonIdol);
}


function openCollection() {
    alert("⭐ Your collection will appear here!");
}


function openGalaxyMap() {
    alert("🌌 The galaxy map will appear here!");
}


function goHome() {
    location.reload();
}


document
    .getElementById("playButton")
    .addEventListener("click", playGame);

document
    .getElementById("collectionButton")
    .addEventListener("click", openCollection);

document
    .getElementById("galaxyButton")
    .addEventListener("click", openGalaxyMap);