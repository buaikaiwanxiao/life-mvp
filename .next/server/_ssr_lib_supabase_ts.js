"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "_ssr_lib_supabase_ts";
exports.ids = ["_ssr_lib_supabase_ts"];
exports.modules = {

/***/ "(ssr)/./lib/supabase.ts":
/*!*************************!*\
  !*** ./lib/supabase.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   getSupabase: () => (/* binding */ getSupabase)\n/* harmony export */ });\n/* harmony import */ var _supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @supabase/supabase-js */ \"(ssr)/./node_modules/@supabase/supabase-js/dist/index.mjs\");\n\nlet supabaseInstance = null;\nfunction getSupabase() {\n    if (!supabaseInstance) {\n        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;\n        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;\n        supabaseInstance = (0,_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__.createClient)(supabaseUrl, supabaseAnonKey);\n    }\n    return supabaseInstance;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9saWIvc3VwYWJhc2UudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBcUQ7QUFFckQsSUFBSUMsbUJBQTJEO0FBRXhELFNBQVNDO0lBQ2QsSUFBSSxDQUFDRCxrQkFBa0I7UUFDckIsTUFBTUUsY0FBY0MsUUFBUUMsR0FBRyxDQUFDQyx3QkFBd0I7UUFDeEQsTUFBTUMsa0JBQWtCSCxRQUFRQyxHQUFHLENBQUNHLDZCQUE2QjtRQUNqRVAsbUJBQW1CRCxtRUFBWUEsQ0FBQ0csYUFBYUk7SUFDL0M7SUFDQSxPQUFPTjtBQUNUIiwic291cmNlcyI6WyJDOlxcVXNlcnNcXHNodWFpXFxEZXNrdG9wXFxsaWZlLW12cFxcbGliXFxzdXBhYmFzZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjcmVhdGVDbGllbnQgfSBmcm9tICdAc3VwYWJhc2Uvc3VwYWJhc2UtanMnO1xyXG5cclxubGV0IHN1cGFiYXNlSW5zdGFuY2U6IFJldHVyblR5cGU8dHlwZW9mIGNyZWF0ZUNsaWVudD4gfCBudWxsID0gbnVsbDtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRTdXBhYmFzZSgpIHtcclxuICBpZiAoIXN1cGFiYXNlSW5zdGFuY2UpIHtcclxuICAgIGNvbnN0IHN1cGFiYXNlVXJsID0gcHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfU1VQQUJBU0VfVVJMITtcclxuICAgIGNvbnN0IHN1cGFiYXNlQW5vbktleSA9IHByb2Nlc3MuZW52Lk5FWFRfUFVCTElDX1NVUEFCQVNFX0FOT05fS0VZITtcclxuICAgIHN1cGFiYXNlSW5zdGFuY2UgPSBjcmVhdGVDbGllbnQoc3VwYWJhc2VVcmwsIHN1cGFiYXNlQW5vbktleSk7XHJcbiAgfVxyXG4gIHJldHVybiBzdXBhYmFzZUluc3RhbmNlO1xyXG59XHJcbiJdLCJuYW1lcyI6WyJjcmVhdGVDbGllbnQiLCJzdXBhYmFzZUluc3RhbmNlIiwiZ2V0U3VwYWJhc2UiLCJzdXBhYmFzZVVybCIsInByb2Nlc3MiLCJlbnYiLCJORVhUX1BVQkxJQ19TVVBBQkFTRV9VUkwiLCJzdXBhYmFzZUFub25LZXkiLCJORVhUX1BVQkxJQ19TVVBBQkFTRV9BTk9OX0tFWSJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/./lib/supabase.ts\n");

/***/ })

};
;