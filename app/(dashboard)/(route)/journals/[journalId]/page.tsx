import JournalContainer from "@/app/(dashboard)/_components/journal-containerxx"
import RightAside from "@/app/(dashboard)/_components/right-aside"
import TopNav from "@/app/(dashboard)/_components/top-nav"



const JournalsPage = () => {
  return (
    <>
      <TopNav />
      <div className="flex-1 flex flex-row overflow-y-hidden ">
        <JournalContainer />
        <RightAside />
      </div>
    </>
  )
}

export default JournalsPage