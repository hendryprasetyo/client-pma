'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { InputWithLabel } from '@/components/ui/input'
import { TypographyP, TypographyH2 } from '@/components/ui/typography'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRef } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { FieldErrors, useForm } from 'react-hook-form'
import { LoginValidation } from '@/lib/Validation'
import z from 'zod'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { loginUser, userProfile } from '@/service/Auth'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/Auth'
import { TResponseApi } from '@/types/type'
import { decodeJwt } from '@/lib/utils'

const FormLogin = () => {
  const router = useRouter()
  const emailInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<z.infer<typeof LoginValidation>>({
    resolver: zodResolver(LoginValidation),
    defaultValues: {
      email: '',
      password: '',
    },
  })
  const { mutate: mutateLogin, isPending } = useMutation({
    mutationFn: loginUser,
    onSuccess: async res => {
      const { data } = res
      const token = data?.access_token || ''
      useAuthStore.getState().login(token)

      const { id: userId } = decodeJwt<{ id: string }>(token)
      try {
        const userRes = await userProfile(userId)
        useAuthStore.getState().setUser(userRes.data)
        if (process.env.NODE_ENV !== 'production') {
          document.cookie = `__access_token__=${token}; Path=/; Secure; SameSite=Lax`
        }
        form.reset()
        toast.success('Login success')
        router.replace('/')
      } catch (err) {
        console.error(err)
        toast.error('Failed to fetch user detail')
      }
    },
    onError: (err: { response: { data: TResponseApi<null> } }) => {
      toast.error(err.response?.data?.message ?? 'Login failed')
    },
  })
  const handleSubmit = (values: z.infer<typeof LoginValidation>) => {
    mutateLogin(values)
  }
  const onInvalid = (errors: FieldErrors<z.infer<typeof LoginValidation>>) => {
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
          Sign In
        </TypographyH2>
        <TypographyP className="text-xs text-muted-foreground text-center">
          Just sign if you have an account in here. Enjoy our Website
        </TypographyP>
      </div>
      <Card className="shadow-sm border-none">
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit, onInvalid)}
              className="space-y-6 py-2"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <InputWithLabel
                        ref={emailInputRef}
                        className="lowercase"
                        type="text"
                        error={!!form.formState.errors.email}
                        onChange={e =>
                          field.onChange(e.target.value.toLowerCase())
                        }
                        label="Your Email"
                        placeholder="Your Email"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <InputWithLabel
                        label="Enter Password"
                        placeholder="Enter Password"
                        type="password"
                        error={!!form.formState.errors.password}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                variant={'blue'}
                type="submit"
                className="w-full cursor-pointer"
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Login
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="w-full flex justify-center items-center">
        <TypographyP className="text-xs font-semibold text-blue-500">
          Don&apos;t have a Square account?{' '}
          <Link href="/register">Register</Link>
        </TypographyP>
      </div>
    </>
  )
}

export default FormLogin
