function init() {
    console.debug("loaded");
    var heading = document.getElementById("hw-heading");
    var colours = [heading.style.color, "#00F"];
    //chrome.usb.getDevices({}, onDeviceFound);
    var add_device = document.getElementById('add-device');
    device_info = document.getElementById('device-info');
    add_device.addEventListener('click', askForDevices);
}
window.onload = init;
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