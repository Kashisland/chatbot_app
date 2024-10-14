import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import ChatbotPage from "./chatbot_page";
import DatePage from "./date_page";
import * as Speech from "expo-speech";
import { ProgressBar } from "react-native-paper";

const HomeScreen = () => {
  const [tasks, setTasks] = useState([
    { id: "1", text: "아침 식사하기", completed: false, default: true },
    { id: "2", text: "점심 식사하기", completed: false, default: true },
    { id: "3", text: "저녁 식사하기", completed: false, default: true },
  ]);
  const [newTask, setNewTask] = useState("");
  const [aacVisible, setAacVisible] = useState(false); // AAC 버튼 표시 상태

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([
        ...tasks,
        {
          id: Date.now().toString(),
          text: newTask,
          completed: false,
          default: false,
        },
      ]);
      setNewTask("");
    }
  };

  const deleteTask = (id, isDefault) => {
    if (!isDefault) {
      setTasks(tasks.filter((task) => task.id !== id));
    }
  };

  const toggleTaskCompletion = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // 기본 투두리스트 항목 수정 함수
  const editDefaultTask = (id) => {
    const taskToEdit = tasks.find((task) => task.id === id);
    if (taskToEdit) {
      Alert.prompt(
        "투두리스트 수정",
        "수정할 내용을 입력하세요:",
        (text) => {
          if (text) {
            setTasks((prevTasks) =>
              prevTasks.map((task) =>
                task.id === id ? { ...task, text } : task
              )
            );
          }
        },
        "plain-text",
        taskToEdit.text // 기존 텍스트를 기본값으로 설정
      );
    }
  };

  // 달성도를 계산하는 함수
  const calculateCompletionRate = () => {
    if (tasks.length === 0) return 0;
    const completedTasks = tasks.filter((task) => task.completed).length;
    return completedTasks / tasks.length;
  };

  const speakToilet = () => {
    Speech.speak("화장실 가고 싶어요", { language: "ko" });
  };

  const speakHelp = () => {
    Speech.speak("도움이 필요해요", { language: "ko" });
  };

  const speakHungry = () => {
    Speech.speak("배고파요", { language: "ko" });
  };

  const toggleAacVisibility = () => {
    setAacVisible(!aacVisible); // AAC 버튼의 표시 상태 토글
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>투두리스트</Text>
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
          <View
            style={[
              styles.taskItem,
              item.default ? styles.defaultTask : styles.userTask,
            ]}
          >
            <TouchableOpacity onPress={() => toggleTaskCompletion(item.id)}>
              <Ionicons
                name={item.completed ? "checkmark-circle" : "radio-button-off"}
                size={24}
                color={item.completed ? "green" : "gray"}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => editDefaultTask(item.id)}>
              <Text
                style={[
                  styles.taskText,
                  item.completed && styles.completedTask,
                ]}
              >
                {item.text}
              </Text>
            </TouchableOpacity>
            {!item.default && (
              <TouchableOpacity
                onPress={() => deleteTask(item.id, item.default)}
              >
                <Text style={styles.deleteButton}>삭제</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />

      {/* 달성도를 표시하는 부분을 FlatList 아래로 이동 */}
      <Text style={styles.completionText}>달성도</Text>
      <ProgressBar
        progress={calculateCompletionRate()}
        color={"#007AFF"}
        style={styles.progressBar}
      />

      {/* 플로팅 AAC 버튼들 */}
      <View style={styles.aacContainer}>
        <TouchableOpacity
          style={styles.aacButton}
          onPress={toggleAacVisibility}
        >
          <Text style={styles.aacButtonText}>AAC</Text>
        </TouchableOpacity>

        {/* AAC 버튼이 보일 때만 나머지 버튼 표시 */}
        {aacVisible && (
          <>
            <TouchableOpacity style={styles.aacButton} onPress={speakToilet}>
              <Ionicons name="water-outline" size={30} color="white" />
              <Text style={styles.aacButtonText}>화장실</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.aacButton} onPress={speakHelp}>
              <Ionicons
                name="chatbox-ellipses-outline"
                size={30}
                color="white"
              />
              <Text style={styles.aacButtonText}>도움</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.aacButton} onPress={speakHungry}>
              <Ionicons name="fast-food-outline" size={30} color="white" />
              <Text style={styles.aacButtonText}>배고픔</Text>
            </TouchableOpacity>
          </>
        )}
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
    backgroundColor: "#e6f7ff",
  },
  logo: {
    width: "50%",
    height: 80,
    alignSelf: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#007AFF",
  },
  input: {
    borderWidth: 1,
    borderColor: "#007AFF",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    fontSize: 18,
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
    alignItems: "center",
    padding: 15,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
  },
  defaultTask: {
    borderColor: "#007AFF",
    backgroundColor: "#e0f0ff",
  },
  userTask: {
    borderColor: "#007AFF",
    backgroundColor: "#f0fff0",
  },
  taskText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 18,
  },
  completedTask: {
    textDecorationLine: "line-through",
    color: "gray",
  },
  deleteButton: {
    color: "red",
  },
  completionText: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
  },
  aacContainer: {
    position: "absolute",
    bottom: 40,
    right: 20,
    alignItems: "flex-end",
  },
  aacButton: {
    backgroundColor: "#007AFF",
    width: 80,
    height: 80,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  aacButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default HomePage;
