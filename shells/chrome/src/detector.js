window.addEventListener('message', e => {
    if (e.source === window && e.data.angularDetected) {
        chrome.runtime.sendMessage(e.data)
    }
})

function detect (win) {

    // verify if has angular
    if (!win.angular) return

    setTimeout(() => {
        const root = document.querySelector('.ng-scope')
        let rooScope = win.angular.element(root).data('$scope')

        if (rooScope) {
            
            while (rooScope.$parent) {
                rooScope = rooScope.$parent
            }

            win.postMessage({
                devtoolsEnabled: true,
                angularDetected: true
            }, '*')
        }
    }, 100)

}

// inject the detector
const script = document.createElement('script')
script.textContent = `;(${detect.toString()})(window)`
document.documentElement.appendChild(script)
script.parentNode.removeChild(script)