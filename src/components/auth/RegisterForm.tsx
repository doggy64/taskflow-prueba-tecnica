'use client'

import { useState } from 'react'
import { register } from '@/actions/auth'
import Link from 'next/link'

export default function RegisterForm() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)
    
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const name = formData.get('name') as string
    
    if (!email || !password || !name) {
      setError('Todos los campos son obligatorios.')
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      setIsLoading(false)
      return
    }

    const result = await register(formData)
    
    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6 w-full max-w-md mx-auto p-8 bg-white rounded-xl shadow-lg border border-gray-100">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Crear Cuenta</h2>
        <p className="mt-2 text-sm text-gray-600">Únete a TaskFlow hoy mismo</p>
      </div>
      
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
          <input 
            type="text" 
            name="name" 
            required 
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" 
            placeholder="Ej. Juan Pérez"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input 
            type="email" 
            name="email" 
            required 
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" 
            placeholder="tu@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
          <input 
            type="password" 
            name="password" 
            required 
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" 
            placeholder="Mínimo 6 caracteres"
          />
        </div>
      </div>

      <button 
        type="submit" 
        disabled={isLoading}
        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {isLoading ? 'Creando cuenta...' : 'Registrarse'}
      </button>

      <p className="text-center text-sm text-gray-600">
        ¿Ya tienes cuenta? <Link href="/login" className="text-blue-600 font-semibold hover:underline">Inicia sesión aquí</Link>
      </p>
    </form>
  )
}