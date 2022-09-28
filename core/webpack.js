function webpack (options) {
  // merge parameter 
  const mergeOptions = _mergeOptions(options)
  // create a compiler object
  const compiler = new Compiler(mergeOptions)
  return compiler
}

/**
 * @description: 合并webpack.config.js和shell参数
 * @param {*} options： webpack.config.js
 * @return {*}
 * @author: Lin_kangjing
 */
function _mergeOptions (options) {
  // 获取shell的参数
  const shellOptions = process.argv.slice(2).reduce((option,argv)=>{
    const [key,value] = argv.split('=')
    if(key && value){
      const parseKey = key.slice(2)
      option[parseKey] = value
    }
    return options
  },{})
  return {...options,...shellOptions}
}
module.exports = webpack