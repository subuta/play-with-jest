const _ = require('lodash')
const path = require('path')

module.exports = (wallaby) => {
  return {
    files: [
      'src/**/*',
      'knexfile.js',
      { pattern: 'db/dev.sqlite', binary: true },
      '!src/**/__tests__/*.spec.js'
    ],

    tests: [
      'src/**/__tests__/*.spec.js'
    ],

    env: {
      type: 'node',
      runner: 'node',

      params: {
        env: _.reduce({
          NODE_PATH: `${path.resolve(wallaby.projectCacheDir, './src')}:./`, // or whatever the folder is
          TZ: 'Asia/Tokyo',
          SQLITE_INMEMORY: 1
        }, (str, value, key) => str + `${key}=${value};`, '')
      }
    },

    compilers: {
      '**/*.js?(x)': wallaby.compilers.babel({
        babel: require('@babel/core')
      })
    },

    testFramework: 'jest'
  }
}
