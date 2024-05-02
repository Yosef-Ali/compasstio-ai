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

  console.log(backgroundImage)

  return (
    <div className="flex h-screen flex-col">
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/70 pointer-events-none [mask-image:linear-gradient(0deg,#000,rgba(0,0,0,.4))] z-20"></div>

      {/* <div
        className={`relative h-screen bg-cover bg-center bg-no-repeat z-10 animate-fade-in-out duration-300 ease-in-out ${hoverImageIndex !== null ? '' : 'opacity-0'
          }`}
        style={{
          backgroundImage,
        }}> */}


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
      <SiteFooter className="container z-40 -mt-16" />
    </div>

  )
}