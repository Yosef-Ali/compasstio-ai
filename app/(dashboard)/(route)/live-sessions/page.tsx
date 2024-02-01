"use client";

import dynamic from "next/dynamic";
import TopNav from "../../_components/top-nav";
import Wrapper from "../../_components/wrapper";
import RightAside from "../../_components/right-aside";
import Shell from '../../_components/shell'
import ParticipantList from "../../_components/live-streaming/ParticipantList";



const LiveStream = dynamic(
  () => import("../../_components/live-streaming/meeting"),
  {
    ssr: false,
  }
);
const LiveStreamPage = () => {

  const tabs = [
    {
      name: 'Participant ',
      title: 'Participant',
      content: <ParticipantList />
    },
    {
      name: 'Setting',
      title: 'Setting',
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