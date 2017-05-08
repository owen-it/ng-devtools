// This script is injected into every page
import { initBoostrap } from 'src/backend/boostrap'

// inject the bootstrap angular
const script = document.createElement('script')
script.textContent = `;(${initBoostrap.toString()})(window)`
document.documentElement.appendChild(script)
script.parentNode.removeChild(script)