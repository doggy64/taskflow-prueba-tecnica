'use server'

import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

async function getUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autorizado')
  return user
}

export async function createTask(projectId: string, formData: FormData) {
  const user = await getUser()
  
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const status = formData.get('status') as string || 'pending'
  const priority = formData.get('priority') as string || 'medium'

  const project = await prisma.project.findUnique({ where: { id: projectId } })
  if (!project || project.userId !== user.id) {
    throw new Error('Proyecto no encontrado o acceso denegado')
  }

  const task = await prisma.task.create({
    data: {
      title,
      description,
      status,
      priority,
      projectId,
      userId: user.id,
    },
  })

  await prisma.auditLog.create({
    data: {
      action: 'CREATE',
      entity: 'Task',
      entityId: task.id,
      userId: user.id,
      newData: JSON.stringify(task),
    }
  })

  revalidatePath(`/projects/${projectId}`)
  revalidatePath('/')
}

export async function updateTask(taskId: string, projectId: string, formData: FormData) {
  const user = await getUser()
  
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const status = formData.get('status') as string
  const priority = formData.get('priority') as string

  const existingTask = await prisma.task.findUnique({ where: { id: taskId } })
  if (!existingTask || existingTask.userId !== user.id) {
    throw new Error('Tarea no encontrada o acceso denegado')
  }

  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: { title, description, status, priority },
  })

  await prisma.auditLog.create({
    data: {
      action: 'UPDATE',
      entity: 'Task',
      entityId: taskId,
      userId: user.id,
      oldData: JSON.stringify(existingTask),
      newData: JSON.stringify(updatedTask),
    }
  })

  revalidatePath(`/projects/${projectId}`)
  revalidatePath('/')
}

export async function deleteTask(taskId: string, projectId: string) {
  const user = await getUser()

  const existingTask = await prisma.task.findUnique({ where: { id: taskId } })
  if (!existingTask || existingTask.userId !== user.id) {
    throw new Error('Tarea no encontrada o acceso denegado')
  }

  await prisma.task.delete({
    where: { id: taskId },
  })

  await prisma.auditLog.create({
    data: {
      action: 'DELETE',
      entity: 'Task',
      entityId: taskId,
      userId: user.id,
      oldData: JSON.stringify(existingTask),
    }
  })

  revalidatePath(`/projects/${projectId}`)
  revalidatePath('/')
}

export async function updateTaskStatus(taskId: string, projectId: string, newStatus: string) {
  const user = await getUser()

  const existingTask = await prisma.task.findUnique({ where: { id: taskId } })
  if (!existingTask || existingTask.userId !== user.id) {
    throw new Error('Tarea no encontrada o acceso denegado')
  }

  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: { status: newStatus },
  })

  await prisma.auditLog.create({
    data: {
      action: 'UPDATE',
      entity: 'Task',
      entityId: taskId,
      userId: user.id,
      oldData: JSON.stringify({ status: existingTask.status }),
      newData: JSON.stringify({ status: updatedTask.status }),
    }
  })

  revalidatePath(`/projects/${projectId}`)
  revalidatePath('/')
}