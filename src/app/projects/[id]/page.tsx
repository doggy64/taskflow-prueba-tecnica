import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { id } = await params

  const project = await prisma.project.findUnique({
    where: {
      id: id,
      userId: user.id, 
    },

    include: {
      tasks: {
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  if (!project) {
    notFound()
  }

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div 
              className="w-6 h-6 rounded-full shadow-inner" 
              style={{ backgroundColor: project.color }}
            ></div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
              <p className="text-sm text-gray-500 mt-1">
                {project.description || 'Sin descripción'}
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
              Editar Proyecto
            </button>
            <button className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
              Eliminar
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Tareas del Proyecto</h2>
          <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors">
            + Nueva Tarea
          </button>
        </div>

        {project.tasks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
            <p className="text-sm text-gray-500">Aún no hay tareas en este proyecto.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-500">Aquí irá la lista interactiva de tareas...</p>
          </div>
        )}
      </div>
    </div>
  )
}