let settings, players, tours = [];

async function loadData() {
  settings = await fetch("data/settings.json").then(r => r.json());
  players = await fetch("data/players.json").then(r => r.json());
  tours = await fetch("data/tours.json").then(r => r.json());

  renderSettings();
  renderSummary();
}

function showTab(id) {
  document.querySelectorAll(".tab").forEach(t => t.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

function renderSettings() {
  document.getElementById("settingsContent").innerHTML = `
    <p>Buy-in: ${settings.buy_in}</p>
    <p>Rebuy (1 lần/người): ${settings.rebuy_price}</p>
  `;
}

function createTour() {
  const date = prompt("Nhập ngày (YYYY-MM-DD)");
  const tour = {
    date,
    players: players.map(p => ({
      ...p,
      checked: false,
      rebuy: false,
      rank: null,
      point: 0
    }))
  };
  tours.push(tour);
  renderTour(tour);
}

function renderTour(tour) {
  let html = `<h3>Tour ngày ${tour.date}</h3><table>
  <tr><th>Tên</th><th>Điểm danh</th><th>Rebuy</th><th>Hạng</th></tr>`;

  tour.players.forEach(p => {
    html += `<tr>
      <td>${p.name}</td>
      <td><input type="checkbox" onchange="p.checked=this.checked"></td>
      <td>
        ${p.checked && !p.rebuy
          ? `<button onclick="doRebuy('${p.id}')">Rebuy</button>`
          : p.rebuy ? "✅" : "-"
        }
      </td>
      <td><input type="number" min="1" max="6" onchange="setRank('${p.id}', this.value)"></td>
    </tr>`;
  });

  html += "</table>";
  document.getElementById("tourContent").innerHTML = html;
}

function doRebuy(id) {
  const p = tours.at(-1).players.find(x => x.id === id);
  if (p.rebuy) return;
  if (confirm(`Xác nhận rebuy cho ${p.name}?`)) {
    p.rebuy = true;
    renderTour(tours.at(-1));
  }
}

function setRank(id, rank) {
  const p = tours.at(-1).players.find(x => x.id === id);
  p.rank = rank;
  p.point = settings.scoring[rank] || 0;
}

function renderSummary() {
  let map = {};
  tours.forEach(t =>
    t.players.forEach(p => {
      if (!map[p.id]) map[p.id] = { name: p.name, point: 0 };
      map[p.id].point += p.point;
    })
  );

  let html = "<table><tr><th>Tên</th><th>Tổng điểm</th></tr>";
  Object.values(map).forEach(p => {
    html += `<tr><td>${p.name}</td><td>${p.point}</td></tr>`;
  });
  html += "</table>";
  document.getElementById("summaryContent").innerHTML = html;
}

loadData();

