import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ChatMessage,
  saveApiKey,
  getApiKey,
  sendMessage,
  saveChatHistory,
  getChatHistory,
  getAllChats,
  getChatTitle,
  setChatTitle,
} from '../utils/geminiApi';
import { useProfile } from './ProfileContext';

const generateId = () => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 10);
  return `${timestamp}-${randomStr}`;
};

interface ChatSession {
  id: string;
  title: string;
  lastMessageDate: number;
}

interface ChatContextType {
  chatSessions: ChatSession[];
  currentChatId: string | null;
  messages: ChatMessage[];
  isLoading: boolean;
  apiKey: string;
  error: string | null;
  setApiKey: (key: string) => Promise<void>;
  createNewChat: () => Promise<string>;
  selectChat: (chatId: string) => Promise<void>;
  sendUserMessage: (message: string) => Promise<void>;
  updateChatTitle: (chatId: string, title: string) => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType>({
  chatSessions: [],
  currentChatId: null,
  messages: [],
  isLoading: false,
  apiKey: '',
  error: null,
  setApiKey: async () => {},
  createNewChat: async () => '',
  selectChat: async () => {},
  sendUserMessage: async () => {},
  updateChatTitle: async () => {},
  deleteChat: async () => {},
});

export const useChat = () => useContext(ChatContext);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKeyState] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { profile } = useProfile();

  useEffect(() => {
    const init = async () => {
      try {
        const storedApiKey = await getApiKey();
        if (storedApiKey) {
          setApiKeyState(storedApiKey);
        }

        // Load chat sessions
        await loadChatSessions();
      } catch (error) {
        console.error('Error initializing chat context:', error);
        setError('Failed to initialize chat. Please try again.');
      }
    };

    init();
  }, []);

  const loadChatSessions = async () => {
    try {
      const chatIds = await getAllChats();
      const sessions: ChatSession[] = [];

      for (const id of chatIds) {
        const title = await getChatTitle(id);
        const messages = await getChatHistory(id);
        const lastMessage = messages[messages.length - 1];
        const lastMessageDate = lastMessage ? lastMessage.timestamp : Date.now();

        sessions.push({
          id,
          title,
          lastMessageDate,
        });
      }

      // Sort by most recent first
      sessions.sort((a, b) => b.lastMessageDate - a.lastMessageDate);
      setChatSessions(sessions);

      // If there's at least one session, select the most recent one
      if (sessions.length > 0 && !currentChatId) {
        await selectChat(sessions[0].id);
      }
    } catch (error) {
      console.error('Error loading chat sessions:', error);
      setError('Failed to load chat sessions. Please try again.');
    }
  };


  const setApiKey = async (key: string) => {
    try {
      await saveApiKey(key);
      setApiKeyState(key);
      setError(null);
    } catch (error) {
      console.error('Error setting API key:', error);
      setError('Failed to save API key. Please try again.');
    }
  };


  const createNewChat = async (): Promise<string> => {
    try {
      const newChatId = generateId();
      const title = 'New Chat';
      const timestamp = Date.now();

      const newSession: ChatSession = {
        id: newChatId,
        title,
        lastMessageDate: timestamp,
      };

      setChatSessions(prev => [newSession, ...prev]);

      await setChatTitle(newChatId, title);

      await selectChat(newChatId);

      return newChatId;
    } catch (error) {
      console.error('Error creating new chat:', error);
      setError('Failed to create new chat. Please try again.');
      return '';
    }
  };


  const selectChat = async (chatId: string) => {
    try {
      setCurrentChatId(chatId);
      
      // Load chat messages
      const chatMessages = await getChatHistory(chatId);
      setMessages(chatMessages);
      setError(null);
    } catch (error) {
      console.error('Error selecting chat:', error);
      setError('Failed to load chat messages. Please try again.');
    }
  };

  // Send a user message
  const sendUserMessage = async (messageText: string) => {
    if (!apiKey) {
      setError('Please enter a Gemini API key in your profile settings.');
      return;
    }

    if (!currentChatId) {
      const newChatId = await createNewChat();
      if (!newChatId) return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Add user message to state
      const userMessage: ChatMessage = {
        role: 'user',
        content: messageText,
        timestamp: Date.now(),
      };

      // Update messages state
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);

      // Save to AsyncStorage
      await saveChatHistory(currentChatId!, updatedMessages);

      // Update session list with new timestamp
      setChatSessions(prev =>
        prev.map(session =>
          session.id === currentChatId
            ? { ...session, lastMessageDate: userMessage.timestamp }
            : session
        ).sort((a, b) => b.lastMessageDate - a.lastMessageDate)
      );
      
      // Add profile context to the first message if available
      let contextMessage = '';
      if (profile && messages.length === 0) {
        contextMessage = `User Profile Information:\n` +
          `Name: ${profile.name}\n` +
          `Investment Goals: ${profile.investmentGoals || 'Not specified'}\n` +
          `Risk Tolerance: ${profile.riskTolerance || 'Medium'}\n` +
          `Investment Horizon: ${profile.investmentHorizon || 'Medium'}\n` +
          `Portfolio Value: ${profile.portfolioValue ? `$${profile.portfolioValue}` : 'Not specified'}\n` +
          `Marketing Sector: ${profile.marketingSector || 'Not specified'}\n` +
          `Business Type: ${profile.businessType || 'Not specified'}\n\n` +
          `User's message: ${messageText}`;
      }

      // Prepare messages for API call
      const apiMessages = messages.length === 0 && profile
        ? [{ role: 'user' as const, content: contextMessage, timestamp: Date.now() }]
        : [...messages, userMessage];

      // Send to Gemini API
      let aiResponse = '';
      const streamingCallback = (chunk: string) => {
        aiResponse += chunk;
        
        // Update the assistant message in real-time
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: aiResponse,
          timestamp: Date.now(),
        };
        
        setMessages([...updatedMessages, assistantMessage]);
      };

      await sendMessage(apiKey, apiMessages, streamingCallback, profile);

      // Create the final assistant message
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: aiResponse,
        timestamp: Date.now(),
      };

      // Update messages state with the final assistant message
      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);

      // Save to AsyncStorage
      await saveChatHistory(currentChatId!, finalMessages);

      // Update session list with new timestamp
      setChatSessions(prev =>
        prev.map(session =>
          session.id === currentChatId
            ? { ...session, lastMessageDate: assistantMessage.timestamp }
            : session
        ).sort((a, b) => b.lastMessageDate - a.lastMessageDate)
      );

      // Update chat title for new chats
      if (messages.length === 0) {
        const chatTitle = messageText.length > 20 
          ? `${messageText.substring(0, 20)}...` 
          : messageText;
        
        await updateChatTitle(currentChatId!, chatTitle);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please check your API key and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Update chat title
  const updateChatTitle = async (chatId: string, title: string) => {
    try {
      await setChatTitle(chatId, title);
      
      setChatSessions(prev =>
        prev.map(session =>
          session.id === chatId ? { ...session, title } : session
        )
      );
    } catch (error) {
      console.error('Error updating chat title:', error);
      setError('Failed to update chat title. Please try again.');
    }
  };

  // Delete chat
  const deleteChat = async (chatId: string) => {
    try {
      // Remove from AsyncStorage
      await AsyncStorage.removeItem(`CHAT_${chatId}`);
      await AsyncStorage.removeItem(`TITLE_${chatId}`);
      
      // Update state
      setChatSessions(prev => prev.filter(session => session.id !== chatId));
      
      // If the current chat is being deleted, select another one or create a new one
      if (currentChatId === chatId) {
        const remainingSessions = chatSessions.filter(session => session.id !== chatId);
        
        if (remainingSessions.length > 0) {
          await selectChat(remainingSessions[0].id);
        } else {
          setCurrentChatId(null);
          setMessages([]);
        }
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
      setError('Failed to delete chat. Please try again.');
    }
  };

  return (
    <ChatContext.Provider
      value={{
        chatSessions,
        currentChatId,
        messages,
        isLoading,
        apiKey,
        error,
        setApiKey,
        createNewChat,
        selectChat,
        sendUserMessage,
        updateChatTitle,
        deleteChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}; 