import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Info, 
  Download, 
  Eye,
  EyeOff,
  Filter 
} from "lucide-react";
import { ReviewResult } from "@/types/review";
import { toast } from "@/hooks/use-toast";

interface ReviewResultsProps {
  results: ReviewResult[];
}

export const ReviewResults = ({ results }: ReviewResultsProps) => {
  const [showExplanations, setShowExplanations] = useState<{ [key: string]: boolean }>({});
  const [filter, setFilter] = useState<"all" | "real" | "fake">("all");

  const filteredResults = results.filter(result => {
    if (filter === "all") return true;
    return result.prediction === filter;
  });

  const toggleExplanation = (id: string) => {
    setShowExplanations(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const exportResults = () => {
    const csvData = results.map(result => ({
      timestamp: result.timestamp.toISOString(),
      prediction: result.prediction,
      confidence: `${(result.confidence * 100).toFixed(1)}%`,
      text: result.text.replace(/"/g, '""'), // Escape quotes for CSV
    }));

    const csvContent = [
      ["Timestamp", "Prediction", "Confidence", "Review Text"],
      ...csvData.map(row => [row.timestamp, row.prediction, row.confidence, `"${row.text}"`])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `review-analysis-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: `${results.length} results exported to CSV file.`,
    });
  };

  const getResultIcon = (prediction: string) => {
    return prediction === "real" ? 
      <CheckCircle className="h-4 w-4 text-success" /> : 
      <XCircle className="h-4 w-4 text-danger" />;
  };

  const getResultColor = (prediction: string) => {
    return prediction === "real" ? "success" : "danger";
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "text-success";
    if (confidence >= 0.6) return "text-warning";
    return "text-danger";
  };

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Analysis Results
            </CardTitle>
            <CardDescription>
              {results.length} review{results.length !== 1 ? 's' : ''} analyzed
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {/* Filter Buttons */}
            <div className="flex items-center gap-1">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("all")}
              >
                All
              </Button>
              <Button
                variant={filter === "real" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("real")}
                className={filter === "real" ? "bg-success hover:bg-success/90" : ""}
              >
                Real
              </Button>
              <Button
                variant={filter === "fake" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("fake")}
                className={filter === "fake" ? "bg-danger hover:bg-danger/90" : ""}
              >
                Fake
              </Button>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={exportResults}
              disabled={results.length === 0}
            >
              <Download className="h-4 w-4 mr-1" />
              Export CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {filteredResults.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {filter === "all" ? "No results yet. Analyze a review to get started." : `No ${filter} reviews found.`}
            </div>
          ) : (
            filteredResults.map((result, index) => (
              <div key={result.id} className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      {getResultIcon(result.prediction)}
                      <Badge 
                        variant="outline"
                        className={`border-${getResultColor(result.prediction)} text-${getResultColor(result.prediction)}`}
                      >
                        {result.prediction.toUpperCase()}
                      </Badge>
                      <span className={`text-sm font-bold ${getConfidenceColor(result.confidence)}`}>
                        {(result.confidence * 100).toFixed(1)}% confidence
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {result.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    
                    <Progress 
                      value={result.confidence * 100} 
                      className="h-2 mb-3"
                    />
                    
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {result.text}
                    </p>
                  </div>
                  
                  {result.explanation && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExplanation(result.id)}
                    >
                      {showExplanations[result.id] ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>
                
                {showExplanations[result.id] && result.explanation && (
                  <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Info className="h-4 w-4 text-primary" />
                      Analysis Explanation
                    </div>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {result.explanation.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {index < filteredResults.length - 1 && <Separator />}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};