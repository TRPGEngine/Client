export interface RoomStateType {
  url: string;
  state: 'new' | 'connecting' | 'connected' | 'closed';
  activeSpeakerId: string;
  statsPeerId: string;
  faceDetection: boolean;
}
