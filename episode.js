const episodeTitleElement = document.getElementById("episode-title");
const transcriptSection = document.getElementById("transcript-section");
const transcriptTemplate = document.getElementById("transcript-template");
const urlParams = new URLSearchParams(window.location.search);

const searchQuery = urlParams.get("search");
const episodeTitle = urlParams.get("title");
let player;

function loadYouTubePlayerAPI() {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

loadYouTubePlayerAPI();

function highlightSearchQuery(text, searchQuery) {
    if (!searchQuery) return text;
    const searchRegex = new RegExp(searchQuery, "gi");
    return text.replace(searchRegex, match => `<mark>${match}</mark>`);
}

function extractVideoId(link) {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/;
    const match = link.match(regex);
    return match ? match[1] : null;
}


async function loadEpisodeTranscript() {
    const episodeFile = new URLSearchParams(window.location.search).get("file");
    console.log("Episode File:", episodeFile);

    const response = await fetch(episodeFile);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const rawData = await response.text();
    console.log("Raw JSON data:", rawData);

    // Remove any potential BOM character
    const cleanedData = rawData.charCodeAt(0) === 0xFEFF ? rawData.slice(1) : rawData;

    const transcriptData = JSON.parse(cleanedData);
    console.log("Transcript data:", transcriptData); // Add this line

    const formattedTranscript = transcriptData.map(([transcript, start, end]) => {
        return {
            start: start,
            end: end,
            transcript: transcript
        };
    });

    displayEpisodeTranscript(formattedTranscript);
}



window.onYouTubeIframeAPIReady = function () {
    displayVideo();
};

function displayVideo() {
    const episodeLink = new URLSearchParams(window.location.search).get("link");
    const videoId = extractVideoId(episodeLink);

    if (videoId) {
        const videoContainer = document.getElementById("video-container");
        videoContainer.innerHTML = `<div id="player"></div>`;

        player = new YT.Player("player", {
            height: "500",
            width: "900",
            videoId: videoId,
            events: {
                "onReady": onPlayerReady
            }
        });
    }
}

function onPlayerReady(event) {
    event.target.playVideo();
}

function setVideoTimestamp(startTime) {
    const totalSeconds = timeStringToSeconds(startTime);

    if (player) {
        player.seekTo(totalSeconds, true);
    }
}

function timeStringToSeconds(timeString) {
    if (typeof timeString !== 'string') {
        return 0;
    }

    const [hours, minutes, seconds] = timeString.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
}

function displayEpisodeTranscript(transcript) {
    episodeTitleElement.textContent = episodeTitle;
    transcript.forEach(item => {
        const transcriptEntry = transcriptTemplate.content.cloneNode(true);
        const timestamp = transcriptEntry.querySelector(".timestamp");
        const content = transcriptEntry.querySelector(".content");
        const startSeconds = item.start;
        const endSeconds = item.end;
        timestamp.textContent = `${formatTime(startSeconds)} - ${formatTime(endSeconds)}`;
        timestamp.setAttribute("data-startTime", item.start); // Add this line
        timestamp.addEventListener("click", () => setVideoTimestamp(item.start));
        content.innerHTML = highlightSearchQuery(item.transcript, searchQuery);
        transcriptSection.appendChild(transcriptEntry);
    });

    if (searchQuery) {
        const firstMark = document.querySelector("mark");
        if (firstMark) {
            firstMark.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }
}

function formatTime(time) {
    if (typeof time === 'undefined') {
        return '';
    }

    const totalSeconds = parseFloat(time);
    return new Date(totalSeconds * 1000).toISOString().substr(11, 8);
}

transcriptSection.addEventListener("click", (event) => {
    const target = event.target;
    if (target.classList.contains("timestamp")) {
        const startTime = target.dataset.startTime;
        setVideoTimestamp(startTime);
    }
});


loadEpisodeTranscript();
displayVideo();
