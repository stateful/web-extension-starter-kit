import manifest from '../public/manifest.json' assert { type: 'json' }

import { WebExtensionButton } from './component.js'
import './index.css'

console.debug(`Initiate Web Extension v${manifest.version}`)

// attach element to page
document.body.appendChild(WebExtensionButton.render('image'))
