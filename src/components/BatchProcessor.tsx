import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Upload, FileText, Loader2, X, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface BatchProcessorProps {
  onBatchAnalyze: (reviews: string[]) => Promise<void>;
  isProcessing: boolean;
}

export const BatchProcessor = ({ onBatchAnalyze, isProcessing }: BatchProcessorProps) => {
  const [batchText, setBatchText] = useState("");
  const [reviews, setReviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextSplit = () => {
    const lines = batchText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0 && line.length >= 10);
    
    if (lines.length === 0) {
      toast({
        title: "No Valid Reviews",
        description: "Please enter reviews separated by new lines (minimum 10 characters each).",
        variant: "destructive",
      });
      return;
    }

    setReviews(lines);
    setBatchText("");
    toast({
      title: "Reviews Added",
      description: `${lines.length} reviews added to batch processing queue.`,
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "text/csv" && !file.name.endsWith('.csv')) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a CSV file.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text
        .split('\n')
        .slice(1) // Skip header row
        .map(line => {
          // Simple CSV parsing - assumes review text is in first column or quotes
          const match = line.match(/"([^"]+)"/);
          return match ? match[1] : line.split(',')[0];
        })
        .map(review => review.trim())
        .filter(review => review.length >= 10);

      if (lines.length === 0) {
        toast({
          title: "No Valid Reviews Found",
          description: "The CSV file doesn't contain valid reviews.",
          variant: "destructive",
        });
        return;
      }

      setReviews(prev => [...prev, ...lines]);
      toast({
        title: "CSV Uploaded",
        description: `${lines.length} reviews loaded from CSV file.`,
      });
    };

    reader.readAsText(file);
    event.target.value = ""; // Reset file input
  };

  const removeReview = (index: number) => {
    setReviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleBatchSubmit = async () => {
    if (reviews.length === 0) {
      toast({
        title: "No Reviews to Process",
        description: "Please add some reviews first.",
        variant: "destructive",
      });
      return;
    }

    try {
      await onBatchAnalyze(reviews);
      setReviews([]);
      toast({
        title: "Batch Processing Complete",
        description: `${reviews.length} reviews analyzed successfully.`,
      });
    } catch (error) {
      toast({
        title: "Batch Processing Failed",
        description: "Failed to process the batch. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Methods */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Text Input */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Text Input
            </CardTitle>
            <CardDescription>
              Paste multiple reviews, one per line
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="batch-text">Reviews (one per line)</Label>
              <Textarea
                id="batch-text"
                placeholder="Paste your reviews here, separated by new lines..."
                value={batchText}
                onChange={(e) => setBatchText(e.target.value)}
                className="min-h-[120px] resize-none"
                disabled={isProcessing}
              />
            </div>
            <Button 
              onClick={handleTextSplit}
              disabled={!batchText.trim() || isProcessing}
              className="w-full"
              variant="outline"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add to Queue
            </Button>
          </CardContent>
        </Card>

        {/* File Upload */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              CSV Upload
            </CardTitle>
            <CardDescription>
              Upload a CSV file with reviews
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="csv-upload">CSV File</Label>
              <input
                ref={fileInputRef}
                type="file"
                id="csv-upload"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isProcessing}
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                variant="outline"
                className="w-full"
              >
                <Upload className="mr-2 h-4 w-4" />
                Choose CSV File
              </Button>
            </div>
            <div className="text-xs text-muted-foreground">
              <p>• CSV should have reviews in the first column</p>
              <p>• First row will be treated as header</p>
              <p>• Minimum 10 characters per review</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Review Queue */}
      {reviews.length > 0 && (
        <Card className="shadow-soft">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Processing Queue</CardTitle>
                <CardDescription>
                  {reviews.length} review{reviews.length !== 1 ? 's' : ''} ready for analysis
                </CardDescription>
              </div>
              <Button
                onClick={handleBatchSubmit}
                disabled={isProcessing}
                className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-glow transition-all duration-300"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Analyze Batch ({reviews.length})
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {reviews.map((review, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium mb-1">
                      Review #{index + 1}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {review}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeReview(index)}
                    disabled={isProcessing}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};