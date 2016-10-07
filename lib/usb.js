const VENDOR_TYPE = "vendor"; // aka 0x40

var device_info;
var digitalPinState;
var gainMask = 0;
var connectionHandle;

module.exports.setConnectionHandle = setConnectionHandle;
module.exports.getConnectionHandle = getConnectionHandle;
module.exports.setDigitalOut = setDigitalOut;

function setConnectionHandle(handle) {
	connectionHandle = handle;
	console.log("set conHandle", connectionHandle);
}

function getConnectionHandle(handle) {
	return connectionHandle;
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
