import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
  ActivityIndicator,
  TouchableWithoutFeedback
} from 'react-native';
import { Task, TaskStatus } from '../../../models';
import {
  TaskActionType,
  UserActionType,
  useTaskContext,
  useUserContext
} from '../../../contexts';
import Spacers from '../../../constants/Spacers';
import Fonts from '../../../constants/Fonts';
import Colors from '../../../constants/Colors';
import Style from '../../../constants/Style';
import Icon from '../../common/Icon';
import { removeTask, updateTask, updateUser } from '../../../remote/db';
import ImagePickerView from '../../common/ImagePickerView';
import { uploadImageToFirebase } from '../../../remote/storage';
import { verifyHousehold, verifyUser } from '../../../functions/verify';
import { router } from 'expo-router';
import { BlurView } from '@react-native-community/blur';

interface TaskDetailsModalProps {
  task: Task;
  isModalVisible: boolean;
  setModalVisible: (isVisible: boolean) => void;
}

const TaskDetailsModal = ({
  task,
  isModalVisible,
  setModalVisible
}: TaskDetailsModalProps) => {
  const {
    state: { user, householdId, householdMembers },
    dispatch: dispatchUser
  } = useUserContext();
  const { dispatch } = useTaskContext();
  const [submissionPhotoUri, setSubmissionPhotoUri] = useState<string>('');
  const [isLoading, setLoading] = useState(false);

  if (!verifyUser(user)) {
    console.log('user undefined');
    router.replace('/auth');
    return;
  }

  if (!verifyHousehold(householdId)) {
    console.log('household undefined');
    router.replace('/household');
    return;
  }

  const {
    title,
    description,
    status,
    points,
    creator,
    assignee,
    submissionPhoto
  } = task;
  const showAssignButton = status === TaskStatus.UNASSIGNED;
  const showSubmitButton =
    status === TaskStatus.ASSIGNED && assignee === user.id;
  const showDeclineConfirmButtons =
    status === TaskStatus.SUBMITTED && creator === user.id;
  const showRemoveButton = creator === user.id;

  const clearState = () => {
    setSubmissionPhotoUri('');
    setLoading(false);
    setModalVisible(false);
  }

  const getDisplayName = (id: string) => {
    return (
      householdMembers?.filter((member) => member.id === id)?.at(0)
        ?.displayName ?? ''
    );
  };

  const onAssign = async () => {
    setLoading(true);
    const updatedTask = {
      ...task,
      status: TaskStatus.ASSIGNED,
      assignee: user.id
    };
    dispatch({ type: TaskActionType.ASSIGN, id: task.id, user: user.id });
    await updateTask(updatedTask);
    clearState();
  };

  const onSubmit = async () => {
    setLoading(true);
    const timestamp = new Date(Date.now());
    const submissionPhotoRemoteUri = await uploadImageToFirebase(
      submissionPhotoUri,
      timestamp.toString(),
      'tasks'
    );
    const updatedTask = {
      ...task,
      status: TaskStatus.SUBMITTED,
      submissionPhoto: submissionPhotoRemoteUri,
      submittedAt: timestamp
    };
    dispatch({
      type: TaskActionType.SUBMIT,
      id: task.id,
      submissionPhoto: submissionPhotoRemoteUri,
      submittedAt: timestamp
    });
    await updateTask(updatedTask);
    clearState();
  };

  const onDecline = async () => {
    setLoading(true);
    const updatedTask = { ...task, status: TaskStatus.ASSIGNED };
    dispatch({ type: TaskActionType.DECLINE, id: task.id });
    await updateTask(updatedTask);
    clearState();
  };

  const onConfirm = async () => {
    setLoading(true);
    const updatedTask = { ...task, status: TaskStatus.CONFIRMED };
    const { assignee, points } = updatedTask;
    dispatch({ type: TaskActionType.CONFIRM, id: task.id });

    if (assignee && points) {
      const assigneeUser = householdMembers
        .filter((m) => m.id === assignee)
        ?.at(0);

      if (assigneeUser) {
        const { currentPoints, totalPoints } = assigneeUser;
        const updatedMember = {
          ...assigneeUser,
          currentPoints: currentPoints + points,
          totalPoints: totalPoints + points
        };
        dispatchUser({
          type: UserActionType.UPDATE_MEMBER,
          member: updatedMember
        });
        user.id == updatedMember.id &&
          dispatchUser({
            type: UserActionType.UPDATE_USER,
            user: updatedMember
          });
        await updateUser(updatedMember);
      }
    }

    await updateTask(updatedTask);
    clearState();
  };

  const onRemove = async () => {
    setLoading(true);
    dispatch({ type: TaskActionType.REMOVE, id: task.id });
    await removeTask(task.id, householdId);
    clearState();
  };

  const renderTopRow = () => (
    <View style={styles.topRow}>
      <View style={styles.circle}>
        <Text style={styles.pointsText}>{`🔥${points}` ?? '🛠'}</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity onPress={() => setModalVisible(false)}>
        <Icon name="close-outline" size={Fonts.large} color={Colors.black} />
      </TouchableOpacity>
    </View>
  );

  const renderContent = () => (
    <View style={styles.content}>
      <Text style={styles.description}>{description}</Text>
      <Text style={styles.contentText}>{`Status: ${status}`}</Text>
      <Text style={styles.contentText}>{`Creator: ${getDisplayName(
        creator
      )}`}</Text>
      <Text style={styles.contentText}>{`Assignee: ${assignee ? getDisplayName(assignee) : 'Unassigned'
        }`}</Text>
      {submissionPhoto && (
        <Image style={styles.image} source={{ uri: submissionPhoto }} />
      )}
      {showSubmitButton && (
        <ImagePickerView onImageSelected={setSubmissionPhotoUri} />
      )}
    </View>
  );

  const renderButtons = () => (
    <>
      {showAssignButton && (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: Colors.lightGreen }]}
          onPress={onAssign}>
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <Text style={styles.buttonText}>Assign me</Text>
          )}
        </TouchableOpacity>
      )}
      {showSubmitButton && (
        <TouchableOpacity
          disabled={!submissionPhotoUri}
          style={[
            styles.button,
            {
              backgroundColor: Colors.lightGreen,
              opacity: !!submissionPhotoUri ? 1 : 0.5
            }
          ]}
          onPress={onSubmit}>
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <Text style={styles.buttonText}>Submit task</Text>
          )}
        </TouchableOpacity>
      )}
      {showDeclineConfirmButtons && (
        <>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: Colors.lightGreen }]}
            onPress={onConfirm}>
            {isLoading ? (
              <ActivityIndicator />
            ) : (
              <Text style={styles.buttonText}>Confirm task</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: Colors.pink }]}
            onPress={onDecline}>
            {isLoading ? (
              <ActivityIndicator />
            ) : (
              <Text style={styles.buttonText}>Decline submission</Text>
            )}
          </TouchableOpacity>
        </>
      )}
      {showRemoveButton && (
        <TouchableOpacity style={styles.button} onPress={onRemove}>
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <Text style={styles.buttonText}>Remove task</Text>
          )}
        </TouchableOpacity>
      )}
    </>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={() => setModalVisible(!isModalVisible)}>
      <BlurView
        style={StyleSheet.absoluteFill}
        blurType="light"
        blurAmount={10}
        reducedTransparencyFallbackColor="white">
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.centeredView}>
            <TouchableWithoutFeedback onPress={() => { }}>
              <View style={styles.modalView}>
                {renderTopRow()}
                {renderContent()}
                {renderButtons()}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    marginTop: Spacers.medium
  },
  modalView: {
    margin: Spacers.medium,
    backgroundColor: Colors.white,
    borderRadius: Style.largeRadius,
    padding: Spacers.large,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    marginRight: Spacers.medium
  },
  circle: {
    width: 90,
    height: 60,
    borderRadius: Style.xLargeRadius,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.lightGrey,
    padding: Spacers.small
  },
  pointsText: {
    fontSize: Fonts.large,
    fontWeight: 'bold'
  },
  content: {
    marginHorizontal: Spacers.medium,
    marginVertical: Spacers.small
  },
  title: {
    fontSize: Fonts.medium,
    fontWeight: 'bold',
    marginBottom: Spacers.small
  },
  description: {
    fontSize: Fonts.medium,
    marginBottom: Spacers.small
  },
  contentText: {
    fontSize: Fonts.medium,
    color: Colors.darkGrey,
    marginBottom: Spacers.small
  },
  button: {
    backgroundColor: Colors.yellow,
    marginTop: Spacers.medium,
    padding: Spacers.medium,
    alignItems: 'center',
    borderRadius: Style.radius,
    fontSize: Fonts.large
  },
  buttonText: {
    color: Colors.black,
    fontWeight: 'bold',
    fontSize: Fonts.medium
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    borderRadius: Style.radius,
    marginTop: Spacers.small,
    alignSelf: 'center'
  },
  imageContainer: {
    marginVertical: Spacers.medium,
    alignItems: 'center'
  }
});

export default TaskDetailsModal;
