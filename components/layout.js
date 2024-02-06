import Header from './header'
import Footer from './footer'

export default function Layout({ children }) {
  return (
    <div className="bg-transparent">
      <Header />
      <div className="h-auto">{children}</div>
      {/* <Footer /> */}
    </div>
  )
}
