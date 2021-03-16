module.exports.authenticate = (packet, ws) => {
  if (packet.authorization === 'SECRETKEY') {
    ws.identification = packet.server
    ws.authorization = true

    ws.alive = true
    ws.on('pong', () => { ws.alive = true })

    console.info(`[ACK-E] ${ws.identification} ${ws.authorization}`)
    ws.send('authorization-ack')
  }

  if (ws.authorization === undefined || ws.authorization === false) {
    console.info(`[ACK-R] ${ws.identification} ${ws.authorization}`)
    ws.send('HTTP/1.1 401 Unauthorized')
    return false
  }

  console.info(`[ACK-A] ${ws.identification} ${ws.authorization}`)
  return ws.authorization === true
}