'use client';

import { Twitter, Linkedin, Facebook, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface SocialShareButtonsProps {
  url: string;
  title: string;
}

export function SocialShareButtons({ url, title }: SocialShareButtonsProps) {
  const shareUrl = typeof window !== 'undefined' ? window.location.href : url;

  const handleShare = (platform: 'twitter' | 'linkedin' | 'facebook') => {
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    };

    window.open(urls[platform], '_blank', 'width=600,height=400');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('ლინკი დაკოპირებულია');
    } catch (error) {
      toast.error('ლინკის კოპირება ვერ მოხერხდა');
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        გაზიარება
      </h3>
      <div className="flex flex-col gap-2">
        <Button
          variant="outline"
          size="sm"
          className="justify-start"
          onClick={() => handleShare('twitter')}
        >
          <Twitter className="w-4 h-4 mr-2" />
          Twitter
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="justify-start"
          onClick={() => handleShare('linkedin')}
        >
          <Linkedin className="w-4 h-4 mr-2" />
          LinkedIn
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="justify-start"
          onClick={() => handleShare('facebook')}
        >
          <Facebook className="w-4 h-4 mr-2" />
          Facebook
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="justify-start"
          onClick={handleCopyLink}
        >
          <LinkIcon className="w-4 h-4 mr-2" />
          ლინკის კოპირება
        </Button>
      </div>
    </div>
  );
}
