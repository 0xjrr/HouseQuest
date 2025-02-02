export enum TaskStatus {
  UNASSIGNED = 'UNASSIGNED',
  ASSIGNED = 'ASSIGNED',
  SUBMITTED = 'SUBMITTED',
  CONFIRMED = 'CONFIRMED'
}

export interface Task {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  creator: string;
  status: TaskStatus;
  assignee?: string;
  points?: number;
  submittedAt?: Date;
  submissionPhoto?: string;
}

export type TaskWithoutId = Omit<Task, 'id'>;

export enum RewardStatus {
  AVAILABLE = "AVAILABLE",
  REQUESTED = "REQUESTED",
  GRANTED = "GRANTED",
}

export interface Reward {

  id: string;
  title: string;
  description: string;
  createdAt: Date;
  creator: string;
  status: RewardStatus;
  recipient?: string;
  points: number;
}
