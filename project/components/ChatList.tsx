import React, { useRef, useEffect } from 'react';
import { 
  FlatList, 
  StyleSheet, 
  View, 
  Text, 
  ActivityIndicator 
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { ChatMessage as ChatMessageType } from '../utils/geminiApi';
import ChatMessage from './ChatMessage';

interface ChatListProps {
  messages: ChatMessageType[];
  isLoading: boolean;
}

const ChatList: React.FC<ChatListProps> = ({ messages, isLoading }) => {
  const theme = useTheme();
  const flatListRef = useRef<FlatList>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const renderItem = ({ item }: { item: ChatMessageType }) => (
    <ChatMessage message={item} />
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyText, { color: theme.dark ? '#aaa' : '#666' }]}>
        Start a conversation about investing, marketing, or financial advice.
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.dark ? '#121212' : '#f8f9fa' }]}>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item, index) => `message-${index}-${item.timestamp}`}
        contentContainerStyle={styles.contentContainer}
        ListEmptyComponent={renderEmptyComponent}
      />
      {isLoading && (
        <View style={styles.typingIndicator}>
          <ActivityIndicator size="small" color={theme.dark ? '#fff' : '#4285F4'} />
          <Text style={[styles.typingText, { color: theme.dark ? '#aaa' : '#666' }]}>
            Assistant is typing...
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingVertical: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginLeft: 16,
  },
  typingText: {
    marginLeft: 8,
    fontSize: 14,
  },
});

export default ChatList; 