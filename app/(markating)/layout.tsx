"use client";

import { marketingConfig } from "@/config/marketing"
import { MainNav } from "@/components/main-nav"

import { SiteFooter } from "@/components/site-footer"
import useImageStore from "../hooks/useImageStoreState"
import Image from "next/image";

interface MarketingLayoutProps {
  children: React.ReactNode
}

export default function MarketingLayout({
  children,
}: MarketingLayoutProps) {
  const { hoverImageIndex } = useImageStore();

  const getImageUrl = (index: number) => `url('/hero-${index + 1}.webp')`; // Assuming image naming convention
  const backgroundImage = getImageUrl(hoverImageIndex);


  return (
    <div className="flex min-h-screen flex-col md:h-screen overflow-x-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/70 pointer-events-none [mask-image:linear-gradient(0deg,#000,rgba(0,0,0,.4))] z-20"></div>


      <Image
        src={`/hero-${hoverImageIndex + 1}.webp`}
        layout="fill"
        objectFit="cover"
        objectPosition="center"
        alt="Background image"
        className=""
        priority // Use priority to preload images on the initial load
      />
      <header className="container z-40">
        <MainNav items={marketingConfig.mainNav} />
      </header>
      <div className="relative z-30 h-full" >
        <main className="flex-grow ">{children}</main>
      </div>
      <SiteFooter className=" container z-40 -mt-16 bg-purple-500" />
    </div>

  )
}