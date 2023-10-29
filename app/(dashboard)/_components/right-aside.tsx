
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


interface Tab {
  name: string;
  title: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
}


const RightAside = ({ tabs }: TabsProps) => {
  return (

    <div className="border-l sm:col-span-4 h-full overflow-y-auto">
      <Tabs defaultValue={tabs[0].name}>
        <div className=" border-b px-6 pt-4 pb-2 text-center sticky top-0 bg-background z-35">
          <TabsList className="grid w-full grid-cols-2">
            {tabs.map(tab => (
              <TabsTrigger key={tab.name} value={tab.name}>
                {tab.title}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        {tabs.map(tab => (
          <TabsContent key={tab.name} value={tab.name}>
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );


}

export default RightAside
