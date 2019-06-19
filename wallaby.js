module.exports = (wallaby) => {
  return {
    files: [
      'src/**/*',
      '!src/**/__tests__/*.spec.js'
    ],

    tests: [
      'src/**/__tests__/*.spec.js'
    ],

    env: {
      type: 'node',
      runner: 'node'
    },

    compilers: {
      '**/*.js?(x)': wallaby.compilers.babel({
        babel: require('@babel/core')
      })
    },

    testFramework: 'jest'
  }
}
