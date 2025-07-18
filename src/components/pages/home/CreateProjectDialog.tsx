'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { InputWithLabel } from '@/components/ui/input'
import { FieldErrors, useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createProject } from '@/service/Projects'
import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import { ProjectValidation } from '@/lib/Validation'
import { toast } from 'sonner'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Loader2 } from 'lucide-react'

const CreateProjectDialog = () => {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)

  const form = useForm<z.infer<typeof ProjectValidation>>({
    resolver: zodResolver(ProjectValidation),
    defaultValues: {
      title: '',
    },
  })
  const { mutate, isPending } = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      toast.success('Project created successfully')
      setOpen(false)
      form.reset({
        title: '',
      })
    },
  })

  const onSubmit = (data: z.infer<typeof ProjectValidation>) => {
    mutate(data)
  }

  const onInvalid = (
    errors: FieldErrors<z.infer<typeof ProjectValidation>>
  ) => {
    const firstError = Object.values(errors).find(err => err?.message) as {
      message?: string
    }
    toast.error(firstError?.message ?? 'Please check the form again')
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="self-end cursor-pointer">+ New Project</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onInvalid)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputWithLabel
                      label="Title"
                      placeholder="Project Title"
                      {...field}
                      error={!!form.formState.errors.title}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
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

export default CreateProjectDialog
