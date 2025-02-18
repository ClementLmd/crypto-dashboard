export const Loader = ({ text }: { text?: string }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900" />
      {text && <div className="text-center mt-2">{text}</div>}
    </div>
  );
};
