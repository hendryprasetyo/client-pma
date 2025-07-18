'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { InputWithLabel } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { useForm, FieldErrors } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TaskValidation } from '@/lib/Validation'
import z from 'zod'
import { useState } from 'react'
import { toast } from 'sonner'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { createTask, getUsers } from '@/service/Projects'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'
type Props = {
  projectId: string
  defaultStatus: 'todo' | 'in-progress' | 'done'
}

const AddTaskDialog = ({ projectId, defaultStatus }: Props) => {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)

  const { data: userList, isPending: isLoadingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
    enabled: open,
  })

  const form = useForm<z.infer<typeof TaskValidation>>({
    resolver: zodResolver(TaskValidation),
    defaultValues: {
      title: '',
      description: '',
      assigneeId: '',
      status: defaultStatus,
    },
  })

  const { mutate: addTask, isPending } = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', projectId] })
      toast.success('Task created successfully')
      setOpen(false)
      form.reset({
        title: '',
        description: '',
        assigneeId: '',
        status: defaultStatus,
      })
    },
    onError: () => {
      toast.error('Failed to create task')
    },
  })

  const handleSubmit = (values: z.infer<typeof TaskValidation>) => {
    addTask({ projectId, tasks: [values] })
  }

  const onInvalid = (errors: FieldErrors<z.infer<typeof TaskValidation>>) => {
    const firstError = Object.values(errors).find(err => err?.message) as {
      message?: string
    }
    toast.error(firstError?.message ?? 'Please check the form again')
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          + Add Task
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Task in &quot;{defaultStatus}&quot;</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit, onInvalid)}
            className="space-y-5 pt-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputWithLabel
                      label="Title"
                      placeholder="Task Title"
                      {...field}
                      error={!!form.formState.errors.title}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Add some notes..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="assigneeId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger
                        className={
                          form.formState.errors.assigneeId
                            ? 'border-red-500'
                            : 'w-full'
                        }
                      >
                        <SelectValue
                          placeholder={
                            isLoadingUsers
                              ? 'Loading users...'
                              : 'Select assignee'
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {userList?.data?.map(user => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name}{' '}
                            <span className="text-xs text-gray-500">
                              ({user.email})
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Hidden status */}
            <input type="hidden" {...form.register('status')} />

            <Button
              type="submit"
              className="w-full"
              disabled={isPending}
              variant="blue"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default AddTaskDialog
