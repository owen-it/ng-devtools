import { initDevTools } from 'src/devtools'
import Bridge from 'src/bridge'

const target = document.getElementById('target')
const targetWindow = target.contentWindow

target.src = 'target.html'
target.onload = () => 
{
    initDevTools({
        connect(cb)
        {
            inject('./build/backend.js', () => {
                cb(new Bridge({
                    listen(fn) {
                        targetWindow.parent.addEventListener('message', event => {
                            fn(event.data)
                        })
                    },
                    send(data){
                        console.log('devtools -> backend', data)
                        targetWindow.postMessage(data, '*')
                    }
                }))
            })
        },
        onReload( reloadFn )
        {
            target.onload = reloadFn
        }
    })
}

function inject (src, load) 
{
    if(!src || src === 'false'){
        return load()
    }

    const script = target.contentDocument.createElement('script')

    script.src = src
    script.onload = load
    target.contentDocument.body.appendChild(script)
}