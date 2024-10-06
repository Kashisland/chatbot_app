import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Button,
} from "react-native";
import moment from "moment";

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(moment());
  const [selectedDate, setSelectedDate] = useState(
    moment().format("YYYY-MM-DD")
  );
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [tasks, setTasks] = useState({}); // 날짜별로 일정을 저장

  // 월의 첫 번째 날을 가져오고, 해당 주의 일요일까지의 날짜를 포함합니다.
  const daysInMonth = () => {
    const start = currentMonth.clone().startOf("month").startOf("week");
    const end = currentMonth.clone().endOf("month").endOf("week");
    const days = [];

    for (
      let date = start;
      date.isBefore(end.clone().add(1, "day"));
      date.add(1, "day")
    ) {
      days.push(date.clone());
    }
    return days;
  };

  const days = daysInMonth();

  const handleDateSelect = (date) => {
    setSelectedDate(date.format("YYYY-MM-DD"));
    setShowModal(true);
  };

  const addTask = () => {
    if (newTask.trim()) {
      const updatedTasks = {
        ...tasks,
        [selectedDate]: [...(tasks[selectedDate] || []), newTask],
      };
      setTasks(updatedTasks);
      setNewTask("");
      setShowModal(false);
    }
  };

  const renderTaskItem = (task, index) => (
    <Text key={index} style={styles.taskItem}>
      {task}
    </Text>
  );

  const renderDay = (day) => {
    const formattedDate = day.format("YYYY-MM-DD");
    const hasTasks = tasks[formattedDate]
      ? tasks[formattedDate].length > 0
      : false;
    const isCurrentMonth = day.month() === currentMonth.month(); // 현재 월의 날짜인지 확인

    return (
      <TouchableOpacity
        style={[styles.dayButton, !isCurrentMonth && styles.otherMonthDay]} // 현재 월이 아닐 경우 스타일 적용
        onPress={() => isCurrentMonth && handleDateSelect(day)} // 현재 월의 날짜만 클릭 가능
      >
        <Text style={styles.dayText}>{day.format("D")}</Text>
        {hasTasks && <Text style={styles.taskIndicator}>•</Text>}
      </TouchableOpacity>
    );
  };

  const renderWeekday = (weekday) => {
    return (
      <View style={styles.weekdayContainer}>
        <Text style={styles.weekdayText}>{weekday}</Text>
      </View>
    );
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(currentMonth.clone().subtract(1, "month"));
  };

  const goToNextMonth = () => {
    setCurrentMonth(currentMonth.clone().add(1, "month"));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goToPreviousMonth}>
          <Text style={styles.arrow}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.monthText}>{currentMonth.format("MMMM YYYY")}</Text>
        <TouchableOpacity onPress={goToNextMonth}>
          <Text style={styles.arrow}>{">"}</Text>
        </TouchableOpacity>
      </View>

      {/* 요일 표시 */}
      <View style={styles.weekdaysContainer}>
        {moment.weekdaysShort().map((day) => renderWeekday(day))}
      </View>

      <View style={styles.daysContainer}>
        <FlatList
          data={days}
          renderItem={({ item }) => renderDay(item)}
          keyExtractor={(item) => item.format("YYYY-MM-DD")}
          numColumns={7} // 1주일에 7일 표시
        />
      </View>

      {/* 일정 추가 모달 */}
      <Modal visible={showModal} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedDate}에 일정 추가</Text>
            <TextInput
              style={styles.input}
              placeholder="일정 입력"
              value={newTask}
              onChangeText={setNewTask}
            />
            <Button title="추가" onPress={addTask} />
            <Button
              title="취소"
              onPress={() => setShowModal(false)}
              color="red"
            />
            {/* 저장된 일정 목록 표시 */}
            <View style={styles.taskListContainer}>
              <Text style={styles.taskListTitle}>저장된 일정:</Text>
              {tasks[selectedDate] && tasks[selectedDate].length > 0 ? (
                <FlatList
                  data={tasks[selectedDate]}
                  renderItem={({ item, index }) => renderTaskItem(item, index)}
                  keyExtractor={(item, index) => index.toString()}
                />
              ) : (
                <Text style={styles.noTasksText}>일정이 없습니다.</Text>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  monthText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  arrow: {
    fontSize: 20,
  },
  weekdaysContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  weekdayContainer: {
    flex: 1,
    alignItems: "center",
  },
  weekdayText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  daysContainer: {
    flex: 1,
  },
  dayButton: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#fff",
    margin: 2,
  },
  dayText: {
    fontSize: 16,
  },
  otherMonthDay: {
    backgroundColor: "#f0f0f0", // 이전/다음 월의 날짜를 구분할 색상
  },
  taskIndicator: {
    color: "green",
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  taskListContainer: {
    marginTop: 15,
  },
  taskListTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  taskItem: {
    fontSize: 14,
  },
  noTasksText: {
    fontStyle: "italic",
    color: "gray",
  },
});

export default Calendar;
