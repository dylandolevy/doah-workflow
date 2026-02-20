'use client';

import { ChatKit, useChatKit } from '@openai/chatkit-react';

export default function MyChat() {
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

  return (
    <div style={{ marginTop: 20 }}>
      <ChatKit control={control} style={{ height: 600, width: 360 }} />
    </div>
  );
}