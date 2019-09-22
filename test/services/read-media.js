/**
 * @file Tests for read media
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */

import should from 'should'
import { readMediaS3 } from '../../src/services/media/read'

describe.skip('Upload media service tests...', async () => { //TODO: puca...

  it('should read media file', async () => {
    try {
      const key = 'test.jpg'
      const image = '/tmp/test.jpg'
      
      let read = await readMediaS3(key, image)
      
      should.exist(read)
    } catch (err) {
      console.log(err.stack)
      // should.not.exist(err)
      throw err
    }
  })

})
