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
      // tippy('#loginBtn', {
      //   content: '엑세스를 제공 받으신 분만 사용 가능합니다.',
      // })
    }
    getPageData()
  }, [])
  return (
    <>
      <header className="body-font fixed h-[60px] w-full bg-transparent bg-transparent px-4 py-2 text-gray-600 sm:px-10">
        <div className="mx-auto flex h-full flex-wrap items-center md:flex-row">
          {/* 홈 링크 */}
          <div className="flex flex-wrap place-content-center items-center gap-2">
            {/* <Link href="/" className="title-font flex font-medium text-gray-900">
              <Image alt="용산03" src="/icon/yongsan_03.svg" width={0} height={0} sizes="100vw" className="w-[240px] justify-center" />
            </Link> */}
            {/* <p className="ml-0 text-xl font-bold text-white sm:ml-4 sm:text-3xl">용산03 시간표</p> */}
          </div>
          <nav className="ml-auto flex flex-wrap items-center justify-center text-base">
            {/* <Link href="/" className="mr-5 hover:text-gray-900">
              홈
            </Link>
            <Link href="/projects" className="mr-5 hover:text-gray-900">
              계약서 작성하기
            </Link> */}
            <div className="ml-auto flex gap-x-5">
              {/* <Link href="/login" className="hover:text-gray-900">
                <button id="loginBtn" className="btn-plain rounded-lg border px-4 py-1">
                  로그인
                </button>
              </Link> */}

              <DarkModeToggleButton />
            </div>
          </nav>
        </div>
      </header>
    </>
  )
}
