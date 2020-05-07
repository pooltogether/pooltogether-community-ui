const fs = require('fs')

console.log('copying _redirects and robots.txt to new ./out/* location')

fs.copyFile('_redirects', './out/_redirects', err => {
  if (err) throw err
  console.log('_redirects was copied to ./out/_redirects')
})

// fs.copyFile('robots.txt', './out/robots.txt', err => {
//   if (err) throw err
//   console.log('_redirects was copied to ./out/robots.txt')
// })