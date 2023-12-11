"use client"
import AccountProfile from "@/components/forms/AccountProfile";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useConvexAuth, useQuery } from "convex/react";
import { redirect } from "next/navigation";
import { Spinner } from "@/components/spinner";


export default function OnBoardingPage() {


  const { user } = useUser();
  {/* @ts-ignore */ }
  const userInfo = useQuery(api.users.getUser, { userId: user?.id.toString() });
  const { isLoading } = useConvexAuth()

  if (!user) return null;


  // if (userInfo?.onboarded) {
  //   redirect("/chat-with-ai");
  // }


  // if (!isLoading) {
  //   return (<div className="w-full flex items-center justify-center">
  //     <Spinner size="lg" />
  //   </div>)
  // }


  const userData = {
    userId: user.id,
    username: userInfo ? userInfo?.username : user.username,
    name: userInfo ? userInfo?.name : user.firstName ?? "",
    bio: userInfo ? userInfo?.bio : "",
    image: userInfo ? userInfo?.avatarUrl : user.imageUrl,
  };

  return (
    <>
      <main className='mx-auto flex max-w-3xl flex-col justify-start px-10 py-10'>
        <h1 className='text-2xl'>Onboarding</h1>
        <p className='mt-3 text-lg'>
          Complete your profile now, to use <span className='font-bold'>
            eternalvirtueai.com
          </span>
        </p>

        <section className='mt-9 p-10 shadow-lg rounded-xl border bg-card text-card-foreground '>
          <AccountProfile user={userData} btnTitle='Continue' />
        </section>
      </main>
    </>
  );
}

