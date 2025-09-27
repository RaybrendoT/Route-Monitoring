// Inicializa o mapa em Manaus
const map = L.map('map').setView([-3.119, -60.021], 12);

// Camada base do mapa
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Grupo de marcadores para usuários
const usuariosLayer = L.layerGroup().addTo(map);

// Variável para armazenar a rota atual
let rotaLayer = null;

// Função para carregar rota e usuários
async function carregarRota(origem, destino) {
    try {
        const response = await fetch(
            `http://localhost:5678/webhook/rota?origem=${origem}&destino=${destino}`
        );
        const data = await response.json();

        // Desenha a rota no mapa
        desenharRota(data.rota);

        // Marca os usuários no mapa
        marcarUsuarios(data.usuarios);

    } catch (err) {
        console.error("Erro ao carregar rota:", err);
    }
}

// Desenha rota com base no GeoJSON
function desenharRota(rota) {
    if (!rota.routes || rota.routes.length === 0) return;

    const coords = rota.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);

    // Remove rota antiga se existir
    if (rotaLayer) map.removeLayer(rotaLayer);

    rotaLayer = L.polyline(coords, { color: 'blue', weight: 4 }).addTo(map);
    map.fitBounds(rotaLayer.getBounds());
}

// Coloca marcadores de usuários no mapa com QR Code
function marcarUsuarios(usuarios) {
    usuariosLayer.clearLayers();

    usuarios.forEach(user => {
        // Cor do marcador: verde = embarcado, vermelho = não embarcado
        const color = user.presenca ? "green" : "red";
        const marker = L.circleMarker([user.latitude, user.longitude], {
            radius: 8,
            color: color,
            fillColor: color,
            fillOpacity: 0.7
        });

        // Gera QR Code para check-in
        const qrUrl = `http://localhost:5678/webhook/checkin?telefone=${encodeURIComponent(user.telefone)}`;
        const qrCodeImg = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(qrUrl)}" alt="QR Code">`;

        marker.bindPopup(`
      <b>${user.nome}</b><br>
      Telefone: ${user.telefone}<br>
      Status: ${user.presenca ? "✅ Embarcado" : "❌ Não embarcado"}<br>
      ${!user.presenca ? "Escaneie QR para confirmar presença:<br>" + qrCodeImg : ""}
    `);

        marker.addTo(usuariosLayer);
    });
}

// Origem e destino fixos (motorista e empresa)
const origem = "-60.021,-3.119";
const destino = "-60.025,-3.135";

// Inicializa mapa na primeira vez
carregarRota(origem, destino);

// Atualiza a cada 10 segundos
setInterval(() => {
    carregarRota(origem, destino);
}, 10000);
