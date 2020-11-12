export type RoomState = 'new' | 'connecting' | 'connected' | 'closed';

export interface RoomStateType {
  url: string | null;
  roomId: string | null;
  state: RoomState;
  activeSpeakerId: string | null;
  statsPeerId: string | null;
  faceDetection: boolean;
}
