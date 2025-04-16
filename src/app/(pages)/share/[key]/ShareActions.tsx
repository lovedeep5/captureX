"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Copy, Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ShareActionsProps {
  url: string;
}

const ShareActions = ({ url }: ShareActionsProps) => {
  const { toast } = useToast();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied!",
      description: "Share URL has been copied to your clipboard",
      className: "bg-[#1E293B] text-white border-gray-800",
    });
  };

  return (
    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="secondary"
          className="bg-[#1E293B]/80 hover:bg-[#1E293B] text-white"
          onClick={handleCopyLink}
        >
          <Copy className="w-4 h-4 mr-2" />
          Copy Link
        </Button>
        <Button
          size="sm"
          variant="secondary"
          className="bg-[#1E293B]/80 hover:bg-[#1E293B] text-white"
          asChild
        >
          <a href={url} download>
            <Download className="w-4 h-4 mr-2" />
            Download
          </a>
        </Button>
      </div>
    </div>
  );
};

export default ShareActions;
