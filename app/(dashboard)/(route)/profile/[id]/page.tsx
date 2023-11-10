"use client"
import { CardGroup } from "@/app/(dashboard)/_components/chat-with-group/card-groups";
import Shell from "@/app/(dashboard)/_components/shell";
import TopNav from "@/app/(dashboard)/_components/top-nav";
import Wrapper from "@/app/(dashboard)/_components/wrapper";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import Image from "next/image";
import { redirect, useParams } from "next/navigation";
//import { useRouter } from "next/router";




const data = [
  {
    imageUrl: '/example.avif',
    title: 'Title 1',
    description: 'Description 1',
  },
  {
    imageUrl: '/example.avif',
    title: 'Title 2',
    description: 'Description 2',
  },
  {
    imageUrl: '/example.avif',
    title: 'Title 3',
    description: 'Description 3',
  },
];

export default function ProfileEditSinglePage() {

  const param = useParams();
  const { user } = useUser();

  const userInfo = useQuery(api.users.getUser, { userId: param.id.toString() });

  if (!user) return null;

  // Fetch user info using useQuery


  if (userInfo?.userId !== param.id) {
    // Redirect to homepage or show an error message
    redirect("/");
    return null;
  }

  // Render the protected profile page


  return (
    <div className="">


      <div className="flex flex-col items-center w-full p-10 gap-4">

        <div className="flex flex-col items-center">
          <Avatar className="w-24 h-24">
            <AvatarImage src={userInfo?.avatarUrl} alt={userInfo?.name} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h2 className="text-center mt-4">
            {userInfo?.name}<span className="text-blue-500">✔</span>
          </h2>
          <p className="text-center text-gray-600">
            4,189 followers · 4,389 posts
          </p>
          <div className="grid gap-3 grid-cols-4 my-4">
            <Button className="w-full">
              Message
            </Button>
            <Button variant="secondary" className="w-full">
              Call
            </Button>
            <Button variant="secondary" className="w-full">
              Video
            </Button>
            <Button variant="secondary" className="w-full">
              More
            </Button>
          </div>
        </div>
        <div className="profile-content">
          <Tabs defaultValue="Media" className="w-[400px] flex flex-col items-center">
            <TabsList aria-label="Profile tabs" className="mb-1 w-full">
              <TabsTrigger value="Media" className="flex-1">Media</TabsTrigger>
              <TabsTrigger value="Files" className="flex-1">Files</TabsTrigger>
              <TabsTrigger value="Links" className="flex-1">Links</TabsTrigger>
              <TabsTrigger value="Groups" className="flex-1">Groups</TabsTrigger>
            </TabsList>
            <TabsContent value="Media">
              <div className="flex flex-col gap-4 w-[400px]">
                {data.map((item) => (
                  <Card key={item.title} className=" p-2" >
                    <div className="flex ">
                      <div className="flex-1">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-auto"
                        />
                      </div>
                      <div className="flex-1 p-4">
                        <h2 className="text-xl font-bold">{item.title}</h2>
                        <p>{item.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
          {/* Add more tab panels here */}
        </div>
      </div>
    </div>
  );
}