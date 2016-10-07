var ui = require("./ui.js");

window.onload = ui.init;


// function onDeviceFound(devices) {
//   if (chrome.runtime.lastError != undefined) {
//     console.warn('chrome.usb.getDevices error: ' +
//                  chrome.runtime.lastError.message);
//     return;
//   }
//   if (devices) {
//     if (devices.length > 0) {
//       console.log("Device(s) found: "+devices.length);
//     } else {
//       console.log("Device could not be found");
//     }
//   } else {
//     console.log("Permission denied.");
//   }
// }