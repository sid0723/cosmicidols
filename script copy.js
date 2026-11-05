let stars = Number(localStorage.getItem("cosmicStars") ?? 100);

let collection = JSON.parse(
    localStorage.getItem("cosmicCollection") || "{}"
);

let idolCount = Object.keys(collection).length;

function saveGame() {
    localStorage.setItem("cosmicStars", stars);
    localStorage.setItem("cosmicCollection", JSON.stringify(collection));
}


const idols = [
    {
        name: "The Moon",
        rarity: "COMMON",
        icon: "🌕",
        description: "Earth's only natural moon. Its gravity helps produce ocean tides."
    },
    {
        name: "Mars",
        rarity: "COMMON",
        icon: "🔴",
        description: "The fourth planet from the Sun. Iron oxide gives Mars its reddish appearance."
    },
    {
        name: "Saturn",
        rarity: "RARE",
        icon: "🪐",
        description: "The sixth planet from the Sun, famous for its rings made mostly of icy particles."
    },
    {
        name: "The Orion Nebula",
        rarity: "EPIC",
        icon: "🌌",
        description: "A star-forming region approximately 1,350 light-years from Earth."
    },
    {
        name: "The Crab Pulsar",
        rarity: "LEGENDARY",
        icon: "✨",
        description: "A rapidly rotating neutron star at the center of the Crab Nebula."
    }
];

function playGame() {
    document.querySelector(".home-screen").innerHTML = `
        <div class="game-screen">


<h1>🌌 COSMIC IDOLS</h1>

<div class="cosmo-container">

<div class="cosmo-speech">
    <img src="images/cosmo.png"
         alt="Cosmo"
         class="cosmo-avatar">

    <p class="cosmo-dialogue" id="cosmoDialogue">
        Welcome back, Explorer! Spend 10 stardust to discover
        a celestial wonder!
    </p>
</div>

</div>

<div class="game-stats">

    <div class="stat">

<div class="stat-title">✨ STARDUST</div>

        <div class="stat-value" id="starsCount">${stars}</div>
    </div>

    <div class="stat">
        <div class="stat-title">💎 CRYSTALS</div>
        <div class="stat-value">25</div>
    </div>

    <div class="stat">
        <div class="stat-title">🌌 IDOLS</div>
        <div class="stat-value" id="idolCount">${idolCount}</div>
    </div>

</div>


            <div class="collect-area">

                <h2>✨ SUMMON A COSMIC IDOL</h2>

                <p>

Spend 10 Stardust to discover a real celestial object
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
    alert("✨ You don't have enough stardust!");
    return;
}
stars -= 10;

const chance = Math.random() * 100;

let selectedRarity;

if (chance < 55) {
    selectedRarity = "COMMON";
} else if (chance < 85) {
    selectedRarity = "RARE";
} else if (chance < 97) {
    selectedRarity = "EPIC";
} else {
    selectedRarity = "LEGENDARY";
}

const possibleIdols = idols.filter(
    idol => idol.rarity === selectedRarity
);

const randomIndex = Math.floor(
    Math.random() * possibleIdols.length
);

const idol = possibleIdols[randomIndex];

if (collection[idol.name]) {
    collection[idol.name]++;
} else {
    collection[idol.name] = 1;
}

const idolLevel = collection[idol.name];

idolCount = Object.keys(collection).length;
document.getElementById("idolCount").textContent = idolCount;
document.getElementById("starsCount").textContent = stars;

idolCount = Object.keys(collection).length;
document.getElementById("idolCount").textContent = idolCount;
document.getElementById("starsCount").textContent = stars;

saveGame();

showDiscoveryAnnouncement(idol, idolLevel);
return;

showDiscoveryAnnouncement(idol, idolLevel);
return;

    const collectArea = document.querySelector(".collect-area");

    collectArea.innerHTML = `
    <div class="idol-card">

<div class="idol-icon">${idol.icon}</div>

<h2>${idol.name}</h2>

<p>LEVEL ${idolLevel}</p>

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


if (idolLevel > 1) {
    document.getElementById("cosmoDialogue").textContent =
        `Congratulations! ${idol.name} leveled up to Level ${idolLevel}!`;
} else {
    document.getElementById("cosmoDialogue").textContent =
        `Amazing discovery! You found ${idol.name}! Let's learn more about it!`;
}


document
    .getElementById("summonButton")
    .addEventListener("click", summonIdol);
}


function showDiscoveryAnnouncement(idol, idolLevel) {
    const isLevelUp = idolLevel > 1;
    const collectArea = document.querySelector(".collect-area");

document.querySelector(".game-screen > .cosmo-container").style.display = "none";

    collectArea.innerHTML = `
        <div class="discovery-announcement">

            <h2 class="announcement-title">
                ${isLevelUp ? "🌟 LEVEL UP!" : "✨ NEW DISCOVERY!"}
            </h2>

            <div class="idol-icon">${idol.icon}</div>

            <h2>${idol.name}</h2>

            <p class="idol-rarity">
                ${idol.rarity}
            </p>

            <p class="announcement-level">
                ${isLevelUp
                    ? `Level ${idolLevel - 1} → Level ${idolLevel}`
                    : "Level 1"}
            </p>

            <div class="cosmo-speech">
                <img src="images/cosmo.png"
                     alt="Cosmo"
                     class="cosmo-avatar">

                <p class="cosmo-dialogue">
                    ${isLevelUp
                        ? `Congratulations! ${idol.name} leveled up!`
                        : `Amazing! You discovered ${idol.name}!`}
                </p>
            </div>

            <button class="summon-button" id="continueButton">
                CONTINUE
            </button>

        </div>
    `;


document.getElementById("continueButton")
    .addEventListener("click", () => {
        playGame();
        document.getElementById("idolCount").textContent = idolCount;
        document.getElementById("starsCount").textContent = stars;
    });

}


function openCollection() {
    const collectedNames = Object.keys(collection);

    let collectionHTML = "";

    if (collectedNames.length === 0) {
        collectionHTML = `
            <p>You haven't discovered any celestial objects yet!</p>
            <p>Visit the Play screen to begin exploring.</p>
        `;
    } else {
        collectedNames.forEach(name => {
            const idol = idols.find(item => item.name === name);

            collectionHTML += `
                <div class="idol-card">
                    <div class="idol-icon">${idol.icon}</div>

                    <h2>${idol.name}</h2>

                    <p class="idol-rarity rarity-${idol.rarity.toLowerCase()}">
                        ${idol.rarity}
                    </p>

                    <p>LEVEL ${collection[name]}</p>

                    <p>${idol.description}</p>
                </div>
            `;
        });
    }

    document.querySelector(".home-screen").innerHTML = `
        <div class="game-screen">
            <h1>⭐ YOUR COLLECTION</h1>

            <div class="collection-grid">
                ${collectionHTML}
            </div>

            <button class="back-button" id="backButton">
                ← BACK TO HOME
            </button>
        </div>
    `;

    document.getElementById("backButton")
        .addEventListener("click", goHome);
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