// import { sendPushNotification } from '../../src/services/push-notification/ios'
// import chai from 'chai'
// import should from 'should'
// const expect = chai.expect
// const assert = chai.assert

// describe('Push notification service tests...', async () => {

//   it('should not send push notification', async () => {
//     let deviceToken = '12345abcd'
//     let result = await sendPushNotification(deviceToken, 'test message')

//     result.should.be.type('object')
//     result.should.have.property('sent')
//     expect(result.sent).to.be.empty
//     result.should.have.property('failed')
//     result.failed.should.be.type('object')
//     // assert(result.failed.status, 400)
//     let firstError = result.failed[0]
//     firstError.should.have.property('status')
//     assert(firstError.status, 400)
//     firstError.should.have.property('device')
//     assert(firstError.device, deviceToken)
//     should(firstError.response).have.property('reason')
//     assert(firstError.response.reason, 'BadDeviceToken')
//   })

// })
