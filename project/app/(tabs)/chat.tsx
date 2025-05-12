import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { GoogleGenAI } from '@google/genai';
import { useAuth } from '@/context/AuthContext';
import { useUser } from '@/context/UserContext';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { Portfolio, Stock } from '@/types/stocks';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const { user } = useAuth();
  const { portfolio, stocks, balance, transactions } = useUser();
  const [apiKey, setApiKey] = useState<string | null>(Constants.expoConfig?.extra?.geminiApiKey || process.env.EXPO_PUBLIC_GEMINI_API_KEY || null);

  useEffect(() => {
    if (!apiKey) {
      Alert.alert(
        "API Key Missing",
        "Please set your Gemini API key in the environment variables.",
        [{ text: "OK" }]
      );
    }
  }, [apiKey]);

  const generateSystemPrompt = () => {
    try {
      // Get updated portfolio with current prices
      const portfolioWithCurrentPrices = portfolio.map(item => {
        const stockInfo = stocks.find(stock => stock.symbol === item.symbol);
        const currentPrice = stockInfo?.price ?? 0; // Default to 0 if price is undefined
        
        return {
          ...item,
          currentPrice,
          currentValue: currentPrice * item.quantity,
          profitLoss: (currentPrice * item.quantity) - item.totalCost,
          profitLossPercent: item.totalCost ? ((currentPrice * item.quantity) - item.totalCost) / item.totalCost * 100 : 0
        };
      });
      
      // Get information about available stocks in the market
      const availableStocks = stocks.map(stock => ({
        symbol: stock.symbol,
        companyName: stock.companyName,
        sector: stock.sector,
        currentPrice: stock.price,
        changePercent: stock.changePercent
      }));

      // Get recent transactions
      const recentTransactions = transactions.slice(0, 5).map(tx => ({
        symbol: tx.symbol,
        type: tx.type,
        quantity: tx.quantity,
        price: tx.price,
        date: tx.date
      }));

      // Create a safe user object with only necessary information
      const safeUserInfo = user ? {
        id: user.id,
        username: user.username,
        preferences: user.preferences
      } : { id: 'guest', username: 'Guest' };

      return `You are an expert financial advisor and stock market analyst. 
      The user's portfolio contains: ${JSON.stringify(portfolioWithCurrentPrices)}
      Current market data for all stocks: ${JSON.stringify(availableStocks)}
      User account balance: $${balance.toFixed(2)}
      Recent transactions: ${JSON.stringify(recentTransactions)}
      User information: ${JSON.stringify(safeUserInfo)}
      
      Important: If the portfolio is empty, suggest stocks based on market data.
      
      Provide personalized, accurate, and helpful financial advice based on their portfolio and preferences.
      Include specific stock prices, profit/loss numbers, and portfolio performance in your responses.
      Keep responses concise and actionable.`;
    } catch (error) {
      console.error('Error generating system prompt:', error);
      return `You are an expert financial advisor and stock market analyst. Provide helpful advice about the stock market and investing.`;
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    if (!apiKey) {
      Alert.alert("API Key Missing", "Please set your Gemini API key in the environment variables.");
      return;
    }

    const userMessage: Message = {
      role: 'user',
      content: input,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({
        apiKey: apiKey,
      });
      
      const config = {
        responseMimeType: 'text/plain',
        systemInstruction: [
          {
            text: generateSystemPrompt(),
          }
        ],
      };

      const contents = [
        {
          role: 'user',
          parts: [
            {
              text: input,
            },
          ],
        },
      ];

      try {
        const response = await ai.models.generateContentStream({
          model: 'gemini-2.0-flash',
          config,
          contents,
        });

        let assistantMessage = '';
        for await (const chunk of response) {
          if (chunk && chunk.text) {
            assistantMessage += chunk.text;
          }
        }

        setMessages(prev => [...prev, {
          role: 'assistant',
          content: assistantMessage || 'I was unable to provide a response. Please try again.',
        }]);
      } catch (apiError) {
        console.error('Gemini API error:', apiError);
        let errorMessage = 'Sorry, I encountered an error. Please try again.';
        
        if (apiError instanceof Error) {
          if (apiError.message.includes('quota')) {
            errorMessage = 'API quota exceeded. Please try again later.';
          } else if (apiError.message.includes('invalid')) {
            errorMessage = 'Invalid API key. Please check your Gemini API key.';
          } else if (apiError.message.includes('unavailable')) {
            errorMessage = 'Service temporarily unavailable. Please try again later.';
          }
        }
        
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: errorMessage,
        }]);
      }
    } catch (error) {
      console.error('Error generating response:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.map((message, index) => (
          <View
            key={index}
            style={[
              styles.messageBubble,
              message.role === 'user' ? styles.userMessage : styles.assistantMessage,
            ]}
          >
            <Text style={[
              styles.messageText,
              message.role === 'assistant' && styles.assistantMessageText
            ]}>
              {message.content}
            </Text>
          </View>
        ))}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#007AFF" />
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Ask me anything about your portfolio..."
          placeholderTextColor="#666"
          multiline
        />
        <TouchableOpacity
          style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!input.trim() || isLoading}
        >
          <Ionicons name="send" size={24} color={input.trim() ? '#007AFF' : '#999'} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  userMessage: {
    backgroundColor: '#007AFF',
    alignSelf: 'flex-end',
  },
  assistantMessage: {
    backgroundColor: '#E5E5EA',
    alignSelf: 'flex-start',
  },
  messageText: {
    color: '#fff',
    fontSize: 16,
  },
  assistantMessageText: {
    color: '#000', // Black text for assistant messages for better readability
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 44,
    height: 44,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  loadingContainer: {
    padding: 8,
    alignItems: 'center',
  },
}); 