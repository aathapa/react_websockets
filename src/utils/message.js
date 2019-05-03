function generateMessage(messageText) {
  return {
    messageText,
    createdAt: new Date().getTime()
  }

}

module.exports = { generateMessage };