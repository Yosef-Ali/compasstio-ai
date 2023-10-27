

import SideMenu from "../_components/sidebar-menu"



interface MainLayoutProps {
  children: React.ReactNode
}

export default async function MainLayout({
  children,
}: MainLayoutProps) {
  return (

    <div className="flex">
      <SideMenu />
      <main className="flex flex-col h-screen w-full" >{children}</main>
      {/* <main className="min-h-screen flex flex-col h-screen" >{children}</main> */}
    </div>

  )
}