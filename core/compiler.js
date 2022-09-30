/*
 * @Description: 
 * @FilePath: \Lwebpack\core\compiler.js
 * @Date: 2022-09-29 15:59:53
 * @LastEditors: Lin_kangjing
 * @LastEditTime: 2022-09-30 11:42:45
 * @author: Lin_kangjing
 */
const {SyncHook} = require('tapable')
const path = require('path')
const {toUnixPath} = require('./utils')
class Compiler{
  constructor(options){
    this.options = options
    // root path
    this.rootPath = this.options.context || toUnixPath(process.cwd())
    // create plugin hooks
    this.hooks = {
      // start the compilation hook
      run:new SyncHook(),
      //  executed before output asset to the output director (before writing to a file)
      emit:new SyncHook(), 
      // executed on compilation completion
      // 在 compilation 完成时执行 全部完成编译执行
      done:new SyncHook()
    }
  }
  // start the compilation
  run(callback){
    // triggering start compiler plugin
    this.hooks.run.call()
    // get the entry object of configuration
    const entry = this.getEntry()
  }
  // get the entry object of configuration
  getEntry(){
    let entry = Object.create(null)
    const {entry:optionsEntry} = this.options
    if(typeof optionsEntry ==='string'){
      entry['main'] = optionsEntry
    }else {
      entry = optionsEntry
    }
    // change entry to an absolute path
    Object.keys(entry).forEach(key=>{
      const value = entry[key]
      if(!path.isAbsolute(value)){
        entry[key] = toUnixPath(path.join(this.rootPath,value))
      }
    })
    return entry
  }
}
module.exports = Compiler