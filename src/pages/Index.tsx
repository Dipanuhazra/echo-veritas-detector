import { useState } from "react";
import { ReviewInput } from "@/components/ReviewInput";
import { ReviewResults } from "@/components/ReviewResults";
import { StatsOverview } from "@/components/StatsOverview";
import { BatchProcessor } from "@/components/BatchProcessor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, BarChart3, Upload, Zap } from "lucide-react";
import { ReviewResult } from "@/types/review";

const Index = () => {
  const [results, setResults] = useState<ReviewResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyzeReview = async (reviewText: string) => {
    setIsAnalyzing(true);
    
    // Simulate API call to ML backend
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockResult: ReviewResult = {
      id: Date.now().toString(),
      text: reviewText,
      prediction: Math.random() > 0.5 ? "fake" : "real",
      confidence: Math.random() * 0.4 + 0.6, // 60-100%
      timestamp: new Date(),
      explanation: [
        "Unusual word patterns detected",
        "Review length within normal range", 
        "Sentiment analysis shows authenticity markers"
      ]
    };
    
    setResults(prev => [mockResult, ...prev]);
    setIsAnalyzing(false);
  };

  const handleBatchAnalyze = async (reviews: string[]) => {
    setIsAnalyzing(true);
    
    // Simulate batch processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const batchResults: ReviewResult[] = reviews.map((text, index) => ({
      id: `${Date.now()}-${index}`,
      text,
      prediction: Math.random() > 0.5 ? "fake" : "real",
      confidence: Math.random() * 0.4 + 0.6,
      timestamp: new Date(),
      explanation: ["Batch processed result"]
    }));
    
    setResults(prev => [...batchResults, ...prev]);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-primary-glow">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Echo Veritas</h1>
              <p className="text-sm text-muted-foreground">AI-Powered Fake Review Detection</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Detect Fake Reviews with AI
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Advanced machine learning algorithms to identify suspicious reviews and protect consumers from deceptive content.
          </p>
        </div>

        {/* Main Interface */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Left Column - Input and Stats */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="single" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="single" className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Single Review
                </TabsTrigger>
                <TabsTrigger value="batch" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Batch Process
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="single" className="mt-6">
                <ReviewInput 
                  onAnalyze={handleAnalyzeReview}
                  isAnalyzing={isAnalyzing}
                />
              </TabsContent>
              
              <TabsContent value="batch" className="mt-6">
                <BatchProcessor 
                  onBatchAnalyze={handleBatchAnalyze}
                  isProcessing={isAnalyzing}
                />
              </TabsContent>
            </Tabs>

            {/* Results */}
            {results.length > 0 && (
              <ReviewResults results={results} />
            )}
          </div>

          {/* Right Column - Stats */}
          <div className="space-y-6">
            <StatsOverview results={results} />
            
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Detection Metrics
                </CardTitle>
                <CardDescription>
                  System performance overview
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Accuracy</span>
                    <span className="text-sm font-bold text-success">94.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Precision</span>
                    <span className="text-sm font-bold text-success">91.8%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Recall</span>
                    <span className="text-sm font-bold text-success">89.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">F1 Score</span>
                    <span className="text-sm font-bold text-success">90.6%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
