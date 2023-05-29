class Response {
  static generate (status, message, data) {
    return { status, message, data }
  }
}

module.exports = Response
