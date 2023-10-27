"use client"
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, SendHorizonalIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface ChatInputProps {
  apiUrl: string;
  query: Record<string, any>;
  name: string;
  type: "conversation" | "channel";
}

const formSchema = z.object({
  content: z.string().min(1),
});

const ChatInput = ({ apiUrl, query, name, type }: ChatInputProps) => {

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    }
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    form.reset();
  }

  return (
    <Form {...form}>
      <div className="relative p-2 ">

        <FormField
          name="content"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  disabled={isLoading}
                  className="px-14 py-7 bg-muted dark:bg-zinc-700/75 border-none border-0 rounded-lg focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200 "
                  placeholder={`Message ${type === "conversation" ? name : "#" + name}`}
                  {...field}

                />
              </FormControl>
            </FormItem>
          )}
        />

        <button
          type="button"
          className="absolute top-6 left-8 h-[24px] w-[24px] bg-purple-400 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center"
        >
          <Plus className="text-white dark:text-[#313338]" />
        </button>

        <button
          type="submit"
          className="absolute top-6 right-8 center"
        >
          <SendHorizonalIcon className="text-purple-400 dark:text-purple-500" />
        </button>

      </div>
    </Form>

  );

};

export default ChatInput;
