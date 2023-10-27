

interface WrapperProps {
  children: React.ReactNode;
}

const Wrapper: React.FC<WrapperProps> = ({ children }) => {
  return (
    <main className="col-span-8  h-full flex flex-col overflow-y-auto ">
      <div className="h-full flex flex-col p-6 relative">
        {children}
      </div>
    </main>
  );
};

export default Wrapper;