const config = require('../../config')

module.exports = {
  development : config.db.uri,
  test        : config.db.testUri,
  production  : config.db.uri
}
