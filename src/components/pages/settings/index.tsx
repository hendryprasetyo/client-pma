'use client'

import { useQuery, useMutation } from '@tanstack/react-query'
import {
  deleteProject,
  getDetailProject,
  getUsers,
  updateProject,
} from '@/service/Projects'
import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'
import ProjectSettingsSkeleton from './ProjectSettingsSkeleton'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Loader2 } from 'lucide-react'
import { TResponseApi } from '@/types/type'
import { useRouter } from 'next/navigation'

type ProjectSettingsProps = {
  projectId: string
}

const ProjectSettings = ({ projectId }: ProjectSettingsProps) => {
  const router = useRouter()
  const { data, isPending, isError } = useQuery({
    queryKey: ['projects', projectId],
    queryFn: () => getDetailProject(projectId),
    retry: false,
  })

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  })

  const project = data?.data

  const [openDelete, setOpenDelete] = useState(false)
  const [name, setName] = useState('')
  const [members, setMembers] = useState<
    { id: string; name: string; email: string }[]
  >([])
  const [newMemberId, setNewMemberId] = useState<string>('')

  useEffect(() => {
    if (project) {
      setName(project.name)
      setMembers(project.memberships)
    }
  }, [project])

  const handleAddMember = () => {
    if (!newMemberId) return

    const userToAdd = users?.data?.find(u => u.id === newMemberId)
    if (!userToAdd) return

    const alreadyExists = members.some(m => m.id === newMemberId)
    if (alreadyExists) {
      toast.warning('Member already exists')
      return
    }

    setMembers(prev => [...prev, userToAdd])
    setNewMemberId('')
    toast.success('Member added')
  }

  const { mutate: updateProjectMutation, isPending: isUpdating } = useMutation({
    mutationFn: updateProject,
    onSuccess: () => {
      toast.success('Project updated successfully')
    },
    onError: () => {
      toast.error('Failed to update project')
    },
  })

  const handleSave = () => {
    if (!name.trim()) {
      toast.warning('Project name is required')
      return
    }

    const newMemberIds = members.map(m => m.id)
    updateProjectMutation({
      projectId,
      title: name,
      newMembers: newMemberIds,
    })
  }

  const { mutate: mutateDeleteProject, isPending: isPendingDelete } =
    useMutation({
      mutationFn: () => deleteProject(projectId),
      onSuccess: () => {
        toast.success('Project deleted!')
        router.replace('/')
      },
      onError: (err: { response: { data: TResponseApi<null> } }) => {
        toast.error(err.response?.data?.message ?? 'Delete Failed')
      },
      onSettled: () => {
        setOpenDelete(false)
      },
    })

  if (isPending) {
    return <ProjectSettingsSkeleton />
  }

  if (isError) {
    router.replace('/')
    return
  }
  return (
    <div className="max-w-2xl mx-auto px-6 py-10 space-y-8">
      <h1 className="text-2xl font-bold text-blue-900">Project Settings</h1>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Project Name
        </label>
        <Input
          value={name}
          onChange={e => setName(e.target.value)}
          className="max-w-md"
        />
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Project Members</h2>
        <div className="flex gap-2 items-center">
          <Select value={newMemberId} onValueChange={setNewMemberId}>
            <SelectTrigger className="w-full max-w-sm">
              <SelectValue placeholder="Select user to add" />
            </SelectTrigger>
            <SelectContent>
              {users?.data?.map(user => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name}{' '}
                  <span className="text-xs text-muted-foreground">
                    ({user.email})
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleAddMember}>Add</Button>
        </div>
        <div className="space-y-2">
          {members.map(m => (
            <div
              key={m.id}
              className="flex items-center justify-between p-4 border rounded-xl bg-muted/50"
            >
              <p className="font-medium">{m.name}</p>
              <p className="text-sm text-gray-500">{m.email}</p>
            </div>
          ))}

          {members.length === 0 && (
            <p className="text-sm text-gray-400 italic">No members yet</p>
          )}
        </div>
      </div>

      <Separator />

      <div className="text-right flex justify-between items-center w-full gap-4">
        <Dialog open={openDelete} onOpenChange={setOpenDelete}>
          <DialogTrigger asChild>
            <Button variant="destructive" className="w-max cursor-pointer">
              Delete Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Confirmation</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              Are you sure you want to Delete this project?
            </DialogDescription>
            <DialogFooter className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpenDelete(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  mutateDeleteProject()
                }}
              >
                {isPendingDelete ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Button
          type="button"
          onClick={handleSave}
          className="px-6"
          disabled={isUpdating}
        >
          {isUpdating ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  )
}

export default ProjectSettings
