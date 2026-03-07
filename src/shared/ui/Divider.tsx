export interface DividerProps {
  className?: string
}

export function Divider({ className = '' }: DividerProps) {
  const classes = `h-px bg-divider ${className}`.trim()
  return <div className={classes} />
}
