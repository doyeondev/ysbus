import Link from 'next/link'

export default function Footer(): JSX.Element {
  return (
    <footer className="body-font text-gray-600">
      <div className="container mx-auto flex flex-col items-center px-5 py-8">
        <p className="mt-4 text-sm text-gray-500">© 2024 용산03</p>
      </div>
    </footer>
  )
}
