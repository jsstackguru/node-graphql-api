import config from '../../config'
import * as AWS from 'aws-sdk'
import * as fs from 'fs'

/**
  * read file from Amazon S3 server
  * @param {string} key
  * @param {string} filename
  * @param {string} bucket
  */
export const readMediaS3 = async (key, filename, bucket = config.aws.s3.defaultBucket) => {
  try {
    let s3bucket

    AWS.config.credentials = {
      accessKeyId: config.aws.s3.accessKey,
      secretAccessKey: config.aws.s3.secretKey,
      region: config.aws.region
    }

    s3bucket = new AWS.S3()

    let params = {
      Bucket: bucket, // name of the bucket as third parameter
      // Key: key,
      Key: key,
    }

    return await new Promise((resolve, reject) => {
      let file = fs.createWriteStream(filename)
      file.on('close', () => {
        resolve(file)
      })

      s3bucket.getObject(params).createReadStream().on('error', (err) => {
        reject(err)
      }).pipe(file)
    })

  } catch (err) {
    throw err
  }
}
