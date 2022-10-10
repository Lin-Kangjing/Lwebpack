/**
 * @description:统一路径分隔符 主要是为了后续生成模块ID方便
 *  uniform path separator,it is mainly for the  convenience of generating the module ID later
 * @return {*}
 * @author: Lin_kangjing
 */
module.exports.toUnixPath = function toUnixPath(path) {
  return path.replace(/\\/g, "/");
}


/**
 * @param {*} modulePath: module absolute path
 * @param {*} extensions:extension name array
 * @param {*} originModulePath:require module path
 * @param {*} moduleContext:the directory where the current moudle resides
 * @return {*}
 * @author: Lin_kangjing
 */
 module.exports.tryExtensions =function tryExtensions(
  modulePath,
  extensions,
  originModulePath,
  moduleContext
) {
  extensions.unshift('')
  for (const extension of extensions) {
    if(fs.existsSync(modulePath + extension)) {
      return modulePath+extension
    }
  }
  throw new Error(`No module, Error:Can't resolve ${originModulePath} in ${moduleContext}`)
}
