interface WrapperProps {
  children: React.ReactNode;
}

const Wrapper: React.FC<WrapperProps> = ({ children }) => {
  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      <div className="flex w-full relative">
        {children}
      </div>
    </div>
  );
};

export default Wrapper;
