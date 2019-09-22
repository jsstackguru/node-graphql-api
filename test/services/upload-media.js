/**
 * @file Tests for upload media
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */

import should from 'should'
import { uploadMediaS3 } from '../../src/services/media/upload'

describe('Upload media service tests...', async () => { //TODO: puca...

  it('should upload media file', async () => {
    try {
      const image = {
        path: __dirname + '/../media/test.txt',
        fieldName: 'test',
      }

      await uploadMediaS3(image, 'test')

    } catch (err) {
      should.not.exist(err)
      throw err
    }
  })

})
