import { LatLng } from 'react-native-maps';

export enum Role {
  PARENT = 'PARENT',
  CHILD = 'CHILD'
}

interface FirestoreTimestamp {
  seconds: number;
  nanoseconds: number;
}


export interface User {
  id: string;
  displayName: string;
  email?: string;
  role: Role;
  totalPoints: number;
  currentPoints: number;
  birthday?: Date;
  photoURL?: string;
  location?: LatLng;
  locationUpdatedAt?: FirestoreTimestamp;
}
