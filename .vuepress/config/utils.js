const fs = require('fs')
const process = require('process')
const oldWebpack4Files = fs.readdirSync(process.cwd() + '/webpack4')

function generateWebpack() {
  let arr = []
  for (let i = 0; i < oldWebpack4Files.length; i++) {
    let obj = {}
    obj.fileName = oldWebpack4Files[i]
    let index = oldWebpack4Files[i].slice(0, 2)
    if (index.includes('：')) {
      index = index.slice(0, 1)
    }
    obj.index = Number(index)
    arr.push(obj)
  }

  let webpack4Files = []
  arr.sort(sortNum('index')).filter(v => {
    webpack4Files.push(v.fileName)
  })

  return webpack4Files
}

function sortNum(index) {
  return function(a, b) {
    var list1 = a[index]
    var list2 = b[index]
    return list1 - list2
  }
}

module.exports = {
  generateWebpack
}
