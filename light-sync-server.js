const WebSocket = require('ws');
const http = require('http');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

const devices = new Set();

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        const data = JSON.parse(message);

        if (data.type === 'join') {
            devices.add(ws);
        }

        // Reenviar mensaje a todos los dispositivos
        devices.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data));
            }
        });
    });

    ws.on('close', () => {
        devices.delete(ws);
    });
});

server.listen(8080, () => {
    console.log('Servidor WebSocket iniciado');
});
