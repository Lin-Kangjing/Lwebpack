/*
 * @Description: 
 * @FilePath: \Lwebpack\core\index.js
 * @Date: 2022-09-28 17:01:20
 * @LastEditors: Lin_kangjing
 * @LastEditTime: 2022-09-28 17:25:55
 * @author: Lin_kangjing
 */
const webpack = require('./webpack')
const config = require('../example/webpack.config')
// step1: init param, merge parameters from configuration files and shell parameters
// step2: call webpack(options) to initialize the compiler object
// webpack() return a compliler object
// 初始化参数
const complier = webpack(config)
complier.run((err,stats)=>{
  if(err){
    console.log(err,'err')
  }
  complier.close((closeErr)=>{
    
  })
})