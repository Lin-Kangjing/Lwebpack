/*
 * @Description: 
 * @FilePath: \Lwebpack\loaders\loader-2.js
 * @Date: 2022-10-11 17:31:33
 * @LastEditors: Lin_kangjing
 * @LastEditTime: 2022-10-11 17:33:26
 * @author: Lin_kangjing
 */
function loader2(sourceCode) {
  // console.log('run loader2-------------');
  return sourceCode + `\n const loader2 = '19Qingfeng'`;
}

module.exports = loader2;