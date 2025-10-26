"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  CustomDropdown,
  DropdownSeparator,
  DropdownItem,
} from "../../ui/dropdown-menu";
import {
  Share2,
  Twitter,
  Facebook,
  Linkedin,
  Link2,
  Check,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { SocialShareProps } from "@/types/index.types";

export function SocialShare({ title, url }: SocialShareProps) {
  const [copied, setCopied] = useState(false);

  // Safe URL construction
  const getFullUrl = () => {
    if (typeof window === "undefined") return url;

    // If URL is already absolute, return as is
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    // Construct full URL
    const origin = window.location.origin;
    const path = url.startsWith("/") ? url : `/${url}`;
    return `${origin}${path}`;
  };

  const fullUrl = getFullUrl();

  // Social share configurations
  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      title
    )}&url=${encodeURIComponent(fullUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      fullUrl
    )}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      fullUrl
    )}`,
  };

  // Copy to clipboard handler
  const copyToClipboard = async () => {
    try {
      // Check if clipboard API is available
      if (!navigator?.clipboard) {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = fullUrl;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);

        setCopied(true);
        toast({
          title: "Success",
          description: "Link copied to clipboard!",
          variant: "success",
        });

        setTimeout(() => setCopied(false), 2000);
        return;
      }

      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);

      toast({
        title: "Success",
        description: "Link copied to clipboard!",
        variant: "success",
      });

      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      toast({
        title: "Error",
        description: "Failed to copy link. Please try again.",
        variant: "error",
      });
    }
  };

  // Open link in new window
  const handleShare = (platform: string) => {
    const link = shareLinks[platform as keyof typeof shareLinks];
    if (link) {
      window.open(link, "_blank", "noopener,noreferrer,width=600,height=400");
    }
  };

  return (
    <CustomDropdown
      align="end"
      trigger={
        <Button size="lg" variant="outline">
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      }
    >
      {/* Twitter */}
      <DropdownItem
        onClick={() => handleShare("twitter")}
        className="cursor-pointer group hover:bg-primary/10 focus:bg-primary/10 transition-colors"
      >
        <div className="flex items-center gap-3 w-full">
          <div className="p-1.5 rounded-lg bg-sky-500/10 group-hover:bg-sky-500/20 transition-colors">
            <Twitter className="w-4 h-4 text-sky-500" />
          </div>
          <span className="font-medium text-foreground">Share on Twitter</span>
        </div>
      </DropdownItem>

      {/* Facebook */}
      <DropdownItem
        onClick={() => handleShare("facebook")}
        className="cursor-pointer group hover:bg-primary/10 focus:bg-primary/10 transition-colors"
      >
        <div className="flex items-center gap-3 w-full">
          <div className="p-1.5 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
            <Facebook className="w-4 h-4 text-blue-600" />
          </div>
          <span className="font-medium text-foreground">Share on Facebook</span>
        </div>
      </DropdownItem>

      {/* LinkedIn */}
      <DropdownItem
        onClick={() => handleShare("linkedin")}
        className="cursor-pointer group hover:bg-primary/10 focus:bg-primary/10 transition-colors"
      >
        <div className="flex items-center gap-3 w-full">
          <div className="p-1.5 rounded-lg bg-blue-700/10 group-hover:bg-blue-700/20 transition-colors">
            <Linkedin className="w-4 h-4 text-blue-700" />
          </div>
          <span className="font-medium text-foreground">Share on LinkedIn</span>
        </div>
      </DropdownItem>

      <DropdownSeparator className="bg-border" />

      {/* Copy Link */}
      <DropdownItem
        onClick={copyToClipboard}
        className="cursor-pointer group hover:bg-primary/10 focus:bg-primary/10 transition-colors"
      >
        <div className="flex items-center gap-3 w-full">
          <div
            className={`p-1.5 rounded-lg transition-all duration-300 ${
              copied
                ? "bg-emerald-500/20"
                : "bg-primary/10 group-hover:bg-primary/20"
            }`}
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-500" />
            ) : (
              <Link2 className="w-4 h-4 text-primary" />
            )}
          </div>
          <span className="font-medium text-foreground">
            {copied ? "Link Copied!" : "Copy Link"}
          </span>
        </div>
      </DropdownItem>
    </CustomDropdown>
  );
}

export default SocialShare;
