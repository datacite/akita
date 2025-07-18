import React from 'react';

export default function EmbedLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <div>
          {children}
        </div>
      </body>
    </html>
  );
} 