/*
 * @Description: 
 * @FilePath: \Lwebpack\core\compiler.js
 * @Date: 2022-09-29 15:59:53
 * @LastEditors: Lin_kangjing
 * @LastEditTime: 2022-09-29 16:19:28
 * @author: Lin_kangjing
 */
const {SyncHook} = require('tapable')
class Compiler{
  constructor(options){
    this.options = options
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

  }
}
module.exports = Compiler