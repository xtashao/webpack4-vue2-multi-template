'use strict'

const path = require('path')
const packageConfig = require('../package.json')

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  resolve: resolve,

  assetsPath: function(_path) {
    const assetsSubDirectory = 'static'
    return path.posix.join(assetsSubDirectory, _path)
  },

  createNotifierCallback: function() {
    const notifier = require('node-notifier')

    return (severity, errors) => {
      if (severity !== 'error') return

      const error = errors[0]
      const filename = error.file && error.file.split('!').pop()

      notifier.notify({
        title: packageConfig.name,
        message: severity + ': ' + error.name,
        subtitle: filename || '',
        icon: path.join(__dirname, 'logo.png')
      })
    }
  }
}

