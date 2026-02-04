/* ======================================================
   UKRP STAFF PORTAL – CORE LOGIC
   ====================================================== */

/* ================== DATA ================== */

const offenses = [
  { n: "FRP - Fail Roleplay", d: "Unrealistic or broken roleplay.", r: "Verbal Warning / Warning" },
  { n: "RDM - Random Death Match", d: "Killing without roleplay.", r: "Warning / Kick" },
  { n: "MRDM - Mass RDM", d: "Killing 3 or more players without RP.", r: "Ban" },
  { n: "VDM - Vehicle Death Match", d: "Using vehicles to kill players.", r: "Warning" },
  { n: "GTA Driving", d: "Unrealistic reckless driving.", r: "Warning" },
  { n: "Cop Baiting", d: "Intentionally provoking law enforcement.", r: "Warning" },
  { n: "NTRP", d: "No intent to roleplay.", r: "Kick / Ban" },
  { n: "Member Disrespect", d: "Disrespecting another player.", r: "Warning / Kick" },
  { n: "NLR - New Life Rule", d: "Returning to scene after death.", r: "Warning" },
  { n: "Trolling", d: "Intentionally disrupting RP.", r: "Kick / Ban" },
  { n: "Lying To Staff", d: "Providing false information.", r: "Kick / Ban" },
  { n: "LTAP", d: "Leaving to avoid punishment.", r: "Ban" },
  { n: "Exploiting", d: "Using cheats or bugs.", r: "Ban" }
];

/* ================== AUTHORITY MATRIX ================== */
/* Everyone except Trainee has FULL permissions (as you requested) */

const FULL_ACCESS_RANKS = [
  "Supervised Moderator",
  "Moderator",
  "Junior Moderator",
  "Senior Moderator",
  "Head Moderator",
  "Junior Administration",
  "Senior Administration",
  "Head Administration",
  "Internal Affair",
  "Foundership",
  "Assistance Co-Founder",
  "Co-Founder",
  "Founder"
];

/* ================== STATE ================== */

let userName = "";
let userRank = "";
let activeLevel = "";

/* ================== ELEMENTS ================== */

const setupStage = document.getElementById("setup-stage");
const deniedStage = document.getElementById("denied-stage");
const mainDashboard = document.getElementById("main-dashboard");

const inputName = document.getElementById("input-name");
const inputRank = document.getElementById("input-rank");

const displayName = document.getElementById("display-name");
const displayRank = document.getElementById("display-rank");

const offensePicker = document.getElementById("offense-picker");
const offenderName = document.getElementById("offender-name");
const toggleName = document.getElementById("toggle-name");

const greetPreview = document.getElementById("greet-preview");
const guideBox = document.getElementById("guide-box");
const guideText = document.getElementById("guide-text");

const finalLog = document.getElementById("final-log");
const logFooter = document.getElementById("log-footer");
const logSig = document.getElementById("log-sig");

/* ================== INIT ================== */

offenses.forEach(o => {
  const opt = document.createElement("option");
  opt.value = o.n;
  opt.textContent = o.n;
  offensePicker.appendChild(opt);
});

loadSession();

/* ================== LOGIN ================== */

document.getElementById("login-btn").onclick = handleLogin;
document.getElementById("return-login").onclick = () => location.reload();
document.getElementById("logout-btn").onclick = logout;

function handleLogin() {
  userName = inputName.value.trim();
  userRank = inputRank.value;

  if (!userName || !userRank) {
    alert("All credentials are required.");
    return;
  }

  if (userRank === "Trainee") {
    setupStage.hidden = true;
    deniedStage.hidden = false;
    return;
  }

  saveSession();
  bootDashboard();
}

function bootDashboard() {
  setupStage.hidden = true;
  deniedStage.hidden = true;
  mainDashboard.hidden = false;

  displayName.innerText = userName;
  displayRank.innerText = userRank;

  greetPreview.innerText =
    `Hello, I'm ${userRank} at UKRP. How may I assist you today?`;
}

/* ================== SESSION ================== */

function saveSession() {
  localStorage.setItem(
    "ukrp_session",
    JSON.stringify({ userName, userRank })
  );
}

function loadSession() {
  const raw = localStorage.getItem("ukrp_session");
  if (!raw) return;

  const s = JSON.parse(raw);
  if (!FULL_ACCESS_RANKS.includes(s.userRank)) return;

  userName = s.userName;
  userRank = s.userRank;
  bootDashboard();
}

function logout() {
  localStorage.removeItem("ukrp_session");
  location.reload();
}

/* ================== PUNISHMENT ================== */

document.querySelectorAll(".punish-btn").forEach(btn => {
  btn.onclick = () => setLevel(btn.dataset.level, btn);
});

function setLevel(level, btn) {
  activeLevel = level;
  document.querySelectorAll(".punish-btn").forEach(b =>
    b.classList.remove("active")
  );
  btn.classList.add("active");
  updateLog();
}

offensePicker.onchange = updateLog;
offenderName.oninput = updateLog;
toggleName.onchange = updateLog;

function updateLog() {
  const offenseName = offensePicker.value;
  if (!offenseName || !activeLevel) return;

  const offense = offenses.find(o => o.n === offenseName);
  const includeName = toggleName.checked;
  const target = offenderName.value.trim() || "User";

  let message =
    "OFFICIAL NOTICE: " +
    (includeName ? target + ", " : "") +
    `you are hereby issued a ${activeLevel} for ${offense.n}. ` +
    `Reason: ${offense.d}`;

  finalLog.innerText = message;
  logSig.innerText = `ISSUED BY: ${userName} | ${userRank}`;
  logFooter.hidden = false;

  guideText.innerText = `Handbook Recommendation: ${offense.r}`;
  guideBox.hidden = false;
}

/* ================== COPY ================== */

document.getElementById("copy-greeting").onclick = () =>
  copyText(greetPreview.innerText);

document.getElementById("copy-log").onclick = () => {
  if (!activeLevel) {
    alert("Punishment not selected.");
    return;
  }
  copyText(`${finalLog.innerText} | ${logSig.innerText}`);
};

document.querySelectorAll(".preset-msg").forEach(btn => {
  btn.onclick = () => copyText(btn.innerText);
});

function copyText(text) {
  navigator.clipboard.writeText(text);
}