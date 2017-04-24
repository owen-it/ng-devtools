// the background script runs all the time and servers as a central message
// hub for each ng devtools (panel + proxy + backend) instance.

const ports = {}

chrome.runtime.onConnect.addListener(port => {
    let tab
    let name

    if (isNumeric(port.name)) {
        tab = port.name
        name = 'devtools'

        installProxy(+port.name)
    }

    console.log('[backend][port]', port)
})

chrome.runtime.onMessage.addListener((req, sender) => {
    console.log('[backend][message]', req, sender)


    // if (sender.tab && req.angularDetected) {

    // }
})

function isNumeric (str) {
    return +str + '' === str
}

function installProxy (tabId) {
    console.log('[backend]', tabId)
return
    chrome.tabs.executeScript(tabId, {
        file: '/build/proxy.js'
    }, function (res) {
        if (!res) {
            ports[tabId].devtools.postMessage('proxy-fail')
        } else {
            console.log('injected proxy to tab' + tabId)
        }
    })
}