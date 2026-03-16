'use client'

import { useState, useTransition } from 'react'
import { updateTaskStatus, deleteTask } from '@/actions/tasks'
import Link from 'next/link'

type Task = {
  id: string
  title: string
  description: string | null
  status: string
  priority: string
}

interface TaskListProps {
  tasks: Task[]
  projectId: string
}

export default function TaskList({ tasks, projectId }: TaskListProps) {
  const [isPending, startTransition] = useTransition()
  
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')

  const filteredTasks = tasks.filter((task) => {
    const matchStatus = statusFilter === 'all' || task.status === statusFilter
    const matchPriority = priorityFilter === 'all' || task.priority === priorityFilter
    return matchStatus && matchPriority
  })

  const handleStatusChange = (taskId: string, newStatus: string) => {
    startTransition(async () => {
      try {
        await updateTaskStatus(taskId, projectId, newStatus)
      } catch (error) {
        alert('Error al actualizar el estado de la tarea')
      }
    })
  }

  const handleDelete = (taskId: string) => {
    if (window.confirm('¿Eliminar esta tarea definitivamente?')) {
      startTransition(async () => {
        try {
          await deleteTask(taskId, projectId)
        } catch (error) {
          alert('Error al eliminar la tarea')
        }
      })
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-700 bg-red-50 border-red-200'
      case 'medium': return 'text-yellow-700 bg-yellow-50 border-yellow-200'
      case 'low': return 'text-blue-700 bg-blue-50 border-blue-200'
      default: return 'text-gray-700 bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div className="flex-1">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Filtrar por Estado</label>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full text-sm text-gray-900 rounded-md border-gray-300 py-1.5 pl-3 pr-8 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
          >
            <option value="all">Todos los estados</option>
            <option value="pending">Pendientes</option>
            <option value="in_progress">En Progreso</option>
            <option value="completed">Completadas</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Filtrar por Prioridad</label>
          <select 
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full text-sm text-gray-900 rounded-md border-gray-300 py-1.5 pl-3 pr-8 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="all">Todas las prioridades</option>
            <option value="high">Alta</option>
            <option value="medium">Media</option>
            <option value="low">Baja</option>
          </select>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="text-center py-8 text-sm text-gray-500">
          No se encontraron tareas con estos filtros.
        </div>
      ) : (
        <div className="space-y-3 relative">
          {isPending && (
            <div className="absolute inset-0 bg-white/50 z-10 rounded-lg flex items-center justify-center">
              <span className="text-sm font-medium text-blue-600">Actualizando...</span>
            </div>
          )}
          
          {filteredTasks.map((task) => (
            <div key={task.id} className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-bold text-gray-900">{task.title}</h3>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${getPriorityColor(task.priority)}`}>
                    {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Media' : 'Baja'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{task.description || 'Sin descripción'}</p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(task.id, e.target.value)}
                  disabled={isPending}
                  className={`text-sm font-semibold rounded-md py-1.5 pl-3 pr-8 outline-none border-gray-200 cursor-pointer ${
                    task.status === 'completed' ? 'bg-green-50 text-green-700' :
                    task.status === 'in_progress' ? 'bg-blue-50 text-blue-700' :
                    'bg-yellow-50 text-yellow-700'
                  }`}
                >
                  <option value="pending">Pendiente</option>
                  <option value="in_progress">En Progreso</option>
                  <option value="completed">Completada</option>
                </select>

                <div className="flex gap-2 ml-auto sm:ml-0">
                  <Link 
                    href={`/projects/${projectId}/tasks/${task.id}/edit`}
                    className="text-gray-500 hover:text-blue-600 text-sm font-medium transition-colors"
                  >
                    Editar
                  </Link>
                  <button 
                    onClick={() => handleDelete(task.id)}
                    disabled={isPending}
                    className="text-gray-500 hover:text-red-600 text-sm font-medium transition-colors"
                  >
                    Borrar
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  )
}