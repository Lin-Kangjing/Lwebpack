/*
 * @Description: 
 * @FilePath: \Lwebpack\core\webpack.js
 * @Date: 2022-09-28 17:01:51
 * @LastEditors: Lin_kangjing
 * @LastEditTime: 2022-10-12 14:20:38
 * @author: Lin_kangjing
 */
const Compiler = require('./compiler.js')
function webpack (options) {
  // merge parameter 
  const mergeOptions = _mergeOptions(options)
  // create a compiler object
  const compiler = new Compiler(mergeOptions)
  console.log('generate compiler------------')
  // load the plugin
  _loadPlugin(options.plugins,compiler)
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
/**
 * @description: load the plugin function
 * @param {*} plugins
 * @param {*} compiler
 * @return {*}
 * @author: Lin_kangjing
 */
function _loadPlugin (plugins,compiler) {
  if(plugins && Array.isArray(plugins)){
    plugins.forEach(plugin=>{
      plugin.apply(compiler)
    })
  }
  
}
module.exports = webpack