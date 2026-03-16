'use client'

import { useTransition } from 'react'
import { deleteProject } from '@/actions/projects'

export default function DeleteProjectButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este proyecto? Todas sus tareas se perderán.')) {
      startTransition(async () => {
        try {
          await deleteProject(id)
        } catch (error) {
          console.error('Error al eliminar:', error)
          alert('Hubo un error al eliminar el proyecto.')
        }
      })
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
    >
      {isPending ? 'Eliminando...' : 'Eliminar'}
    </button>
  )
}