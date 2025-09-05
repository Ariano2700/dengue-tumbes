'use client'
import Sidebar from "../common/Sidebar"
import { DashboardHeader } from "./DashboardHeader"

interface DashboardLayoutProps {
  children: React.ReactNode
  activeItem?: string
  title: string
  description: string
  showHealthBadge?: boolean
}

function DashboardLayout({
  children,
  activeItem,
  title,
  description,
  showHealthBadge = false,
}: DashboardLayoutProps) {
  return (
    <div>
      <div className="flex min-h-screen w-full">
        <Sidebar activeItem={activeItem} />
        <div>
          <DashboardHeader title={title} description={description} showHealthBadge={showHealthBadge} />
          <main className="flex-1 p-6 space-y-6">{children}</main>
        </div>
      </div>
    </div>
  )
}
export default DashboardLayout;