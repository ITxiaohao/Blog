const fs = require('fs')
const process = require('process')

function generateOrderFileName(path) {
  const oldFiles = fs.readdirSync(process.cwd() + path)
  let arr = []
  for (let i = 0; i < oldFiles.length; i++) {
    let obj = {}
    obj.fileName = oldFiles[i]
    let index = oldFiles[i].slice(0, 2)
    if (index.includes('：')) {
      index = index.slice(0, 1)
    }
    obj.index = Number(index)
    arr.push(obj)
  }

  let files = []
  arr.sort(sortNum('index')).filter(v => {
    files.push(v.fileName)
  })

  return files
}

function generateFileName(path) {
  const oldFiles = fs.readdirSync(process.cwd() + path)
  let arr = []
  for (let i = 0; i < oldFiles.length; i++) {
    let obj = {}
    obj.fileName = oldFiles[i]
    let index = oldFiles[i].slice(0, 2)
    if (index.includes('：')) {
      index = index.slice(0, 1)
    }
    obj.index = Number(index)
    arr.push(obj)
  }

  return arr
}

function sortNum(index) {
  return function(a, b) {
    var list1 = a[index]
    var list2 = b[index]
    return list1 - list2
  }
}

module.exports = {
  generateOrderFileName,
  generateFileName
}
