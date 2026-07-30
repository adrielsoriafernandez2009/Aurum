import { Search, Bell } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function Topbar() {
  return (
    <div className="sticky top-0 z-40 flex h-20 shrink-0 items-center gap-x-6 bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xl border-b border-zinc-200/50 dark:border-zinc-800/50 px-4 sm:px-6 lg:px-8 shadow-[0_4px_30px_rgb(0,0,0,0.02)]">
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 items-center">
        <form className="relative flex flex-1 max-w-2xl h-10" action="#" method="GET">
          <label htmlFor="search-field" className="sr-only">
            Buscar
          </label>
          <Search
            className="pointer-events-none absolute inset-y-0 left-3 h-full w-4 text-zinc-400"
            aria-hidden="true"
          />
          <Input
            id="search-field"
            className="block h-full w-full rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-50 dark:bg-zinc-900/50 py-2 pl-10 pr-4 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-1 focus-visible:ring-zinc-300 dark:focus-visible:ring-zinc-700 sm:text-sm shadow-sm transition-all"
            placeholder="Buscar movimientos, categorías..."
            type="search"
            name="search"
          />
        </form>
      </div>
    </div>
  )
}
