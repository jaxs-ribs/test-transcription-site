const searchBox = document.getElementById("search-box");
const episodeList = document.getElementById("episode-list");
const episodeLinkTemplate = document.getElementById("episode-link-template");
let episodes = [];

async function loadEpisodes() {
    try {
        const response = await fetch("list.json");

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const rawData = await response.text();
        console.log("Raw JSON data:", rawData);

        // Remove any potential BOM character
        const cleanedData = rawData.charCodeAt(0) === 0xFEFF ? rawData.slice(1) : rawData;

        const episodeData = JSON.parse(cleanedData);

        const episodePromises = episodeData.map(async ([file, title, link]) => {
            const response = await fetch(file);
            const data = await response.json();
            const episode = {
                title: title,
                file: file,
                transcript: data,
                link: link
            };
            return episode;
        });


        episodes = await Promise.all(episodePromises);
        displayEpisodes();
    } catch (error) {
        console.error("Error loading episodes:", error);
    }
}

function displayEpisodes() {
    episodeList.innerHTML = "";
    const searchQuery = searchBox.value.trim().toLowerCase();
    episodes.forEach(episode => {
        const title = episode.title.toLowerCase();
        if (!searchQuery || title.includes(searchQuery)) {
            const episodeElement = episodeLinkTemplate.content.cloneNode(true);
            const episodeLink = episodeElement.querySelector(".episode-link");
            episodeLink.href = `episode.html?title=${encodeURIComponent(episode.title)}&file=${encodeURIComponent(episode.file)}&link=${encodeURIComponent(episode.link)}&search=${encodeURIComponent(searchQuery)}`;
            episodeLink.textContent = episode.title;
            episodeLink.target = "_blank"; // Add this line
            episodeList.appendChild(episodeElement);
        }
    });
}


function filterEpisodes() {
    const query = searchBox.value.toLowerCase();
    const episodeLinks = episodeList.querySelectorAll(".episode-link");
    episodeLinks.forEach(link => {
        const title = link.textContent.toLowerCase();
        const episode = episodes.find(episode => episode.title.toLowerCase() === title);
        const transcript = episode.transcript;
        const transcriptString = JSON.stringify(transcript).toLowerCase();
        const isVisible = transcriptString.includes(query);
        link.style.display = isVisible ? "block" : "none";
        if (isVisible) {
            link.href = `episode.html?title=${encodeURIComponent(episode.title)}&file=${encodeURIComponent(episode.file)}&search=${encodeURIComponent(query)}`;
        }
    });
}

function storeSearchInput() {
    sessionStorage.setItem("searchInput", searchBox.value);
}

function handleNavigation() {
    const storedSearchInput = sessionStorage.getItem("searchInput");
    if (storedSearchInput) {
        searchBox.value = storedSearchInput;
    }
    displayEpisodes();
    filterEpisodes();
}


function init() {
    loadEpisodes();
    searchBox.addEventListener("input", filterEpisodes);

    function handleNavigation() {
        displayEpisodes();
    }

    window.addEventListener("pageshow", handleNavigation);
    window.addEventListener("popstate", handleNavigation);
}

document.addEventListener("DOMContentLoaded", init);
window.addEventListener("beforeunload", storeSearchInput);




