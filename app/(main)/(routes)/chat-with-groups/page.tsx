"use client";
import Image from "next/image";
import { useUser } from "@clerk/clerk-react";
import TopNav from "../../_components/top-nav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { CheckCheckIcon, FileTextIcon, PenBoxIcon, SearchIcon, UserPlus2Icon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { ModeToggle } from "@/components/mode-toggle";

const ChatWithAiPage = () => {
  return (
    <>
      <TopNav />
      <div className="flex-1 overflow-hidden ">
        <div className=" z-20 flex h-full w-full">
          <div className="w-full">
            <div className="mx-auto flex h-full w-full  flex-col max-w-6xl ">
              <div className="h-full relative">
                <div className="chat-container h-full no-scrollbar overflow-scroll md:pl-6 md:pr-10 px-3">
                  <div className="pt-4">
                    <div className="mx-w-sm mx-auto flex flex-col items-center px-4 md:pt-6 md:max-w-lg md:px-0">
                      <div className="flex flex-col items-center justify-center space-y-6">
                        <div className="flex flex-col items-start justify-center space-y-4 md:items-center">
                          <h1 className="flex  items-start justify-center space-y-4 md:items-center text-3xl font-bold">
                            Welcome to&nbsp;
                            <span className="text-purple-500">Chat with Groups</span>

                          </h1>
                          <p className="md:text-md w-full text-sm text-purple-800 md:w-120 md:text-center">
                            Get started by writing a task and Chat can do the rest. Not sure where to start? Check out the Prompt Library for inspiration.
                          </p>

                        </div>
                        <div className="flex w-full items-center py-2 md:py-5">
                          <div className="flex h-10 w-11 items-center justify-center rounded-full bg-purple-100">
                            <SearchIcon className="h-5 w-5 text-purple-500" />
                          </div>
                          <div className="w-full md:pl-4">
                            <div className="flex items-center">
                              <h3 className="mb-1.5 font-medium text-purple-700">
                                Real-Time Search
                              </h3>
                            </div>
                            <p className="md:text-md cursor-pointer text-sm text-purple-700 line-clamp-1 hover:text-purple-600 md:line-clamp-none">
                              {`Summarize the latest news on generative AI"`}
                            </p>
                            <p className="md:text-md cursor-pointer text-sm text-purple-700 line-clamp-1 hover:text-purple-600 md:line-clamp-none">{"Write a personalized email to [insert Linkedin profile URL]"}

                            </p>

                          </div>
                        </div>
                        <div className="flex w-full items-center py-2 md:py-5">
                          <div className="flex h-10 w-11 items-center justify-center rounded-full bg-purple-50">
                            <FileTextIcon className="h-5 w-5 text-purple-500" />
                          </div>
                          <div className="w-full md:pl-4">
                            <div className="flex items-center">
                              <h3 className="mb-1.5 font-medium text-purple-700 ">
                                Brainstorm Ideas
                              </h3>
                            </div>
                            <p className="md:text-md cursor-pointer text-sm text-purple-700 line-clamp-1 hover:text-purple-600 md:line-clamp-none">
                              {`Generate 10 Instagram captions for fashion week`}
                            </p>
                            <p className="md:text-md cursor-pointer text-sm text-purple-700 line-clamp-1 hover:text-purple-600 md:line-clamp-none">{"Write a product description for a bicycle in the style of Hemingway"}

                            </p>

                          </div>
                        </div>
                        <div className="flex w-full items-center py-2 md:py-5">
                          <div className="flex h-10 w-11 items-center justify-center rounded-full bg-purple-50">
                            <PenBoxIcon className="h-5 w-5 text-purple-500" />
                          </div>
                          <div className="w-full md:pl-4">
                            <div className="flex items-center">
                              <h3 className="mb-1.5 font-medium text-purple-700">
                                Long Form Content
                              </h3>
                            </div>
                            <p className="md:text-md cursor-pointer text-sm text-purple-700 line-clamp-1 hover:text-purple-600 md:line-clamp-none">
                              {"Create a blog post about search engine optimization"}
                            </p>
                            <p className="md:text-md cursor-pointer text-sm text-purple-700 line-clamp-1 hover:text-purple-600 md:line-clamp-none">{"Write a press release about www.copy.ai"}

                            </p>

                          </div>
                        </div>
                        <div className="h-56"></div>
                        <div id="anchor" className="h-px"></div>

                      </div>

                    </div>
                  </div>
                  {/* chat input */}

                </div>
                <div className="flex  absolute  bottom-0 flex-col w-full">
                  <div className=" fade-up pb-5 md:pl-6 md:pr-10 px-3">
                    <div className="w-full relative">
                      <div className="prompt-container flex flex-wrap items-end justify-center border border-grey-200 rounded-2xl shadow-md">
                        <span className="m-2 p-2  flex w-full flex-grow">
                          <input type="text" className="w-full h-full rounded-xl border-none outline-none focus:ring-0 bg-transparent" placeholder="Type your prompt here" />
                        </span>
                        <div className="flex h-10 w-full bg-muted rounded-b-2xl border"></div>
                      </div>

                    </div>


                  </div>
                </div>
              </div>




            </div>
          </div>


          {/* vertical menu */}
          <div className="duration-300 w-0 translate-x-0 lg:w-120 2xl:w-144 top-12 z-40 flex h-full flex-shrink-0 transform flex-col border-grey-200 bg-purple-500 md:top-0">
            <div className="sticky top-0 h-0 w-0">
              <div className="absolute -left-0.5 z-10 hidden w-1 lg:block ">

              </div>
              <div className="absolute -left-2.5 top-40 ml-px hidden w-24 -translate-x-14 -rotate-90 transform cursor-pointer flex-row items-center justify-center rounded-t-md bg-purple-500 px-3 py-2 text-xs text-white shadow-overlay duration-300 lg:flex">
                <span className="tracking-wider">Close</span>
              </div>
            </div>
          </div>
          {/* Right side bar  */}
          <div className="border-l  w-[500px]">

            <div className="flex flex-col h-full">

              <div className=" border-b  px-6  pt-4 pb-2 text-center">
                <Tabs defaultValue="account" className="w-[400px]">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="account">Messages</TabsTrigger>
                    <TabsTrigger value="password">Invite Friends <UserPlus2Icon className="ml-2 h-4 w-4" /></TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="flex-grow p-6">
                <div className="grid grid-cols-1 gap-4">
                  <Card >
                    <CardHeader>
                      <div className="flex">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <Avatar>
                              <AvatarImage src="https://github.com/shadcn.png" />
                              <AvatarFallback>CN</AvatarFallback>
                            </Avatar>

                            <div className="ml-4">
                              <div className="text-lg font-medium">John Doe</div>
                              <div className="text-gray-600">Hello world!</div>
                            </div>
                          </div>
                        </div>

                        <div className="flex-1"></div>

                        <div className="flex justify-end">
                          <div className="flex flex-col h-full justify-between">
                            <p className="text-sm ">h8</p>
                            <CheckCheckIcon className="h-5 w-5" />
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                  <Card >
                    <CardHeader>
                      <div className="flex">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <Avatar>
                              <AvatarImage src="https://github.com/shadcn.png" />
                              <AvatarFallback>CN</AvatarFallback>
                            </Avatar>

                            <div className="ml-4">
                              <div className="text-lg font-medium">John Doe</div>
                              <div className="text-gray-600">Hello world!</div>
                            </div>
                          </div>
                        </div>

                        <div className="flex-1"></div>

                        <div className="flex justify-end">
                          <div className="flex flex-col h-full justify-between">
                            <p className="text-sm ">h8</p>
                            <CheckCheckIcon className="h-5 w-5" />
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                  <Card >
                    <CardHeader>
                      <div className="flex">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <Avatar>
                              <AvatarImage src="https://github.com/shadcn.png" />
                              <AvatarFallback>CN</AvatarFallback>
                            </Avatar>

                            <div className="ml-4">
                              <div className="text-lg font-medium">John Doe</div>
                              <div className="text-gray-600">Hello world!</div>
                            </div>
                          </div>
                        </div>

                        <div className="flex-1"></div>

                        <div className="flex justify-end">
                          <div className="flex flex-col h-full justify-between">
                            <p className="text-sm ">h8</p>
                            <CheckCheckIcon className="h-5 w-5" />
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                  <Card >
                    <CardHeader>
                      <div className="flex">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <Avatar>
                              <AvatarImage src="https://github.com/shadcn.png" />
                              <AvatarFallback>CN</AvatarFallback>
                            </Avatar>

                            <div className="ml-4">
                              <div className="text-lg font-medium">John Doe</div>
                              <div className="text-gray-600">Hello world!</div>
                            </div>
                          </div>
                        </div>

                        <div className="flex-1"></div>

                        <div className="flex justify-end">
                          <div className="flex flex-col h-full justify-between">
                            <p className="text-sm ">h8</p>
                            <CheckCheckIcon className="h-5 w-5" />
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                  <Card >
                    <CardHeader>
                      <div className="flex">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <Avatar>
                              <AvatarImage src="https://github.com/shadcn.png" />
                              <AvatarFallback>CN</AvatarFallback>
                            </Avatar>

                            <div className="ml-4">
                              <div className="text-lg font-medium">John Doe</div>
                              <div className="text-gray-600">Hello world!</div>
                            </div>
                          </div>
                        </div>

                        <div className="flex-1"></div>

                        <div className="flex justify-end">
                          <div className="flex flex-col h-full justify-between">
                            <p className="text-sm ">h8</p>
                            <CheckCheckIcon className="h-5 w-5" />
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                  <Card >
                    <CardHeader>
                      <div className="flex">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <Avatar>
                              <AvatarImage src="https://github.com/shadcn.png" />
                              <AvatarFallback>CN</AvatarFallback>
                            </Avatar>

                            <div className="ml-4">
                              <div className="text-lg font-medium">John Doe</div>
                              <div className="text-gray-600">Hello world!</div>
                            </div>
                          </div>
                        </div>

                        <div className="flex-1"></div>

                        <div className="flex justify-end">
                          <div className="flex flex-col h-full justify-between">
                            <p className="text-sm ">h8</p>
                            <CheckCheckIcon className="h-5 w-5" />
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </div>

              </div>

              <div className=" border-t py-2 px-6 sticky bottom-0">
                <div className="w-full flex justify-end">
                  <ModeToggle />
                </div>
              </div>

            </div>

          </div>
        </div >

      </div >
    </>
  )
}
export default ChatWithAiPage