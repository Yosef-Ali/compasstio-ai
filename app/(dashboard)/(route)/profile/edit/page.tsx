"use client"
import AccountProfile from "@/components/forms/AccountProfile";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { redirect } from "next/navigation";


export default function ProfileEditPage() {

  const { user } = useUser();
  if (!user) return null;

  const userInfo = useQuery(api.users.getUser, { userId: user.id });

  // if (userInfo?.onboarded) {
  //   redirect("/chat-with-ai");
  // }
  console.log('userInfo edit', userInfo)




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
        <h1 className='text-2xl'>Edit profile</h1>
        {/* <p className='mt-3 text-lg'>
          Complete your profile now, to use <span className='font-bold'>
            eternalvirtueai.com
          </span>
        </p> */}

        <section className='mt-9 p-10 shadow-lg rounded-xl border bg-card text-card-foreground '>
          <AccountProfile user={userData} btnTitle='Continue' />
        </section>
      </main>
    </>
  );
}

