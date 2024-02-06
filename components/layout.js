import Header from './header'
import Nav from './nav'

import Footer from './footer'

export default function Layout({ children }) {
  return (
    <div className="bg-primary">
      <Nav />
      <div className="h-auto">{children}</div>
      <Footer />
    </div>
  )
}
