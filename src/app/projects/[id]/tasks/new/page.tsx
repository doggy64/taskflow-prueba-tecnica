import TaskForm from '@/components/tasks/TaskForm'
import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'

export default async function NewTaskPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { id: projectId } = await params

  const project = await prisma.project.findUnique({
    where: { id: projectId, userId: user.id },
  })

  if (!project) notFound()

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <Link href="/projects" className="hover:text-blue-600">Proyectos</Link>
          <span>/</span>
          <Link href={`/projects/${projectId}`} className="hover:text-blue-600">{project.name}</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Nueva Tarea</span>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900">Añadir Tarea</h1>
        <p className="mt-1 text-sm text-gray-600">
          Crea una nueva tarea para el proyecto <span className="font-semibold text-gray-900">{project.name}</span>.
        </p>
      </div>

      <TaskForm projectId={projectId} />
    </div>
  )
}