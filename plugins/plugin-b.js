/*
 * @Description: 
 * @FilePath: \Lwebpack\plugins\plugin-b.js
 * @Date: 2022-09-30 11:15:40
 * @LastEditors: Lin_kangjing
 * @LastEditTime: 2022-09-30 11:19:15
 * @author: Lin_kangjing
 */
class PluginB {
  constructor(compiler){
    compiler.hooks.done.tap('Plugin B',( )=>{
      console.log('PluginB')
    })
  }
}
module.exports = PluginB