import { Request } from '@/lib/Axios'
import { TResponseApi } from '@/types/type'

export interface ProjectResponse {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

export type TStatus = 'todo' | 'in-progress' | 'done'

export interface ProjectParams {
  search?: string
  page?: number
  limit?: number
}

export type TTaskResponse = {
  id: string
  title: string
  status: string
  assignee: {
    id: string
    name: string
    email: string
  }
}
type TMemberResponse = {
  id: string
  name: string
  email: string
  isOwner: boolean
}

export interface DetailProjectResponse {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  tasks: TTaskResponse[]
  memberships: TMemberResponse[]
}

export interface UpdateTaskResponse {
  id: string
  title: string
  description: string
  status: string
  projectId: string
  assigneeId: string
  createdAt: string
  updatedAt: string
}

export type CreateTaskRequest = {
  projectId: string
  tasks: {
    title: string
    description: string
    status: TStatus
    assigneeId: string
  }[]
}

export type UpdateTaskRequest = {
  projectId: string
  taskId: string
  status: TStatus
}

export type CreateProjectRequest = {
  title: string
}

export type UpdateProjectRequest = {
  projectId: string
  title: string
  newMembers: string[]
}

type TUsersResponse = {
  id: string
  name: string
  email: string
}
export const getProjects = async (params?: ProjectParams) => {
  const qs = new URLSearchParams()

  if (params?.search) {
    qs.set('search', params.search)
  }

  if (params?.page !== undefined) {
    qs.set('page', String(params.page))
  }

  if (params?.limit !== undefined) {
    qs.set('limit', String(params.limit))
  }

  const url = qs.toString() ? `/api/projects?${qs}` : '/api/projects'

  const { data } = await Request.get<TResponseApi<ProjectResponse[] | null>>(
    url
  )

  return data
}


export const createProject = async (payload: CreateProjectRequest) => {
  const { data } = await Request.post<TResponseApi<null>>(
    '/api/projects',
    payload
  )
  return data
}

export const updateProject = async (payload: UpdateProjectRequest) => {
  const { data } = await Request.put<TResponseApi<null>>(
    '/api/projects',
    payload
  )
  return data
}

export const getDetailProject = async (projectId?: string) => {
  const { data } = await Request.get<
    TResponseApi<DetailProjectResponse | null>
  >(`/api/projects/${projectId}`)
  return data
}

export const createTask = async (payload: CreateTaskRequest) => {
  const { data } = await Request.post<
    TResponseApi<DetailProjectResponse | null>
  >('/api/task', payload)
  return data
}

export const updateTask = async (payload: UpdateTaskRequest) => {
  const { data } = await Request.patch<TResponseApi<UpdateTaskResponse | null>>(
    '/api/task',
    payload
  )
  return data
}

export const getUsers = async () => {
  const { data } = await Request.get<TResponseApi<TUsersResponse[]>>(
    '/api/users'
  )
  return data
}

export const getMembers = async (projectId: string) => {
  const { data } = await Request.get<TResponseApi<TUsersResponse[]>>(
    `/api/projects/members/${projectId}`
  )
  return data
}
