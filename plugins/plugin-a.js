/*
 * @Description: 
 * @FilePath: \Lwebpack\plugins\plugin-a.js
 * @Date: 2022-09-30 11:15:40
 * @LastEditors: Lin_kangjing
 * @LastEditTime: 2022-09-30 11:16:39
 * @author: Lin_kangjing
 */
class PluginA {
  constructor(compiler){
    compiler.hooks.run.tap('Plugin A',( )=>{
      console.log('PluginA')
    })
  }
}
module.exports = PluginA