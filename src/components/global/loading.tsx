import { Loader2 } from "lucide-react";
import React from "react";

const LoadingComponent = () => {
  return (
    <div className="w-full h-full fixed inset-0 z-[99] flex items-center flex-col justify-center bg-black/40">
      <Loader2 className="size-10 animate-spin" />
    </div>
  );
};

export default LoadingComponent;
