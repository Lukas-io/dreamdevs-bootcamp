export type AwardStatus = "PENDING" | "OPEN" | "CLOSED";

export interface Award {
  id: string;
  title: string;
  nominees: string[];
  status: AwardStatus;
  revealed: boolean;
  anonymous: boolean;
}

export interface Voter {
  id: string;
  name: string;
  studentId: string;
  active: boolean;
}

export interface Vote {
  id: string;
  voterId: string;
  awardId: string;
  nomineeName: string;
}

export interface AwardResults {
  awardId: string;
  title: string;
  revealed: boolean;
  votes: Array<{ voterId?: string; nomineeName: string }> | null;
}

export interface WinnerResult {
  awardTitle: string;
  tie: boolean;
  winner?: string;
  tiedNominees?: string[];
  votes: number;
}

export interface CreateAwardBody {
  title: string;
  nominees: string[];
  anonymous?: boolean;
}

export interface RegisterVoterBody {
  name: string;
  studentId: string;
}

export interface CastVoteBody {
  voterId: string;
  awardId: string;
  nomineeName: string;
}
