export type VoteValue = -1 | 1 | 2;

export interface CreateVotePayload {
  imageId: string;
  value: VoteValue;
}

export interface DogVoteResponse {
  id: number;
  image_id: string;
  value: VoteValue;
  created_at: string;
}
