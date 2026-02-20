// app/components/ChatWidget.tsx
'use client';

import React, { useState, Suspense, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { XMarkIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid';

// Lazy-load the actual chat component (MyChat).
const MyChat = dynamic(() => import('./MyChat'), { ssr: false });

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [mountedOnce, setMountedOnce] = useState(false);
  const [attention, setAttention] = useState(false); // small demo state (pulse)

  useEffect(() => {
    // restore preference
    const saved = typeof window !== 'undefined' ? localStorage.getItem('doah_chat_open') : null;
    if (saved === '1') {
      setOpen(true);
      setMountedOnce(true);
    }

    // demo: trigger attention pulse once after load (remove in prod)
    const t = setTimeout(() => setAttention(true), 3000);
    const t2 = setTimeout(() => setAttention(false), 8000);
    return () => {
      clearTimeout(t);
      clearTimeout(t2);
    };
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
      {/* Container: change classes here to move widget */}
      <div className="fixed right-6 bottom-6 z-50"> {/* <-- bottom-right by default */}
        {/* Panel: slide & fade animation */}
        <div
          id="doah-chat-panel"
          className={`transform transition-all duration-300 ease-in-out origin-bottom-right
            ${open ? 'translate-y-0 opacity-100 scale-100 pointer-events-auto' : 'translate-y-6 opacity-0 scale-95 pointer-events-none'}`}
          style={{ width: open ? 380 : 0 }}
        >
          <div className="w-[380px] h-[640px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
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
                  aria-label="Close chat"
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-md hover:bg-gray-100"
                >
                  <XMarkIcon className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

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

        {/* Floating toggle button */}
        <button
          aria-expanded={open}
          aria-controls="doah-chat-panel"
          onClick={() => setOpen((s) => !s)}
          className={`
            mt-4 inline-flex items-center justify-center w-14 h-14 rounded-full shadow-lg
            bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
            transform transition-transform duration-200
            ${open ? 'scale-110' : 'scale-100'}
            ${attention ? 'animate-pulse-slow' : ''}
          `}
          title="Open chat (press 'c')"
        >
          {/* rotate/transition the icon on open */}
          <span className={`inline-block transform transition-transform duration-300 ${open ? 'rotate-45' : 'rotate-0'}`}>
            {!open ? (
              <ChatBubbleLeftRightIcon className="w-6 h-6" />
            ) : (
              <XMarkIcon className="w-6 h-6" />
            )}
          </span>
        </button>
      </div>
    </div>
  );
}