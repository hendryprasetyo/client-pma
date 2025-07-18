'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { InputWithLabel } from '@/components/ui/input'
import { TypographyP, TypographyH2 } from '@/components/ui/typography'
import { Loader2 } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { FieldErrors, useForm } from 'react-hook-form'
import { RegisterValidation } from '@/lib/Validation'
import z from 'zod'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { registerUser } from '@/service/Auth'
import { useRouter } from 'next/navigation'
import { TResponseApi } from '@/types/type'

const FormRegister = () => {
  const router = useRouter()

  const form = useForm<z.infer<typeof RegisterValidation>>({
    resolver: zodResolver(RegisterValidation),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })
  const { mutate: mutateRegister, isPending } = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      form.reset()
      toast.success('Successfully Resiter Account')
      router.replace('/login')
    },
    onError: (err: { response: { data: TResponseApi<null[]> } }) => {
      toast.error(err.response?.data?.message ?? 'Register failed')
    },
  })
  const handleSubmit = (values: z.infer<typeof RegisterValidation>) => {
    const { email, firstName, lastName, password, confirmPassword } = values
    const payload = {
      email,
      name: `${firstName} ${lastName}`.trim(),
      password: password,
      confirm_password: confirmPassword,
    }
    mutateRegister(payload)
  }
  const onInvalid = (
    errors: FieldErrors<z.infer<typeof RegisterValidation>>
  ) => {
    // Ambil pesan error pertama yang tersedia
    const firstError = Object.values(errors).find(err => err?.message) as {
      message?: string
    }

    toast.error(firstError?.message ?? 'Please check the form again')
  }
  return (
    <>
      <div className="w-full flex flex-col justify-center items-center">
        <TypographyH2 className="text-4xl font-bold tracking-wide text-neutral-700">
          Register
        </TypographyH2>
        <TypographyP className="text-xs text-muted-foreground text-center">
          Let&apos;s Sign up first for enter into Square Website. Uh She Up!
        </TypographyP>
      </div>
      <Card className="shadow-sm border-none">
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit, onInvalid)}
              className="space-y-6 py-2"
            >
              <div className="w-full flex gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <InputWithLabel
                          variant="primary"
                          error={!!form.formState.errors.firstName}
                          label="First Name"
                          placeholder="First Name"
                          type="text"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <InputWithLabel
                          {...field}
                          variant="primary"
                          error={!!form.formState.errors.lastName}
                          label="Last Name"
                          placeholder="Last Name"
                          type="text"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <InputWithLabel
                        variant="primary"
                        className="lowercase"
                        error={!!form.formState.errors.email}
                        onChange={e =>
                          field.onChange(e.target.value.toLowerCase())
                        }
                        label="Mail Address"
                        placeholder="Mail Address"
                        type="text"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="w-full flex gap-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <InputWithLabel
                          {...field}
                          variant="primary"
                          error={!!form.formState.errors.password}
                          label="Password"
                          placeholder="Password"
                          type="password"
                          isPassword
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <InputWithLabel
                          {...field}
                          variant="primary"
                          error={!!form.formState.errors.confirmPassword}
                          label="Confirm Password"
                          placeholder="Confirm Password"
                          type="password"
                          isPassword
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex w-full gap-2">
                <Button
                  variant="outline"
                  type="button"
                  className="cursor-pointer w-3/12"
                  onClick={() => router.push('/login')}
                >
                  Login
                </Button>
                <Button
                  variant="blue"
                  type="submit"
                  className="w-9/12 cursor-pointer"
                  disabled={isPending}
                >
                  {isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Register
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  )
}

export default FormRegister
