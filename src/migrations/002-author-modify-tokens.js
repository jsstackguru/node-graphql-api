
// import { connect } from './db'


export const up = (next) => {
  try {

    // const db = await connect()
    // const Author = db.collection('authors')

    // await Author.updateMany({}, {

    // })

    next()
  } catch (err) {
    throw err
  }
}

export const down = (next) => {
  try {

    // const db = await connect()
    // const Author = db.collection('authors')

    // await Author.updateMany({}, {

    // })

    next()
  } catch (err) {
    throw err
  }
}
