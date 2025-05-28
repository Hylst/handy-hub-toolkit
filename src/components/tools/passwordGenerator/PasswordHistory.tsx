
import { Clock, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface PasswordEntry {
  id: string;
  password: string;
  timestamp: number;
  settings: any;
}

interface PasswordHistoryProps {
  passwordHistory: PasswordEntry[];
  passwordTemplates: Record<string, any>;
}

export const PasswordHistory = ({ passwordHistory, passwordTemplates }: PasswordHistoryProps) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Mot de passe copié !",
      description: "Le mot de passe a été copié dans le presse-papiers.",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Historique des mots de passe</h3>
        <Clock className="w-5 h-5 text-gray-500" />
      </div>
      
      {passwordHistory.length === 0 ? (
        <div className="text-center py-8 px-4">
          <p className="text-gray-500">Aucun mot de passe généré récemment.</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {passwordHistory.map((entry) => (
            <div key={entry.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border rounded-lg bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700">
              <div className="flex-1 w-full sm:w-auto">
                <div className="font-mono text-sm break-all mb-2 sm:mb-1">{entry.password}</div>
                <div className="text-xs text-gray-500 space-y-1 sm:space-y-0">
                  <div>{new Date(entry.timestamp).toLocaleString()}</div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span>Longueur: {entry.settings.length}</span>
                    <span>•</span>
                    <span>Template: {passwordTemplates[entry.settings.template as keyof typeof passwordTemplates]?.name || "Personnalisé"}</span>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => copyToClipboard(entry.password)}
                variant="ghost"
                size="sm"
                className="mt-2 sm:mt-0 sm:ml-2"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
