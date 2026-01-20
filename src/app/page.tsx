import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-2xl space-y-8 text-center">
        <h1 className="text-4xl font-bold">Hackathon Platform</h1>
        <p className="text-muted-foreground">Платформа для проведения хакатонов</p>

        <nav className="flex flex-wrap justify-center gap-4">
          <Link
            href="/login"
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
          >
            Войти
          </Link>
          <Link
            href="/register"
            className="rounded-md bg-secondary px-4 py-2 text-secondary-foreground hover:bg-secondary/80"
          >
            Регистрация
          </Link>
          <Link
            href="/hackathons"
            className="rounded-md border border-border px-4 py-2 hover:bg-accent"
          >
            Хакатоны
          </Link>
          <Link
            href="/profile"
            className="rounded-md border border-border px-4 py-2 hover:bg-accent"
          >
            Профиль
          </Link>
          <Link
            href="/invitations"
            className="rounded-md border border-border px-4 py-2 hover:bg-accent"
          >
            Приглашения
          </Link>
          <Link
            href="/my-teams"
            className="rounded-md border border-border px-4 py-2 hover:bg-accent"
          >
            Мои команды
          </Link>
        </nav>
      </div>
    </div>
  )
}
