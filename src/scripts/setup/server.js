import server from '../../server'
import { errorHandler } from '../../middleware/error'

// Error handler
server.use(errorHandler)

export default server
