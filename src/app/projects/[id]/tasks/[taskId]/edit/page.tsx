import TaskForm from '@/components/tasks/TaskForm'
import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'

export default async function EditTaskPage({
  params,
}: {
  
  params: Promise<{ id: string; taskId: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { id: projectId, taskId } = await params

  const task = await prisma.task.findUnique({
    where: {
      id: taskId,
      projectId: projectId,
      userId: user.id,
    },

    include: {
      project: { select: { name: true } }
    }
  })

  if (!task) notFound()

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <Link href="/projects" className="hover:text-blue-600">Proyectos</Link>
          <span>/</span>
          <Link href={`/projects/${projectId}`} className="hover:text-blue-600">{task.project.name}</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Editar Tarea</span>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900">Editar Tarea</h1>
        <p className="mt-1 text-sm text-gray-600">
          Modifica los detalles de la tarea seleccionada.
        </p>
      </div>
      <TaskForm 
        projectId={projectId} 
        initialData={{
          id: task.id,
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority
        }} 
      />
    </div>
  )
}