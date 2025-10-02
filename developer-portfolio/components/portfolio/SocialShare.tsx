"use client";

import { Button } from "@/components/ui/button";
import { Share2, Twitter, Facebook, Linkedin, LinkIcon } from "lucide-react";
import { toast } from "sonner";
import { CustomDropdown, DropdownItem } from "../ui/dropdown-menu";

interface SocialShareProps {
  title: string;
  url: string;
}

export function SocialShare({ title, url }: SocialShareProps) {
  const fullUrl =
    typeof window !== "undefined" ? `${window.location.origin}${url}` : url;

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

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy link");
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
      <DropdownItem asChild>
        <a
          href={shareLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center"
        >
          <Twitter className="w-4 h-4 mr-2" />
          Share on Twitter
        </a>
      </DropdownItem>
      <DropdownItem asChild>
        <a
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center"
        >
          <Facebook className="w-4 h-4 mr-2" />
          Share on Facebook
        </a>
      </DropdownItem>
      <DropdownItem asChild>
        <a
          href={shareLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center"
        >
          <Linkedin className="w-4 h-4 mr-2" />
          Share on LinkedIn
        </a>
      </DropdownItem>
      <DropdownItem onClick={copyToClipboard} className="flex items-center">
        <LinkIcon className="w-4 h-4 mr-2" />
        Copy Link
      </DropdownItem>
    </CustomDropdown>
  );
}
