// READER SETTINGS

let currentNovel = null;
let currentChapter = 0;
let fontSize = 18;


// OPEN A CHAPTER

function readChapter(index) {

    currentChapter = index;

    document.getElementById("details").style.display = "none";
    document.getElementById("reader").style.display = "block";

    renderChapter();

    window.scrollTo(0, 0);
}


// DISPLAY CHAPTER CONTENT

function renderChapter() {

    if (!currentNovel) return;

    const chapter = currentNovel.chapters[currentChapter];

    document.getElementById("readerTitle").textContent =
        currentNovel.title;

    document.getElementById("chapterLabel").textContent =
        `Chapter ${currentChapter + 1}: ${chapter.title}`;

    document.getElementById("chapterText").textContent =
        chapter.text;

    document.getElementById("chapterText").style.fontSize =
        fontSize + "px";

    // PREVIOUS CHAPTER BUTTON

    document.getElementById("previous").disabled =
        currentChapter === 0;

    // NEXT CHAPTER BUTTON

    document.getElementById("next").disabled =
        currentChapter === currentNovel.chapters.length - 1;
}


// MOVE BETWEEN CHAPTERS

function changeChapter(direction) {

    const nextChapter = currentChapter + direction;

    if (
        nextChapter >= 0 &&
        nextChapter < currentNovel.chapters.length
    ) {

        currentChapter = nextChapter;

        renderChapter();

        window.scrollTo(0, 0);
    }
}


// CHANGE READING FONT SIZE

function changeFont(amount) {

    fontSize += amount;

    // Minimum font size: 14px
    // Maximum font size: 28px

    fontSize = Math.max(14, Math.min(28, fontSize));

    document.getElementById("chapterText").style.fontSize =
        fontSize + "px";
}


// RETURN TO NOVEL DETAILS

function closeReader() {

    document.getElementById("reader").style.display = "none";
    document.getElementById("details").style.display = "block";

    window.scrollTo(0, 0);
}
