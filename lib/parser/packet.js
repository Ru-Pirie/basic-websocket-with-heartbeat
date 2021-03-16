module.exports.parsePacket = (context) => {
  const packet = {}

  for (const r of context.split('\n\0')) {
    const parts = r.split(": ")
    const k = parts.shift()
    const v = parts.join(': ')

    packet[k.toLowerCase()] = v
  }

  return packet
}
