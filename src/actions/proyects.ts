'use server'

import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

async function getUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autorizado')
  return user
}

export async function createProject(formData: FormData) {
  const user = await getUser()
  
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const color = formData.get('color') as string

  const project = await prisma.project.create({
    data: {
      name,
      description,
      color,
      userId: user.id,
    },
  })

  await prisma.auditLog.create({
    data: {
      action: 'CREATE',
      entity: 'Project',
      entityId: project.id,
      userId: user.id,
      newData: JSON.stringify(project),
    }
  })

  revalidatePath('/projects')
  revalidatePath('/')
  redirect('/projects')
}

export async function updateProject(id: string, formData: FormData) {
  const user = await getUser()
  
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const color = formData.get('color') as string

  const existingProject = await prisma.project.findUnique({ where: { id } })
  if (!existingProject || existingProject.userId !== user.id) {
    throw new Error('Proyecto no encontrado o acceso denegado')
  }

  const updatedProject = await prisma.project.update({
    where: { id },
    data: { name, description, color },
  })

  await prisma.auditLog.create({
    data: {
      action: 'UPDATE',
      entity: 'Project',
      entityId: id,
      userId: user.id,
      oldData: JSON.stringify(existingProject),
      newData: JSON.stringify(updatedProject),
    }
  })

  revalidatePath('/projects')
  revalidatePath(`/projects/${id}`)
  revalidatePath('/')
  redirect('/projects')
}

export async function deleteProject(id: string) {
  const user = await getUser()

  const existingProject = await prisma.project.findUnique({ where: { id } })
  if (!existingProject || existingProject.userId !== user.id) {
    throw new Error('Proyecto no encontrado o acceso denegado')
  }

  await prisma.project.delete({
    where: { id },
  })

  await prisma.auditLog.create({
    data: {
      action: 'DELETE',
      entity: 'Project',
      entityId: id,
      userId: user.id,
      oldData: JSON.stringify(existingProject),
    }
  })

  revalidatePath('/projects')
  revalidatePath('/')
}