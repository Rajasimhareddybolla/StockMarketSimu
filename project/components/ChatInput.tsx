import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator, 
  Keyboard, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Send } from 'lucide-react-native';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('');
  const theme = useTheme();

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
      Keyboard.dismiss();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View 
        style={[
          styles.container,
          { 
            backgroundColor: theme.dark ? '#222' : '#fff',
            borderTopColor: theme.dark ? '#333' : '#e1e1e1',
          }
        ]}
      >
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.dark ? '#333' : '#f1f1f1',
              color: theme.dark ? '#fff' : '#000',
            }
          ]}
          placeholder="Type your message..."
          placeholderTextColor={theme.dark ? '#aaa' : '#888'}
          value={message}
          onChangeText={setMessage}
          multiline
          maxLength={1000}
          returnKeyType="send"
          onSubmitEditing={handleSend}
          editable={!isLoading}
        />
        <TouchableOpacity 
          style={[
            styles.sendButton,
            { backgroundColor: message.trim() && !isLoading ? '#4285F4' : theme.dark ? '#333' : '#e1e1e1' }
          ]} 
          onPress={handleSend}
          disabled={!message.trim() || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Send size={20} color={message.trim() ? '#fff' : theme.dark ? '#666' : '#888'} />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 100,
    marginRight: 10,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatInput; 