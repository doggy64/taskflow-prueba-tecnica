import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const [
    totalProjects,
    tasksDistribution,
    recentTasks,
    topProjects
  ] = await Promise.all([
   
    prisma.project.count({ where: { userId: user.id } }),

    
    prisma.task.groupBy({
      by: ['status'],
      where: { userId: user.id },
      _count: { _all: true }
    }),

    
    prisma.task.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { project: { select: { name: true, color: true } } }
    }),

    prisma.project.findMany({
      where: { 
        userId: user.id,
        tasks: { some: { status: 'pending' } } 
      },
      include: {
        _count: {
          select: { tasks: { where: { status: 'pending' } } }
        }
      },
      orderBy: {
        tasks: { _count: 'desc' }
      },
      take: 3
    })
  ])

  
  const totalTasks = tasksDistribution.reduce((acc, curr) => acc + curr._count._all, 0)
  const getTaskCount = (status: string) => tasksDistribution.find(t => t.status === status)?._count._all || 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">Resumen general de tu espacio de trabajo.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Proyectos Totales</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{totalProjects}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Tareas Pendientes</p>
          <p className="mt-2 text-3xl font-bold text-yellow-600">{getTaskCount('pending')}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">En Progreso</p>
          <p className="mt-2 text-3xl font-bold text-blue-600">{getTaskCount('in_progress')}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Completadas</p>
          <p className="mt-2 text-3xl font-bold text-green-600">{getTaskCount('completed')}</p>
          <p className="text-xs text-gray-400 mt-1">De un total de {totalTasks} tareas</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
       
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Últimas Tareas Creadas</h2>
          {recentTasks.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">Aún no has creado ninguna tarea.</p>
          ) : (
            <ul className="space-y-4">
              {recentTasks.map(task => (
                <li key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{task.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: task.project.color }}></span>
                      <span className="text-xs text-gray-500">{task.project.name}</span>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                    task.status === 'completed' ? 'bg-green-100 text-green-800' :
                    task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {task.status === 'completed' ? 'Completada' : task.status === 'in_progress' ? 'En progreso' : 'Pendiente'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Proyectos que requieren atención</h2>
          {topProjects.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">¡Excelente! No tienes proyectos con tareas pendientes.</p>
          ) : (
            <ul className="space-y-4">
              {topProjects.map(project => (
                <li key={project.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-12 rounded-full" style={{ backgroundColor: project.color }}></div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{project.name}</p>
                      <Link href={`/projects/${project.id}`} className="text-xs text-blue-600 hover:underline">
                        Ver proyecto →
                      </Link>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-yellow-600">{project._count.tasks}</p>
                    <p className="text-xs text-gray-500">Pendientes</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}