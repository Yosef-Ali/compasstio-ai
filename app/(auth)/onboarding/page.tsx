import AccountProfile from "@/components/forms/AccountProfile";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";


export default function onBoardingPage() {
  // const user = await currentUser();
  // if (!user) return null; // to avoid typescript warnings

  // const userInfo = await fetchUser(user.id);
  // if (userInfo?.onboarded) redirect("/");

  // const userData = {
  //   id: user.id,
  //   objectId: userInfo?._id,
  //   username: userInfo ? userInfo?.username : user.username,
  //   name: userInfo ? userInfo?.name : user.firstName ?? "",
  //   bio: userInfo ? userInfo?.bio : "",
  //   image: userInfo ? userInfo?.image : user.imageUrl,
  // };
  const userData = {
    id: "12345",
    objectId: "593f7834e275010010000001",
    username: "johndoe",
    name: "John Doe",
    bio: "I'm a software engineer who loves to code and learn new things.",
    image: "https://example.com/user-image.jpg",
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

