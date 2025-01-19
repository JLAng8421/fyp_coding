'use client';

// Programmer Name  : Ang Jia Liang TP068299
// Program Name     : ai_assistant/page.tsx
// Description      : The frontend of AI assistant page
// First Written on : 4-Dec-2024
// Edited on        : 30-Dec-2024

// Import necessary dependencies and components
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Banner } from '@/components/Banner';
import { Send, Loader2, RefreshCw, Bot, User, Info, LogIn } from 'lucide-react';
import { ConfirmationModal } from '@/components/ConfirmationModal';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import Link from 'next/link';

// Define the structure of a message object
interface Message {
  role: 'user' | 'ai';
  content: string;
}

export default function AskPage() {
  // State the variables
  const [input, setInput] = useState('');
  const [conversation, setConversation] = useState<Message[]>([]);
  const [isAiResponding, setIsAiResponding] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasAskedQuestion, setHasAskedQuestion] = useState(false);

  // Ref to ensure the conversation view scrolls to the latest message
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check and update the user's login status when the page is loaded
  useEffect(() => {
    // Check if user is logged in
    const userId = localStorage.getItem('userId');
    setIsLoggedIn(!!userId);
  }, []);

  // Extracts the AI's response from the raw response data
  const extractAiResponse = (overallResponse: string) => {
    const match = overallResponse.match(/### Response:\s*(.*)/s);
    return match ? match[1].trim() : '';
  };

  // Handles when the user sends a message
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate input and user status before proceeding
    if (input.trim() && (isLoggedIn || !hasAskedQuestion)) {
      const userMessage: Message = { role: 'user', content: input };
      setConversation((prev) => [...prev, userMessage]);
      setIsAiResponding(true);
      setInput('');

      // Allow a single question for user that are not signned in
      if (!isLoggedIn) {
        setHasAskedQuestion(true);
      }

      try {
        // Send the user's message to the backend API for AI response
        const response = await fetch(
          'https://8060-35-247-0-0.ngrok-free.app/api/chat', // please ensures that there are api/chat at the end of the url
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              instruction: 'Answer the input.',
              input_text: input,
            }),
          }
        );

        // Process the response and update the conversation
        const data = await response.json();
        const extractedAiMessage = extractAiResponse(data.response);
        const aiMessage: Message = { role: 'ai', content: extractedAiMessage };
        setConversation((prev) => [...prev, aiMessage]);
      } catch (error) {
        // Handle API call errors
        console.error('Error fetching AI response:', error);
        const errorMessage: Message = {
          role: 'ai',
          content: 'Sorry, I encountered an error. Please try again.',
        };
        setConversation((prev) => [...prev, errorMessage]);
      } finally {
        setIsAiResponding(false);
      }
    }
  };

  // Prompt the user to confirm before starting a new chat
  const handleStartNewChat = () => {
    if (conversation.length > 0) {
      setIsConfirmationOpen(true);
    } else {
      alert('The chat is currently empty.');
    }
  };

  // Reset the chat and close the confirmation box
  const confirmStartNewChat = () => {
    setConversation([]);
    setIsConfirmationOpen(false);
    setHasAskedQuestion(false);
  };

  // Automatically scroll to the latest message in the conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      {/* Display the banner */}
      <Banner />
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header section with title and tooltip */}
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold text-blue-800 flex items-center">
              <Bot className="mr-2" />
              Ask AI Assistant
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full">
                      <Info className="w-5 h-5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {/* Provide information about the assistant */}
                    <p className="max-w-xs text-sm">
                      This assistant is based on the Mistral-7B model by
                      MistralAI, and is fine-tuned for mental health support
                      purpose. While precautions were taken to reduce harmful
                      responses, we cannot guarantee complete prevention. <br />
                      The assistant will be able to provide information,
                      guidance, and resources but is not a substitute for
                      professional medical advice. For any serious concerns, we
                      encourage you to consult a qualified healthcare
                      professional.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </h1>
          </div>

          {/* Chat window */}
          <div
            className="h-[calc(100vh-300px)] overflow-y-auto p-6"
            style={{ scrollBehavior: 'smooth' }}
          >
            {/* Render conversation messages */}
            {conversation.map((message, index) => (
              <div
                key={index}
                className={`mb-4 flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="flex items-center mb-1">
                    {message.role === 'user' ? (
                      <>
                        <span className="font-semibold mr-2">You</span>
                        <User className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        <span className="font-semibold mr-2">AI</span>
                        <Bot className="w-4 h-4" />
                      </>
                    )}
                  </div>
                  <p className="text-sm whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>
              </div>
            ))}

            {/* Show loading indicator during AI response */}
            {isAiResponding && (
              <div className="flex justify-start mb-4">
                <div className="bg-gray-100 p-3 rounded-lg text-gray-800 flex items-center">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  <span>AI is thinking...</span>
                </div>
              </div>
            )}

            {/* Prompt user to sign in after their first question */}
            {!isLoggedIn && hasAskedQuestion && (
              <div className="flex justify-center mb-4">
                <div className="bg-yellow-100 p-3 rounded-lg text-yellow-800 flex items-center">
                  <LogIn className="w-4 h-4 mr-2" />
                  <span>
                    Please{' '}
                    <Link href="/signin" className="underline font-semibold">
                      Sign in
                    </Link>{' '}
                    to ask more questions.
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input field for user questions */}
          <div className="p-4 border-t">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask something..."
                className="flex-grow"
                disabled={isAiResponding || (!isLoggedIn && hasAskedQuestion)}
              />
              <Button
                type="submit"
                disabled={
                  isAiResponding ||
                  !input.trim() ||
                  (!isLoggedIn && hasAskedQuestion)
                }
              >
                <Send className="w-4 h-4 mr-2" />
                Send
              </Button>
            </form>
          </div>

          {/* Button to start a new chat */}
          <div className="p-4 bg-gray-50 flex justify-between items-center">
            <Button
              onClick={handleStartNewChat}
              variant="outline"
              className="w-full"
              disabled={conversation.length === 0}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Start New Chat
            </Button>
          </div>
        </div>
      </div>

      {/* Confirmation box for starting a new chat */}
      <ConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onConfirm={confirmStartNewChat}
      />
    </main>
  );
}
