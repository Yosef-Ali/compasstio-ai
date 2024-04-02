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
import { Input } from '@/components/ui/input';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { useDialog } from '@/app/hooks/useDialog';
import { Id } from '@/convex/_generated/dataModel';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CaretSortIcon } from '@radix-ui/react-icons';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { CheckIcon } from 'lucide-react';

interface MultipleSelectorWithFormProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}


const optionSchema = z.object({
  label: z.string(),
  value: z.string(),
  disable: z.boolean().optional(),
});

// Add a new schema for the group name input
const groupNameSchema = z.object({
  name: z.string().nonempty(),
});

// Combine the schemas into one


const FormSchemaEdit = z.object({
  members: z.array(optionSchema).min(0),
  group: groupNameSchema,
});




const useUsers = () => {
  const [options, setOptions] = React.useState<Option[]>([]);
  const users = useQuery(api.users.get);

  React.useEffect(() => {
    const newOptions = users?.map(user => ({
      label: `${user.name} (${user.username})`,
      value: user.username,
    })) as Option[];
    setOptions(newOptions);
  }, [users]);

  return options;
};

const useGroups = (id: Id<"users">) => {
  const [options, setOptions] = React.useState<Option[]>([]);
  const groups = useQuery(api.liveSessionsGroups.getGroups, { userId: id });

  React.useEffect(() => {
    const newOptions = groups?.map(group => ({
      label: group.title,
      value: group._id,
    })) as Option[];
    setOptions(newOptions);
  }, [groups]);

  return options;
};

const useMembers = (groupId: Id<"groups">) => {
  const membersData = useQuery(api.liveSessionsGroups.getMembersInfo, { groupId });

  const membersOptions = React.useMemo(() => {
    if (!groupId) return []; // Return empty array when groupId is empty
    return membersData?.map(member => ({
      label: `${member.name} (${member.username})`,
      value: member.username,
    })) as Option[];
  }, [groupId, membersData]);

  return membersOptions;
}

const useEditGroup = ({ groupId }: { groupId: Id<"groups"> }) => {
  const editGroup = useMutation(api.liveSessionsGroups.update);

  const editGroupFunc = React.useCallback(
    async (data: z.infer<typeof FormSchemaEdit>) => {
      await editGroup({
        title: data.group.name,
        groupId: groupId,
        members: data.members.map((member) => member.value) as string[],
      });
    },
    [editGroup, groupId]
  );

  return editGroupFunc;
};


const MultipleSelectorWithEditGroup = React.forwardRef((props: MultipleSelectorWithFormProps, ref) => {
  const form = useForm<z.infer<typeof FormSchemaEdit>>({
    resolver: zodResolver(FormSchemaEdit),

  });
  const userId = useUser().user?.id;
  const [groupId, setGroupId] = React.useState<Id<"groups">>();

  const { onClose } = useDialog()
  const { toast } = useToast()

  const selectGroupOptions = useGroups(userId as Id<"users">);

  const membersOptions = useMembers(groupId as Id<"groups">);

  const options = useUsers();

  const editGroupFunc = useEditGroup({ groupId: groupId as Id<"groups"> });


  function onSubmit(data: z.infer<typeof FormSchemaEdit>) {

    props.setLoading(true)
    editGroupFunc(data);
    onClose()

    toast({
      title: "Group updated",
      description: "The group has been updated.",
    })

  }

  // Use the useImperativeHandle hook to expose a submitForm method

  function handleSelectChange(value: Id<"groups">) {
    // get the value of the selected option 
    setGroupId(value as Id<"groups">);
    const selectedOption = selectGroupOptions?.find(
      option => option.value === value
    );
    if (selectedOption) {
      // Set the group name value to the label of the selected option
      form.setValue("group.name", selectedOption.label);
    }
  }

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
          name="group.name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select group</FormLabel>
              <FormControl>
                <Select onValueChange={handleSelectChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a group to edit" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectGroupOptions && selectGroupOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="group.name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Edit group name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  value={field.value}
                  defaultValue={field.name}
                  onChange={field.onChange}
                  placeholder="Enter a name for your group..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="members"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select group</FormLabel>
              <FormControl>
                <MultipleSelector
                  value={membersOptions}
                  onChange={field.onChange}
                  defaultOptions={membersOptions}

                  options={options}
                  placeholder="Select to delete or add participants..."
                  emptyIndicator={
                    <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                      no results found.
                    </p>
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
});

// Add the display name
MultipleSelectorWithEditGroup.displayName = 'MultipleSelectorWithEditGroup';

export default MultipleSelectorWithEditGroup


