
import { Button } from "@/components/ui/button";

interface PasswordTemplatesProps {
  passwordTemplates: Record<string, any>;
  onApplyTemplate: (templateKey: string) => void;
}

export const PasswordTemplates = ({ passwordTemplates, onApplyTemplate }: PasswordTemplatesProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Templates prédéfinis</h3>
      <div className="grid gap-4">
        {Object.entries(passwordTemplates).map(([key, template]) => (
          <div key={key} className="p-4 border rounded-lg bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1">
                <h4 className="font-medium mb-2">{template.name}</h4>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <div className="mb-1">Longueur: {template.length} caractères</div>
                  <div>
                    Inclut: {[
                      template.upper && "Majuscules",
                      template.lower && "Minuscules", 
                      template.numbers && "Chiffres",
                      template.symbols && "Symboles"
                    ].filter(Boolean).join(", ")}
                  </div>
                </div>
              </div>
              <Button
                onClick={() => onApplyTemplate(key)}
                variant="outline"
                size="sm"
                className="w-full sm:w-auto"
              >
                Utiliser
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
