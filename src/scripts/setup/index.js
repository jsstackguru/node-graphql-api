/**
 * @file Start application
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */

import '@babel/polyfill'

import config from '../../config'
import server from './server'
// application
import apps from './app'

server.listen(config.port, () => {
  console.log('Listening at port %s', config.port)

  // start app
  apps(server)
})
