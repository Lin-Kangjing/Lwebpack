/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./example/src/entry2.js":
/*!*******************************!*\
  !*** ./example/src/entry2.js ***!
  \*******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
 * @Description: 
 * @FilePath: \Lwebpack\example\src\entry2.js
 * @Date: 2022-09-28 16:19:19
 * @LastEditors: Lin_kangjing
 * @LastEditTime: 2022-10-11 17:37:12
 * @author: Lin_kangjing
 */
const depModule = __webpack_require__(/*! ./module */ "./example/src/module.js");

console.log(depModule, 'dep');
console.log('This is entry 2 !');

// webpack/example/module.js
const name = '19Qingfeng';

module.exports = {
  name,
};
 const loader2 = '19Qingfeng'
 const loader1 = 'https://github.com/19Qingfeng'

/***/ }),

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
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./example/src/entry2.js");
/******/ 	
/******/ })()
;