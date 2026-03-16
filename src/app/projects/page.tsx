import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function ProjectsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const projects = await prisma.project.findMany({
    where: { userId: user.id },
    include: {
      tasks: {
        select: { status: true } 
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mis Proyectos</h1>
          <p className="mt-1 text-sm text-gray-600">
            Gestiona tus proyectos y haz seguimiento a tus tareas.
          </p>
        </div>
        <Link 
          href="/projects/new" 
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          + Nuevo Proyecto
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
          <h3 className="text-sm font-semibold text-gray-900">No hay proyectos</h3>
          <p className="mt-1 text-sm text-gray-500">Comienza creando tu primer proyecto.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            const pending = project.tasks.filter(t => t.status === 'pending').length
            const inProgress = project.tasks.filter(t => t.status === 'in_progress').length
            const completed = project.tasks.filter(t => t.status === 'completed').length

            return (
              <Link key={project.id} href={`/projects/${project.id}`} className="group block">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md hover:border-blue-300 transition-all h-full flex flex-col">
                  <div className="h-2 w-full" style={{ backgroundColor: project.color }}></div>
                  
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex items-center gap-3 mb-3">
                      <div 
                        className="w-4 h-4 rounded-full flex-shrink-0" 
                        style={{ backgroundColor: project.color }}
                      ></div>
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                        {project.name}
                      </h3>
                    </div>
                    
                    <p className="text-sm text-gray-600 line-clamp-2 mb-6 flex-grow">
                      {project.description || 'Sin descripción'}
                    </p>

                    <div className="grid grid-cols-3 gap-2 mt-auto pt-4 border-t border-gray-100">
                      <div className="text-center">
                        <p className="text-xs font-medium text-gray-500 mb-1">Pendientes</p>
                        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded-md bg-yellow-50 text-yellow-700">
                          {pending}
                        </span>
                      </div>
                      <div className="text-center border-l border-r border-gray-100">
                        <p className="text-xs font-medium text-gray-500 mb-1">En Progreso</p>
                        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded-md bg-blue-50 text-blue-700">
                          {inProgress}
                        </span>
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-medium text-gray-500 mb-1">Completadas</p>
                        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded-md bg-green-50 text-green-700">
                          {completed}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}