/**
 * @description:统一路径分隔符 主要是为了后续生成模块ID方便
 *  uniform path separator,it is mainly for the  convenience of generating the module ID later
 * @return {*}
 * @author: Lin_kangjing
 */
function toUnixPath (path) {
  return path.replace(/\\/g,'/')
}