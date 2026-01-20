import { Button } from '@/shared/ui/Button'
import { Card, CardContent, CardHeader } from '@/shared/ui/Card'
import { FormField } from '@/shared/ui/FormField'
import { Input } from '@/shared/ui/Input'
import { Label } from '@/shared/ui/Label'
import Link from 'next/link'

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h1 className="text-2xl font-bold">Регистрация</h1>
          <p className="text-sm text-text-secondary">Создайте новый аккаунт</p>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <FormField>
              <Label htmlFor="name">Имя</Label>
              <Input id="name" type="text" placeholder="Иван Иванов" />
            </FormField>

            <FormField>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="example@mail.com" />
            </FormField>

            <FormField>
              <Label htmlFor="password">Пароль</Label>
              <Input id="password" type="password" placeholder="••••••••" />
            </FormField>

            <FormField>
              <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
              <Input id="confirmPassword" type="password" placeholder="••••••••" />
            </FormField>

            <Button type="submit" className="w-full" variant="primary">
              Зарегистрироваться
            </Button>

            <p className="text-center text-sm text-text-secondary">
              Уже есть аккаунт?{' '}
              <Link href="/login" className="text-link-default hover:text-link-hover hover:underline">
                Войти
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
