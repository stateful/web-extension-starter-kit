import React from 'react'
import { $, expect } from '@wdio/globals'
import { mock, fn } from '@wdio/browser-runner'
import { render } from '@testing-library/react'
import browser from 'webextension-polyfill'

import Component from './component.js'

mock('webextension-polyfill', () => ({
  runtime: {
    sendMessage: fn().mockResolvedValue({ data: 'Some funny cat fact!' })
  }
}))

describe('Web Extension Component', () => {
  it('should be able to fetch cat facts', async () => {
    render(<Component />)
    await expect($('h1')).toHaveText('Cat Facts!')

    const getCatFactBtn = await $('aria/Get a Cat Fact!')
    await getCatFactBtn.click()

    await getCatFactBtn.waitForEnabled()
    await expect($('p')).toHaveText('Some funny cat fact!') // WebdriverIO matcher (async)
    expect(browser.runtime.sendMessage).toHaveBeenCalledWith({ action: 'fetch' }) // Jest matcher (sync)
  })
})

// import React, { useState } from 'react'
// import browser from

// export default () => {
//   const [fact, setFact] = useState('Click the button to fetch a fact!')
//   const [loading, setLoading] = useState(false)

//   async function handleOnClick() {
//     setLoading(true)
//     const {data} = await browser.runtime.sendMessage({ action: 'fetch' })
//     setFact(data)
//     setLoading(false)
//   }

//   return (
//     <div className='flex flex-col gap-4 p-4 shadow-sm bg-gradient-to-r from-purple-500 to-pink-500 w-96'>
//       <h1>Cat Facts!</h1>
//       <button
//         className='px-4 py-2 font-semibold text-sm bg-cyan-500 text-white rounded-full shadow-sm disabled:opacity-75 w-48'
//         disabled={loading} onClick={handleOnClick}>Get a Cat Fact!
//       </button>
//       <p className='text-white'>{fact}</p>
//     </div>
//   )
// }
