import { Loader } from "lucide-react";

const Loading = () => {
  return (
    <div className="fixed inset-0 flex gap-2 items-center justify-center bg-background/50">
      <Loader className="w-6 h-6 animate-spin text-primary-700" />
      <span className="text-sm font-medium text-primary-700">Loading...</span>
    </div>
  );
};

export default Loading;
