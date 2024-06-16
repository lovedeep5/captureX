import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'
import React from 'react'

interface DashboardHeaderType {
    title: string,
    descreption: string, 
    icon: LucideIcon, 
    bgColor: string, 
    iconColor: string
}

const DasboardHeader = ({title, descreption, icon : Icon, bgColor, iconColor}: DashboardHeaderType) => {
  return (
    <div className='flex items-center gap-x-3  rounded  mb-10 '>
        <div className={cn('w-fit rounded-md p-2 bg-neutral-200 ')}>
            <Icon className={cn('w-10 h-10', iconColor)} />
        </div>
        <div>
          <h2 className='text-3xl font-bold'>{title}</h2>
          <p className="text-sm text-muted-foreground">{descreption}</p>

        </div>
    </div>
  )
}

export default DasboardHeader