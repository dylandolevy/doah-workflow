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
        {/* Panel: fixed positioning so it sits above the button reliably */}
        <div
          id="doah-chat-panel"
          className={`pointer-events-auto transform transition-all duration-300 ease-in-out origin-bottom-right
            ${open ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
          style={{
            position: 'absolute',
            width: 380,
            bottom: 96, // space for the button
            right: 24,
            // Use a viewport-based max height so the panel grows/shrinks with the viewport
            maxHeight: 'calc(100vh - 120px)',
          }}
        >
          {/* Outer shell: keep overflow visible here so footer isn't clipped by rounded corners */}
          <div
            className="w-[380px] bg-white rounded-2xl shadow-2xl flex flex-col z-[60]"
            style={{
              // full height but constrained by parent maxHeight
              height: '100%',
              maxHeight: 'calc(100vh - 120px)',
              overflow: 'visible',
            }}
          >
            {/* Header */}
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

            {/* Main: chat messages area (scrollable) */}
            {/* NOTE: the chat list should live here and be allowed to scroll independently */}
            <div
              className="flex-1 overflow-auto"
              style={{
                // Make it fill remaining vertical space (header + footer reserved),
                // height will be automatically constrained by the outer maxHeight.
                padding: '16px',
              }}
            >
              {mountedOnce ? (
                // If MyChat renders its own input/footer, it should be removed or adjusted:
                // Ideally MyChat renders only the message list here and NOT the footer input.
                // If MyChat contains the input, ensure that input is not positioned absolute
                // outside this area — it should be inside a footer we control below.
                <Suspense fallback={<div className="p-4">Loading chat…</div>}>
                  <MyChat />
                </Suspense>
              ) : (
                <div className="p-4 text-sm text-gray-500">Click the button to open chat</div>
              )}
            </div>

            {/* Footer: fixed-height input area that always stays visible */}
            <div
              className="px-4 py-3 border-t bg-white"
              style={{
                // fixed footer height so it never collapses
                height: 72,
                // add a little extra bottom padding so the rounded corner doesn't overlap input
                paddingBottom: 18,
              }}
            >
              {/* If MyChat already provides the input, move/duplicate that input into this area.
                  For demonstration we show a simple input bar here. */}
              <div className="relative">
                <input
                  aria-label="Message the AI"
                  type="text"
                  className="w-full h-10 rounded-full border border-gray-200 px-4 focus:outline-none focus:ring-2 focus:ring-[#3C6E69]"
                  placeholder="Message the AI"
                  // ensure the input is not covered by anything and is clickable
                  style={{ zIndex: 80 }}
                />
                {/* small send button in corner (visual match to screenshot) */}
                <button
                  aria-label="Send"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#111827] text-white"
                  style={{ zIndex: 85 }}
                >
                  ↑
                </button>
              </div>
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