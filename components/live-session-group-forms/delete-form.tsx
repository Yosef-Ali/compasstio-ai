"use client";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import * as React from 'react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import MultipleSelector, { Option } from '@/components/ui/multiple-selector';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { useDialog } from '@/app/hooks/useDialog';
import { Id } from '@/convex/_generated/dataModel'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CaretSortIcon } from '@radix-ui/react-icons';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { CheckIcon } from 'lucide-react';

interface MultipleSelectorWithFormProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const FormSchemaDelete = z.object({
  option: z.string({
    required_error: "Please select a language.",
  }),
})

const useGroups = (id: Id<"users">) => {
  const [options, setOptions] = React.useState<Option[]>([]);
  const groups = useQuery(api.liveSessionsGroups.getGroups, { userId: id });
  const users = useQuery(api.users.get);

  console.log("useGroups groups", groups);

  React.useEffect(() => {
    const newOptions = groups?.map(group => ({
      label: group.title,
      value: group._id,
    })) as Option[];
    setOptions(newOptions);
  }, [groups]);

  return options;
};


const MultipleSelectorWithDeleteGroup = React.forwardRef((props: MultipleSelectorWithFormProps, ref) => {
  const form = useForm<z.infer<typeof FormSchemaDelete>>({
    resolver: zodResolver(FormSchemaDelete),
  });
  const { onClose } = useDialog()
  const userId = useUser().user?.id;
  const groupOptions = useGroups(userId as Id<"users">);
  const removeGroup = useMutation(api.liveSessionsGroups.remove);
  const { toast } = useToast()


  function onSubmit(data: z.infer<typeof FormSchemaDelete>) {

    const groupId = data.option

    removeGroup({ _id: groupId as Id<"groups"> });

    toast({
      title: "Group removed",
      description: "The group has been removed.",
    })

    onClose()
  }

  // Use the useImperativeHandle hook to expose a submitForm method
  React.useImperativeHandle(ref, () => ({
    submitForm() {
      form.handleSubmit(onSubmit)();
    },
  }));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-3/3 space-y-6">
        <FormField
          control={form.control}
          name="option"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Language</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? groupOptions.find(
                          (groupOptions) => groupOptions.value === field.value
                        )?.label
                        : "Select language"}
                      <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[450px] p-2">
                  <Command>
                    <CommandInput
                      placeholder="Search framework..."
                      className="h-10"
                    />
                    <CommandEmpty>No group found.</CommandEmpty>
                    <CommandGroup>
                      {groupOptions && groupOptions.map((option) => (
                        <CommandItem
                          value={option.label}
                          key={option.value}
                          onSelect={() => {
                            form.setValue("option", option.value)
                          }}
                          className="py-2"
                        >
                          {option.label}
                          <CheckIcon
                            className={cn(
                              "ml-auto h-4 w-4 ",
                              option.value === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                This is the group that to be deleted.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" onClick={() => onClose()}>
            Cancel
          </Button>
          <Button type="submit" className='bg-red-500 hover:bg-red-700'>Delete</Button>
        </div>
      </form>
    </Form>
  )
})

// Add the display name
MultipleSelectorWithDeleteGroup.displayName = 'MultipleSelectorWithDeleteGroup';

export default MultipleSelectorWithDeleteGroup