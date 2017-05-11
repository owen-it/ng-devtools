// This script is injected into every page
import { initBootstrap } from 'src/backend/bootstrap'

// inject the bootstrap angular
const script = document.createElement('script')
script.textContent = `;(${initBootstrap.toString()})(window)`
document.documentElement.appendChild(script)
script.parentNode.removeChild(script)