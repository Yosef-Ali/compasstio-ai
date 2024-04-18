"use client";

import { marketingConfig } from "@/config/marketing"
import { MainNav } from "@/components/main-nav"

import { SiteFooter } from "@/components/site-footer"
import useImageStore from "../hooks/useImageStoreState"

interface MarketingLayoutProps {
  children: React.ReactNode
}

export default function MarketingLayout({
  children,
}: MarketingLayoutProps) {
  const { hoverImageIndex } = useImageStore();

  const getImageUrl = (index: number) => `url('/hero-${index + 1}.webp')`; // Assuming image naming convention
  const backgroundImage = getImageUrl(hoverImageIndex);

  console.log(backgroundImage)

  return (
    <div className="flex min-h-screen flex-col">
      <div
        className={`relative h-screen bg-cover bg-center bg-no-repeat z-10 animate-fade-in-out duration-300 ease-in-out ${hoverImageIndex !== null ? '' : 'opacity-0'
          }`}
        style={{
          backgroundImage,
        }}>
        <header className="container z-40">
          <MainNav items={marketingConfig.mainNav} />
        </header>
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </div>
    </div>
  )
}