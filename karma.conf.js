// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

// Object.assign no usado: si CHROME_BIN ya está en el entorno, se respeta.
// En máquinas sin Chrome se usa Brave si está presente; si no, karma-chrome-launcher
// intentará auto-detectar Chrome y solo fallará si no hay ningún navegador compatible.
const fs = require('fs');
if (!process.env.CHROME_BIN && fs.existsSync('/usr/bin/brave')) {
  process.env.CHROME_BIN = '/usr/bin/brave';
}

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma'),
    ],
    client: {
      jasmine: {},
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
    },
    jasmineHtmlReporter: {
      suppressAll: true, // removes the duplicated traces
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/newcv'),
      subdir: '.',
      reporters: [{ type: 'html' }, { type: 'text-summary' }],
    },
    reporters: ['progress', 'kjhtml'],
    customLaunchers: {
      ChromeHeadlessCI: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--disable-gpu'],
      },
    },
    browsers: ['ChromeHeadless'],
    restartOnFileChange: true,
  });
};