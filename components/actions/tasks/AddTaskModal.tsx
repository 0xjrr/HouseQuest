import React, { useState } from 'react';
import { Modal, ScrollView, TouchableWithoutFeedback, StyleSheet, Text, TextInput, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { TaskStatus, TaskWithoutId } from '../../../models';
import { Spacers, Colors, Style, Fonts } from '../../../constants';
import {
  TaskActionType,
  useTaskContext,
  useUserContext
} from '../../../contexts';
import { createTask } from '../../../remote/db';
import { verifyHousehold, verifyUser } from '../../../functions/verify';
import { router } from 'expo-router';
import { BlurView } from '@react-native-community/blur';
import SpinningWheelModal from './SpinningWheelModal';


export default function AddTaskModal({ isModalVisible, setModalVisible }: { isModalVisible: boolean, setModalVisible: (isVisible: boolean) => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [points, setPoints] = useState(5);
  const [customPoints, setCustomPoints] = useState(0);
  const [assignee, setAssignee] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [isRandomModalVisible, setRandomModalVisible] = useState(false);

  const { state: { user, householdId, householdMembers } } = useUserContext();
  const { dispatch } = useTaskContext();

  if (!verifyUser(user)) {
    console.log("user undefined")
    router.replace('/auth');
    return;
  }

  if (!verifyHousehold(householdId)) {
    console.log("household undefined")
    router.replace('/household');
    return;
  }

  const disableAddButton = title === '' || description === '';

  const clearStates = () => {
    setTitle('');
    setDescription('');
    setPoints(5);
    setCustomPoints(0);
    setLoading(false);
    setRandomModalVisible(false);
    setAssignee('');
  }

  const handleAddButton = async () => {
    setLoading(true);
    const task: TaskWithoutId = {
      title,
      description,
      points: points === undefined ? customPoints : points,
      assignee,
      status: assignee ? TaskStatus.ASSIGNED : TaskStatus.UNASSIGNED,
      creator: user.id,
      createdAt: new Date(Date.now()),
      submissionPhoto: "",
    }
    const taskId = await createTask(task, householdId);
    dispatch({ type: TaskActionType.ADD, task: { ...task, id: taskId } });
    setLoading(false);
    clearStates();
    setModalVisible(!isModalVisible);
  };

  const renderTitle = () => <>
    <Text style={styles.mediumText}>Title:</Text>
    <TextInput
      value={title}
      onChangeText={text => setTitle(text)}
      style={styles.input}
    />
  </>

  const renderDescription = () => <>
    <Text style={styles.mediumText}>Description:</Text>
    <TextInput
      value={description}
      onChangeText={text => setDescription(text)}
      style={styles.input}
      multiline
      numberOfLines={4}
    /></>

  const renderPointsPicker = () => <>
    <Text style={styles.mediumText}>Points:</Text>
    <Picker
      selectedValue={points}
      onValueChange={itemValue => setPoints(itemValue)}
    >
      <Picker.Item label="5" value={5} />
      <Picker.Item label="10" value={10} />
      <Picker.Item label="15" value={15} />
      <Picker.Item label="Custom" value={undefined} />
    </Picker></>

  {
    points === undefined && (
      <TextInput
        placeholder="Enter points"
        keyboardType="numeric"
        value={`${customPoints}`}
        onChangeText={text => { setCustomPoints(Number(text)) }}
        style={styles.input}
      />
    )
  }

  const renderAssigneePicker = () => <View >
    <Text style={styles.mediumText}>Assignee:</Text>
    <View style={styles.pickerContainer}>
      <Picker
        style={{ flex: 1, }}
        selectedValue={assignee}
        onValueChange={itemValue => setAssignee(itemValue)}
      >
        <Picker.Item label="Unassigned" value={undefined} />
        {householdMembers.map((member) => <Picker.Item key={member.displayName} label={member.displayName} value={member.id} />)}
      </Picker>
      <TouchableOpacity
        style={[styles.button, styles.randomButton]}
        onPress={() => setRandomModalVisible(true)}>
        <Text style={{ fontSize: 40 }}> 🎲</Text>
      </TouchableOpacity>
    </View>
  </View>

  const renderButtons = () => <>
    <TouchableOpacity
      style={[styles.button, { opacity: disableAddButton ? 0.5 : 1 }]}
      disabled={disableAddButton}
      onPress={handleAddButton}>
      {!isLoading ? <Text style={styles.mediumText}>Add Task</Text> : <ActivityIndicator />}
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.button, styles.buttonCancel]}
      onPress={() => { clearStates(); setModalVisible(false) }}>
      {!isLoading ? <Text style={styles.mediumText}>Cancel</Text> : <ActivityIndicator />}
    </TouchableOpacity></>

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={() => setModalVisible(!isModalVisible)}>
      <TouchableWithoutFeedback style={{ flex: 1, justifyContent: "center" }} onPress={() => setModalVisible(false)}>
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType="light"
          blurAmount={10}
          reducedTransparencyFallbackColor="white">
          <ScrollView contentContainerStyle={styles.scrollView} style={styles.centeredView}>
            <View style={styles.modalView}>
              {renderTitle()}
              {renderDescription()}
              {renderPointsPicker()}
              {renderAssigneePicker()}
              {renderButtons()}
            </View>
          </ScrollView>
          <SpinningWheelModal isModalVisible={isRandomModalVisible} setModalVisible={setRandomModalVisible} setAssignee={setAssignee} />
        </BlurView>
      </TouchableWithoutFeedback>
    </Modal>

  );
};


const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    marginTop: Spacers.medium,
  },
  scrollView: {
    justifyContent: 'center',
  },
  modalView: {
    margin: Spacers.medium,
    backgroundColor: Colors.white,
    borderRadius: Style.largeRadius,
    padding: Spacers.large,
    marginTop: Spacers.xLarge,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    backgroundColor: Colors.yellow,
    marginTop: Spacers.medium,
    padding: Spacers.medium,
    alignItems: 'center',
    borderRadius: Style.radius,
    fontSize: Fonts.large,
  },
  buttonCancel: {
    backgroundColor: Colors.lightGrey,
  },
  mediumText: {
    fontSize: Fonts.medium,
  },
  input: {
    borderColor: Colors.darkGrey,
    borderWidth: 1,
    borderRadius: Style.radius,
    padding: Spacers.small,
    fontSize: Fonts.small,
    marginVertical: Spacers.small
  },
  randomButton: {
    padding: Spacers.small,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignContent: "center",
  },
  pickerContainer: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
    paddingVertical: Spacers.small,
  },

});
