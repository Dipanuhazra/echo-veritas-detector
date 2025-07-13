export interface ReviewResult {
  id: string;
  text: string;
  prediction: "real" | "fake";
  confidence: number;
  timestamp: Date;
  explanation?: string[];
}