import React, { ReactNode } from 'react'
import Header from 'components/Header'
// import Footer from './Footer'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps): JSX.Element {
  return (
    <div className="bg-transparent">
      <Header />
      <div className="h-auto">{children}</div>
      {/* <Footer /> */}
    </div>
  )
}
