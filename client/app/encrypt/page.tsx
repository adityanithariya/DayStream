'use client'

import { AES, enc, format } from 'crypto-js'
import React, { useState } from 'react'

const Encrypt = () => {
  const [encrypted, setEncrypted] = useState('')
  const [data, setData] = useState({
    message: '',
    key: '',
  })
  return (
    <main className="flex flex-col">
      <h1>Encrypt Data</h1>
      <input
        type="text"
        placeholder="Message"
        value={data.message}
        onChange={(e) => setData({ ...data, message: e.target.value })}
      />
      <input
        type="text"
        placeholder="Key"
        value={data.key}
        onChange={(e) => setData({ ...data, key: e.target.value })}
      />
      <button
        type="button"
        onClick={() =>
          setEncrypted(AES.encrypt(data.message, data.key).toString())
        }
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
    </main>
  )
}

export default Encrypt
