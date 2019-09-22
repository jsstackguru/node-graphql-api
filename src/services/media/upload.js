import config from '../../config'
import * as AWS from 'aws-sdk'
import * as fs from 'fs'
import AWSMock from 'mock-aws-s3'
// Services

/**
  * upload file on Amazon S3 server
  * @param {object} file
  * @param {string} key
  * @param {string} bucket
  */
export const uploadMediaS3 = async (file, key, bucket = config.aws.s3.defaultBucket) => {
  try {
    let s3bucket

    let bodyStream = fs.createReadStream(file.path)
    let params = {
      Bucket: bucket, // name of the bucket as third parameter
      Key: key,
      Body: bodyStream
    }
    
    if (config.test) {
      AWSMock.config.basePath = __dirname + '/../../../test/media/buckets/' // Can configure a basePath for your local buckets
      s3bucket = AWSMock.S3({
        params: { Bucket: bucket }
      })

      s3bucket.putObject(params, (err, data) => {
        if (err) {
          throw err
        } else {
          return data
        }
      })
    } else {
      AWS.config.credentials = {
        accessKeyId: config.aws.s3.accessKey,
        secretAccessKey: config.aws.s3.secretKey,
        region: config.aws.region
      }
      s3bucket = new AWS.S3()
    
      let data = await s3bucket.putObject(params).promise()
 
      return data
    }
  } catch (err) {
    return err
  }
}
