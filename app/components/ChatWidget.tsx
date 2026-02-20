// app/components/ChatWidget.tsx
'use client';

import React, { useState, Suspense, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { XMarkIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid';

// Lazy-load the actual chat component (MyChat). Replace path if your MyChat is elsewhere.
const MyChat = dynamic(() => import('./MyChat'), { ssr: false });

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [mountedOnce, setMountedOnce] = useState(false);

  // remember preference in localStorage (optional)
  useEffect(() => {
    const saved = localStorage.getItem('doah_chat_open');
    if (saved === '1') {
      setOpen(true);
      setMountedOnce(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('doah_chat_open', open ? '1' : '0');
    if (open) setMountedOnce(true);
  }, [open]);

  // keyboard toggle with "c"
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key.toLowerCase() === 'c') setOpen((s) => !s);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div aria-live="polite">
      {/* Container */}
      <div className="fixed right-6 bottom-6 z-50">
        {/* Expanded panel */}
        <div
          className={`transform transition-all duration-300 ease-in-out ${
            open ? 'opacity-100 translate-y-0' : 'opacity-0 pointer-events-none translate-y-6'
          }`}
          style={{ width: open ? 380 : 0 }}
        >
          <div className="w-[380px] h-[640px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-green-600 text-white">
                  <ChatBubbleLeftRightIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold">DoAH Chatbot</div>
                  <div className="text-xs text-gray-500">AI assistant</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  aria-label={open ? 'Close chat' : 'Open chat'}
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-md hover:bg-gray-100"
                >
                  <XMarkIcon className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Body: lazy mount the chat only after first open */}
            <div className="flex-1">
              {mountedOnce ? (
                <Suspense fallback={<div className="p-4">Loading chat…</div>}>
                  <MyChat />
                </Suspense>
              ) : (
                <div className="p-4 text-sm text-gray-500">Click the button to open chat</div>
              )}
            </div>
          </div>
        </div>

        {/* Floating toggle button (always visible) */}
        <button
          aria-expanded={open}
          aria-controls="doah-chat-panel"
          onClick={() => setOpen((s) => !s)}
          className="mt-4 inline-flex items-center justify-center w-14 h-14 rounded-full shadow-lg bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          title="Open chat (press 'c')"
        >
          {!open ? (
            <ChatBubbleLeftRightIcon className="w-6 h-6" />
          ) : (
            <XMarkIcon className="w-6 h-6" />
          )}
        </button>
      </div>
    </div>
  );
}