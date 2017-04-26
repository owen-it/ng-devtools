// This is the devtools script, which is called when the user opens the
// chrome devtool on a page. We check to see if we global hook has detected
// Angular presence on the page. If yes, create the Angular panel; otherwise poll
// for 10 seconds.

let created = false
let checkCount = 0

chrome.devtools.network.onNavigated.addListener(createPanel)
const checkAngularInterval = setInterval(createPanel, 1000)

createPanel()

function createPanel () {
    if (created || checkCount++ > 10) {
        return
    }

    chrome.devtools.inspectedWindow.eval(
        '!!(window.__NG_DEVTOOLS_GLOBAL_HOOK__.Angular)',
        function (hasAngular) {
            if (!hasAngular || created) {
                return
            }

            clearInterval(checkAngularInterval)
            created = true
            chrome.devtools.panels.create(
                'Angular', 'icons/128.png', 'devtools.html',
                function (panel) { /* panel loaded */ }
            )
        }
    )
}