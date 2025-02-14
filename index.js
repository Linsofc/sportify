let currentSong = null;
let favoriteSongs = JSON.parse(localStorage.getItem("favoriteSongs")) || [];
const itemsPerPage = 5;
let currentPage = 1;
let isDarkTheme = false;
let captchaCode;

function generateCaptcha() {
  const canvas = document.getElementById("captchaCanvas");
  const context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);

  captchaCode = Math.random().toString(36).substring(2, 8);
  context.font = "30px Arial";
  context.fillStyle = "#000";
  context.fillText(captchaCode, 50, 35);
}

function validateCaptcha() {
  const userInput = document.getElementById("captchaInput").value;
  if (userInput === captchaCode) {
    document.getElementById("captchaModal").classList.add("hidden");
    document.getElementById("container").classList.remove("hidden");
  } else {
    alert("Captcha tidak sesuai. Silakan coba lagi.");
    generateCaptcha();
  }
}

document.addEventListener("DOMContentLoaded", function () {
  generateCaptcha();
  document.getElementById("captchaModal").classList.remove("hidden");
});

document.getElementById("themeToggle").addEventListener("click", () => {
  isDarkTheme = !isDarkTheme;
  document.body.classList.toggle("theme-dark", isDarkTheme);
  document
    .getElementById("themeIcon")
    .classList.toggle("fa-moon", !isDarkTheme);
  document.getElementById("themeIcon").classList.toggle("fa-sun", isDarkTheme);
});

document.getElementById("chatToggle").addEventListener("click", () => {
  document.getElementById("chatModal").classList.remove("hidden");
});

document.getElementById("sendButton").addEventListener("click", sendMessage);
document.getElementById("clearButton").addEventListener("click", clearChat);

async function sendMessage() {
  const chatInput = document.getElementById("chatInput").value;
  if (!chatInput) return;

  addChatMessage(chatInput, "user");
  let response = await getBotResponse(chatInput);
  addChatMessage(response, "bot");

  document.getElementById("chatInput").value = "";
}

async function getBotResponse(userMessage) {
  let _body = {
    messages: [
      {
        role: "system",
        content: `Hi! Saya adalah Lins AI menggunakan model Meta LLaMA. Saya dibuat oleh perusahaan bernama Lins Officiall. 
                Saya adalah Lins - MD, asisten bot yang bisa menyimpan nama Anda sebagai "Linsofc", berbicara dalam bahasa Indonesia, dan selalu berusaha membantu dengan cara yang ramah dan menyenangkan. Ayo ngobrol`,
      },
      {
        role: "user",
        content: userMessage,
      },
    ],
  };

  try {
    let response = await fetch(
      "https://aihub.xtermai.xyz/api/chat/gpt?key=Bell409",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(_body),
      }
    );

    let data = await response.json();
    if (data.status) {
      return data.response;
    } else {
      return "Maaf, saya tidak bisa memberikan jawaban saat ini.";
    }
  } catch (error) {
    console.error("Fetch error:", error);
    return "Terjadi kesalahan dalam mengambil respons.";
  }
}

function addChatMessage(message, sender) {
  const chatContainer = document.getElementById("chatContainer");
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("flex", "items-start", "mb-4");
  const avatar = document.createElement("div");
  avatar.classList.add("avatar", "bg-gray-300", "mr-2");
  avatar.textContent = sender === "user" ? "U" : "AI";
  const messageContent = document.createElement("div");
  messageContent.classList.add(
    "p-3",
    "rounded-lg",
    "bg-gray-200",
    "dark:bg-gray-600",
    "dark:text-white"
  );
  messageContent.textContent = message;
  messageDiv.appendChild(avatar);
  messageDiv.appendChild(messageContent);
  chatContainer.appendChild(messageDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function clearChat() {
  document.getElementById("chatContainer").innerHTML = "";
}

function closeChat() {
  document.getElementById("chatModal").classList.add("hidden");
}

function search() {
  const query = document.getElementById("searchInput").value;
  const url =
    "https://spotifyapi.caliphdev.com/api/search/tracks?q=" +
    encodeURIComponent(query);

  document.getElementById("loader").classList.remove("hidden");

  axios
    .get(url)
    .then((response) => {
      document.getElementById("loader").classList.add("hidden");
      const resultsDiv = document.getElementById("results");
      resultsDiv.innerHTML = "";

      response.data.forEach((song) => {
        const resultItem = document.createElement("div");
        resultItem.classList.add(
          "flex",
          "items-center",
          "bg-white",
          "rounded-lg",
          "shadow-md",
          "p-4",
          "mb-4",
          "dark:bg-gray-800"
        );

        const thumbnail = document.createElement("img");
        thumbnail.src = song.thumbnail;
        thumbnail.classList.add("w-24", "h-24", "mr-4");
        resultItem.appendChild(thumbnail);

        const songInfo = document.createElement("div");
        const title = document.createElement("h3");
        title.textContent = song.title;
        title.classList.add("text-lg", "font-bold", "mb-1");
        songInfo.appendChild(title);

        const artist = document.createElement("p");
        artist.textContent = `Artist: ${song.artist}`;
        artist.classList.add("text-gray-700", "mb-1", "dark:text-gray-300");
        songInfo.appendChild(artist);

        const album = document.createElement("p");
        album.textContent = `Album: ${song.album}`;
        album.classList.add("text-gray-700", "mb-1", "dark:text-gray-300");
        songInfo.appendChild(album);

        const previewBtn = document.createElement("button");
        previewBtn.innerHTML = '<i class="fas fa-play"></i> Preview';
        previewBtn.classList.add(
          "bg-blue-500",
          "text-white",
          "px-4",
          "py-2",
          "rounded",
          "hover:bg-blue-600",
          "focus:outline-none",
          "focus:ring",
          "focus:border-blue-300",
          "mr-4"
        );
        previewBtn.onclick = function () {
          openPreview(song);
        };
        songInfo.appendChild(previewBtn);

        resultItem.appendChild(songInfo);
        resultsDiv.appendChild(resultItem);
      });
    })
    .catch((error) => {
      document.getElementById("loader").classList.add("hidden");
      console.error("Terjadi kesalahan:", error);
    });
}

function openPreview(song) {
  currentSong = song;
  const modal = document.getElementById("previewModal");
  modal.classList.remove("hidden");

  document.getElementById("previewThumbnail").src = song.thumbnail;
  document.getElementById("previewTitle").textContent = song.title;
  document.getElementById(
    "previewArtist"
  ).textContent = `Artist: ${song.artist}`;
  document.getElementById("previewAlbum").textContent = `Album: ${song.album}`;

  const audioContainer = document.getElementById("previewAudioContainer");
  audioContainer.innerHTML = `
        <audio id="audioPlayer" controls autoplay class="w-full mb-4">
            <source src="https://spotifydl.nvlgroup.my.id/download?url=${song.url}" type="audio/mp3">
            Your browser does not support the audio element.
        </audio>
  `;

  const audioPlayer = document.getElementById("audioPlayer");
  audioPlayer.addEventListener("ended", playNextSong);

  document.getElementById(
    "previewDownload"
  ).href = `https://spotifyapi.caliphdev.com/api/download/track?url=${song.url}`;
}

function playNextSong() {
  const currentIndex = favoriteSongs.findIndex(
    (song) => song.url === currentSong.url
  );
  if (currentIndex !== -1 && currentIndex + 1 < favoriteSongs.length) {
    openPreview(favoriteSongs[currentIndex + 1]);
  } else {
    console.log("Tidak ada lagu berikutnya.");
  }
}

function closePreview() {
  const modal = document.getElementById("previewModal");
  modal.classList.add("hidden");
}

function saveToFavorites() {
  if (
    currentSong &&
    !favoriteSongs.some((song) => song.url === currentSong.url)
  ) {
    favoriteSongs.push(currentSong);
    localStorage.setItem("favoriteSongs", JSON.stringify(favoriteSongs));
    displayFavorites();
    closePreview();
  }
}

function displayFavorites() {
  const favoritesDiv = document.getElementById("favorites");
  favoritesDiv.innerHTML = "";

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const currentFavorites = favoriteSongs.slice(start, end);

  currentFavorites.forEach((song, index) => {
    const favoriteItem = document.createElement("div");
    favoriteItem.classList.add(
      "flex",
      "items-center",
      "bg-white",
      "rounded-lg",
      "shadow-md",
      "p-4",
      "mb-4",
      "dark:bg-gray-800"
    );

    const thumbnail = document.createElement("img");
    thumbnail.src = song.thumbnail;
    thumbnail.classList.add("w-24", "h-24", "mr-4");
    favoriteItem.appendChild(thumbnail);

    const songInfo = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = song.title;
    title.classList.add("text-lg", "font-bold", "mb-1");
    songInfo.appendChild(title);

    const artist = document.createElement("p");
    artist.textContent = `Artist: ${song.artist}`;
    artist.classList.add("text-gray-700", "mb-1", "dark:text-gray-300");
    songInfo.appendChild(artist);

    const album = document.createElement("p");
    album.textContent = `Album: ${song.album}`;
    album.classList.add("text-gray-700", "mb-1", "dark:text-gray-300");
    songInfo.appendChild(album);

    const playBtn = document.createElement("button");
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
    playBtn.classList.add(
      "bg-green-500",
      "text-white",
      "px-4",
      "py-2",
      "rounded",
      "hover:bg-green-600",
      "focus:outline-none",
      "focus:ring",
      "focus:border-green-300",
      "mr-2"
    );
    playBtn.onclick = function () {
      openPreview(song);
    };
    songInfo.appendChild(playBtn);

    const removeBtn = document.createElement("button");
    removeBtn.innerHTML = '<i class="fas fa-trash"></i>';
    removeBtn.classList.add(
      "bg-red-500",
      "text-white",
      "px-4",
      "py-2",
      "rounded",
      "hover:bg-red-600",
      "focus:outline-none",
      "focus:ring",
      "focus:border-red-300"
    );
    removeBtn.onclick = function () {
      removeFromFavorites(start + index);
    };
    songInfo.appendChild(removeBtn);

    favoriteItem.appendChild(songInfo);
    favoritesDiv.appendChild(favoriteItem);
  });

  renderPagination();
}

function removeFromFavorites(index) {
  Swal.fire({
    title: "Apakah anda yakin menghapus lagu ini?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Hapus",
    cancelButtonText: "Batal",
  }).then((result) => {
    if (result.isConfirmed) {
      favoriteSongs.splice(index, 1);
      localStorage.setItem("favoriteSongs", JSON.stringify(favoriteSongs));
      displayFavorites();
    }
  });
}

function renderPagination() {
  const paginationDiv = document.getElementById("pagination");
  paginationDiv.innerHTML = "";

  const totalPages = Math.ceil(favoriteSongs.length / itemsPerPage);
  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = document.createElement("button");
    pageBtn.textContent = i;
    pageBtn.classList.add(
      "mx-1",
      "px-3",
      "py-1",
      "rounded",
      "border",
      "focus:outline-none",
      "focus:ring"
    );
    if (i === currentPage) {
      pageBtn.classList.add("bg-blue-500", "text-white", "border-blue-500");
    } else {
      pageBtn.classList.add(
        "bg-gray-200",
        "text-gray-700",
        "border-gray-300",
        "hover:bg-gray-300",
        "hover:text-gray-700",
        "hover:border-gray-400"
      );
    }
    pageBtn.onclick = function () {
      currentPage = i;
      displayFavorites();
    };
    paginationDiv.appendChild(pageBtn);
  }
}

displayFavorites();

function updateNotification(song) {
  if (Notification.permission === "granted") {
    new Notification(`${song.title} - ${song.artist}`, {
      body: "• Spotify Linsofc",
      icon: song.thumbnail,
    });
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        updateNotification(song);
      }
    });
  }
}

document.addEventListener(
  "play",
  function (e) {
    const audioElements = document.getElementsByTagName("audio");
    for (let i = 0; i < audioElements.length; i++) {
      if (audioElements[i] !== e.target) {
        audioElements[i].pause();
      }
    }
    if (currentSong) updateNotification(currentSong);
  },
  true
);

displayFavorites();
