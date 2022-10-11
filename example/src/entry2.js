/*
 * @Description: 
 * @FilePath: \Lwebpack\example\src\entry2.js
 * @Date: 2022-09-28 16:19:19
 * @LastEditors: Lin_kangjing
 * @LastEditTime: 2022-10-11 17:37:12
 * @author: Lin_kangjing
 */
const depModule = require('./module');

console.log(depModule, 'dep');
console.log('This is entry 2 !');

// webpack/example/module.js
const name = '19Qingfeng';

module.exports = {
  name,
};