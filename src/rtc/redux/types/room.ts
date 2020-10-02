export interface RoomStateType {
  url: string | null;
  state: 'new' | 'connecting' | 'connected' | 'closed';
  activeSpeakerId: string | null;
  statsPeerId: string | null;
  faceDetection: boolean;
}
