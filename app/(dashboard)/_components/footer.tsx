
import { ModeToggle } from "@/components/mode-toggle";

export const Footer = () => {
  return (
    <div className="grid grid-cols-12 !bg-transparent" >
      <div className="col-span-8">
        <div className="flex items-center justify-center">
        </div>
      </div>
      <div className="col-span-4 flex items-center justify-end pr-7 ">
        <div className="hidden lg:block">
          <ModeToggle />
        </div>
      </div>
    </div >
  );
};
