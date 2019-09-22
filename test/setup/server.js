import server from '../../src/server'
import { errorHandler } from '../../src/middleware/error'
/**
 * Routes
 */
import '../../src/routes'

// Error handler
server.use(errorHandler)

export default server
