const Database = require('../../db/Database')
const UUIDService = require('../../utils/UUIDService')

class TemplateService {
  static async getTemplates () {
    return new Promise((resolve, reject) => {
      Database.db.all('SELECT * FROM template', (err, rows) => {
        if (err) {
          reject(err)
        }
        resolve(rows)
      })
    })
  }

  static async getTemplateById (id) {
    return new Promise((resolve, reject) => {
      Database.db.all(
        'SELECT * FROM template where id = ?',
        [id],
        (err, rows) => {
          if (err) {
            reject(err)
          }
          resolve(rows)
        }
      )
    })
  }
  static async postTemplate (template) {
    const uuid = UUIDService.generateUUID()
    await new Promise((resolve, reject) => {
      const fields = template.fields || {}
      Database.db.run(
        `
        INSERT INTO template (name, fields, body, id) 
        VALUES (?, ?, ?, ?);
       `,
        [template.name, JSON.stringify(fields), template.body, uuid],
        function (err, rows) {
          if (err) {
            reject(err)
          }
          resolve(rows)
        }
      )
    })
    return this.getTemplateById(uuid)
  }
  static async putTemplate (id, template) {
    await new Promise((resolve, reject) => {
      const fields = template.fields || {}
      Database.db.run(
        `
        UPDATE template SET name = ?, fields = ?, body = ? WHERE id = ?;
       `,
        [template.name, JSON.stringify(fields), template.body, id],
        (err, rows) => {
          if (err) {
            reject(err)
          }
          resolve(rows)
        }
      )
    })
    return this.getTemplateById(id)
  }

  static async deleteTemplateById (id) {
    return new Promise((resolve, reject) => {
      Database.db.run(
        'DELETE FROM template WHERE id = ?',
        [id],
        (err, rows) => {
          if (err) {
            reject(err)
          }
          resolve(rows)
        }
      )
    })
  }
}

module.exports = TemplateService
