export default async function HackathonMainPage({
  params,
}: {
  params: Promise<{ hackathonId: string }>
}) {
  const { hackathonId } = await params
  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Хакатон #{hackathonId}</h1>
      <div className="text-muted-foreground">
        <p>Главная страница хакатона будет здесь</p>
      </div>
    </div>
  )
}
