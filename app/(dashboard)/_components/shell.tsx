interface WrapperProps {
  children: React.ReactNode;
}

const Wrapper: React.FC<WrapperProps> = ({ children }) => {
  return (
    <div className="flex overflow-y-hidden ">
      {/* <div className="flex-1 grid xl:grid-cols-12 border border-yellow-800 relative z-20"> */}
      <div className="flex w-full h-full z-20 relative">
        {children}
      </div>
    </div>
  );
};

export default Wrapper;