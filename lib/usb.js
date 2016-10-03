const VENDOR_TYPE = "vendor"; // aka 0x40

var device_info;
var digitalPinState;
var gainMask = 0;
var connectionHandle;

function askForDevices() {
    console.log("getting devices");
    chrome.usb.getUserSelectedDevices({
        'multiple': false
    }, function(selected_devices) {
        if (chrome.runtime.lastError != undefined) {
            console.warn('chrome.usb.getUserSelectedDevices error: ' + chrome.runtime.lastError.message);
            return;
        }
        for (var device of selected_devices) {
            chrome.usb.openDevice(device, function(handle) {
                if (chrome.runtime.lastError != undefined) {
                    var el = document.createElement('em');
                    el.textContent = 'Failed to open device: ' + chrome.runtime.lastError.message;
                    device_info.appendChild(el);
                } else {
                    populateDeviceInfo(handle, function() {
                    	connectionHandle = handle;
						console.log("set conHandle", connectionHandle);
                    });
                }
            });
        }
    });
}


function usbSendControl(requestType, request, value, index, length, data) {
    var transferInfo = {
        requestType: requestType,
        /* string: "vendor", "standard", "class" or "reserved" */
        recipient: "interface",
        /* string: "device", "interface", "endpoint" or "other". */
        direction: "out",
        /* "in" or "out" */
        request: request,
        /* int */
        value: value,
        index: index,
        /* int */
        length: length,
        /* only when dir is in */
        data: data /* only when dir is out */
    };
    chrome.usb.controlTransfer(connectionHandle, transferInfo, function() {//TODO
		if (chrome.runtime.lastError != undefined) {
			console.log('error: ' + chrome.runtime.lastError.message);
		} else {
			console.log("all ok");
		}
    });
}


function setDigitalOut(digitalState) {
    console.log("set digitalPinState=" + digitalState);
    digitalPinState = digitalState;
    usbSendControl(VENDOR_TYPE, 0xa6, digitalState, 0, 0, new Uint8Array([]).buffer);
}

/** mode: int */
function setDeviceMode(mode) {
    usbSendControl(VENDOR_TYPE, 0xa5, mode, gainMask, 0, NULL);
}

/** newGain: double **/
// function setGain(newGain){
//     if (newGain == scopeGain) {
//     	return; //No update!
//     }
//     gainBuffers(scopeGain/newGain);
//     scopeGain = newGain;
//     if (newGain == 0.5){
//         gainMask = 7<<2 | 7<<10;
//     }
//     else {
//     	gainMask = log2(newGain))<<2 | (unsigned short)(log2(newGain))<<10;
// 	}
//     console.log("newGain = "+newGain);
//     console.log("gainMask = "+gainMask);
//     usbSendControl(VENDOR_TYPE, 0xa5, deviceMode, gainMask, 0, NULL);
// }

function setFunctionGen(channel, functionGenControl) {//TODO
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
            el.textContent = 'Failed to read device configuration: ' + chrome.runtime.lastError.message;
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
