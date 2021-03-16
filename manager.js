// Socket Server Connection
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 1337 })

// Basic Packet Parser and Authentication Agent
const { parsePacket } = require('./lib/parser/packet')
const { authenticate } = require('./lib/middleware/auth')

// Discord Backlog and Known Connections
const backlog = []
const connections = {
  server: null
}

// Handle Inbound Connections
wss.on('connection', function connection (ws) {
  // Data Handler
  ws.on('message', function incoming (packet) {
    // Parse the Packet
    packet = parsePacket(packet)

    if (!authenticate(packet, ws)) {
      return ws.terminate()
    }

    // Assign Link; Drop if Authentication Packet
    connections[packet.server] = ws
    if (packet.authorization) return 'drop-packet-processing-further'

    // Live Processing
    if (connections.server !== null) connections['server'].send(JSON.stringify(packet))
    else {
      backlog.push(JSON.stringify(packet))
      console.error(`dispatch_recv: server was not connect to portal ~ dispatched event backlogged; backlog_length(${backlog.length})`)
    }
  })

  // Disconnection Handler
  ws.on('close', () => {
    console.info(`[GRACEFUL_DISCONNECT] I:${ws.identification} A:${ws.authorization !== undefined}`)
    connections[ws.identification] = null
  })
})

// Clean Hard-Death Clients (Network Interrupts)
setInterval(() => {
  wss.clients.forEach(function each (ws) {
    if (ws.alive === false) {
      console.info(`[DEAD] I:${ws.identification} A:${ws.authorization !== undefined}`)
      connections[server.identification] = null
      return ws.terminate()
    }
    ws.alive = false
    ws.ping('ACK')
  })
}, 3000)

// Dispatch Backlogged Requests.
setInterval(() => {
  if (connections.server !== null && backlog.length > 0) {
    connections.server.send(backlog.shift())
  }
}, 50)
