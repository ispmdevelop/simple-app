const Database = require('../../db/Database')
const UUIDService = require('../../utils/UUIDService')

class FormService {
  static async getForms () {
    return new Promise((resolve, reject) => {
      Database.db.all('SELECT * FROM form', (err, rows) => {
        if (err) {
          reject(err)
        }
        resolve(rows)
      })
    })
  }

  static async getFormById (id) {
    return new Promise((resolve, reject) => {
      Database.db.all('SELECT * FROM form where id = ?', [id], (err, rows) => {
        if (err) {
          reject(err)
        }
        resolve(rows)
      })
    })
  }
  static async postForm (form) {
    const uuid = UUIDService.generateUUID()
    await new Promise((resolve, reject) => {
      const fields = form.fields || {}
      Database.db.run(
        `
        INSERT INTO form (body, fields, template_id, id) 
        VALUES (?, ?, ?, ?);
       `,
        [form.body, JSON.stringify(fields), form.templateId, uuid],
        (err, rows) => {
          if (err) {
            reject(err)
          }
          resolve(rows)
        }
      )
    })
    return this.getFormById(uuid)
  }
  static async putForm (id, form) {
    await new Promise((resolve, reject) => {
      const fields = form.fields || {}
      Database.db.run(
        `
        UPDATE form SET body = ?, fields = ?, template_id = ? WHERE id = ?;
       `,
        [form.body, JSON.stringify(fields), form.templateId, id],
        (err, rows) => {
          if (err) {
            reject(err)
          }
          resolve(rows)
        }
      )
    })
    return this.getFormById(id)
  }

  static async deleteFormById (id) {
    return new Promise((resolve, reject) => {
      Database.db.run('DELETE FROM form WHERE id = ?', [id], (err, rows) => {
        if (err) {
          reject(err)
        }
        resolve(rows)
      })
    })
  }
}

module.exports = FormService
