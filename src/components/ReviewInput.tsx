import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, Send, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ReviewInputProps {
  onAnalyze: (reviewText: string) => Promise<void>;
  isAnalyzing: boolean;
}

export const ReviewInput = ({ onAnalyze, isAnalyzing }: ReviewInputProps) => {
  const [reviewText, setReviewText] = useState("");
  const [charCount, setCharCount] = useState(0);
  const maxChars = 2000;

  const handleTextChange = (value: string) => {
    if (value.length <= maxChars) {
      setReviewText(value);
      setCharCount(value.length);
    }
  };

  const handleSubmit = async () => {
    if (!reviewText.trim()) {
      toast({
        title: "Review Required",
        description: "Please enter a review to analyze.",
        variant: "destructive",
      });
      return;
    }

    if (reviewText.trim().length < 10) {
      toast({
        title: "Review Too Short",
        description: "Please enter a review with at least 10 characters.",
        variant: "destructive",
      });
      return;
    }

    try {
      await onAnalyze(reviewText.trim());
      setReviewText("");
      setCharCount(0);
      toast({
        title: "Analysis Complete",
        description: "Your review has been analyzed successfully.",
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze the review. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleSubmit();
    }
  };

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Review Analysis
        </CardTitle>
        <CardDescription>
          Paste or type a review to check its authenticity using AI detection.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="review-text" className="text-sm font-medium">
            Review Text
          </Label>
          <Textarea
            id="review-text"
            placeholder="Enter the review you'd like to analyze for authenticity..."
            value={reviewText}
            onChange={(e) => handleTextChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className="min-h-[120px] resize-none"
            disabled={isAnalyzing}
          />
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>Press Ctrl+Enter to analyze</span>
            <span className={charCount > maxChars * 0.9 ? "text-warning" : ""}>
              {charCount}/{maxChars}
            </span>
          </div>
        </div>

        <Button 
          onClick={handleSubmit}
          disabled={isAnalyzing || !reviewText.trim()}
          className="w-full bg-gradient-to-r from-primary to-primary-glow hover:shadow-glow transition-all duration-300"
          size="lg"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing Review...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Analyze Review
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};