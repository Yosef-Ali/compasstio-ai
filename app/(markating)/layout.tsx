"use client";

import { marketingConfig } from "@/config/marketing"
import { MainNav } from "@/components/main-nav"

import { SiteFooter } from "@/components/site-footer"
import useImageStore from "../hooks/useImageStoreState"
import Image from "next/image";
import { Button } from "@/components/ui/button";

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
    <div className="flex h-screen flex-col md:h-screen overflow-hidden">
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
      <div className="relative z-30 flex justify-center items-center h-full">
        <main className="flex-grow">{children}</main>
      </div>
      <SiteFooter className=" container z-40 " />
    </div>
    // <section className="relative flex h-screen w-full items-center justify-center bg-cover bg-center bg-no-repeat overflow-hidden">
    //   {/* <div className="absolute inset-0 bg-gray-900 bg-opacity-70" /> */}
    //   <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/70 pointer-events-none [mask-image:linear-gradient(0deg,#000,rgba(0,0,0,.4))] z-20"></div>

    //   <div className="relative z-10 max-w-3xl px-4 text-center">
    //     {/* <h1 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
    //       A beginning of divine wisdom
    //     </h1>
    //     <h2 className="mb-8 text-lg font-medium text-gray-300 sm:text-xl lg:text-2xl">
    //       This is an Experiment - the AI journey of self-discovery, guidance, and growth to connect with yourself and
    //       the universe.
    //     </h2>
    //     <Button className="rounded-full px-8 py-3 text-lg font-medium" variant="default">
    //       Join Now
    //     </Button> */}
    //     <div className="relative z-30 h-full border" >
    //       <main className="flex-grow ">{children}</main>
    //     </div>
    //   </div>
    //   <img
    //     alt="Hero Background"
    //     className="absolute inset-0 h-full w-full object-cover"
    //     height="1080"
    //     src="/hero-1.webp"
    //     style={{
    //       aspectRatio: "1920/1080",
    //       objectFit: "cover",
    //     }}
    //     width="1920"
    //   />
    // </section>

  )
}