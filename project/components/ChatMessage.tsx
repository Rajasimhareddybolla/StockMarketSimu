import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ChatMessage as ChatMessageType } from '../utils/geminiApi';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { UserCircle, Bot } from 'lucide-react-native';
import { useTheme } from '@react-navigation/native';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const isUser = message.role === 'user';

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isUser 
            ? theme.dark 
              ? '#333' 
              : '#e8f1fe'
            : theme.dark 
              ? '#222' 
              : '#fff',
          alignSelf: isUser ? 'flex-end' : 'flex-start',
        },
      ]}
    >
      <View style={styles.avatarContainer}>
        {isUser ? (
          <UserCircle size={24} color={theme.dark ? '#fff' : '#000'} />
        ) : (
          <Bot size={24} color={theme.dark ? '#fff' : '#4285F4'} />
        )}
      </View>
      <View style={styles.messageContent}>
        <Text
          style={[
            styles.messageText,
            { color: theme.dark ? '#fff' : '#000' },
          ]}
        >
          {message.content}
        </Text>
        <Text
          style={[
            styles.timestamp,
            { color: theme.dark ? '#aaa' : '#666' },
          ]}
        >
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: '80%',
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 12,
    borderRadius: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  avatarContainer: {
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  messageContent: {
    flex: 1,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  timestamp: {
    fontSize: 12,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
});

export default ChatMessage; 