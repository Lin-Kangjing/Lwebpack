/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./example/src/module.js":
/*!*******************************!*\
  !*** ./example/src/module.js ***!
  \*******************************/
/***/ ((module) => {

/*
 * @Description: 
 * @FilePath: \Lwebpack\example\src\module.js
 * @Date: 2022-09-28 16:19:29
 * @LastEditors: Lin_kangjing
 * @LastEditTime: 2022-10-12 14:27:31
 * @author: Lin_kangjing
 */
const name = '19Qingfeng';

module.exports = {
  name,
};
 const loader2 = '19Qingfeng'
 const loader1 = 'https://github.com/19Qingfeng'

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*******************************!*\
  !*** ./example/src/entry1.js ***!
  \*******************************/
/*
 * @Description: 
 * @FilePath: \Lwebpack\example\src\entry1.js
 * @Date: 2022-09-28 16:19:08
 * @LastEditors: Lin_kangjing
 * @LastEditTime: 2022-10-12 16:38:38
 * @author: Lin_kangjing
 */
const depModule = __webpack_require__(/*! ./module */ "./example/src/module.js");

console.log(depModule, 'dep');
console.log('This is entry 1 !');


 const loader2 = '19Qingfeng'
 const loader1 = 'https://github.com/19Qingfeng'
})();

/******/ })()
;