'use client'

import { useEffect, useState } from 'react'
import { FiDownload } from 'react-icons/fi'

type WindowEvent = Event & {
  prompt: () => void
  userChoice: Promise<{ outcome: string }>
}

function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<WindowEvent | null>(null)
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault()
      setDeferredPrompt(event as WindowEvent)
    })
  }, [])

  const handleInstall = () => {
    if (deferredPrompt) {
      deferredPrompt?.prompt()
      deferredPrompt?.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt')
          setDeferredPrompt(null)
        } else {
          console.log('User dismissed the A2HS prompt')
        }
      })
    }
  }

  useEffect(() => {
    if (!window.matchMedia('(display-mode: standalone)').matches)
      setShowButton(true)
  }, [])

  return showButton ? (
    <button
      type="button"
      onClick={handleInstall}
      disabled={!deferredPrompt}
      className="p-2"
    >
      <FiDownload className="size-6" />
    </button>
  ) : null
}

export default InstallButton
