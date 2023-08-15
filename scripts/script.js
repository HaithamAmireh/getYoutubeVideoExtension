const url = 'https://ytstream-download-youtube-videos.p.rapidapi.com/dl?id=';
const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': '6f335f07dfmsh1d2e866931fd32ap122d39jsn295e66eb0c55',
    'X-RapidAPI-Host': 'ytstream-download-youtube-videos.p.rapidapi.com'
  }
};
const fetchVideo = document.querySelector("#fetchVideo")

async function getVideo(key) {
  const response = await fetch(url + key, options)
  const data = await response.json()
  chrome.downloads.download({ url: data.adaptiveFormats[0].url, filename: String(data.title.replace(/[^a-zA-Z0-9]/g, "_")) + ".mp4" });
}

async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  const key = await extractYouTubeVideoId(tab.url)
  return key
}

function extractYouTubeVideoId(url) {
  const regex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  if (match && match[1]) {
    return match[1];
  } else {
    return null;
  }
}

fetchVideo.addEventListener("click", async () => {
  const videoId = await getCurrentTab()
  await getVideo(videoId)
})
