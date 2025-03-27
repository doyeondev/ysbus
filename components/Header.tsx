import Link from 'next/link'
import DarkModeToggleButton from './dark-mode-toggle-button'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'

export default function Header(): JSX.Element {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false)

  useEffect(() => {
    async function getPageData() {
      localStorage.theme = 'light'
    }
    getPageData()
  }, [])

  const toggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    localStorage.theme = newMode ? 'dark' : 'light'
    document.documentElement.classList.toggle('dark', newMode)
  }

  return (
    <>
      <header className="body-font fixed h-[60px] w-full bg-transparent bg-transparent px-4 py-2 text-gray-600 sm:px-10">
        <div className="mx-auto flex h-full flex-wrap items-center md:flex-row">
          <div className="flex flex-wrap place-content-center items-center gap-2">
          </div>
          <nav className="ml-auto flex flex-wrap items-center justify-center text-base">
            <div className="ml-auto flex gap-x-5">
              <DarkModeToggleButton
                isDarkMode={isDarkMode}
                toggleDarkMode={toggleDarkMode}
              />
            </div>
          </nav>
        </div>
      </header>
    </>
  )
}
