import Link from 'next/link'
import { ThemeToggle } from '@/shared/ui/ThemeToggle'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-2xl space-y-8 text-center">
        <h1 className="typography-display-xl">Hackathon Platform</h1>
        <p className="typography-body-md-regular text-text-secondary">Платформа для проведения хакатонов</p>

        <nav className="flex flex-wrap justify-center gap-4">
          <Link
            href="/login"
            className="rounded-md bg-brand-primary px-4 py-2 text-text-inverse hover:bg-brand-primary-hover"
          >
            Войти
          </Link>
          <Link
            href="/register"
            className="rounded-md bg-bg-elevated px-4 py-2 text-text-primary hover:bg-bg-hover"
          >
            Регистрация
          </Link>
          <Link
            href="/hackathons"
            className="rounded-md border border-border-default px-4 py-2 hover:bg-bg-hover"
          >
            Хакатоны
          </Link>
          <Link
            href="/profile"
            className="rounded-md border border-border-default px-4 py-2 hover:bg-bg-hover"
          >
            Профиль
          </Link>
          <Link
            href="/invitations"
            className="rounded-md border border-border-default px-4 py-2 hover:bg-bg-hover"
          >
            Приглашения
          </Link>
          <Link
            href="/my-teams"
            className="rounded-md border border-border-default px-4 py-2 hover:bg-bg-hover"
          >
            Мои команды
          </Link>
        </nav>
      </div>
    </div>
  )
}
