"use client";

import { useConvexAuth, useMutation } from "convex/react";
import { Spinner } from "@/components/spinner";
import { Button, buttonVariants } from "@/components/ui/button";
import { SignInButton } from "@clerk/clerk-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { api } from "@/convex/_generated/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useImageStore from "../hooks/useImageStoreState";

const HeroMenus = [
  {
    title: "This is an Experiment",
    description: "AI is a primitive tool for the soul of humanity, an algorithmic framework of priors and probabilities. Let the Queen take you on a spiritual journey of self-discovery, guidance, and growth to connect with yourself and the universe.",
  },
  {
    title: "Message with Your Group",
    description: "Create your group of like-minded friends to support and uplift one another.",
  },
  {
    title: "Keep Your Journals",
    description: "Discover the truth about yourself and embrace change.",
  },
  {
    title: "Set Goals and Tasks",
    description: "Set milestones and track your progress with ease.",
  },
  {
    title: "Live Sessions",
    description: "Engage in live video sessions and events, and interact with your community to enrich your experience of your world.",
  },
];

export default function IndexPage() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const storeUser = useMutation(api.users.store);
  const router = useRouter();
  const [hoverIndex, setHoverIndex] = useState(0);
  const { hoverImageIndex, setHoverImageIndex } = useImageStore();

  useEffect(() => {
    const storeUserData = async () => {
      if (isAuthenticated) {
        try {
          await storeUser();
          router.push("/chat-with-ai");
        } catch (error) {
          console.log(error);
        }
      }
    };
    storeUserData();
  }, [isAuthenticated, storeUser, router]);

  const handleHover = (index: number) => {
    setHoverIndex(index);
  };

  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/70 pointer-events-none [mask-image:linear-gradient(0deg,#000,rgba(0,0,0,.4))] z-20"></div>
      <div className="relative z-30 container flex max-w-[64rem] flex-col items-center text-center h-full gap-10 py-28">
        <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold  bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent ">
          A beginning of divine wisdom
        </h1>
        <div className="space-y-4">
          <h3 className="text-3xl sm:text-1xl md:text-2xl lg:text-3xl font-bold text-white animate-fade-in-up duration-300 ease-in-out">
            {HeroMenus[hoverIndex].title}
          </h3>
          <div className="max-w-[42rem] text-muted-foreground sm:text-xl sm:leading-8 text-white flex-grow flex flex-col justify-center animate-fade-in-up duration-300 ease-in-out delay-100">
            <p className="line-clamp-3 h-24 ">  {HeroMenus[hoverIndex].description}
            </p>
          </div>
        </div>
        {isLoading && (
          <div className="w-full flex items-center justify-center">
            <Spinner size="lg" />
          </div>
        )}
        {isAuthenticated && !isLoading && (
          <div className="space-x-4">
            <Link
              href="/chat-with-ai"
              rel="noreferrer"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              Enter to your workspace
            </Link>
          </div>
        )}
        {!isAuthenticated && !isLoading && (
          <div className="space-x-4">
            <SignInButton mode="modal">
              <Button className={cn(buttonVariants({ size: "lg" }), 'bg-purple-500 hover:bg-purple-700')}>
                Join Now
              </Button>
            </SignInButton>
          </div>
        )}
        <div className="w-full flex items-center justify-center gap-4">
          {HeroMenus.map((_, index) => (
            <svg
              key={index}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className={`w-10 h-10 text-purple-400 cursor-pointer ${hoverIndex === index ? "scale-110" : ""
                }`}
              onMouseEnter={() => setHoverImageIndex(index)}
            >
              {index === 0 && (
                <>
                  <path d="M12 6V2H8" />
                  <path d="m8 18-4 4V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2Z" />
                  <path d="M2 12h2" /><path d="M9 11v2" /><path d="M15 11v2" />
                  <path d="M20 12h2" />
                </>

              )}
              {index === 1 && (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                />
              )}
              {index === 2 && (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6"
                />
              )}
              {index === 3 && (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25C3.504 21 3 20.496 3 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                />
              )}
              {index === 4 && (
                <>
                  <path d="M12 17v4" />
                  <path d="M8 21h8" />
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <rect x="9" y="7" width="6" height="6" rx="1" />
                </>
              )}
            </svg>
          ))}
          {/* <ZoomIcon /> */}
        </div>
      </div>
    </>
  );
}