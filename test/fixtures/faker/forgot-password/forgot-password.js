import randToken from 'rand-token'

// models
import { ForgotPassword } from '../../../../src/models/forgot-password'
// faker
import faker from 'faker'
// utils
import { ObjectId } from 'mongodb'


const forgotPasswordFaker = async ({
  n = 1,
  author,
  code,
  active = true,
  single = false
}) => {
  let forgotPasswords = []
  for (let i = 0; i < n; i++) {
    let forgot = ForgotPassword.create({
      author: author || ObjectId(),
      code: code || randToken.generate(64),
      active,
    })
    forgotPasswords.push(forgot)
  }
  if (single) {
    return await forgotPasswords[0]
  }
  return await Promise.all(forgotPasswords)
}

export default forgotPasswordFaker
