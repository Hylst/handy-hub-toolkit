
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Task } from '../hooks/useTaskManager';

interface KeywordAnalysisProps {
  tasks: Task[];
  onKeywordClick: (keyword: string) => void;
}

export const KeywordAnalysis = ({ tasks, onKeywordClick }: KeywordAnalysisProps) => {
  const getKeywordFrequency = () => {
    const keywords: { [key: string]: number } = {};
    tasks.forEach(task => {
      task.tags.forEach(tag => {
        keywords[tag] = (keywords[tag] || 0) + 1;
      });
      // Analyser aussi les mots du titre
      task.title.toLowerCase().split(' ').forEach(word => {
        if (word.length > 3) {
          keywords[word] = (keywords[word] || 0) + 1;
        }
      });
    });
    return Object.entries(keywords)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);
  };

  const keywordFrequency = getKeywordFrequency();

  if (keywordFrequency.length === 0) {
    return null;
  }

  return (
    <Card className="bg-gray-50 dark:bg-gray-800/50">
      <CardContent className="p-4">
        <h4 className="font-medium mb-2">Mots-clés les plus fréquents</h4>
        <div className="flex flex-wrap gap-2">
          {keywordFrequency.map(([keyword, count]) => (
            <Badge
              key={keyword}
              variant="secondary"
              className="cursor-pointer"
              onClick={() => onKeywordClick(keyword)}
            >
              {keyword} ({count})
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
