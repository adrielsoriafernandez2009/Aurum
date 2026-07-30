import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
          <Skeleton className="h-4 w-48 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
        </div>
        <Skeleton className="h-10 w-32 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl border-white/20 dark:border-zinc-800/50 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-4 w-24 rounded bg-zinc-200 dark:bg-zinc-800" />
              <Skeleton className="h-4 w-4 rounded-full bg-zinc-200 dark:bg-zinc-800" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
              <Skeleton className="h-3 w-20 mt-3 rounded bg-zinc-200 dark:bg-zinc-800" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4 space-y-6">
          <Card className="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl border-white/20 dark:border-zinc-800/50 shadow-sm h-full">
            <CardHeader>
              <Skeleton className="h-6 w-40 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-11 w-11 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800" />
                    <Skeleton className="h-3 w-1/2 rounded bg-zinc-200 dark:bg-zinc-800" />
                  </div>
                  <Skeleton className="h-5 w-16 rounded bg-zinc-200 dark:bg-zinc-800" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <Card className="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl border-white/20 dark:border-zinc-800/50 shadow-sm h-full">
            <CardHeader>
              <Skeleton className="h-6 w-32 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
            </CardHeader>
            <CardContent className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-24 rounded bg-zinc-200 dark:bg-zinc-800" />
                    <Skeleton className="h-4 w-24 rounded bg-zinc-200 dark:bg-zinc-800" />
                  </div>
                  <Skeleton className="h-2 w-full rounded-full bg-zinc-200 dark:bg-zinc-800" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
