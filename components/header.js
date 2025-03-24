import Link from 'next/link'
import DarkModeToggleButton from './dark-mode-toggle-button'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css' // optional for styling

export default function Header() {
  useEffect(() => {
    async function getPageData() {
      localStorage.theme = 'light'
    }
    getPageData()
  }, [])
  return (
    <>
      <header className="body-font fixed h-[60px] w-full bg-transparent bg-transparent px-4 py-2 text-gray-600 sm:px-10">
        <div className="mx-auto flex h-full flex-wrap items-center md:flex-row">
          {/* 홈 링크 */}
          <div className="flex flex-wrap place-content-center items-center gap-2"></div>
          <nav className="ml-auto flex flex-wrap items-center justify-center text-base">
            <div className="ml-auto flex gap-x-5">
              <DarkModeToggleButton />
            </div>
          </nav>
        </div>
      </header>
    </>
  )
}
