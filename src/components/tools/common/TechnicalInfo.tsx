
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Database, 
  HardDrive,
  CheckCircle,
  Info
} from 'lucide-react';

export const TechnicalInfo = () => {
  return (
    <Card className="border-gray-200 dark:border-gray-700">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Info className="w-4 h-4" />
          Informations Techniques
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span className="text-sm">IndexedDB activé</span>
          <Badge variant="outline" className="text-xs">Performant</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-blue-500" />
          <span className="text-sm">Stockage local sécurisé</span>
          <Badge variant="outline" className="text-xs">Hors ligne</Badge>
        </div>
        <div className="flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-purple-500" />
          <span className="text-sm">Synchronisation automatique</span>
          <Badge variant="outline" className="text-xs">Temps réel</Badge>
        </div>
      </CardContent>
    </Card>
  );
};
