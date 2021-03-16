// Import WS Library; my recommendation but you can use whatever if Manny has a preference.
const WebSocket = require('ws');

// Put your URL or IP here instead
const ws = new WebSocket('ws://127.0.0.1:1337');

// Import EventEmitter and Initialize
const { EventEmitter } = require('events')
const portal = new EventEmitter()

let packet = null

ws.on('open', () => {
  // Listen for Messages
  ws.on('message', (content) => {
    if (content.includes('{') && content.includes('}')) {
      packet = JSON.parse(content)
    }

    if (packet !== null) {
      portal.emit(packet.type.toLowerCase(), packet)
    }
  })

  // Issue Authentication and Identity. You will not get events until you do this.
  ws.send([
    'Server: server',
    'Authorization: SECRETKEY'
  ].join('\n\0')) // New-line null byte; Delimiter for Packet Lines
})

let beat = false

// This is how you would watch events; just like discord message, ready, etc.
portal.on('heartbeat', (packet) => {
  beat = true
})

setInterval(function(){
  if (beat){
    console.log('heartbeat')
    beat = false
  } else {
    console.log('no heartbeat')
  }
}, 2000)