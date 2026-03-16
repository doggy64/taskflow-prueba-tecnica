import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <h2 className="text-6xl font-extrabold text-blue-600 mb-4">404</h2>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">Página no encontrada</h3>
      <p className="text-gray-600 mb-8 max-w-md">
        Lo sentimos, no pudimos encontrar el proyecto o la página que estás buscando. Es posible que haya sido eliminada o no tengas acceso.
      </p>
      <Link 
        href="/" 
        className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
      >
        Volver al Dashboard
      </Link>
    </div>
  )
}