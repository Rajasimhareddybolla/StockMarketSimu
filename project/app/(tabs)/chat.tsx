import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useTheme } from '@react-navigation/native';
import { Link, router, Stack } from 'expo-router';
import { MessageSquarePlus, Settings, List } from 'lucide-react-native';
import ChatList from '../../components/ChatList';
import ChatInput from '../../components/ChatInput';
import { useChat } from '../../context/ChatContext';
import { useProfile } from '../../context/ProfileContext';

export default function ChatScreen() {
  const theme = useTheme();
  const { 
    messages, 
    isLoading, 
    apiKey, 
    error, 
    chatSessions,
    currentChatId,
    sendUserMessage, 
    createNewChat,
    selectChat,
    deleteChat
  } = useChat();
  const { profile } = useProfile();
  const [showSidebar, setShowSidebar] = useState(false);

  // Check for API key on mount
  useEffect(() => {
    if (!apiKey && !profile?.email) {
      Alert.alert(
        'API Key Required',
        'You need to enter a Gemini API key in your profile settings to use the chat feature.',
        [
          { 
            text: 'Go to Settings', 
            onPress: () => router.push('/profile') 
          },
          {
            text: 'Cancel',
            style: 'cancel'
          }
        ]
      );
    }
  }, [apiKey, profile]);

  const handleSendMessage = (message: string) => {
    sendUserMessage(message);
  };

  const handleNewChat = () => {
    createNewChat();
    setShowSidebar(false);
  };

  const handleSelectChat = (chatId: string) => {
    selectChat(chatId);
    setShowSidebar(false);
  };

  const handleDeleteChat = (chatId: string) => {
    Alert.alert(
      'Delete Chat',
      'Are you sure you want to delete this chat?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        { 
          text: 'Delete', 
          onPress: () => deleteChat(chatId),
          style: 'destructive'
        }
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.dark ? '#121212' : '#f8f9fa' }]}>
      <Stack.Screen 
        options={{
          headerTitle: 'Investment & Marketing AI',
          headerStyle: { 
            backgroundColor: theme.dark ? '#1a1a1a' : '#ffffff',
          },
          headerShadowVisible: false,
          headerTitleStyle: { 
            color: theme.dark ? '#ffffff' : '#000000',
          },
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => setShowSidebar(!showSidebar)}
              style={styles.headerButton}
            >
              <List size={24} color={theme.dark ? '#ffffff' : '#000000'} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={styles.headerRightContainer}>
              <TouchableOpacity 
                onPress={handleNewChat}
                style={styles.headerButton}
              >
                <MessageSquarePlus size={24} color={theme.dark ? '#ffffff' : '#000000'} />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => router.push('/profile')}
                style={styles.headerButton}
              >
                <Settings size={24} color={theme.dark ? '#ffffff' : '#000000'} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      {/* Sidebar for chat history */}
      {showSidebar && (
        <View 
          style={[
            styles.sidebar, 
            { backgroundColor: theme.dark ? '#1a1a1a' : '#ffffff' }
          ]}
        >
          <TouchableOpacity
            style={[
              styles.newChatButton, 
              { backgroundColor: theme.dark ? '#333' : '#e8f1fe' }
            ]}
            onPress={handleNewChat}
          >
            <MessageSquarePlus size={20} color={theme.dark ? '#fff' : '#4285F4'} />
            <Text 
              style={[
                styles.newChatText, 
                { color: theme.dark ? '#fff' : '#4285F4' }
              ]}
            >
              New Chat
            </Text>
          </TouchableOpacity>

          {chatSessions.length === 0 ? (
            <Text style={[styles.noChatsText, { color: theme.dark ? '#aaa' : '#666' }]}>
              No chat history yet
            </Text>
          ) : (
            chatSessions.map((session) => (
              <TouchableOpacity
                key={session.id}
                style={[
                  styles.chatItem,
                  session.id === currentChatId && {
                    backgroundColor: theme.dark ? '#333' : '#e8f1fe',
                  },
                ]}
                onPress={() => handleSelectChat(session.id)}
                onLongPress={() => handleDeleteChat(session.id)}
              >
                <Text 
                  style={[
                    styles.chatTitle,
                    { color: theme.dark ? '#fff' : '#000' },
                    session.id === currentChatId && { 
                      fontWeight: 'bold', 
                      color: theme.dark ? '#fff' : '#4285F4' 
                    },
                  ]}
                  numberOfLines={1}
                >
                  {session.title}
                </Text>
                <Text 
                  style={[
                    styles.chatDate, 
                    { color: theme.dark ? '#aaa' : '#666' }
                  ]}
                >
                  {new Date(session.lastMessageDate).toLocaleDateString()}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      )}

      {/* Chat content */}
      <View style={styles.chatContainer}>
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={[styles.errorText, { color: theme.dark ? '#ff6b6b' : '#d32f2f' }]}>
              {error}
            </Text>
          </View>
        ) : null}

        <ChatList messages={messages} isLoading={isLoading} />
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerButton: {
    padding: 8,
  },
  headerRightContainer: {
    flexDirection: 'row',
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '70%',
    height: '100%',
    zIndex: 10,
    elevation: 10,
    padding: 16,
    paddingTop: 80,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  newChatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  newChatText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  chatItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  chatTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  chatDate: {
    fontSize: 12,
  },
  noChatsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
  },
  chatContainer: {
    flex: 1,
  },
  errorContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(213, 0, 0, 0.1)',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
  },
}); 