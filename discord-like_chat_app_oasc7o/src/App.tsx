import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { Chat } from "./Chat";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 bg-gray-800 p-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Discord-like Chat</h2>
        <SignOutButton />
      </header>
      <main className="flex-1 flex">
        <Authenticated>
          <Chat />
        </Authenticated>
        <Unauthenticated>
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="w-full max-w-md mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-white mb-4">Welcome to Chat</h1>
                <p className="text-gray-400">Sign in to start chatting</p>
              </div>
              <SignInForm />
            </div>
          </div>
        </Unauthenticated>
      </main>
      <Toaster />
    </div>
  );
}
