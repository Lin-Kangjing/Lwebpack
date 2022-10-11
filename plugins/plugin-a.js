/*
 * @Description: 
 * @FilePath: \Lwebpack\plugins\plugin-a.js
 * @Date: 2022-09-30 11:15:40
 * @LastEditors: Lin_kangjing
 * @LastEditTime: 2022-10-11 17:16:41
 * @author: Lin_kangjing
 */
class PluginA {
  apply(compiler){
    compiler.hooks.run.tap('Plugin A',( )=>{
      console.log('PluginA run----------------')
    })
  }
}
module.exports = PluginA