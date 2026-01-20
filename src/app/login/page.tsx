import { Button } from '@/shared/ui/Button'
import { Card, CardContent, CardHeader } from '@/shared/ui/Card'
import { FormField } from '@/shared/ui/FormField'
import { Input } from '@/shared/ui/Input'
import { Label } from '@/shared/ui/Label'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h1 className="text-2xl font-bold">Вход</h1>
          <p className="text-sm text-muted-foreground">Войдите в свой аккаунт</p>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <FormField>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="example@mail.com" />
            </FormField>

            <FormField>
              <Label htmlFor="password">Пароль</Label>
              <Input id="password" type="password" placeholder="••••••••" />
            </FormField>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="rounded border-border" />
                <span>Запомнить меня</span>
              </label>
              <Link href="#" className="text-sm text-primary hover:underline">
                Забыли пароль?
              </Link>
            </div>

            <Button type="submit" className="w-full" variant="primary">
              Войти
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Нет аккаунта?{' '}
              <Link href="/register" className="text-primary hover:underline">
                Зарегистрироваться
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
