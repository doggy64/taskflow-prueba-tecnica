import ProjectForm from '@/components/projects/ProjectForm'
import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { id } = await params

  const project = await prisma.project.findUnique({
    where: { id: id, userId: user.id },
  })

  if (!project) notFound()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Editar Proyecto</h1>
        <p className="mt-1 text-sm text-gray-600">
          Actualiza la información de tu proyecto.
        </p>
      </div>

      <ProjectForm initialData={{
        id: project.id,
        name: project.name,
        description: project.description,
        color: project.color
      }} />
    </div>
  )
}