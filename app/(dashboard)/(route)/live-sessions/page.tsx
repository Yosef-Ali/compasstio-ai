"use client";

import dynamic from "next/dynamic";
import TopNav from "../../_components/top-nav";
import Wrapper from "../../_components/wrapper";
import RightAside from "../../_components/right-aside";
import Shell from '../../_components/shell'
import ParticipantList from "../../_components/live-streaming/ParticipantList";
import MeetingList from "../../_components/live-streaming/MeetingList";


const LiveStream = dynamic(
  () => import("../../_components/live-streaming/meeting"),
  {
    ssr: false,
  }
);

const LiveStreamPage = () => {

  const tabs = [
    {
      name: 'Meetings',
      title: 'Meetings',
      content: <MeetingList />
    },
    {
      name: 'Participants',
      title: 'Participants',
      content: <ParticipantList />
    }
  ];

  return (
    <>
      <TopNav />
      <Shell>
        <Wrapper>
          <div className='w-full bg-gray-800 h-full'>
            <LiveStream />
          </div>
        </Wrapper>
        <RightAside tabs={tabs} />
      </Shell>
    </>
  )
}

export default LiveStreamPage 