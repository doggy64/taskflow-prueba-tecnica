'use client'

import { useState } from 'react'
import { createProject, updateProject } from '@/actions/projects'
import Link from 'next/link'

interface ProjectFormProps {
  initialData?: {
    id: string
    name: string
    description: string | null
    color: string
  }
}

export default function ProjectForm({ initialData }: ProjectFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const colorOptions = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', 
    '#8B5CF6', '#EC4899', '#14B8A6', '#64748B'
  ]
  const [selectedColor, setSelectedColor] = useState(initialData?.color || colorOptions[0])

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)

    const name = formData.get('name') as string
    if (!name.trim()) {
      setError('El nombre del proyecto es obligatorio.')
      setIsLoading(false)
      return
    }

    formData.append('color', selectedColor)

    try {
      if (initialData) {
        await updateProject(initialData.id, formData)
      } else {
        await createProject(formData)
      }
    } catch (err: any) {
      //Si el error es de redirección, lo dejamos pasar.//
      if (err.message && err.message.includes('NEXT_REDIRECT')) {
        throw err
      }
      setError('Hubo un problema al guardar el proyecto. Inténtalo de nuevo.')
      setIsLoading(false)
    }
  }

  return (
    <form action={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6 max-w-2xl">
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Nombre del Proyecto <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          defaultValue={initialData?.name}
          required
          placeholder="Ej. Rediseño del sitio web"
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Descripción (Opcional)
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={initialData?.description || ''}
          rows={3}
          placeholder="¿De qué trata este proyecto?"
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
        ></textarea>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Color del Proyecto
        </label>
        <div className="flex flex-wrap gap-3">
          {colorOptions.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setSelectedColor(color)}
              className={`w-8 h-8 rounded-full transition-transform ${
                selectedColor === color ? 'ring-2 ring-offset-2 ring-gray-900 scale-110' : 'hover:scale-110'
              }`}
              style={{ backgroundColor: color }}
              aria-label={`Seleccionar color ${color}`}
            />
          ))}
        </div>
      </div>

      <div className="pt-4 flex items-center gap-4 border-t border-gray-100">
        <Link 
          href="/projects" 
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
        >
          {isLoading ? 'Guardando...' : initialData ? 'Actualizar Proyecto' : 'Crear Proyecto'}
        </button>
      </div>
    </form>
  )
}