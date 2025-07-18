'use client'

import {
  DetailProjectResponse,
  getDetailProject,
  TStatus,
  updateTask,
} from '@/service/Projects'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import moment from 'moment'
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from '@hello-pangea/dnd'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import AddTaskDialog from './AddTaskDialog'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import Link from 'next/link'
import { Settings } from 'lucide-react'
import { TResponseApi } from '@/types/type'

const STATUS_ORDER = ['todo', 'in-progress', 'done']
const STATUS_LABEL: Record<string, string> = {
  todo: 'To Do',
  'in-progress': 'In Progress',
  done: 'Done',
}
const STATUS_COLOR: Record<string, string> = {
  todo: 'bg-red-200 text-gray-800',
  'in-progress': 'bg-yellow-200 text-yellow-800',
  done: 'bg-green-200 text-green-800',
}

type DetailProjectProps = {
  projectId: string
}

const DetailProject = ({ projectId }: DetailProjectProps) => {
  const queryClient = useQueryClient()
  const { data, isPending } = useQuery({
    queryKey: ['projects', projectId],
    queryFn: () => getDetailProject(projectId),
    staleTime: 5 * 60 * 1000,
  })

  const project = data?.data
  const tasks = project?.tasks ?? []

  const tasksByStatus = STATUS_ORDER.reduce((acc, status) => {
    acc[status] = tasks.filter(task => task.status === status)
    return acc
  }, {} as Record<string, typeof tasks>)

  const { mutate: updateTaskStatus } = useMutation({
    mutationFn: updateTask,

    onMutate: async ({ taskId, status }) => {
      await queryClient.cancelQueries({ queryKey: ['projects', projectId] })

      const previousData = queryClient.getQueryData<
        TResponseApi<DetailProjectResponse | null>
      >(['projects', projectId])

      queryClient.setQueryData(
        ['projects', projectId],
        (oldData: TResponseApi<DetailProjectResponse | null> | undefined) => {
          if (!oldData) return oldData

          return {
            ...oldData,
            data: {
              ...oldData.data,
              tasks: oldData?.data?.tasks.map(task =>
                task.id === taskId ? { ...task, status } : task
              ),
            },
          }
        }
      )

      return { previousData }
    },

    onError: (err, _newTask, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['projects', projectId], context.previousData)
      }
    },
  })

  if (isPending) {
    return (
      <div className="px-6 md:px-12 py-10 space-y-10">
        <div className="space-y-2 text-center">
          <Skeleton className="h-8 w-64 mx-auto" />
          <Skeleton className="h-4 w-40 mx-auto" />
          <Separator className="max-w-md mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6 justify-items-center">
          {STATUS_ORDER.map(status => (
            <div
              key={status}
              className="bg-white w-full max-w-[450px] border border-gray-200 shadow-sm rounded-2xl p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-6 w-6 rounded-full" />
              </div>
              <Skeleton className="h-10 w-full rounded-md mb-8" />

              <div className="space-y-4">
                {[1, 2].map(i => (
                  <div
                    key={i}
                    className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-2"
                  >
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Members Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex items-start gap-3"
            >
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result

    if (!destination) return
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    updateTaskStatus({
      taskId: draggableId,
      projectId,
      status: destination.droppableId as TStatus,
    })
  }
  return (
    <div className="px-6 md:px-12 py-10 space-y-10">
      <div className="space-y-2 text-center">
        <div className="flex justify-center items-center gap-2">
          <h2 className="text-4xl font-extrabold text-blue-900">
            {project?.name}
          </h2>
          <Link
            href={`/projects/${projectId}/settings`}
            className="cursor-pointer"
          >
            <Settings />
          </Link>
        </div>
        <p className="text-sm text-muted-foreground">
          Created at: {moment(project?.createdAt).format('DD MMM YYYY, HH:mm')}
        </p>
        <Separator className="max-w-md mx-auto mt-4" />
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Tasks</h2>
        <p className="text-sm text-muted-foreground mb-6">
          You can update the status of a task by simply dragging and dropping it
          into a different column.
        </p>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6 justify-items-center">
            {STATUS_ORDER.map(status => (
              <Droppable droppableId={status} key={status}>
                {provided => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="bg-white w-full max-w-[450px] border border-gray-200 shadow-sm rounded-2xl p-4 transition hover:shadow-md"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-gray-800">
                        {STATUS_LABEL[status]}
                      </h2>
                      <Badge className={STATUS_COLOR[status]}>
                        {tasksByStatus[status]?.length}
                      </Badge>
                    </div>

                    <AddTaskDialog
                      projectId={projectId}
                      defaultStatus={status as TStatus}
                    />

                    <ScrollArea className="mt-10 h-[370px] pr-2">
                      <div className="space-y-4">
                        {tasksByStatus[status].map((task, index) => (
                          <Draggable
                            key={task.id}
                            draggableId={task.id}
                            index={index}
                          >
                            {provided => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="bg-gray-50 border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow transition"
                              >
                                <h3 className="font-semibold text-gray-900 capitalize line-clamp-2 text-ellipsis overflow-hidden">
                                  {task.title}
                                </h3>
                                {task.assignee && (
                                  <p className="text-sm text-gray-500 mt-2">
                                    <span className="font-medium">
                                      Assigned to:
                                    </span>
                                    &nbsp;
                                    <span className="text-xs">
                                      {task.assignee.email}
                                    </span>
                                  </p>
                                )}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                        {tasksByStatus[status].length === 0 && (
                          <p className="text-sm text-gray-400 w-full text-center italic">
                            No tasks
                          </p>
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      </div>
      {/* Project Members */}
      <div className="mt-10 w-full">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Project Members
        </h2>

        {project?.memberships?.length === 0 ? (
          <p className="text-sm text-gray-400 italic text-center">No members</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {project?.memberships?.map(m => (
              <div
                key={m.id}
                className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex items-start gap-3 hover:shadow-md transition w-max"
              >
                <div className="h-10 w-10 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-bold uppercase flex-shrink-0">
                  {m.name.charAt(0)}
                </div>

                <div>
                  <div className="flex justify-center items-center gap-2">
                    <p className="font-semibold text-gray-900 capitalize">
                      {m.name}
                    </p>
                    {m.isOwner ? (
                      <Badge className="py-0 px-1 text-[12px]">Owner</Badge>
                    ) : (
                      <Badge className="py-0 px-1 text-[12px]">Member</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{m.email}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DetailProject
