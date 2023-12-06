export class User {
  id!: string;
  email!: string;
  displayName!: string;
  photoURL!: string;
  emailVerified!: boolean;
}

export interface VideoElement {
  muted: boolean;
  srcObject: MediaStream;
  userId: string;
}
