'use client';

import { CodeSandboxLogoIcon } from '@radix-ui/react-icons';
import { useCompletion } from 'ai/react';
import { toast } from 'sonner';
import { useDebouncedCallback } from 'use-debounce';

export default function Completion() {
  const { complete, completion, isLoading } = useCompletion({
    api: '/api/completion',
    onResponse: res => {
      // trigger something when the response starts streaming in
      // e.g. if the user is rate limited, you can show a toast
      if (res.status === 429) {
        toast.error('You are being rate limited. Please try again later.');
      }
    },
    onFinish: () => {
      // do something with the completion result
      toast.success('Successfully generated completion!');

    },
  });

  const handleInputChange = useDebouncedCallback(e => {
    complete(e.target.value);
  }, 500);

  console.log('completion', completion)

  return (
    <div className="space-y-3 p-10 mx-auto w-full max-w-lg">
      <p>Current state: {isLoading ? 'Generating...' : 'Idle'}</p>
      <textarea
        placeholder="Enter your prompt..."
        onChange={handleInputChange}
      />
      <p>{completion}</p>
    </div>
  );
}