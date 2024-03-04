"use client";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import * as React from 'react';
import {
  Form,
  FormControl,
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
const FormSchema = z.object({
  members: z.array(optionSchema).min(1),
  group: groupNameSchema,
});


const useUsers = () => {
  const [options, setOptions] = React.useState<Option[]>([]);
  const users = useQuery(api.users.get);

  React.useEffect(() => {
    const newOptions = users?.map(user => ({
      label: `${user.name} (${user.email})`,
      value: user.email,
    })) as Option[];
    setOptions(newOptions);
  }, [users]);

  return options;
};


const useCreateGroup = () => {
  const createGroup = useMutation(api.liveSessionsGroups.create);
  const ownerId = useUser().user?.id;

  const createGroupFunc = React.useCallback(
    async (data: z.infer<typeof FormSchema>) => {
      await createGroup({
        title: data.group.name,
        userId: ownerId as string,
        members: data.members.map((member) => member.value) as string[],
      });
    },
    [createGroup, ownerId]
  );

  return createGroupFunc;
};


const MultipleSelectorWithCreateGroup = React.forwardRef((props: MultipleSelectorWithFormProps, ref) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const { onClose } = useDialog()
  const { toast } = useToast()
  const options = useUsers();
  const createGroupFunc = useCreateGroup();

  function onSubmit(data: z.infer<typeof FormSchema>) {
    props.setLoading(true)
    createGroupFunc(data);
    onClose()
    toast({
      title: "Group created",
      description: "The group has been created.",
    })
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
          name="group.name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Create group</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  value={field.value}
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
              <FormLabel>Select participants</FormLabel>
              <FormControl>
                <MultipleSelector
                  value={field.value}
                  onChange={field.onChange}
                  defaultOptions={options}
                  options={options}
                  placeholder="Select frameworks you like..."
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


export default MultipleSelectorWithCreateGroup