//import { promises as fs } from "fs"
"use client"

import data from "./data/tasks.json"

import Image from "next/image"
import { z } from "zod"

import { columns } from "./components/columns"
import { DataTable } from "./components/data-table"
import { UserNav } from "./components/user-nav"
import { taskSchema } from "./data/schema"
import Wrapper from "../wrapper"

type Task = {
  // Define the structure of the task object
  // Example: title: string, description: string, etc.
}

function getTasks(): Task[] {
  return z.array(taskSchema).parse(data)
}

export default function TaskPage() {
  const tasks: Task[] = getTasks()
  return (
    <>
      <Wrapper>
        <div className="overflow-y-hidden">
          <div className="md:hidden">
            <Image
              src="/examples/tasks-light.png"
              width={1280}
              height={998}
              alt="Playground"
              className="block dark:hidden"
            />
            <Image
              src="/examples/tasks-dark.png"
              width={1280}
              height={998}
              alt="Playground"
              className="hidden dark:block"
            />
          </div>

          <div className="hidden h-full flex-1 flex-col space-y-4 md:flex">
            {/* @ts-ignore */}
            <DataTable data={tasks} columns={columns} />
          </div>
        </div>
      </Wrapper>
    </>
  )
}
