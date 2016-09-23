function init() {
  console.debug("loaded");
  var heading = document.getElementById("hw-heading");
  var colours = [heading.style.color, "#00F"];
  var index = 0;
  setInterval(function() {
    index = (index === 0) ? 1 : 0;
    heading.style.color = colours[index]},
  500);

  chrome.usb.getDevices({"vendorId": 1003, "productId": 40960}, onDeviceFound);
  //chrome.usb.findDevices({"vendorId": 1003, "productId": 40960, "interfaceId": interfaceId}, onDeviceFound);
}

window.onload = init;

function onDeviceFound(devices) {
  this.devices=devices;
  if (devices) {
    if (devices.length > 0) {
      console.log("Device(s) found: "+devices.length);
    } else {
      console.log("Device could not be found");
    }
  } else {
    console.log("Permission denied.");
  }
}
