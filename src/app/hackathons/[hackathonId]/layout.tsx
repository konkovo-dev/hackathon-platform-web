import Link from 'next/link'

// TODO: В будущем пункты меню будут скрываться по ролям пользователя
const menuItems = [
  { label: 'Главная', href: 'main', key: 'main' },
  { label: 'Команда', href: 'team', key: 'team' },
  { label: 'Отправить', href: 'submit', key: 'submit' },
  { label: 'Ментор', href: 'mentor', key: 'mentor' },
  { label: 'Жюри', href: 'jury', key: 'jury' },
  { label: 'Организатор', href: 'organizer', key: 'organizer' },
  { label: 'Результаты', href: 'results', key: 'results' },
]

function HackathonSidebar({ hackathonId }: { hackathonId: string }) {
  return (
    <aside className="w-64 border-r border-border-default bg-bg-surface p-4">
      <nav className="space-y-1">
        {menuItems.map(item => (
          <Link
            key={item.key}
            href={`/hackathons/${hackathonId}/${item.href}`}
            className="block rounded-md px-3 py-2 text-sm hover:bg-bg-hover hover:text-text-primary"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}

export default async function HackathonLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ hackathonId: string }>
}) {
  const { hackathonId } = await params
  return (
    <div className="flex min-h-screen">
      <HackathonSidebar hackathonId={hackathonId} />
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
