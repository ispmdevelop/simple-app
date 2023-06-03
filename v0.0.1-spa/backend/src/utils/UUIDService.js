const crypto = require('crypto')

class UUIDService {
  static generateUUID (length) {
    const len = length || 32
    return crypto.randomBytes(len / 2).toString('hex')
  }
}

module.exports = UUIDService
