document.title = "Aidan Byrnes";

const el = {
  about: document.getElementById("about-container"),
  aboutSpan: document.getElementById("about-span"),
  menuSpan: document.getElementById("mobile-menu"),
  footer: document.getElementById("footer"),
  vidDesc: document.getElementById("vid-desc"),
  vidDescText: document.getElementById("vid-desc-text"),
  video: document.getElementById("videoPlayer"),
  videoWrapper: document.getElementById("canvas-clip"),
  unmuteMsg: document.getElementById("mute-msg"),
  loader: document.getElementById("loader-container"),
  dotsContainer: document.getElementById("dots"),
  nameSpan: document.getElementById("name-span"),
};
const unmuteGraphic = el.unmuteMsg.firstChild;

const state = {
  aboutOpen: false,
  currentIndex: -1,
};

videos.forEach((_, i) => {
  const dot = document.createElement("div");
  dot.className = "dot";
  dot.appendChild(document.createElement("div"));
  dot.onclick = () => videoLoad(i);
  el.dotsContainer.appendChild(dot);
});
const dots = document.getElementsByClassName("dot");

function toggleAbout() {
  state.aboutOpen ? hideAbout() : showAbout();
}

function showAbout() {
  //audio.volume = 0.005;
  el.about.style.display = "block";
  setActive(el.aboutSpan, true);
  setActive(el.menuSpan, true);
  el.footer.style.marginTop = "auto";
  el.vidDesc.style.display = "none";
  el.unmuteMsg.style.display = "none";
  window.location.hash = "about";
  backgroundObscure();
  state.aboutOpen = true;
}

function hideAbout() {
  //audio.volume = 0.01;
  el.about.style.display = "none";
  setActive(el.aboutSpan, false);
  setActive(el.menuSpan, false);
  el.footer.style.marginTop = null;
  el.vidDesc.style.display = null;
  el.unmuteMsg.style.display = null;

  window.location.hash = "";
  if (typeof window.history.replaceState === "function") {
    history.replaceState({}, "", window.location.pathname + window.location.search);
  }

  backgroundShow();
  state.aboutOpen = false;
}

function setActive(target, active) {
  target.style.textDecoration = active ? "line-through" : "none";
  target.style.opacity = active ? "100%" : null;
}

function backgroundShow() {
  el.videoWrapper.style.opacity = "100%";
  el.videoWrapper.style.filter = "none";
}

function backgroundObscure() {
  el.videoWrapper.style.filter = "blur(40px)";
  el.videoWrapper.style.opacity = "30%";
}

el.aboutSpan.addEventListener("click", toggleAbout);
el.menuSpan.addEventListener("click", toggleAbout);
el.nameSpan.addEventListener("click", hideAbout);

if (window.location.hash === "#about") showAbout();

window.addEventListener("popstate", () => {
  window.location.hash === "#about" ? showAbout() : hideAbout();
});

function muteVid() {
  el.video.muted = true;
  el.video.style.filter = "blur(10px) brightness(0.9)";
  unmuteGraphic.style.display = null;
}

function unmuteVid() {
  el.video.muted = false;
  el.video.style.filter = null;
  unmuteGraphic.style.display = "none";
}

muteVid();

el.unmuteMsg.addEventListener("click", unmuteVid);

document.body.addEventListener("click", (event) => {
  if (event.target !== document.body) return;
  if (state.aboutOpen) hideAbout();
  else el.video.muted ? unmuteVid() : muteVid();
});

function videoLoad(index) {
  if (state.currentIndex === index) return;
  state.currentIndex = index;

  const v = videos[index];
  el.video.src = "video/" + v.src;
  el.video.load();
  el.video.play();

  el.vidDescText.innerHTML = v.desc == null
    ? "<br><br>" + v.title
    : v.title + "<br>" + v.desc;

  el.video.volume = v.vol ?? 1;
  el.video.style.height = v.cover === false ? "auto" : "inherit";

  Array.from(dots).forEach((dot) => (dot.style = "null"));
  dots[index].style.opacity = "100%";
}

el.video.addEventListener("ended", () => videoLoad((state.currentIndex + 1) % videos.length));

el.video.addEventListener("loadstart", () => {
  el.loader.style.display = null;
  unmuteGraphic.style.display = "none";
});

el.video.addEventListener("canplay", () => {
  el.loader.style.display = "none";
  if (el.video.muted) unmuteGraphic.style.display = null;
});

videoLoad(0);