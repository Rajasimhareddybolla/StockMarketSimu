import { GoogleGenerativeAI } from '@google/generative-ai';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Initialize the GoogleGenerativeAI client
const initializeAI = (apiKey: string) => {
  return new GoogleGenerativeAI(apiKey);
};

// Improve the system prompt with more detailed investing guidance
const SYSTEM_PROMPT = `You are an expert financial advisor specializing in stock market investments and marketing strategy.

IMPORTANT: You must ALWAYS respond in exactly TWO lines:
- First line: Direct answer to the user's question
- Second line: Brief supporting point or additional context

Keep responses extremely concise and focused. Never exceed two lines.

EXPERTISE AREAS:
1. Stock market analysis and investment recommendations
   - Technical and fundamental analysis
   - Industry trends and company valuation
   - Portfolio diversification strategies
   - Risk assessment and management

2. Personal finance optimization
   - Investment horizon planning (short, medium, long-term)
   - Risk tolerance-based portfolio construction
   - Retirement and wealth-building strategies
   - Tax-efficient investing approaches

3. Marketing strategies for businesses
   - Market positioning and competitive analysis
   - Growth hacking and customer acquisition
   - Digital marketing optimization
   - Brand development and management

USER PROFILE PERSONALIZATION:
- Tailor advice based on the user's investment goals, risk tolerance, and investment horizon
- Consider the user's portfolio value when making specific recommendations
- For marketing advice, focus on their business type and sector

COMMUNICATION STYLE:
- Provide clear, actionable recommendations with reasoning
- Use simple language while maintaining accuracy
- Balance educational content with practical advice
- When appropriate, suggest specific investment types or sectors (but never specific stocks)
- Acknowledge market uncertainties appropriately

Always start by considering the user's profile information when it's available.`;

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export const saveApiKey = async (apiKey: string) => {
  try {
    await AsyncStorage.setItem('GEMINI_API_KEY', apiKey);
    return true;
  } catch (error) {
    console.error('Error saving API key:', error);
    return false;
  }
};

export const getApiKey = async () => {
  try {
    return await AsyncStorage.getItem('GEMINI_API_KEY');
  } catch (error) {
    console.error('Error retrieving API key:', error);
    return null;
  }
};

export const saveChatHistory = async (chatId: string, messages: ChatMessage[]) => {
  try {
    await AsyncStorage.setItem(`CHAT_${chatId}`, JSON.stringify(messages));
    return true;
  } catch (error) {
    console.error('Error saving chat history:', error);
    return false;
  }
};

export const getChatHistory = async (chatId: string): Promise<ChatMessage[]> => {
  try {
    const history = await AsyncStorage.getItem(`CHAT_${chatId}`);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error retrieving chat history:', error);
    return [];
  }
};

export const getAllChats = async (): Promise<string[]> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    return keys.filter(key => key.startsWith('CHAT_')).map(key => key.replace('CHAT_', ''));
  } catch (error) {
    console.error('Error retrieving all chats:', error);
    return [];
  }
};

export const getChatTitle = async (chatId: string): Promise<string> => {
  try {
    const title = await AsyncStorage.getItem(`TITLE_${chatId}`);
    return title || 'New Chat';
  } catch (error) {
    console.error('Error retrieving chat title:', error);
    return 'New Chat';
  }
};

export const setChatTitle = async (chatId: string, title: string) => {
  try {
    await AsyncStorage.setItem(`TITLE_${chatId}`, title);
    return true;
  } catch (error) {
    console.error('Error saving chat title:', error);
    return false;
  }
};

export const clearChat = async (chatId: string): Promise<boolean> => {
  try {
    await AsyncStorage.removeItem(`CHAT_${chatId}`);
    await AsyncStorage.removeItem(`TITLE_${chatId}`);
    return true;
  } catch (error) {
    console.error('Error clearing chat:', error);
    return false;
  }
};

// Update the sendMessage function to better include profile context
export const sendMessage = async (
  apiKey: string,
  messages: ChatMessage[],
  onChunkReceived?: (chunk: string) => void,
  userProfile?: any
): Promise<string> => {
  try {
    const genAI = initializeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    const lastUserMessage = messages[messages.length - 1];
    
    let profileContext = '';
    if (userProfile) {
      profileContext = `IMPORTANT: Respond in EXACTLY TWO LINES.
First line: Direct answer to the question
Second line: Brief supporting point

User profile information (use only if relevant to the question):
Name: ${userProfile.name || 'Not specified'}
Investment Goals: ${userProfile.investmentGoals || 'Not specified'}
Risk Tolerance: ${userProfile.riskTolerance || 'Medium'} 
Investment Horizon: ${userProfile.investmentHorizon || 'Medium'} 
Portfolio Value: ${userProfile.portfolioValue ? `$${userProfile.portfolioValue}` : 'Not specified'}
Preferred Investments: ${userProfile.preferredInvestments || 'Not specified'}
Marketing Sector: ${userProfile.marketingSector || 'Not specified'}
Business Type: ${userProfile.businessType || 'Not specified'}

Remember: Keep it to exactly two lines, use profile info only if relevant.`;
    }
    
    const prompt = `${profileContext}
User: ${lastUserMessage.content}

Remember: Respond in exactly two lines. First line: direct answer. Second line: brief supporting point.`;
    
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 150, // Reduced to encourage shorter responses
      },
      systemInstruction: SYSTEM_PROMPT,
    });
    
    let responseText = result.response.text();
    
    // Ensure response is exactly two lines
    const lines = responseText.split('\n').filter(line => line.trim());
    if (lines.length > 2) {
      responseText = lines.slice(0, 2).join('\n');
    }
    
    if (onChunkReceived) {
      onChunkReceived(responseText);
    }
    
    return responseText;
  } catch (error) {
    console.error('Error sending message to Gemini:', error);
    throw error;
  }
}; 