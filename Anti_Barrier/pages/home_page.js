import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons"; // 아이콘 사용
import ChatbotPage from "./chatbot_page";
import DatePage from "./date_page";
import * as Speech from "expo-speech";

// 홈 화면에서 투두리스트와 AAC 버튼을 표시하는 컴포넌트
const HomeScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  // 투두리스트에 새로운 항목 추가
  const addTask = () => {
    if (newTask.trim()) {
      setTasks([
        ...tasks,
        { id: Date.now().toString(), text: newTask, completed: false },
      ]);
      setNewTask("");
    }
  };

  // 투두리스트에서 항목 삭제
  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // 항목 체크/언체크
  const toggleTaskCompletion = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // TTS 함수: 화장실 가고 싶어요
  const speakToilet = () => {
    Speech.speak("화장실 가고 싶어요", { language: "ko" });
  };

  // TTS 함수: 도움이 필요해요
  const speakHelp = () => {
    Speech.speak("도움이 필요해요", { language: "ko" });
  };

  // TTS 함수: 배고파요
  const speakHungry = () => {
    Speech.speak("배고파요", { language: "ko" });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>To Do List</Text>
      <TextInput
        style={styles.input}
        placeholder="할 일을 입력하세요"
        value={newTask}
        onChangeText={setNewTask}
      />
      <TouchableOpacity style={styles.addButton} onPress={addTask}>
        <Text style={styles.addButtonText}>추가</Text>
      </TouchableOpacity>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <TouchableOpacity onPress={() => toggleTaskCompletion(item.id)}>
              <Ionicons
                name={item.completed ? "checkmark-circle" : "radio-button-off"}
                size={24}
                color={item.completed ? "green" : "gray"}
              />
            </TouchableOpacity>
            <Text
              style={[styles.taskText, item.completed && styles.completedTask]}
            >
              {item.text}
            </Text>
            <TouchableOpacity onPress={() => deleteTask(item.id)}>
              <Text style={styles.deleteButton}>삭제</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* AAC 버튼들 */}
      <View style={styles.aacContainer}>
        <TouchableOpacity style={styles.aacButton} onPress={speakToilet}>
          <Ionicons name="water-outline" size={30} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.aacButton} onPress={speakHelp}>
          <Ionicons name="chatbox-ellipses-outline" size={30} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.aacButton} onPress={speakHungry}>
          <Ionicons name="fast-food-outline" size={30} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const Tab = createBottomTabNavigator();

const HomePage = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Chatbot") {
            iconName = focused ? "chatbubble" : "chatbubble-outline";
          } else if (route.name === "Schedule") {
            iconName = focused ? "calendar" : "calendar-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "홈" }}
      />
      <Tab.Screen
        name="Chatbot"
        component={ChatbotPage}
        options={{ title: "챗봇" }}
      />
      <Tab.Screen
        name="Schedule"
        component={DatePage}
        options={{ title: "일정 관리" }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  addButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "center", // 수직 중앙 정렬
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 10,
  },
  taskText: {
    flex: 1, // 텍스트가 가능한 공간을 다 차지하도록
    marginLeft: 10, // 아이콘과 텍스트 사이의 간격
  },
  completedTask: {
    textDecorationLine: "line-through", // 완료된 항목에 선 긋기
    color: "gray", // 색상 변경
  },
  deleteButton: {
    color: "red",
  },
  aacContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  aacButton: {
    backgroundColor: "#007AFF",
    width: 60, // 버튼의 너비
    height: 60, // 버튼의 높이
    borderRadius: 30, // 반지름을 반으로 해서 동그란 버튼
    alignItems: "center",
    justifyContent: "center",
  },
});

export default HomePage;
