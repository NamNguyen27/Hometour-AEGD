const screen = document.getElementById("screen");

function newTour() {
  const date = prompt("Ngày chơi (VD: 10/08)");
  TOUR.date = date;
  TOUR.players = PLAYERS.map(name => ({
    name,
    check: false,
    rebuy: false,
    rank: null,
    point: 0
  }));
  show("check");
}

function show(tab) {
  if (!TOUR.players.length) {
    screen.innerHTML = "<p>➕ Tạo tour mới để bắt đầu</p>";
    return;
  }

  if (tab === "check") renderCheck();
  if (tab === "rebuy") renderRebuy();
  if (tab === "rank") renderRank();
  if (tab === "summary") renderSummary();
}

function renderCheck() {
  screen.innerHTML = `<h3>Điểm danh – ${TOUR.date}</h3>`;
  TOUR.players.forEach(p => {
    screen.innerHTML += `
      <div class="card">
        ${p.name}
        <button ${p.check ? "disabled" : ""} onclick="checkIn('${p.name}')">
          ${p.check ? "✅" : "⭕"}
        </button>
      </div>`;
  });
}

function checkIn(name) {
  TOUR.players.find(p => p.name === name).check = true;
  renderCheck();
}

function renderRebuy() {
  screen.innerHTML = "<h3>Rebuy (1 lần)</h3>";
  TOUR.players
    .filter(p => p.check)
    .forEach(p => {
      screen.innerHTML += `
        <div class="card">
          ${p.name}
          <button ${p.rebuy ? "disabled" : ""} onclick="doRebuy('${p.name}')">
            ${p.rebuy ? "✅" : "REBUY"}
          </button>
        </div>`;
    });
}

function doRebuy(name) {
  const p = TOUR.players.find(x => x.name === name);
  if (confirm(`Rebuy cho ${name}? (1 lần)`)) {
    p.rebuy = true;
    renderRebuy();
  }
}

function renderRank() {
  screen.innerHTML = "<h3>Xếp hạng</h3>";
  TOUR.players
    .filter(p => p.check)
    .forEach(p => {
      screen.innerHTML += `
        <div class="card">
          ${p.name}
          <select onchange="setRank('${p.name}', this.value)">
            <option value="">–</option>
            ${[1,2,3,4,5,6].map(r =>
              `<option ${p.rank==r?"selected":""}>${r}</option>`
            ).join("")}
          </select>
        </div>`;
    });
}

function setRank(name, r) {
  const used = TOUR.players.map(p => p.rank);
  if (used.includes(Number(r))) {
    alert("Hạng đã được chọn");
    return;
  }
  const p = TOUR.players.find(x => x.name === name);
  p.rank = Number(r);
  p.point = SETTINGS.scoring[r] || 0;
}

function renderSummary() {
  let prize =
    TOUR.players.filter(p => p.check).length * SETTINGS.buyIn +
    TOUR.players.filter(p => p.rebuy).length * SETTINGS.rebuy;

  screen.innerHTML = `
    <h3>Tổng kết – ${TOUR.date}</h3>
    <p>💰 Prize Pool: ${prize}k</p>
  `;

  TOUR.players
    .filter(p => p.rank)
    .sort((a,b) => a.rank - b.rank)
    .forEach(p => {
      screen.innerHTML += `
        <div class="card">
          🏆 ${p.rank}. ${p.name}
          <strong>${p.point}</strong>
        </div>`;
    });
}
