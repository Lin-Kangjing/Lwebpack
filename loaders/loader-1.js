/*
 * @Description: 
 * @FilePath: \Lwebpack\loaders\loader-1.js
 * @Date: 2022-10-11 17:31:16
 * @LastEditors: Lin_kangjing
 * @LastEditTime: 2022-10-11 17:33:22
 * @author: Lin_kangjing
 */
function loader1(sourceCode) {
  // console.log('run loader1-------------');
  return sourceCode + `\n const loader1 = 'https://github.com/19Qingfeng'`;
}

module.exports = loader1;