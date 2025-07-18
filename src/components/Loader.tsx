import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const Loader = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm',
        className
      )}
    >
      <div className="flex items-center space-x-2">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    </div>
  )
}

export default Loader
