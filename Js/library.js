
// =====================================
// NOVEL HAVEN - LIBRARY.JS
// =====================================

let activeGenre = "All";
let savedOnly = false;

let saved = JSON.parse(
    localStorage.getItem("savedNovels") || "[]"
);

// =====================================
// HOMEPAGE SECTIONS
// =====================================

function createHomepageSections() {
    const home = document.getElementById("home");

    if (!home || document.getElementById("homeHighlights")) return;

    const highlights = document.createElement("div");
    highlights.id = "homeHighlights";

    highlights.innerHTML = `
        <section class="featured-section">
            <h2>Featured Novel</h2>
            <div id="featuredNovel"></div>
        </section>

        <section class="recommended-section">
            <h2>Recommended for You</h2>
            <div id="recommendedGrid" class="book-grid"></div>
        </section>

        <section class="continue-section">
            <h2>Continue Reading</h2>
            <div id="continueGrid" class="book-grid"></div>
        </section>
    `;

    const firstSection = home.querySelector("section");

    if (firstSection) {
        firstSection.before(highlights);
    } else {
        home.appendChild(highlights);
    }
}

// =====================================
// FEATURED NOVEL
// =====================================

function renderFeatured() {
    const container = document.getElementById("featuredNovel");

    if (!container || novels.length === 0) return;

    const novel = novels[0];

    container.innerHTML = `
        <div class="featured-card">
            <div class="featured-info">
                <span>FEATURED STORY</span>
                <h3>${novel.title}</h3>
                <p>By ${novel.author}</p>
                <button onclick="openNovel(${novel.id})">
                    Read Featured Novel
                </button>
            </div>
        </div>
    `;
}

// =====================================
// RECOMMENDED NOVELS
// =====================================

function renderRecommended() {
    const container = document.getElementById("recommendedGrid");

    if (!container) return;

    const coverSymbols = {
        Fantasy: "🏰",
        Romance: "🌹",
        Action: "⚔️",
        Mystery: "🔍",
        Werewolf: "🐺",
        "Sci-Fi": "🚀",
        Horror: "👻",
        Adventure: "🧭",
        Cultivation: "🐉",
        Comedy: "😂"
    };

    container.innerHTML = novels.slice(0, 4).map(novel => `
        <div class="book">
            <div class="cover cover-${novel.id}">
                <span class="cover-symbol">
                    ${coverSymbols[novel.genre] || "📖"}
                </span>
                <small>${novel.genre}</small>
                <h3>${novel.title}</h3>
                <span class="cover-author">
                    BY ${novel.author.toUpperCase()}
                </span>
            </div>

            <h3>${novel.title}</h3>
            <p>By ${novel.author}</p>

            <button onclick="openNovel(${novel.id})">
                Read Now
            </button>
        </div>
    `).join("");
}

// =====================================
// CONTINUE READING
// =====================================

function renderContinueReading() {
    const container = document.getElementById("continueGrid");

    if (!container) return;

    const progress = JSON.parse(
        localStorage.getItem("readingProgress") || "{}"
    );

    const readingNovels = novels.filter(
        novel => progress[novel.id]
    );

    if (readingNovels.length === 0) {
        container.innerHTML = `
            <p class="empty">
                Your reading journey starts here.
                Open a novel to see it here!
            </p>
        `;
        return;
    }

    container.innerHTML = readingNovels.map(novel => {
        const chapterIndex = progress[novel.id].chapter || 0;

        return `
            <div class="book">
                <div class="cover cover-${novel.id}">
                    <h3>${novel.title}</h3>
                </div>

                <h3>${novel.title}</h3>
                <p>Chapter ${chapterIndex + 1}</p>

                <button onclick="openNovel(${novel.id})">
                    Continue Reading
                </button>
            </div>
        `;
    }).join("");
}

// =====================================
// GENRES
// =====================================

function renderGenres() {
    const genres = [
        "All",
        ...new Set(novels.map(novel => novel.genre))
    ];

    const container = document.getElementById("genres");

    if (!container) return;

    container.innerHTML = genres.map(genre => `
        <button
            class="genre ${activeGenre === genre ? "active" : ""}"
            onclick="selectGenre('${genre}')">
            ${genre}
        </button>
    `).join("");
}

function selectGenre(genre) {
    activeGenre = genre;
    savedOnly = false;

    renderGenres();
    renderBooks();
}

// =====================================
// DISCOVER AND SEARCH NOVELS
// =====================================

function renderBooks() {
    const query = document
        .getElementById("search")
        .value.toLowerCase();

    const filtered = novels.filter(novel => {
        const matchesGenre =
            activeGenre === "All" ||
            novel.genre === activeGenre;

        const matchesSaved =
            !savedOnly || saved.includes(novel.id);

        const matchesSearch =
            novel.title.toLowerCase().includes(query) ||
            novel.author.toLowerCase().includes(query) ||
            novel.genre.toLowerCase().includes(query);

        return matchesGenre && matchesSaved && matchesSearch;
    });

    document.getElementById("bookHeading").textContent =
        savedOnly ? "My Saved Novels" : "Discover Novels";

    const grid = document.getElementById("bookGrid");

    if (filtered.length === 0) {
        grid.innerHTML = `
            <p class="empty">No novels found.</p>
        `;
        return;
    }

    const coverSymbols = {
        Fantasy: "🏰",
        Romance: "🌹",
        Action: "⚔️",
        Mystery: "🔍",
        Werewolf: "🐺",
        "Sci-Fi": "🚀",
        Horror: "👻",
        Adventure: "🧭",
        Cultivation: "🐉",
        Comedy: "😂"
    };

    grid.innerHTML = filtered.map(novel => `
        <div class="book">

            <div class="cover cover-${novel.id}">
                <span class="cover-symbol">
                    ${coverSymbols[novel.genre] || "📖"}
                </span>

                <small>${novel.genre}</small>

                <h3>${novel.title}</h3>

                <span class="cover-author">
                    BY ${novel.author.toUpperCase()}
                </span>
            </div>

            <h3>${novel.title}</h3>

            <p>By ${novel.author}</p>

            <div class="book-actions">

                <button onclick="openNovel(${novel.id})">
                    Read
                </button>

                <button
                    class="save"
                    onclick="toggleSave(${novel.id})">

                    ${saved.includes(novel.id) ? "♥ Saved" : "♡ Save"}

                </button>

            </div>
        </div>
    `).join("");
}

// =====================================
// SAVE AND UNSAVE NOVELS
// =====================================

function toggleSave(id) {
    if (saved.includes(id)) {
        saved = saved.filter(savedId => savedId !== id);
    } else {
        saved.push(id);
    }

    localStorage.setItem(
        "savedNovels",
        JSON.stringify(saved)
    );

    renderBooks();
}

function showSaved() {
    savedOnly = true;
    activeGenre = "All";

    renderGenres();
    renderBooks();
}

// =====================================
// OPEN NOVEL DETAILS
// =====================================

function openNovel(id) {
    const novel = novels.find(item => item.id === id);

    if (!novel) return;

    const home = document.getElementById("home");
    const details = document.getElementById("details");

    home.style.display = "none";
    details.style.display = "block";

    renderDetails(novel);

    window.scrollTo(0, 0);
}

// =====================================
// DISPLAY NOVEL DETAILS
// =====================================

function renderDetails(novel) {
    document.getElementById("detailTitle").textContent =
        novel.title;

    document.getElementById("detailAuthor").textContent =
        "By " + novel.author;

    document.getElementById("detailGenre").textContent =
        novel.genre;

    document.getElementById("detailSynopsis").textContent =
        novel.synopsis;

    const chapterList = document.getElementById("chapterList");

    chapterList.innerHTML = novel.chapters.map((chapter, index) => `
        <button onclick="readChapter(${novel.id}, ${index})">
            Chapter ${index + 1}: ${chapter.title}
        </button>
    `).join("");
}

// =====================================
// CLOSE NOVEL DETAILS
// =====================================

function closeDetails() {
    document.getElementById("details").style.display = "none";
    document.getElementById("home").style.display = "block";

    renderBooks();
    renderContinueReading();

    window.scrollTo(0, 0);
}

// =====================================
// SEARCH LISTENER
// =====================================

document.getElementById("search").addEventListener(
    "input",
    renderBooks
);

// =====================================
// START WEBSITE
// =====================================

createHomepageSections();
renderFeatured();
renderRecommended();
renderContinueReading();
renderGenres();
renderBooks();
        
