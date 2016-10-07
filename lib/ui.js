var usb = require("./usb.js");

var boardControls;
var choose_device_button
var device_info;

module.exports.init = init;

function init() {
    console.debug("loaded");
    var heading = document.getElementById("hw-heading");
    var colours = [heading.style.color, "#00F"];

    boardControls = document.getElementById('board-controls');
    boardControls.setAttribute('style','visibility:hidden');

    //chrome.usb.getDevices({}, onDeviceFound);
    
    if (usb.getConnectionHandle() == null) {
        choose_device_button = document.getElementById('add-device');
        device_info = document.getElementById('device-info');
        choose_device_button.addEventListener('click', askForDevices);
    } else {
        showBoardControls();
    }

}

function showBoardControls() {
    boardControls.setAttribute('style','visibility:visibile');
    var setDigitalButton = document.getElementById('set-digital');
    var setDigitalVal = document.getElementById('set-digital-val');
    setDigitalButton.addEventListener('click', function() {
        var currentVal = parseInt(setDigitalVal.options[setDigitalVal.selectedIndex].value, 10);
        console.log("set dig:"+currentVal)
        usb.setDigitalOut(currentVal);
    });

    // and hide board chooser control
    choose_device_button.setAttribute('style','visibility:hidden');
}

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
                    usb.setConnectionHandle(handle);
                    showBoardControls();
//                     populateDeviceInfo(handle, function() {
//                       //NA    
//                     });
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