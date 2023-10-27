interface WrapperProps {
  children: React.ReactNode;
}

const Wrapper: React.FC<WrapperProps> = ({ children }) => {
  return (
    <div className="flex flex-1 overflow-y-hidden ">
      <div className="flex-1 grid grid-cols-12 ">
        {children}
      </div>
    </div>
  );
};

export default Wrapper;