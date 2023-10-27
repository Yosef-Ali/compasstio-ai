import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CardRecent from "./recent-card"


export const RecentPinTabs = () => {
  return (
    <>
      <Tabs defaultValue="Recent" >
        <div className=" border-b  px-6  pt-4 pb-2 text-center static top-0 bg-background z-35">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="Recent">Recent</TabsTrigger>
            <TabsTrigger value="Pinned">Pinned</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="Recent">
          <div className="flex-1 flex flex-row">
            <div className="flex-1 overflow-y-auto" style={{ height: "85vh" }}>
              <div className="grid grid-cols-1 gap-4 p-4">
                <CardRecent />
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="Pinned"><div className="flex-1 flex flex-row">
          <div className="flex-1 overflow-y-auto" style={{ height: "85vh" }}>
            <div className="grid grid-cols-1 gap-4 p-4">
              <CardRecent />
            </div>
          </div>
        </div>
        </TabsContent>
      </Tabs>
    </>
  )
}
