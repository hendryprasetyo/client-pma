'use client'

import { useQuery, useMutation } from '@tanstack/react-query'
import { getDetailProject, getUsers, updateProject } from '@/service/Projects'
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

type ProjectSettingsProps = {
  projectId: string
}

const ProjectSettings = ({ projectId }: ProjectSettingsProps) => {
  const { data, isPending } = useQuery({
    queryKey: ['projects', projectId],
    queryFn: () => getDetailProject(projectId),
  })

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  })

  const project = data?.data

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

  if (isPending) {
    return <ProjectSettingsSkeleton />
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

      <div className="text-right">
        <Button onClick={handleSave} className="px-6" disabled={isUpdating}>
          {isUpdating ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  )
}

export default ProjectSettings
