// const { connect } = require('./db')

exports.up = (next) => {
  // try {
  //   const db = await connect()

  //   await new Promise((resolve, reject) => {
  //     db.collection('authors').updateMany({}, {
  //       $set: {
  //         deleted: false
  //       }
  //     }, (err, result) => {
  //       if (err) {
  //         reject(err)
  //       } else {
  //         resolve(result)
  //       }
  //     })
  //   })

  //   next()
  // } catch (err) {
  //   throw err
  // }
  next()
}

exports.down = function(next){
  next()
}
