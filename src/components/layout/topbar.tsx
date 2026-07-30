import { Search, Bell } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function Topbar() {
  return (
    <div className="sticky top-0 z-40 flex h-12 shrink-0 items-center gap-x-6 bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xl border-b border-zinc-200/50 dark:border-zinc-800/50 px-4 sm:px-6 lg:px-8 shadow-[0_4px_30px_rgb(0,0,0,0.02)]">
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <form className="relative flex flex-1" action="#" method="GET">
          <label htmlFor="search-field" className="sr-only">
            Buscar
          </label>
          <Search
            className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-zinc-400"
            aria-hidden="true"
          />
          <Input
            id="search-field"
            className="block h-full w-full border-0 bg-transparent py-0 pl-10 pr-0 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus-visible:ring-0 sm:text-sm shadow-none"
            placeholder="Buscar movimientos, categorías..."
            type="search"
            name="search"
          />
        </form>
      </div>
    </div>
  )
}
