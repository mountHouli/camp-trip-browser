const { NODE_ENV } = process.env

const global = {
  apiUrl: 'http://localhost:1775',
  port: 1776
}

// !! Do external assets in a webpacky way.
const envSpecific = {
  prod: {
    cssBundleMarkup: '<link href="/clientIndex.bundle.css" rel="stylesheet"/>',
    fontAwesomeUrl: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css',
    basscssUrl: 'https://unpkg.com/basscss@8.0.2/css/basscss.min.css'
  },
  dev: {
    cssBundleMarkup: '', // In dev, to make HMR work, extract-text-webpack-plugin is not used; therefore, there is no CSS bundle.  Use an empty string here rather than null or undefined so as to not break HTML template.
    fontAwesomeUrl: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css',
    basscssUrl: 'https://unpkg.com/basscss@8.0.2/css/basscss.css'
  }
}

module.exports = {
  ...global,
  ...envSpecific[NODE_ENV]
}
