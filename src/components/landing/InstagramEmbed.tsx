
import React, { useEffect, useRef } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface InstagramEmbedProps {
  url: string;
}

export const InstagramEmbed: React.FC<InstagramEmbedProps> = ({ url }) => {
  const embedRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    const processInstagramEmbeds = () => {
      // @ts-ignore
      if (window.instgrm && window.instgrm.Embeds) {
        // @ts-ignore
        window.instgrm.Embeds.process();
      }
    };
    
    // Check if the Instagram script is loaded
    // @ts-ignore
    if (window.instgrm) {
      processInstagramEmbeds();
    }

    // A simple way to detect when the embed has likely loaded is to check for the iframe
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                const iframe = embedRef.current?.querySelector('iframe.instagram-media-rendered');
                if (iframe) {
                    setIsLoading(false);
                    observer.disconnect();
                    break;
                }
            }
        }
    });

    if (embedRef.current) {
        observer.observe(embedRef.current, { childList: true, subtree: true });
    }

    // Fallback to hide skeleton after a few seconds
    const fallbackTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 5000);


    return () => {
        observer.disconnect();
        clearTimeout(fallbackTimeout);
    }
  }, [url]);

  return (
    <div ref={embedRef} className="relative aspect-video w-full bg-slate-100 flex items-center justify-center">
      {isLoading && <Skeleton className="h-full w-full" />}
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={url}
        data-instgrm-version="14"
        style={{
          background: '#FFF',
          border: '0',
          borderRadius: '3px',
          boxShadow: '0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)',
          margin: '1px',
          maxWidth: '540px',
          minWidth: '326px',
          padding: '0',
          width: 'calc(100% - 2px)',
        }}
      >
      </blockquote>
    </div>
  );
};
