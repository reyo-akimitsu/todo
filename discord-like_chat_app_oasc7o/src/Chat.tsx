import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";

export function Chat() {
  const [selectedChannel, setSelectedChannel] = useState<Id<"channels"> | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const channels = useQuery(api.channels.list);
  const messages = useQuery(api.messages.list, selectedChannel ? { channelId: selectedChannel } : "skip");
  const sendMessage = useMutation(api.messages.send);
  const createChannel = useMutation(api.channels.create);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChannel || !newMessage.trim()) return;
    
    await sendMessage({
      channelId: selectedChannel,
      content: newMessage,
    });
    setNewMessage("");
  };

  const handleCreateChannel = async () => {
    const name = prompt("Enter channel name:");
    if (!name) return;
    await createChannel({ name });
  };

  return (
    <>
      <div className="w-64 bg-gray-900 p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-gray-200 font-semibold">Channels</h3>
          <button
            onClick={handleCreateChannel}
            className="text-gray-400 hover:text-white text-2xl"
          >
            +
          </button>
        </div>
        <div className="space-y-1">
          {channels?.map((channel) => (
            <button
              key={channel._id}
              onClick={() => setSelectedChannel(channel._id)}
              className={`w-full text-left px-2 py-1 rounded ${
                selectedChannel === channel._id
                  ? "bg-gray-700 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
              }`}
            >
              # {channel.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 bg-gray-700 flex flex-col">
        {selectedChannel ? (
          <>
            <div className="flex-1 p-4 overflow-y-auto flex flex-col-reverse">
              <div className="space-y-4">
                {messages?.map((message) => (
                  <div key={message._id} className="flex items-start gap-2">
                    <div className="bg-gray-800 rounded-lg p-3">
                      <div className="font-semibold text-gray-300 mb-1">
                        {message.author}
                      </div>
                      <div className="text-gray-100">{message.content}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <form onSubmit={handleSendMessage} className="p-4 bg-gray-800">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Send a message..."
                className="w-full px-4 py-2 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select a channel to start chatting
          </div>
        )}
      </div>
    </>
  );
}
