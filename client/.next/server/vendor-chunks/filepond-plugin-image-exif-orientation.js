"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/filepond-plugin-image-exif-orientation";
exports.ids = ["vendor-chunks/filepond-plugin-image-exif-orientation"];
exports.modules = {

/***/ "(ssr)/./node_modules/filepond-plugin-image-exif-orientation/dist/filepond-plugin-image-exif-orientation.esm.js":
/*!****************************************************************************************************************!*\
  !*** ./node_modules/filepond-plugin-image-exif-orientation/dist/filepond-plugin-image-exif-orientation.esm.js ***!
  \****************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/*!\n * FilePondPluginImageExifOrientation 1.0.11\n * Licensed under MIT, https://opensource.org/licenses/MIT/\n * Please visit https://pqina.nl/filepond/ for details.\n */\n\n/* eslint-disable */\n\n// test if file is of type image\nconst isJPEG = file => /^image\\/jpeg/.test(file.type);\n\nconst Marker = {\n  JPEG: 0xffd8,\n  APP1: 0xffe1,\n  EXIF: 0x45786966,\n  TIFF: 0x4949,\n  Orientation: 0x0112,\n  Unknown: 0xff00\n};\n\nconst getUint16 = (view, offset, little = false) =>\n  view.getUint16(offset, little);\nconst getUint32 = (view, offset, little = false) =>\n  view.getUint32(offset, little);\n\nconst getImageOrientation = file =>\n  new Promise((resolve, reject) => {\n    const reader = new FileReader();\n    reader.onload = function(e) {\n      const view = new DataView(e.target.result);\n\n      // Every JPEG file starts from binary value '0xFFD8'\n      if (getUint16(view, 0) !== Marker.JPEG) {\n        // This aint no JPEG\n        resolve(-1);\n        return;\n      }\n\n      const length = view.byteLength;\n      let offset = 2;\n\n      while (offset < length) {\n        const marker = getUint16(view, offset);\n        offset += 2;\n\n        // There's our APP1 Marker\n        if (marker === Marker.APP1) {\n          if (getUint32(view, (offset += 2)) !== Marker.EXIF) {\n            // no EXIF info defined\n            break;\n          }\n\n          // Get TIFF Header\n          const little = getUint16(view, (offset += 6)) === Marker.TIFF;\n          offset += getUint32(view, offset + 4, little);\n\n          const tags = getUint16(view, offset, little);\n          offset += 2;\n\n          for (let i = 0; i < tags; i++) {\n            // found the orientation tag\n            if (\n              getUint16(view, offset + i * 12, little) === Marker.Orientation\n            ) {\n              resolve(getUint16(view, offset + i * 12 + 8, little));\n              return;\n            }\n          }\n        } else if ((marker & Marker.Unknown) !== Marker.Unknown) {\n          // Invalid\n          break;\n        } else {\n          offset += getUint16(view, offset);\n        }\n      }\n\n      // Nothing found\n      resolve(-1);\n    };\n\n    // we don't need to read the entire file to get the orientation\n    reader.readAsArrayBuffer(file.slice(0, 64 * 1024));\n  });\n\nconst IS_BROWSER = (() =>\n  typeof window !== 'undefined' && typeof window.document !== 'undefined')();\nconst isBrowser = () => IS_BROWSER;\n\n// 2x1 pixel image 90CW rotated with orientation header\nconst testSrc =\n  'data:image/jpg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/4QA6RXhpZgAATU0AKgAAAAgAAwESAAMAAAABAAYAAAEoAAMAAAABAAIAAAITAAMAAAABAAEAAAAAAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wAALCAABAAIBASIA/8QAJgABAAAAAAAAAAAAAAAAAAAAAxABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQAAPwBH/9k=';\n\n// should correct orientation if is presented in landscape, in which case the browser doesn't autocorrect\nlet shouldCorrect = undefined;\nconst testImage = isBrowser() ? new Image() : {};\ntestImage.onload = () =>\n  (shouldCorrect = testImage.naturalWidth > testImage.naturalHeight);\ntestImage.src = testSrc;\n\nconst shouldCorrectImageExifOrientation = () => shouldCorrect;\n\n/**\n * Read Image Orientation Plugin\n */\nconst plugin = ({ addFilter, utils }) => {\n  const { Type, isFile } = utils;\n\n  // subscribe to file load and append required info\n  addFilter(\n    'DID_LOAD_ITEM',\n    (item, { query }) =>\n      new Promise((resolve, reject) => {\n        // get file reference\n        const file = item.file;\n\n        // if this is not a jpeg image we are not interested\n        if (\n          !isFile(file) ||\n          !isJPEG(file) ||\n          !query('GET_ALLOW_IMAGE_EXIF_ORIENTATION') ||\n          !shouldCorrectImageExifOrientation()\n        ) {\n          // continue with the unaltered dataset\n          return resolve(item);\n        }\n\n        // get orientation from exif data\n        getImageOrientation(file).then(orientation => {\n          item.setMetadata('exif', { orientation });\n          resolve(item);\n        });\n      })\n  );\n\n  // Expose plugin options\n  return {\n    options: {\n      // Enable or disable image orientation reading\n      allowImageExifOrientation: [true, Type.BOOLEAN]\n    }\n  };\n};\n\n// fire pluginloaded event if running in browser, this allows registering the plugin when using async script tags\nconst isBrowser$1 =\n  typeof window !== 'undefined' && typeof window.document !== 'undefined';\nif (isBrowser$1) {\n  document.dispatchEvent(\n    new CustomEvent('FilePond:pluginloaded', { detail: plugin })\n  );\n}\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (plugin);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvZmlsZXBvbmQtcGx1Z2luLWltYWdlLWV4aWYtb3JpZW50YXRpb24vZGlzdC9maWxlcG9uZC1wbHVnaW4taW1hZ2UtZXhpZi1vcmllbnRhdGlvbi5lc20uanMiLCJtYXBwaW5ncyI6Ijs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSwwQkFBMEIsVUFBVTtBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGtCQUFrQjs7QUFFbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixrQkFBa0I7QUFDcEMsVUFBVSxlQUFlOztBQUV6QjtBQUNBO0FBQ0E7QUFDQSxhQUFhLE9BQU87QUFDcEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxxQ0FBcUMsYUFBYTtBQUNsRDtBQUNBLFNBQVM7QUFDVCxPQUFPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0NBQStDLGdCQUFnQjtBQUMvRDtBQUNBOztBQUVBLGlFQUFlLE1BQU0sRUFBQyIsInNvdXJjZXMiOlsiSDpcXEtBTkhBSVlBXFxNYWluUHJvXFxMZWFyblByb1xcY2xpZW50XFxub2RlX21vZHVsZXNcXGZpbGVwb25kLXBsdWdpbi1pbWFnZS1leGlmLW9yaWVudGF0aW9uXFxkaXN0XFxmaWxlcG9uZC1wbHVnaW4taW1hZ2UtZXhpZi1vcmllbnRhdGlvbi5lc20uanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBGaWxlUG9uZFBsdWdpbkltYWdlRXhpZk9yaWVudGF0aW9uIDEuMC4xMVxuICogTGljZW5zZWQgdW5kZXIgTUlULCBodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVC9cbiAqIFBsZWFzZSB2aXNpdCBodHRwczovL3BxaW5hLm5sL2ZpbGVwb25kLyBmb3IgZGV0YWlscy5cbiAqL1xuXG4vKiBlc2xpbnQtZGlzYWJsZSAqL1xuXG4vLyB0ZXN0IGlmIGZpbGUgaXMgb2YgdHlwZSBpbWFnZVxuY29uc3QgaXNKUEVHID0gZmlsZSA9PiAvXmltYWdlXFwvanBlZy8udGVzdChmaWxlLnR5cGUpO1xuXG5jb25zdCBNYXJrZXIgPSB7XG4gIEpQRUc6IDB4ZmZkOCxcbiAgQVBQMTogMHhmZmUxLFxuICBFWElGOiAweDQ1Nzg2OTY2LFxuICBUSUZGOiAweDQ5NDksXG4gIE9yaWVudGF0aW9uOiAweDAxMTIsXG4gIFVua25vd246IDB4ZmYwMFxufTtcblxuY29uc3QgZ2V0VWludDE2ID0gKHZpZXcsIG9mZnNldCwgbGl0dGxlID0gZmFsc2UpID0+XG4gIHZpZXcuZ2V0VWludDE2KG9mZnNldCwgbGl0dGxlKTtcbmNvbnN0IGdldFVpbnQzMiA9ICh2aWV3LCBvZmZzZXQsIGxpdHRsZSA9IGZhbHNlKSA9PlxuICB2aWV3LmdldFVpbnQzMihvZmZzZXQsIGxpdHRsZSk7XG5cbmNvbnN0IGdldEltYWdlT3JpZW50YXRpb24gPSBmaWxlID0+XG4gIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBjb25zdCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICAgIHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbihlKSB7XG4gICAgICBjb25zdCB2aWV3ID0gbmV3IERhdGFWaWV3KGUudGFyZ2V0LnJlc3VsdCk7XG5cbiAgICAgIC8vIEV2ZXJ5IEpQRUcgZmlsZSBzdGFydHMgZnJvbSBiaW5hcnkgdmFsdWUgJzB4RkZEOCdcbiAgICAgIGlmIChnZXRVaW50MTYodmlldywgMCkgIT09IE1hcmtlci5KUEVHKSB7XG4gICAgICAgIC8vIFRoaXMgYWludCBubyBKUEVHXG4gICAgICAgIHJlc29sdmUoLTEpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGxlbmd0aCA9IHZpZXcuYnl0ZUxlbmd0aDtcbiAgICAgIGxldCBvZmZzZXQgPSAyO1xuXG4gICAgICB3aGlsZSAob2Zmc2V0IDwgbGVuZ3RoKSB7XG4gICAgICAgIGNvbnN0IG1hcmtlciA9IGdldFVpbnQxNih2aWV3LCBvZmZzZXQpO1xuICAgICAgICBvZmZzZXQgKz0gMjtcblxuICAgICAgICAvLyBUaGVyZSdzIG91ciBBUFAxIE1hcmtlclxuICAgICAgICBpZiAobWFya2VyID09PSBNYXJrZXIuQVBQMSkge1xuICAgICAgICAgIGlmIChnZXRVaW50MzIodmlldywgKG9mZnNldCArPSAyKSkgIT09IE1hcmtlci5FWElGKSB7XG4gICAgICAgICAgICAvLyBubyBFWElGIGluZm8gZGVmaW5lZFxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gR2V0IFRJRkYgSGVhZGVyXG4gICAgICAgICAgY29uc3QgbGl0dGxlID0gZ2V0VWludDE2KHZpZXcsIChvZmZzZXQgKz0gNikpID09PSBNYXJrZXIuVElGRjtcbiAgICAgICAgICBvZmZzZXQgKz0gZ2V0VWludDMyKHZpZXcsIG9mZnNldCArIDQsIGxpdHRsZSk7XG5cbiAgICAgICAgICBjb25zdCB0YWdzID0gZ2V0VWludDE2KHZpZXcsIG9mZnNldCwgbGl0dGxlKTtcbiAgICAgICAgICBvZmZzZXQgKz0gMjtcblxuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGFnczsgaSsrKSB7XG4gICAgICAgICAgICAvLyBmb3VuZCB0aGUgb3JpZW50YXRpb24gdGFnXG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgIGdldFVpbnQxNih2aWV3LCBvZmZzZXQgKyBpICogMTIsIGxpdHRsZSkgPT09IE1hcmtlci5PcmllbnRhdGlvblxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgIHJlc29sdmUoZ2V0VWludDE2KHZpZXcsIG9mZnNldCArIGkgKiAxMiArIDgsIGxpdHRsZSkpO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKChtYXJrZXIgJiBNYXJrZXIuVW5rbm93bikgIT09IE1hcmtlci5Vbmtub3duKSB7XG4gICAgICAgICAgLy8gSW52YWxpZFxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG9mZnNldCArPSBnZXRVaW50MTYodmlldywgb2Zmc2V0KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBOb3RoaW5nIGZvdW5kXG4gICAgICByZXNvbHZlKC0xKTtcbiAgICB9O1xuXG4gICAgLy8gd2UgZG9uJ3QgbmVlZCB0byByZWFkIHRoZSBlbnRpcmUgZmlsZSB0byBnZXQgdGhlIG9yaWVudGF0aW9uXG4gICAgcmVhZGVyLnJlYWRBc0FycmF5QnVmZmVyKGZpbGUuc2xpY2UoMCwgNjQgKiAxMDI0KSk7XG4gIH0pO1xuXG5jb25zdCBJU19CUk9XU0VSID0gKCgpID0+XG4gIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiB3aW5kb3cuZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnKSgpO1xuY29uc3QgaXNCcm93c2VyID0gKCkgPT4gSVNfQlJPV1NFUjtcblxuLy8gMngxIHBpeGVsIGltYWdlIDkwQ1cgcm90YXRlZCB3aXRoIG9yaWVudGF0aW9uIGhlYWRlclxuY29uc3QgdGVzdFNyYyA9XG4gICdkYXRhOmltYWdlL2pwZztiYXNlNjQsLzlqLzRBQVFTa1pKUmdBQkFRRUFTQUJJQUFELzRRQTZSWGhwWmdBQVRVMEFLZ0FBQUFnQUF3RVNBQU1BQUFBQkFBWUFBQUVvQUFNQUFBQUJBQUlBQUFJVEFBTUFBQUFCQUFFQUFBQUFBQUQvMndCREFQLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy93QUFMQ0FBQkFBSUJBU0lBLzhRQUpnQUJBQUFBQUFBQUFBQUFBQUFBQUFBQUF4QUJBQUFBQUFBQUFBQUFBQUFBQUFBQUFQL2FBQWdCQVFBQVB3QkgvOWs9JztcblxuLy8gc2hvdWxkIGNvcnJlY3Qgb3JpZW50YXRpb24gaWYgaXMgcHJlc2VudGVkIGluIGxhbmRzY2FwZSwgaW4gd2hpY2ggY2FzZSB0aGUgYnJvd3NlciBkb2Vzbid0IGF1dG9jb3JyZWN0XG5sZXQgc2hvdWxkQ29ycmVjdCA9IHVuZGVmaW5lZDtcbmNvbnN0IHRlc3RJbWFnZSA9IGlzQnJvd3NlcigpID8gbmV3IEltYWdlKCkgOiB7fTtcbnRlc3RJbWFnZS5vbmxvYWQgPSAoKSA9PlxuICAoc2hvdWxkQ29ycmVjdCA9IHRlc3RJbWFnZS5uYXR1cmFsV2lkdGggPiB0ZXN0SW1hZ2UubmF0dXJhbEhlaWdodCk7XG50ZXN0SW1hZ2Uuc3JjID0gdGVzdFNyYztcblxuY29uc3Qgc2hvdWxkQ29ycmVjdEltYWdlRXhpZk9yaWVudGF0aW9uID0gKCkgPT4gc2hvdWxkQ29ycmVjdDtcblxuLyoqXG4gKiBSZWFkIEltYWdlIE9yaWVudGF0aW9uIFBsdWdpblxuICovXG5jb25zdCBwbHVnaW4gPSAoeyBhZGRGaWx0ZXIsIHV0aWxzIH0pID0+IHtcbiAgY29uc3QgeyBUeXBlLCBpc0ZpbGUgfSA9IHV0aWxzO1xuXG4gIC8vIHN1YnNjcmliZSB0byBmaWxlIGxvYWQgYW5kIGFwcGVuZCByZXF1aXJlZCBpbmZvXG4gIGFkZEZpbHRlcihcbiAgICAnRElEX0xPQURfSVRFTScsXG4gICAgKGl0ZW0sIHsgcXVlcnkgfSkgPT5cbiAgICAgIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgLy8gZ2V0IGZpbGUgcmVmZXJlbmNlXG4gICAgICAgIGNvbnN0IGZpbGUgPSBpdGVtLmZpbGU7XG5cbiAgICAgICAgLy8gaWYgdGhpcyBpcyBub3QgYSBqcGVnIGltYWdlIHdlIGFyZSBub3QgaW50ZXJlc3RlZFxuICAgICAgICBpZiAoXG4gICAgICAgICAgIWlzRmlsZShmaWxlKSB8fFxuICAgICAgICAgICFpc0pQRUcoZmlsZSkgfHxcbiAgICAgICAgICAhcXVlcnkoJ0dFVF9BTExPV19JTUFHRV9FWElGX09SSUVOVEFUSU9OJykgfHxcbiAgICAgICAgICAhc2hvdWxkQ29ycmVjdEltYWdlRXhpZk9yaWVudGF0aW9uKClcbiAgICAgICAgKSB7XG4gICAgICAgICAgLy8gY29udGludWUgd2l0aCB0aGUgdW5hbHRlcmVkIGRhdGFzZXRcbiAgICAgICAgICByZXR1cm4gcmVzb2x2ZShpdGVtKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGdldCBvcmllbnRhdGlvbiBmcm9tIGV4aWYgZGF0YVxuICAgICAgICBnZXRJbWFnZU9yaWVudGF0aW9uKGZpbGUpLnRoZW4ob3JpZW50YXRpb24gPT4ge1xuICAgICAgICAgIGl0ZW0uc2V0TWV0YWRhdGEoJ2V4aWYnLCB7IG9yaWVudGF0aW9uIH0pO1xuICAgICAgICAgIHJlc29sdmUoaXRlbSk7XG4gICAgICAgIH0pO1xuICAgICAgfSlcbiAgKTtcblxuICAvLyBFeHBvc2UgcGx1Z2luIG9wdGlvbnNcbiAgcmV0dXJuIHtcbiAgICBvcHRpb25zOiB7XG4gICAgICAvLyBFbmFibGUgb3IgZGlzYWJsZSBpbWFnZSBvcmllbnRhdGlvbiByZWFkaW5nXG4gICAgICBhbGxvd0ltYWdlRXhpZk9yaWVudGF0aW9uOiBbdHJ1ZSwgVHlwZS5CT09MRUFOXVxuICAgIH1cbiAgfTtcbn07XG5cbi8vIGZpcmUgcGx1Z2lubG9hZGVkIGV2ZW50IGlmIHJ1bm5pbmcgaW4gYnJvd3NlciwgdGhpcyBhbGxvd3MgcmVnaXN0ZXJpbmcgdGhlIHBsdWdpbiB3aGVuIHVzaW5nIGFzeW5jIHNjcmlwdCB0YWdzXG5jb25zdCBpc0Jyb3dzZXIkMSA9XG4gIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiB3aW5kb3cuZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnO1xuaWYgKGlzQnJvd3NlciQxKSB7XG4gIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoXG4gICAgbmV3IEN1c3RvbUV2ZW50KCdGaWxlUG9uZDpwbHVnaW5sb2FkZWQnLCB7IGRldGFpbDogcGx1Z2luIH0pXG4gICk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHBsdWdpbjtcbiJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOlswXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/filepond-plugin-image-exif-orientation/dist/filepond-plugin-image-exif-orientation.esm.js\n");

/***/ })

};
;