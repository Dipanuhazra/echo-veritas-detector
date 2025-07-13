import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Activity, Shield } from "lucide-react";
import { ReviewResult } from "@/types/review";

interface StatsOverviewProps {
  results: ReviewResult[];
}

export const StatsOverview = ({ results }: StatsOverviewProps) => {
  const totalReviews = results.length;
  const fakeReviews = results.filter(r => r.prediction === "fake").length;
  const realReviews = results.filter(r => r.prediction === "real").length;
  
  const fakePercentage = totalReviews > 0 ? (fakeReviews / totalReviews) * 100 : 0;
  const realPercentage = totalReviews > 0 ? (realReviews / totalReviews) * 100 : 0;
  
  const averageConfidence = totalReviews > 0 
    ? results.reduce((sum, r) => sum + r.confidence, 0) / totalReviews 
    : 0;

  const stats = [
    {
      title: "Total Analyzed",
      value: totalReviews.toString(),
      icon: Activity,
      description: "Reviews processed",
      color: "text-primary"
    },
    {
      title: "Fake Detected",
      value: fakeReviews.toString(),
      icon: TrendingDown,
      description: `${fakePercentage.toFixed(1)}% of total`,
      color: "text-danger"
    },
    {
      title: "Real Reviews",
      value: realReviews.toString(), 
      icon: TrendingUp,
      description: `${realPercentage.toFixed(1)}% of total`,
      color: "text-success"
    },
    {
      title: "Avg. Confidence",
      value: `${(averageConfidence * 100).toFixed(1)}%`,
      icon: Shield,
      description: "Detection accuracy",
      color: "text-primary"
    }
  ];

  return (
    <div className="space-y-4">
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Session Overview</CardTitle>
          <CardDescription>
            Current analysis session statistics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center gap-2">
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  <span className="text-sm font-medium">{stat.title}</span>
                </div>
                <div className="space-y-1">
                  <div className={`text-2xl font-bold ${stat.color}`}>
                    {stat.value}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {totalReviews > 0 && (
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-sm">Detection Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Real Reviews</span>
                <span className="font-medium text-success">{realPercentage.toFixed(1)}%</span>
              </div>
              <Progress 
                value={realPercentage} 
                className="h-2"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Fake Reviews</span>
                <span className="font-medium text-danger">{fakePercentage.toFixed(1)}%</span>
              </div>
              <Progress 
                value={fakePercentage} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};