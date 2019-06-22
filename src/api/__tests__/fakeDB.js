import _ from 'lodash'

let trx = null
let afterDone = _.noop

export default {
  swap: (db) => new Promise((resolve) => {
    // Some initial actions, transaction is stated here
    db.transaction((_trx) => {
      trx = _trx
      resolve(trx)
    }).catch((e) => {
      afterDone()
    })
  }),

  restore: () => new Promise((resolve) => {
    afterDone = resolve
    trx.rollback()
  })
}
