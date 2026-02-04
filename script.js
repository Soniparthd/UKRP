const offenses = [
  "FRP - Fail Roleplay",
  "RDM - Random Death Match",
  "VDM - Vehicle Death Match",
  "GTA Driving",
  "NLR - New Life Rule",
  "LTAP",
  "Exploiting"
];

let userName = "";
let userRank = "";
let activeLevel = "";

const setupStage = document.getElementById("setup-stage");
const deniedStage = document.getElementById("denied-stage");
const mainDashboard = document.getElementById("main-dashboard");

const inputName = document.getElementById("input-name");
const inputRank = document.getElementById("input-rank");

const displayName = document.getElementById("display-name");
const displayRank = document.getElementById("display-rank");
const greetPreview = document.getElementById("greet-preview");

const offensePicker = document.getElementById("offense-picker");
const offenderName = document.getElementById("offender-name");
const toggleName = document.getElementById("toggle-name");

const finalLog = document.getElementById("final-log");
const logFooter = document.getElementById("log-footer");
const logSig = document.getElementById("log-sig");

/* Populate offenses */
offenses.forEach(o => {
  const opt = document.createElement("option");
  opt.value = o;
  opt.textContent = o;
  offensePicker.appendChild(opt);
});

/* Login */
document.getElementById("login-btn").onclick = () => {
  userName = inputName.value.trim();
  userRank = inputRank.value;

  if (!userName || !userRank) {
    alert("Fill all fields");
    return;
  }

  if (userRank === "Trainee") {
    setupStage.hidden = true;
    deniedStage.hidden = false;
    return;
  }

  localStorage.setItem("ukrp", JSON.stringify({ userName, userRank }));
  boot();
};

function boot() {
  setupStage.hidden = true;
  deniedStage.hidden = true;
  mainDashboard.hidden = false;

  displayName.innerText = userName;
  displayRank.innerText = userRank;
  greetPreview.innerText = `Hello, I'm ${userRank} at UKRP.`;
}

/* Session restore */
const saved = localStorage.getItem("ukrp");
if (saved) {
  const s = JSON.parse(saved);
  userName = s.userName;
  userRank = s.userRank;
  boot();
}

/* Logout */
document.getElementById("logout-btn").onclick = () => {
  localStorage.removeItem("ukrp");
  location.reload();
};

/* Punishment */
document.querySelectorAll(".punish-btn").forEach(btn => {
  btn.onclick = () => {
    activeLevel = btn.dataset.level;
    document.querySelectorAll(".punish-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    updateLog();
  };
});

offensePicker.onchange = updateLog;
offenderName.oninput = updateLog;
toggleName.onchange = updateLog;

function updateLog() {
  if (!activeLevel || !offensePicker.value) return;

  const target = toggleName.checked ? (offenderName.value || "User") + ", " : "";
  finalLog.innerText =
    `OFFICIAL NOTICE: ${target}you are issued a ${activeLevel} for ${offensePicker.value}.`;

  logSig.innerText = `Issued by ${userName} (${userRank})`;
  logFooter.hidden = false;
}

/* Copy */
document.getElementById("copy-greeting").onclick = () =>
  navigator.clipboard.writeText(greetPreview.innerText);

document.getElementById("copy-log").onclick = () =>
  navigator.clipboard.writeText(finalLog.innerText + " | " + logSig.innerText);