// Import WS Library; my recommendation but you can use whatever if Manny has a preference.
const WebSocket = require('ws');

// Put your URL or IP here instead
const ws = new WebSocket('ws://127.0.0.1:1337');

ws.on('open', () => {
  
  // Issue Authentication and Identity. You will not get events until you do this.
  ws.send([
    'Server: main-laptop',
    'Authorization: SECRETKEY'
  ].join('\n\0')) // New-line null byte; Delimiter for Packet Lines

  setInterval(function(){
    const date = Date.now()

    const message = [
        'server: main-laptop',
        'type: heartbeat',
        `timestamp: ${date}`
    ]

    ws.send(message.join('\n\0'))
  }, 1000)


})
