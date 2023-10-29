import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import React from 'react'
import ItemButton from './item-button'

const TopNav = () => {
  return (
    <div className="sticky top-0 z-40 bg-background ">
      <div className="w-full">
        <div className=" pl-5 pr-5 py-3 md:pr-8 border-b  flex-1 flex  w-full">
          <div className="flex items-center w-full p-1">
            <div className="flex text-xl line-clamp-1">
              <span className="flex flex-1 outline-none max-w-fit rounded-md border-none focus:ring-0 text-h1 cursor-pointer p-2 line-clamp-1">Untitle</span>
              <input type="text" className="flex flex-1 px-2 w-full overflow-ellipsis whitespace-nowrap outline-none max-w-fit rounded-md border-none focus:ring-0 !p-0 !m-0 text-h1 cursor-pointer" />
            </div>
          </div>
          {/* <div className="flex justify-end space-x-2">
            <Button className='flex bg-purple-500'>NewProject</Button>
          </div> */}
          <div className="flex shrink-0">
            <ItemButton
              onClick={() => { }}
              label="New Page"
              icon={PlusCircle}
            />
          </div>

        </div>
      </div>
    </div>
  )
}

export default TopNav