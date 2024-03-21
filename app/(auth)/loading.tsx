import { Spinner } from "@/components/spinner";

const Loading = () => {
  return (
    <div className="h-screen flex items-center justify-center">
      <div>
        <Spinner size="lg" />
      </div>
    </div>
  )
}

export default Loading


