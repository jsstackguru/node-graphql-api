import config from '../../config'
import * as AWS from 'aws-sdk'
import AWSMock from 'mock-aws-s3'
// Services
import log from '../log'

/**
  * delete file on Amazon S3 server
  * @param {string} key
  * @param {string} bucket
  */
export const removeMediaS3 = async (key, bucket = config.aws.s3.defaultBucket) => {
  try {
    let s3bucket

    if (config.test) {
      AWSMock.config.basePath = __dirname + '/../../test/media/buckets/' // Can configure a basePath for your local buckets
      s3bucket = AWSMock.S3({
        params: { Bucket: bucket }
      })
    } else {
      AWS.config.credentials = {
        accessKeyId: config.aws.s3.accessKey,
        secretAccessKey: config.aws.s3.secretKey,
        region: config.aws.region
      }
      s3bucket = new AWS.S3()
    }
    let params = {
      Bucket: bucket, // name of the bucket as third parameter
      Key: key
    }

    let data = await s3bucket.deleteObject(params).promise()

    return data

  } catch (err) {
    log.error(err)
    return err
  }
}
