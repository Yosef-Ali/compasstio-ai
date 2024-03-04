import { Button } from "@/components/ui/button";

export function LeaveScreen({ setIsMeetingLeft }) {
  return (
    <div className="bg-gray-800 h-screen flex flex-col flex-1 items-center justify-center">
      <h1 className="text-white text-4xl">You left the meeting!</h1>
      <div className="mt-12">
        <Button
          className=" bg-purple-500 hover:bg-purple-700 text-sm"
          onClick={() => {
            setIsMeetingLeft(false);
          }}
        >
          Rejoin the Meeting
        </Button>
      </div>
    </div>
  );
}
