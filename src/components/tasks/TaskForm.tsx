'use client'

import { useState } from 'react'
import { createTask, updateTask } from '@/actions/tasks'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface TaskFormProps {
  projectId: string
  initialData?: {
    id: string
    title: string
    description: string | null
    status: string
    priority: string
  }
}

export default function TaskForm({ projectId, initialData }: TaskFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)

    const title = formData.get('title') as string
    
    if (!title.trim()) {
      setError('El título de la tarea es obligatorio.')
      setIsLoading(false)
      return
    }

    try {
      if (initialData) {
        await updateTask(initialData.id, projectId, formData)
      } else {
        await createTask(projectId, formData)
      }
     
      router.push(`/projects/${projectId}`)
    } catch (err: any) {
      setError('Hubo un error al guardar la tarea. Intenta nuevamente.')
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
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Título de la Tarea <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          defaultValue={initialData?.title}
          required
          placeholder="Ej. Diseñar la base de datos"
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
          placeholder="Agrega más detalles sobre esta tarea..."
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
        ></textarea>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Estado
          </label>
          <select
            id="status"
            name="status"
            defaultValue={initialData?.status || 'pending'}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none bg-white transition-all"
          >
            <option value="pending">Pendiente</option>
            <option value="in_progress">En Progreso</option>
            <option value="completed">Completada</option>
          </select>
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
            Prioridad
          </label>
          <select
            id="priority"
            name="priority"
            defaultValue={initialData?.priority || 'medium'}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none bg-white transition-all"
          >
            <option value="low">Baja</option>
            <option value="medium">Media</option>
            <option value="high">Alta</option>
          </select>
        </div>
      </div>

      <div className="pt-4 flex items-center gap-4 border-t border-gray-100">
        <Link 
          href={`/projects/${projectId}`} 
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
        >
          {isLoading ? 'Guardando...' : initialData ? 'Actualizar Tarea' : 'Crear Tarea'}
        </button>
      </div>
    </form>
  )
}