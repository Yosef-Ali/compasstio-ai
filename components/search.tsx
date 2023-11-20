import { Input } from "@/components/ui/input"
import {  SearchIcon } from "lucide-react"

export default function SearchBar() {
  return (
    <div className="relative rounded-lg flex items-center w-full">
      <SearchIcon className="absolute left-2 w-4 h-4 ml-2 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search"
        className="w-full h-full pl-10 bg-transparent text-muted-foreground rounded-lg ring-offset-purple-300 focus-visible:ring-purple-400 "
      />
    </div>
  )
}