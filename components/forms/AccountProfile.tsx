"use client"
import Image from "next/image";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserValidation } from "@/lib/validations/user";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useRef } from "react";
import { Id } from "@/convex/_generated/dataModel";

interface Props {
  user: {
    userId: string;
    username: string | null;
    name: string;
    bio: string;
    image: string;
  };
  btnTitle: string;
}

const AccountProfile = ({ user, btnTitle }: Props) => {
  const router = useRouter();
  const pathname = usePathname();

  const createProfile = useMutation(api.users.create)
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);
  const updateAvatar = useMutation(api.users.updateAvatar);

  const form = useForm<z.infer<typeof UserValidation>>({
    resolver: zodResolver(UserValidation),
    defaultValues: {
      profile_photo: user?.image ? user.image : "",
      name: user?.name ? user.name : "",
      username: user?.username ? user.username : "",
      bio: user?.bio ? user.bio : "",
    },
  });



  const onSubmit = (values: z.infer<typeof UserValidation>) => {

    const promise = createProfile({
      userId: user.userId ?? "",
      name: values.name,
      username: values.username,
      bio: values.bio,
      onboarded: true,
      avatarUrl: ""

    })

    toast.promise(promise, {
      loading: "Creating a new profile...",
      success: "New profile created!",
      error: "Failed to create a new profile."
    });

    if (pathname === "/profile/edit") {
      router.back();
    } else {
      router.push("/");
    }
  };

  async function handleImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];


    if (file) {
      // Step 1: Generate a URL for uploading
      const postUrl = await generateUploadUrl();

      // Step 2: Upload the file to the generated URL
      const result = await fetch(postUrl, {
        method: "POST",
        body: file,
      });

      if (result.ok) {
        // Step 3: Update the profile photo URL in the form
        const { storageId } = await result.json();

      } else {
        // Handle upload error
        console.error('Failed to upload image');
      }
    }
  }

  return (
    <Form {...form}>
      <form
        className='flex flex-col justify-start gap-10'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name='profile_photo'
          render={({ field }) => (
            <FormItem className='flex items-center gap-4'>
              <FormLabel className='account-form_image-label cursor-pointer'>
                {user.image ? (
                  <Image
                    src={user.image}
                    alt='profile_icon'
                    width={96}
                    height={96}
                    priority
                    className='rounded-full object-contain'
                  />
                ) : (
                  <Image
                    src='/assets/profile.svg'
                    alt='profile_icon'
                    width={24}
                    height={24}
                    className='object-contain'
                  />
                )}

              </FormLabel>
              <FormControl className='flex-1 text-base-semibold text-gray-400 cursor-pointer'>
                <Input
                  type='file'
                  accept='image/*'
                  placeholder='Add profile photo'
                  className='cursor-pointer border-none bg-transparent outline-none file:text-blue'
                  onChange={(e) => handleImage(e)}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col gap-3'>
              <FormLabel className='text-base-semibold text-light-2'>
                Name
              </FormLabel>
              <FormControl>
                <Input
                  type='text'
                  className='account-form_input no-focus'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col gap-3'>
              <FormLabel className='text-base-semibold text-light-2'>
                Username
              </FormLabel>
              <FormControl>
                <Input
                  type='text'
                  className='account-form_input no-focus'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='bio'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col gap-3'>
              <FormLabel className='text-base-semibold text-light-2'>
                Bio
              </FormLabel>
              <FormControl>
                <Textarea
                  rows={10}
                  className='account-form_input no-focus'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' className='bg-purple-500 hover:bg-purple-700'>
          {btnTitle}
        </Button>
      </form>
    </Form>
  )
}

export default AccountProfile