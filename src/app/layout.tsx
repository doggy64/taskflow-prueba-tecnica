import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from '@/components/auth/LogoutButton'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TaskFlow',
  description: 'Gestión de Proyectos y Tareas',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <html lang="es">
      <body className={`${inter.className} bg-gray-50 min-h-screen flex flex-col`}>
        
        {user && (
          <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
              
              <div className="flex items-center gap-8">
                <Link href="/" className="text-2xl font-bold text-blue-600">
                  TaskFlow
                </Link>
                <nav className="hidden md:flex gap-6">
                  <Link href="/" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors">
                    Dashboard
                  </Link>
                  <Link href="/projects" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors">
                    Proyectos
                  </Link>
                </nav>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {user.user_metadata?.full_name || 'Usuario'}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <div className="h-8 w-px bg-gray-200 mx-2 hidden md:block"></div>
                <LogoutButton />
              </div>
            </div>
          </header>
        )}
        <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
        
      </body>
    </html>
  )
}