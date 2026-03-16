import ProjectForm from '@/components/projects/ProjectForm'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function NewProjectPage() {
 
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Crear Nuevo Proyecto</h1>
        <p className="mt-1 text-sm text-gray-600">
          Configura los detalles iniciales de tu nuevo proyecto.
        </p>
      </div>
      <ProjectForm />
    </div>
  )
}