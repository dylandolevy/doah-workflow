// app/components/ChatWidget.tsx
'use client';

import React, { useState, Suspense, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { XMarkIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid';

const MyChat = dynamic(() => import('./MyChat'), { ssr: false });

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [mountedOnce, setMountedOnce] = useState(false);
  const [attention, setAttention] = useState(false);

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('doah_chat_open') : null;
    if (saved === '1') {
      setOpen(true);
      setMountedOnce(true);
    }

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

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key.toLowerCase() === 'c') setOpen((s) => !s);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div aria-live="polite">
      {/* fixed container */}
      <div className="fixed right-6 bottom-6 z-50 pointer-events-none">
        {/* Panel wrapper positioned absolute within fixed container so it sits above the button */}
        <div
          id="doah-chat-panel"
          className={`pointer-events-auto transform transition-all duration-300 ease-in-out origin-bottom-right
            ${open ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
          style={{
            position: 'absolute',
            width: 380,
            bottom: 96, // leave room for the button
            right: 24,
            maxHeight: 'calc(100vh - 120px)',
          }}
        >
          <div
            className="w-[380px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col z-[60]"
            style={{
              // give it enough height so ChatKit can render its input at the bottom.
              // ChatKit itself uses a fixed height in your original code (600) so match or exceed that.
              height: 640,
              maxHeight: 'calc(100vh - 120px)',
            }}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[#3C6E69] text-white">
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

            <div className="flex-1 overflow-auto">
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
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
          <button
            aria-expanded={open}
            aria-controls="doah-chat-panel"
            onClick={() => setOpen((s) => !s)}
            className={`
              inline-flex items-center justify-center w-14 h-14 rounded-full shadow-lg
              bg-[#3C6E69] text-white hover:bg-[#335f5a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3C6E69]
              transform transition-transform duration-200
              ${open ? 'scale-110' : 'scale-100'}
              ${attention ? 'animate-pulse-slow' : ''}
            `}
            title="Open chat (press 'c')"
            style={{ pointerEvents: 'auto', zIndex: 50 }}
          >
            <span className={`inline-block transform transition-transform duration-300 ${open ? 'rotate-45' : 'rotate-0'}`}>
              {!open ? <ChatBubbleLeftRightIcon className="w-6 h-6" /> : <XMarkIcon className="w-6 h-6" />}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}