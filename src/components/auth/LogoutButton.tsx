'use client'

import { logout } from '@/actions/auth'
import { useTransition } from 'react'

export default function LogoutButton() {
  const [isPending, startTransition] = useTransition()

  const handleLogout = () => {
    startTransition(async () => {
      const result = await logout()
      if (result?.error) {
        console.error('Error al cerrar sesión:', result.error)
      }
    })
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      className="text-sm font-medium px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
    >
      {isPending ? 'Saliendo...' : 'Cerrar sesión'}
    </button>
  )
}