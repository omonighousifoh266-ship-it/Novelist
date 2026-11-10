
// LIBRARY SETTINGS

const genreList = [
    "All", "Romance", "Fantasy", "Werewolf",
    "Vampire", "Action", "Adventure", "Mystery",
    "Horror", "Sci-Fi", "Cultivation", "Comedy",
    "Drama", "Historical"
];

let activeGenre = "All";
let savedOnly = false;

let saved = JSON.parse(
    localStorage.getItem("savedNovels") || "[]"
);


// HOMEPAGE SECTIONS

function createHomepageSections() {
    const home = document.getElementById("home");
    const firstSection = home.querySelector("section");

    if (document.getElementById("homeHighlights")) return;

    const highlights = document.createElement("div");
    highlights.id = "homeHighlights";

    highlights.innerHTML = `
        <section class="featured-section">
            <h2>Featured Novel</h2>
            <div id="featuredNovel"></div>
        </section>

        <section>
            <h2>Recommended for You</h2>
            <div class="book-grid" id="recommendedGrid"></div>
        </section>

        <section>
            <h2>Continue Reading</h2>
            <div class="book-grid" id="continueGrid"></div>
        </section>
    `;

    firstSection.before(highlights);
}


// FEATURED NOVEL

function renderFeatured() {
    const container = document.getElementById("featuredNovel");
    const novel = novels[0];

    if (!novel) {
        container.innerHTML = "<p>No featured novel yet.</p>";
        return;
    }

    container.innerHTML = `
        <div class="book featured-book">
            <div class="cover ${novel.style}">
                <small>${novel.genre}</small>
                <h2>${novel.title}</h2>
            </div>

            <h3>${novel.title}</h3>
            <p>By ${novel.author}</p>

            <button onclick="openNovel(${novel.id})">
                Read Featured Novel
            </button>
        </div>
    `;
}


// RECOMMENDED NOVELS

function renderRecommended() {
    const container = document.getElementById("recommendedGrid");

    const recommendations = novels.slice(0, 4);

    container.innerHTML = recommendations.map(novel => `
        <div class="book">
            <div class="cover ${novel.style}">
                <small>${novel.genre}</small>
                <h3>${novel.title}</h3>
            </div>

            <h3>${novel.title}</h3>
            <p>By ${novel.author}</p>

            <button onclick="openNovel(${novel.id})">
                Read Now
            </button>
        </div>
    `).join("");
}


// CONTINUE READING

function renderContinueReading() {
    const container = document.getElementById("continueGrid");

    const progress = JSON.parse(
        localStorage.getItem("readingProgress") || "{}"
    );

    const startedNovels = novels.filter(
        novel => progress[novel.id] !== undefined
    );

    if (startedNovels.length === 0) {
        container.innerHTML = `
            <p class="empty">
                Your reading journey starts here.
                Open a novel and begin reading!
            </p>
        `;
        return;
    }

    container.innerHTML = startedNovels.map(novel => {
        const chapterIndex = progress[novel.id].chapter || 0;
        const chapter = novel.chapters[chapterIndex];

        return `
            <div class="book">
                <div class="cover ${novel.style}">
                    <small>${novel.genre}</small>
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


// DISPLAY GENRES

function renderGenres() {
    const container = document.getElementById("genres");

    container.innerHTML = genreList.map(genre => `
        <button
            class="genre ${activeGenre === genre ? "active" : ""}"
            onclick="selectGenre('${genre}')">
            ${genre}
        </button>
    `).join("");
}


// SELECT GENRE

function selectGenre(genre) {
    activeGenre = genre;
    savedOnly = false;

    renderGenres();
    renderBooks();
}


// DISPLAY NOVELS

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

    grid.innerHTML = filtered.map(novel => `
        <div class="book">

            <div class="cover ${novel.style}">
                <small>${novel.genre}</small>
                <h3>${novel.title}</h3>
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


// SAVE OR REMOVE A NOVEL

function toggleSave(id) {

    if (saved.includes(id)) {
        saved = saved.filter(item => item !== id);
    } else {
        saved.push(id);
    }

    localStorage.setItem(
        "savedNovels",
        JSON.stringify(saved)
    );

    renderBooks();
}


// SHOW SAVED NOVELS

function showSaved() {
    savedOnly = true;
    activeGenre = "All";

    renderGenres();
    renderBooks();

    window.scrollTo(0, 0);
}


// OPEN NOVEL DETAILS

function openNovel(id) {
    currentNovel = novels.find(
        novel => novel.id === id
    );

    if (!currentNovel) return;

    document.getElementById("home").style.display = "none";
    document.getElementById("reader").style.display = "none";
    document.getElementById("details").style.display = "block";

    renderDetails();

    window.scrollTo(0, 0);
}


// DISPLAY NOVEL DETAILS

function renderDetails() {

    document.getElementById("detailTitle").textContent =
        currentNovel.title;

    document.getElementById("detailName").textContent =
        currentNovel.title;

    document.getElementById("detailAuthor").textContent =
        "Written by " + currentNovel.author;

    document.getElementById("detailGenre").textContent =
        currentNovel.genre;

    document.getElementById("detailSynopsis").textContent =
        currentNovel.synopsis;

    const cover = document.getElementById("detailCover");

    cover.className = "cover " + currentNovel.style;

    const list = document.getElementById("chapterList");

    list.innerHTML = currentNovel.chapters.map(
        (chapter, index) => `
            <div class="chapter-item"
                onclick="readChapter(${index})">

                Chapter ${index + 1}: ${chapter.title}

                <small>Tap to start reading →</small>

            </div>
        `
    ).join("");
}


// RETURN TO LIBRARY

function closeDetails() {

    document.getElementById("details").style.display = "none";
    document.getElementById("home").style.display = "block";

    window.scrollTo(0, 0);
}


// START LIBRARY

createHomepageSections();
renderFeatured();
renderRecommended();
renderContinueReading();
renderGenres();
renderBooks();
