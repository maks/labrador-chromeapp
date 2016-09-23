var device_info;


function init() {
  console.debug("loaded");
  var heading = document.getElementById("hw-heading");
  var colours = [heading.style.color, "#00F"];
  var index = 0;
  setInterval(function() {
    index = (index === 0) ? 1 : 0;
    heading.style.color = colours[index]},
  500);

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

function askForDevices() {
	console.log("getting devices");
	chrome.usb.getUserSelectedDevices({
		'multiple': false
	  }, function(selected_devices) {
		if (chrome.runtime.lastError != undefined) {
		  console.warn('chrome.usb.getUserSelectedDevices error: ' +
					   chrome.runtime.lastError.message);
		  return;
		}
		console.log("got devices:"+selected_devices.length);
		for (var device of selected_devices) {
		  console.log("got device:"+device);  

		  chrome.usb.openDevice(device, function(handle) {
			  if (chrome.runtime.lastError != undefined) {
				var el = document.createElement('em');
				el.textContent = 'Failed to open device: ' +
					chrome.runtime.lastError.message;
				device_info.appendChild(el);
			  } else {
				populateDeviceInfo(handle, function () {
				  chrome.usb.closeDevice(handle);
				});
			  }
		  });


		}
	});
}


function appendDeviceInfo(name, value) {
  var el = document.createElement('b');
  el.textContent = name + ': '
  device_info.appendChild(el);
  device_info.appendChild(document.createTextNode(value));
  device_info.appendChild(document.createElement('br'));
}


function populateDeviceInfo(handle, callback) {
  chrome.usb.getConfiguration(handle, function(config) {
    if (chrome.runtime.lastError != undefined) {
      var el = document.createElement('em');
      el.textContent = 'Failed to read device configuration: ' +
          chrome.runtime.lastError.message;
      device_info.appendChild(el);
    } else {
      var el = document.createElement('h2');
      el.textContent = 'Configuration ' + config.configurationValue;
      device_info.appendChild(el);

      for (var iface of config.interfaces) {
        el = document.createElement('h3');
        el.textContent = 'Interface ' + iface.interfaceNumber;
        device_info.appendChild(el);

        appendDeviceInfo('Alternate Setting', iface.alternateSetting);
        appendDeviceInfo('Inteface Class', iface.interfaceClass);
        appendDeviceInfo('Interface Subclass', iface.interfaceSubclass);
        appendDeviceInfo('Interface Protocol', iface.interfaceProtocol);

        for (var endpoint of iface.endpoints) {
          el = document.createElement('h4');
          el.textContent = 'Endpoint ' + endpoint.address;
          device_info.appendChild(el);

          appendDeviceInfo('Type', endpoint.type);
          appendDeviceInfo('Direction', endpoint.direction);
          appendDeviceInfo('Maximum Packet Size', endpoint.maximumPacketSize);
        }
      }
    }
    callback();
  });
}

	

/*
"optional_permissions": [
		{
		    "usbDevices": [
		    {
		       "vendorId": 1003,
		       "productId": 40960
		    }
	       ]
	   }
	 ] 
 */