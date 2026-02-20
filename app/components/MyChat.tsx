// app/components/MyChat.tsx
'use client';

import React, { useEffect } from 'react';
import { ChatKit, useChatKit } from '@openai/chatkit-react';

type Props = {
  showInput?: boolean;
};

export default function MyChat({ showInput = true }: Props) {
  const { control } = useChatKit({
    api: {
      async getClientSecret(existing) {
        let deviceId = localStorage.getItem('deviceId');

        if (!deviceId) {
          deviceId = crypto.randomUUID();
          localStorage.setItem('deviceId', deviceId);
        }

        const res = await fetch('/api/chatkit/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ deviceId }),
        });

        if (!res.ok) {
          const txt = await res.text();
          throw new Error(txt);
        }

        const json = await res.json();
        return json.client_secret;
      },
    },
  });

  useEffect(() => {
    // If we are hiding the ChatKit input/footer, inject a small CSS override.
    // We scope rules to #mychat-root so it won't affect other components.
    if (!showInput) {
      const id = 'mychat-hide-footer-style';
      if (!document.getElementById(id)) {
        const style = document.createElement('style');
        style.id = id;
        // these selectors try to cover common input/footer patterns inside ChatKit
        style.innerHTML = `
          /* scope to the wrapper so it's safe */
          #mychat-root textarea,
          #mychat-root input[type="text"],
          #mychat-root [role="textbox"],
          #mychat-root .chatkit-footer,
          #mychat-root .ck-footer,
          #mychat-root [data-testid*="input"],
          #mychat-root [data-testid*="footer"] {
            display: none !important;
            visibility: hidden !important;
            height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          /* ensure the message list can use the freed space */
          #mychat-root .chatkit-body,
          #mychat-root .ck-body,
          #mychat-root [data-testid*="messages"] {
            height: 100% !important;
            max-height: none !important;
          }
        `;
        document.head.appendChild(style);
      }
    } else {
      // remove the injected style if present
      const existing = document.getElementById('mychat-hide-footer-style');
      if (existing) existing.remove();
    }

    // cleanup on unmount
    return () => {
      const existing = document.getElementById('mychat-hide-footer-style');
      if (existing) existing.remove();
    };
  }, [showInput]);

  return (
    // wrapper id is important — CSS rules above are scoped to it
    <div id="mychat-root" style={{ height: '100%', width: '100%', marginTop: 20 }}>
      {/* Let the parent control sizing — set height to 100% so ChatKit fills the available area */}
      <ChatKit control={control} style={{ height: '100%', width: 360 }} />
    </div>
  );
}