import * as React from 'react'
import { type LucideIcon } from 'lucide-react'
import * as Icons from 'lucide-react'

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: string
  className?: string
}

export const Icon: React.FC<IconProps> = ({ name, className, ...props }) => {
  const LucideIcon = (Icons as Record<string, LucideIcon>)[name]

  if (!LucideIcon) {
    return <Icons.HelpCircle className={className} {...props as any} />
  }

  return <LucideIcon className={className} {...props as any} />
}
