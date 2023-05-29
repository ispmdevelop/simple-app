const UUIDService = require('./../utils/UUIDService')

class DataBase {
  static db

  static init () {
    const sqlite3 = require('sqlite3').verbose()
    DataBase.db = new sqlite3.Database('main.db')
  }

  static setUpSchema () {
    return new Promise((resolve, reject) => {
      DataBase.db.exec(
        `
        PRAGMA foreign_keys = ON;
        CREATE TABLE if not exists  template (
          id TEXT PRIMARY KEY,
          name TEXT UNIQUE not null,
          body TEXT not null,
          fields TEXT not null
        );

        CREATE TABLE if not exists form (
          id TEXT PRIMARY KEY,
          body TEXT not null,
          fields TEXT not null,
          template_id TEXT not null,
          CONSTRAINT form_template_id FOREIGN KEY (template_id) REFERENCES template(id)
        );`,
        err => {
          if (err) {
            reject(err)
          } else {
            resolve()
          }
        }
      )
    })
  }

  static populate () {
    const uuid = UUIDService.generateUUID()

    const template = {
      name: 'Mock script3',
      fields: [
        { name: 'companyName', placeholder: 'Name of your company' },
        { name: 'aiName', placeholder: 'Name your A.i' },
        {
          name: 'paintPoints',
          placeholder: 'What is your prospects biggest pain points'
        },
        {
          name: 'desires',
          placeholder: 'What are your project biggest desires'
        },
        { name: 'helpYou', placeholder: 'How do you help you' }
      ],
      body: 'This script is mean to be for ${companyName} only and only ${companyName} should be able to use it.\nAs ${companyName} is the best company in the world.\nThe name of its AI is ${aiName} and the biggest pain point of its customers are ${paintPoints}.\nbut also its biggest desire is ${desires}\nso they are helping themselves with ${helpYou}.'
    }
    return DataBase.db.run(
      `
        INSERT INTO template (name, fields, body, id) 
        VALUES (?, ?, ?, ?);
       `,
      [template.name, JSON.stringify(template.fields), template.body, uuid],
      function (err, rows) {
        if (err) {
          console.log('Population failed', err)
        }
      }
    )
  }
}

module.exports = DataBase
