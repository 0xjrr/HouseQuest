import {
  Announcement,
  KudosOrSlobs,
  Reward,
  RewardStatus,
  Task,
  TaskWithoutId,
  Todo,
  User
} from '../models';
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  updateDoc
} from 'firebase/firestore';
import { db } from '../config';
import { LatLng } from 'react-native-maps';

export async function fetchMembers(
  householdId: string,
  onMemberCallback: (member: User) => void
) {
  const membersRef = doc(db, 'households', householdId);
  const membersSnapshot = await getDoc(membersRef);

  if (membersSnapshot.exists()) {
    const membersIds = membersSnapshot.data().members;

    membersIds.forEach(async (id: string) => {
      const memberRef = doc(db, 'users', id);
      const memberDoc = await getDoc(memberRef);

      if (memberDoc.exists()) {
        const data = memberDoc.data();
        const member: User = {
          id: id,
          displayName: data.displayName,
          role: data.role,
          totalPoints: data.totalPoints ?? 0,
          currentPoints: data.currentPoints ?? 0,
          birthday: data.birthday,
          photoURL: data.photoURL,
          location: data.location, // Add location
          locationUpdatedAt: data.locationUpdatedAt // Add locationUpdatedAt
        };
        onMemberCallback(member);
      }
    });
  }
}

export async function fetchHouseholdName(
  householdId: string,
  onNameCallback: (name: string) => void
) {
  const householdRef = doc(db, 'households', householdId);
  const householdSnapshot = await getDoc(householdRef);

  if (householdSnapshot.exists()) {
    const name = householdSnapshot.data().name;
    onNameCallback(name);
  }
}

export async function fetchTasks(
  householdId: string,
  onTaskCallback: (task: Task) => void
) {
  const tasksRef = doc(db, 'households', householdId);
  const tasksSnapshot = await getDoc(tasksRef);

  if (tasksSnapshot.exists()) {
    const tasksIds = tasksSnapshot.data().tasks;

    tasksIds.forEach(async (id: string) => {
      const taskRef = doc(db, 'tasks', id);
      const taskDoc = await getDoc(taskRef);

      if (taskDoc.exists()) {
        const data = taskDoc.data();
        const task: Task = {
          id: id,
          title: data.title,
          description: data.description,
          createdAt: data.createdAt.toDate(),
          creator: data.creator,
          status: data.status,
          assignee: data.assignee,
          points: data.points,
          submittedAt: data.submittedAt?.toDate(),
          submissionPhoto: data.submissionPhoto
        };
        onTaskCallback(task);
      } else {
        console.log(`Task with ID ${id} does not exist.`);
      }
    });
  }
}

export async function fetchRewards(
  householdId: string,
  onRewardCallback: (task: Reward) => void
) {
  const householdsRef = doc(db, 'households', householdId);
  const rewardsSnapshot = await getDoc(householdsRef);

  if (rewardsSnapshot.exists()) {
    const rewardsIds = rewardsSnapshot.data().rewards;

    rewardsIds.forEach(async (id: string) => {
      const rewardRef = doc(db, 'rewards', id);
      const rewardDoc = await getDoc(rewardRef);

      if (rewardDoc.exists()) {
        const data = rewardDoc.data();
        const reward: Reward = {
          id: id,
          title: data.title,
          description: data.description,
          createdAt: data.createdAt.toDate(),
          creator: data.creator,
          status: data.status,
          points: data.points,
          recipient: data.recipient
        };
        onRewardCallback(reward);
      } else {
        console.log(`Reward with ID ${id} does not exist.`);
      }
    });
  }
}

export async function fetchKudosSlobs(
  householdId: string,
  onKudosSlobsCallback: (kudosOrSlobs: KudosOrSlobs) => void
) {
  const kudosRef = doc(db, 'households', householdId);
  const kudosSnapshot = await getDoc(kudosRef);

  if (kudosSnapshot.exists()) {
    const kudosIds = kudosSnapshot.data().kudos;

    kudosIds.forEach(async (id: string) => {
      const kudosRef = doc(db, 'kudos', id);
      const kudosDoc = await getDoc(kudosRef);

      if (kudosDoc.exists()) {
        const data = kudosDoc.data();
        const kudosOrSlobs: KudosOrSlobs = {
          id: id,
          type: data.type,
          sender: data.sender,
          receiver: data.receiver,
          message: data.message,
          timestamp: data.timestamp.toDate(),
          points: data.points
        };
        onKudosSlobsCallback(kudosOrSlobs);
      } else {
        console.log(`Kudos or slob with ID ${id} does not exist.`);
      }
    });
  }
}

export async function fetchTodos(
  householdId: string,
  onTodoCallback: (todo: Todo) => void
) {
  const todosRef = doc(db, 'households', householdId);
  const todosSnapshot = await getDoc(todosRef);

  if (todosSnapshot.exists()) {
    const todosIds = todosSnapshot.data().todos;

    todosIds.forEach(async (id: string) => {
      const todoRef = doc(db, 'todos', id);
      const todoDoc = await getDoc(todoRef);

      if (todoDoc.exists()) {
        const data = todoDoc.data();
        const todo: Todo = {
          id: id,
          timestamp: data.timestamp.toDate(),
          status: data.status,
          description: data.description,
          category: data.category
        };
        onTodoCallback(todo);
      } else {
        console.log(`Todo with ID ${id} does not exist.`);
      }
    });
  }
}

export async function fetchAnnouncements(
  householdId: string,
  onAnnouncementCallback: (announcement: Announcement) => void
) {
  const householdsRef = doc(db, 'households', householdId);
  const announcementsSnapshot = await getDoc(householdsRef);

  if (announcementsSnapshot.exists()) {
    const announcementsIds = announcementsSnapshot.data().announcements;

    await Promise.all(announcementsIds.map(async (id: string) => {
      const announcementRef = doc(db, 'announcements', id);
      const announcementDoc = await getDoc(announcementRef);

      if (announcementDoc.exists()) {
        const data = announcementDoc.data();
        const announcement: Announcement = {
          id: id,
          sender: data.sender,
          createdAt: data.createdAt.toDate(),
          content: data.content,
          photoUri: data.photoUri
        };
        onAnnouncementCallback(announcement);
      } else {
        console.log(`Announcement with ID ${id} does not exist.`);
      }
    }));
  }
}

// ====================================================================================================================

export async function createTask(
  task: TaskWithoutId,
  householdId: string
): Promise<string> {
  const tasksRef = await addDoc(collection(db, 'tasks'), task);
  const householdRef = doc(db, 'households', householdId);
  await updateDoc(householdRef, {
    tasks: arrayUnion(tasksRef.id)
  });

  return tasksRef.id;
}

// export async function createReward(
//   reward: Reward,
//   householdId: string
// ): Promise<string> {
//   const rewardsRef = await addDoc(collection(db, 'tasks'), reward);
//   const householdRef = doc(db, 'households', householdId);
//   await updateDoc(householdRef, {
//     rewards: arrayUnion(rewardsRef.id)
//   });

//   return rewardsRef.id;
// }


export async function createReward(reward: Reward, householdId: string): Promise<string> {
  try {
    const rewardsRef = await addDoc(collection(db, 'rewards'), {
      ...reward,
      status: reward.status.toString(),
    });
    const householdRef = doc(db, 'households', householdId);

    await updateDoc(householdRef, {
      rewards: arrayUnion(rewardsRef.id)
    });

    return rewardsRef.id;
  } catch (error) {
    console.error('Erro ao adicionar recompensa:', error);
    throw error;
  }
}

export async function removeReward(rewardId: string, householdId: string) {
  console.log('Removing reward:', rewardId);
  const rewardRef = doc(db, 'rewards', rewardId);
  await deleteDoc(rewardRef);

  const householdRef = doc(db, 'households', householdId);
  await updateDoc(householdRef, {
    rewards: arrayRemove(rewardId)
  });
}



export async function updateRewardStatus(rewardId: string, newStatus: RewardStatus, recipient?: User): Promise<void> {
  try {
    if (newStatus === RewardStatus.REQUESTED && recipient) {
      const rewardRef = doc(db, 'rewards', rewardId);
      await updateDoc(rewardRef, { recipient: recipient.id, status: newStatus });
      return;
    }
    if (newStatus === RewardStatus.AVAILABLE) {
      const rewardRef = doc(db, 'rewards', rewardId);
      await updateDoc(rewardRef, { recipient: null, status: newStatus });
      return;
    }
    const rewardRef = doc(db, 'rewards', rewardId);
    await updateDoc(rewardRef, { status: newStatus });
  } catch (error) {
    console.error('Error updating reward status:', error);
    throw error;
  }
}

export async function createKudosSlobs(
  kudosSlobs: KudosOrSlobs,
  householdId: string
): Promise<string> {
  const kudosSlobsRef = await addDoc(collection(db, 'kudos'), kudosSlobs);
  const householdRef = doc(db, 'households', householdId);
  await updateDoc(householdRef, {
    kudos: arrayUnion(kudosSlobsRef.id)
  });
  return kudosSlobsRef.id;
}

export async function createTodo(
  todo: Omit<Todo, 'id'>,
  householdId: string
): Promise<string> {
  const todoRef = await addDoc(collection(db, 'todos'), todo);
  const householdRef = doc(db, 'households', householdId);
  await updateDoc(householdRef, {
    todos: arrayUnion(todoRef.id)
  });
  return todoRef.id;
}

export async function createAnnouncement(
  announcement: Announcement,
  householdId: string
): Promise<string> {
  const announcementRef = await addDoc(
    collection(db, 'announcements'),
    announcement
  );
  const householdRef = doc(db, 'households', householdId);
  await updateDoc(householdRef, {
    announcements: arrayUnion(announcementRef.id)
  });
  return announcementRef.id;
}

// ===================================================================

// idk why but otherwise firebase breaks
function clearEmptyFields<T extends object>(obj: T) {
  Object.keys(obj).forEach((key) => {
    if (obj[key as keyof T] == null) {
      delete obj[key as keyof T];
    }
  });
  return obj;
}

export async function updateTask(task: Task) {
  const tasksRef = doc(db, 'tasks', task.id);

  const clearedTask = clearEmptyFields<Task>(task);
  await updateDoc(tasksRef, { ...clearedTask });
}


export async function removeTask(taskId: string, householdId: string) {
  const tasksRef = doc(db, 'tasks', taskId);
  await deleteDoc(tasksRef);

  const householdRef = doc(db, 'households', householdId);
  await updateDoc(householdRef, {
    tasks: arrayRemove(taskId)
  });
}

export async function updateUser(user: User) {
  const usersRef = doc(db, 'users', user.id);

  const clearedUser = clearEmptyFields<User>(user);
  await updateDoc(usersRef, { ...clearedUser });
}

export async function updateTodo(todo: Todo) {
  const todoRef = doc(db, 'todos', todo.id);

  const clearedTodo = clearEmptyFields<Todo>(todo);
  await updateDoc(todoRef, { ...clearedTodo });
}

export async function removeTodo(todoId: string, householdId: string) {
  const todosRef = doc(db, 'todos', todoId);
  await deleteDoc(todosRef);

  const householdRef = doc(db, 'households', householdId);
  await updateDoc(householdRef, {
    todos: arrayRemove(todoId)
  });
}

export async function updateUserLocation(userId: string, location: LatLng) {
  const usersRef = doc(db, 'users', userId);
  await updateDoc(usersRef, {
    location: location,
    locationUpdatedAt: new Date( Date.now() )
  });
}
