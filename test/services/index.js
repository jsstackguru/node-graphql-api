describe('Start services tests...', () => {
  require('./auth')
  require('./push-notification')
  require('./activity')
  describe('Amazon AWS tests', () => {
    require('./read-media')
    require('./upload-media')
  })
})