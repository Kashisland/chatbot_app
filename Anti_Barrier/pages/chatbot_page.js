import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import * as Speech from "expo-speech"; // expo-speech 모듈을 import

const ChatbotPage = () => {
  const [messages, setMessages] = useState([
    {
      id: "1",
      text: "원하시는 상황을 입력해주세요.",
      sender: "bot",
    },
  ]);
  const [inputText, setInputText] = useState("");

  // 앱이 처음 로드될 때 TTS로 첫 메시지를 읽어줌
  useEffect(() => {
    Speech.speak("안녕하세요! 원하시는 상황을 입력해주세요!");
  }, []);

  const sendMessage = () => {
    if (inputText.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        text: inputText,
        sender: "user",
      };
      setMessages([...messages, newMessage]);
      setInputText("");

      // 챗봇 응답 추가 (예: 1초 딜레이 후)
      setTimeout(() => {
        const botResponse = {
          id: Date.now().toString(),
          text: "챗봇의 응답입니다.",
          sender: "bot",
        };
        setMessages((prevMessages) => [...prevMessages, botResponse]);

        // 챗봇의 응답을 TTS로 읽어줌
        Speech.speak("챗봇의 응답입니다.");
      }, 1000);
    }
  };

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.sender === "user" ? styles.userMessage : styles.botMessage,
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 70}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          <FlatList
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            style={styles.messageList}
          />
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="메시지를 입력하세요"
              placeholderTextColor="#aaa"
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
              <Text style={styles.sendButtonText}>전송</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e6f7ff", // 부드러운 배경 색상
  },
  innerContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  messageList: {
    flex: 1,
    padding: 10,
  },
  messageContainer: {
    marginVertical: 8,
    padding: 15,
    borderRadius: 15, // 둥근 모서리
    maxWidth: "80%",
    elevation: 5, // 그림자 효과 (안드로이드)
    shadowColor: "#000", // 그림자 색상 (iOS)
    shadowOffset: { width: 0, height: 2 }, // 그림자 오프셋
    shadowOpacity: 0.3, // 그림자 불투명도
    shadowRadius: 4, // 그림자 반경
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#cce5ff", // 사용자 메시지 색상
  },
  botMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#eaeaea", // 챗봇 메시지 색상
  },
  messageText: {
    fontSize: 17, // 글자 크기 증가
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#EAEAEA",
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#007AFF",
    borderRadius: 20,
    padding: 10,
    fontSize: 18, // 글자 크기 증가
  },
  sendButton: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    backgroundColor: "#007AFF",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 12, // 패딩 증가
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 18, // 글자 크기 증가
  },
});

export default ChatbotPage;
