"use client"
import AccountProfileEdit from "@/components/forms/AccountProfileEdit";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { Spinner } from "@/components/spinner";


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
        <h1 className='text-2xl'>Profile</h1>
        <p className='mt-3 text-lg'>
          Edit your profile now, to use <span className='font-bold'>
            eternalvirtueai.com
          </span>
        </p>

        <section className='mt-9 p-10 shadow-lg rounded-xl border bg-card text-card-foreground'>
          <AccountProfileEdit user={userData} btnTitle='Continue' />
        </section>
      </main>
    </>
  );
}



