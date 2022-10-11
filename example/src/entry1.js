/*
 * @Description: 
 * @FilePath: \Lwebpack\example\src\entry1.js
 * @Date: 2022-09-28 16:19:08
 * @LastEditors: Lin_kangjing
 * @LastEditTime: 2022-10-11 17:36:35
 * @author: Lin_kangjing
 */
// webpack/example/entry1.js
const depModule = require('./module');

console.log(depModule, 'dep');
console.log('This is entry 1 !');

