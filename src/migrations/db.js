const config = require('./config')
const MongoClient = require('mongodb').MongoClient

// Connection URL
const url = config[process.env.NODE_ENV] || config['development']

// Create a client, passing in additional options
const client = new MongoClient(url, { useNewUrlParser: true })
const dbName = 'istory_migration'

export const connect = () => {
  return new Promise((resolve, reject) => {
    // Use connect method to connect to the server
    client.connect(err => {
      if (err) {
        // eslint-disable-next-line no-console
        console.log(err.stack)
        reject(err)
      } else {
        const db = client.db(dbName)
        // client.close()
        resolve(db)
      }
    })
  })
}
