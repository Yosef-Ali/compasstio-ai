import { useRef, useEffect } from 'react';

interface TextareaProps {
  className?: string;
  variant?: 'default' | 'bordered';
  value?: string;
  autoResize?: boolean;
  onChange: (value: string) => void;
}

const Textarea: React.FC<TextareaProps> = ({
  className,
  variant,
  value,
  autoResize,
  onChange
}) => {

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const baseClasses = `max-w-full w-full px-5 py-4 rounded-sm content-center outline-none text-sm
  placeholder:text-black placeholder:opacity-40 text-opacity-70 dark:placeholder:text-white
  dark:placeholder:opacity-70 focus:outline-none transition duration-200
  ease-out`;

  const variantClasses = variant === 'bordered' ? `border border-gray-200 text-black bg-gray-50 dark:bg-gray-700
  dark:text-white dark:bg-opacity-70 dark:focus:bg-opacity-0 focus:bg-opacity-0
  focus:border-indigo-300 dark:border-gray-600` : `text-black bg-gray-50 dark:text-white border-opacity-0
  dark:bg-gray-700 dark:bg-opacity-70 dark:border-opacity-70 dark:border-gray-700`;

  const classes = `${baseClasses} ${variantClasses} ${className}`;

  useEffect(() => {
    if (autoResize && textareaRef.current) {
      handleAutoResize();
    }
  });

  const handleAutoResize = () => {
    textareaRef.current!.style.height = 'auto';
    textareaRef.current!.style.height = textareaRef.current!.scrollHeight + 'px';
  }

  return (
    <textarea
      className={classes}
      ref={textareaRef}
      value={value}
      onChange={(e) => {
        handleAutoResize();
        onChange(e.target.value);
      }}
    />
  );

};

export default Textarea;