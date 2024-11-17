'use client'

import { toastSuccess } from '@lib/toast'
import { AES, enc } from 'crypto-js'
import React, { useState } from 'react'

const Encrypt = () => {
  const [encrypted, setEncrypted] = useState('')
  const [data, setData] = useState({
    message: '',
    key: '',
  })
  return (
    <main className="flex flex-col text-secondary-light">
      <h1>Encrypt Data</h1>
      <input
        type="text"
        placeholder="Message"
        value={data.message}
        onChange={(e) => setData({ ...data, message: e.target.value })}
        className="border-primary"
      />
      <input
        type="text"
        placeholder="Key"
        value={data.key}
        onChange={(e) => setData({ ...data, key: e.target.value })}
        className="border-primary"
      />
      <button
        type="button"
        onClick={() => {
          const encrypted = AES.encrypt(data.message, data.key).toString()
          setEncrypted(encrypted)
          navigator.clipboard.writeText(encrypted)
        }}
      >
        Encrypt
      </button>
      <button
        type="button"
        onClick={() =>
          setEncrypted(AES.decrypt(encrypted, data.key).toString(enc.Utf8))
        }
      >
        Decrypt
      </button>
      <div>{encrypted}</div>
      <button
        type="button"
        onClick={() => toastSuccess('Data copied to clipboard')}
      >
        Toast
      </button>
    </main>
  )
}

export default Encrypt
