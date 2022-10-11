/*
 * @Description: 
 * @FilePath: \Lwebpack\plugins\plugin-b.js
 * @Date: 2022-09-30 11:15:40
 * @LastEditors: Lin_kangjing
 * @LastEditTime: 2022-10-11 17:25:30
 * @author: Lin_kangjing
 */
class PluginB {
  apply(compiler){
    compiler.hooks.done.tap('Plugin B',( )=>{
      
      console.log('PluginB run----------------')
    })
  }
}
module.exports = PluginB