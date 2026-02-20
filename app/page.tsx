import MyChat from "./components/MyChat";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 py-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">
          DoAH Chatbot
        </h1>
        <p className="text-gray-600 mt-2">
          Powered by AI Workflow
        </p>
      </div>

      <MyChat />
    </main>
  );
}