"use client"
import AccountProfile from "@/components/forms/AccountProfile";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { redirect } from "next/navigation";
import { Spinner } from "@/components/spinner";
import { Id } from "@/convex/_generated/dataModel";


export default function OnBoardingPage() {
  const { isLoading } = useConvexAuth()

  if (isLoading) {
    return (<div className="w-full flex items-center justify-center">
      <Spinner size="lg" />
    </div>)
  }

  const { user } = useUser();

  if (!user) return null;



  const userInfo = useQuery(api.users.getUser, { id: user.id.toString() });

  if (userInfo?.onboarded) {
    redirect("/chat-with-ai");

  }

  const userData = {
    userId: userInfo?.userId ?? user.id.toString(),
    username: userInfo ? userInfo?.username : user.username,
    name: userInfo ? userInfo?.name : user.firstName ?? "",
    bio: userInfo ? userInfo?.bio : "",
    image: userInfo ? userInfo?.avatarUrl : user.imageUrl,
    email: userInfo ? userInfo?.email ?? "" : user.emailAddresses?.[0]?.emailAddress ?? "",
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

        <section className='mt-9 p-10 shadow-lg rounded-xl border bg-card text-card-foreground'>
          <AccountProfile user={userData} btnTitle='Continue' />
        </section>
      </main>
    </>
  );
}



