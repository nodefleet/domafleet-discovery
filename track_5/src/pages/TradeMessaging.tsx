import React, { useState } from 'react';
import { MessageCircle, Send, Users, Shield } from 'lucide-react';
import SEOHead from '../components/SEOHead';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  type: 'message' | 'offer' | 'system';
}

const TradeMessaging: React.FC = () => {
  const [message, setMessage] = useState('');
  const [messages] = useState<Message[]>([
    {
      id: '1',
      sender: '0x1234...5678',
      content: 'Hi! I\'m interested in purchasing premium.doma. Is the listed price negotiable?',
      timestamp: '2024-12-01T10:00:00Z',
      type: 'message'
    },
    {
      id: '2',
      sender: 'You',
      content: 'Hello! Yes, I\'m open to reasonable offers. What did you have in mind?',
      timestamp: '2024-12-01T10:05:00Z',
      type: 'message'
    },
    {
      id: '3',
      sender: '0x1234...5678',
      content: 'I was thinking around 2.0 ETH. I can provide proof of funds if needed.',
      timestamp: '2024-12-01T10:10:00Z',
      type: 'message'
    }
  ]);

  const handleSendMessage = () => {
    if (message.trim()) {
      // In a real implementation, this would send the message via XMTP
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  return (
    <>
      <SEOHead
        title="Trade Chat - Secure Domain Negotiations"
        description="Connect with domain owners and buyers for secure trade negotiations on the Doma Protocol platform."
        keywords="domain trading, secure messaging, blockchain negotiations, XMTP"
      />

      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-[calc(100vh-12rem)]">
            <div className="flex h-full">
              {/* Sidebar */}
              <div className="w-1/3 border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Trade Chats
                  </h2>
                </div>
                
                <div className="flex-1 overflow-y-auto">
                  <div className="p-2 space-y-1">
                    <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                      <div className="font-medium text-gray-900">premium.doma</div>
                      <div className="text-sm text-gray-600">0x1234...5678</div>
                      <div className="text-xs text-gray-500 mt-1">Last message 5 min ago</div>
                    </div>
                    
                    <div className="p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="font-medium text-gray-900">crypto.doma</div>
                      <div className="text-sm text-gray-600">0x9876...4321</div>
                      <div className="text-xs text-gray-500 mt-1">Last message 2 hours ago</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat Area */}
              <div className="flex-1 flex flex-col">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">premium.doma</h3>
                      <p className="text-sm text-gray-600">Trading with 0x1234...5678</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center text-green-600">
                        <Shield className="w-4 h-4 mr-1" />
                        <span className="text-sm">Encrypted</span>
                      </div>
                      <div className="flex items-center text-blue-600">
                        <Users className="w-4 h-4 mr-1" />
                        <span className="text-sm">2 participants</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          msg.sender === 'You'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <div className="text-sm">{msg.content}</div>
                        <div
                          className={`text-xs mt-1 ${
                            msg.sender === 'You' ? 'text-blue-100' : 'text-gray-500'
                          }`}
                        >
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type your message..."
                      className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!message.trim()}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Messages are encrypted end-to-end using XMTP protocol
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TradeMessaging;
