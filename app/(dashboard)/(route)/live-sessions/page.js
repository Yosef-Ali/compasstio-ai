"use client";
import ThemeProviderContext from "@/app/context/ThemeProvider";
import dynamic from "next/dynamic";
import TopNav from "../../_components/top-nav";
import Wrapper from "../../_components/wrapper";
import RightAside from "../../_components/right-aside";
import Shell from '../../_components/shell';
import ParticipantList from "../../_components/live-streaming/GroupsList";
import MeetingList from "../../_components/live-streaming/MeetingList";



const MeetingAppContainer = dynamic(
  () => import("@/app/(dashboard)/_components/video-chat/containers/MeetingAppContainer"),
  {
    ssr: false,
  }
);

const tabs = [
  {
    name: 'Meetings',
    title: 'Meetings',
    content: <MeetingList />
  },
  {
    name: 'Groups',
    title: 'Groups',
    content: <ParticipantList />
  }
];


export default function Home() {
  return (
    <>
      <TopNav />
      <Shell>
        <Wrapper>
          <div className='w-full bg-gray-800 h-full'>
            <ThemeProviderContext>
              <MeetingAppContainer />
            </ThemeProviderContext>
          </div>
        </Wrapper>
        <RightAside tabs={tabs} />
      </Shell>
    </>
  );
}



