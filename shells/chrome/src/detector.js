window.addEventListener('message', e => {
    if (e.source === window && e.data.angularDetected) {
        chrome.runtime.sendMessage({
            angularDetected: e.data.angularDetected
        })
    }
})

function detect (win) {

    setTimeout(() => {
        const root = document.querySelector('.ng-scope')
        let $scope = root && angular.element(root).data('$scope')

        if ($scope) {
            
            while ($scope.$parent) {
                $scope = $scope.parent
            }

            // win.postMessage({
            //     devtoolsEnabled: angular.config.devtools,
            //     angularDetected: true
            // }, '*')
        }
    }, 200)

}

// inject the detector
const script = document.createElement('script')
script.textContent = `;(${detect.toString()})(window)`
document.documentElement.appendChild(script)
script.parentNode.removeChild(script)