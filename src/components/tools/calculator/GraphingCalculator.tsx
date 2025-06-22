
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { TrendingUp, Settings, RotateCcw, Calculator } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GraphingCalculatorProps {
  history: string[];
  setHistory: (history: string[]) => void;
  clearAll: () => void;
}

interface GraphPoint {
  x: number;
  y: number;
}

interface GraphOptions {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  angleUnit: 'rad' | 'deg' | 'grad';
  strokeWidth: number;
  theme: 'light' | 'dark';
}

export const GraphingCalculator: React.FC<GraphingCalculatorProps> = ({
  history,
  setHistory,
  clearAll,
}) => {
  const [expression, setExpression] = useState<string>("sin(x)");
  const [graphData, setGraphData] = useState<GraphPoint[]>([]);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [graphOptions, setGraphOptions] = useState<GraphOptions>({
    xMin: -10,
    xMax: 10,
    yMin: -10,
    yMax: 10,
    angleUnit: 'rad',
    strokeWidth: 2,
    theme: 'light'
  });
  const { toast } = useToast();

  const addToHistory = (calculation: string) => {
    setHistory([calculation, ...history.slice(0, 19)]);
  };

  // Fonction d'évaluation d'expression mathématique sécurisée
  const evaluateExpression = useCallback((expr: string, x: number): number => {
    try {
      // Remplacer les fonctions mathématiques
      let processedExpr = expr
        .replace(/sin/g, 'Math.sin')
        .replace(/cos/g, 'Math.cos')
        .replace(/tan/g, 'Math.tan')
        .replace(/log/g, 'Math.log10')
        .replace(/ln/g, 'Math.log')
        .replace(/sqrt/g, 'Math.sqrt')
        .replace(/abs/g, 'Math.abs')
        .replace(/exp/g, 'Math.exp')
        .replace(/\^/g, '**')
        .replace(/π/g, 'Math.PI')
        .replace(/pi/g, 'Math.PI')
        .replace(/e(?![a-zA-Z])/g, 'Math.E')
        .replace(/x/g, x.toString());

      // Convertir les angles si nécessaire
      if (graphOptions.angleUnit === 'deg') {
        processedExpr = processedExpr
          .replace(/Math\.sin\(([^)]+)\)/g, 'Math.sin(($1) * Math.PI / 180)')
          .replace(/Math\.cos\(([^)]+)\)/g, 'Math.cos(($1) * Math.PI / 180)')
          .replace(/Math\.tan\(([^)]+)\)/g, 'Math.tan(($1) * Math.PI / 180)');
      } else if (graphOptions.angleUnit === 'grad') {
        processedExpr = processedExpr
          .replace(/Math\.sin\(([^)]+)\)/g, 'Math.sin(($1) * Math.PI / 200)')
          .replace(/Math\.cos\(([^)]+)\)/g, 'Math.cos(($1) * Math.PI / 200)')
          .replace(/Math\.tan\(([^)]+)\)/g, 'Math.tan(($1) * Math.PI / 200)');
      }

      return eval(processedExpr);
    } catch (error) {
      return NaN;
    }
  }, [graphOptions.angleUnit]);

  // Générer les points du graphique
  const generateGraph = useCallback(() => {
    if (!expression.trim()) return;

    const points: GraphPoint[] = [];
    const step = (graphOptions.xMax - graphOptions.xMin) / 200;

    for (let x = graphOptions.xMin; x <= graphOptions.xMax; x += step) {
      const y = evaluateExpression(expression, x);
      if (!isNaN(y) && isFinite(y) && y >= graphOptions.yMin && y <= graphOptions.yMax) {
        points.push({ x: parseFloat(x.toFixed(3)), y: parseFloat(y.toFixed(3)) });
      }
    }

    setGraphData(points);
    addToHistory(`f(x) = ${expression}`);
  }, [expression, graphOptions, evaluateExpression]);

  const insertFunction = (func: string) => {
    setExpression(prev => prev + func);
  };

  const resetGraph = () => {
    setGraphOptions({
      xMin: -10,
      xMax: 10,
      yMin: -10,
      yMax: 10,
      angleUnit: 'rad',
      strokeWidth: 2,
      theme: 'light'
    });
    setExpression("sin(x)");
    setGraphData([]);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Panneau de contrôle */}
      <Card className="xl:col-span-1 shadow-lg border-2">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-100 dark:from-purple-950/50 dark:to-indigo-900/50">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            Calculatrice Graphique
            <Badge variant="secondary" className="text-xs">f(x)</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {/* Saisie d'expression */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Expression f(x) =</label>
            <Input
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              placeholder="sin(x), x^2, etc."
              className="font-mono"
              onKeyDown={(e) => e.key === 'Enter' && generateGraph()}
            />
          </div>

          {/* Fonctions courantes */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Fonctions</h4>
            <div className="grid grid-cols-3 gap-2">
              {[
                { func: "sin(x)", label: "sin" },
                { func: "cos(x)", label: "cos" },
                { func: "tan(x)", label: "tan" },
                { func: "x^2", label: "x²" },
                { func: "x^3", label: "x³" },
                { func: "sqrt(x)", label: "√x" },
                { func: "ln(x)", label: "ln" },
                { func: "log(x)", label: "log" },
                { func: "exp(x)", label: "exp" },
                { func: "abs(x)", label: "|x|" },
                { func: "1/x", label: "1/x" },
                { func: "π", label: "π" }
              ].map(({ func, label }) => (
                <Button
                  key={func}
                  variant="outline"
                  size="sm"
                  onClick={() => insertFunction(func)}
                  className="text-xs"
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>

          {/* Opérateurs */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Opérateurs</h4>
            <div className="grid grid-cols-4 gap-2">
              {['+', '-', '*', '/', '^', '(', ')', 'x'].map(op => (
                <Button
                  key={op}
                  variant="outline"
                  size="sm"
                  onClick={() => insertFunction(op)}
                  className="text-xs"
                >
                  {op}
                </Button>
              ))}
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="grid grid-cols-2 gap-2 pt-4">
            <Button
              onClick={generateGraph}
              className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white"
            >
              <Calculator className="w-4 h-4 mr-2" />
              Tracer
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowOptions(!showOptions)}
            >
              <Settings className="w-4 h-4 mr-2" />
              Options
            </Button>
          </div>

          {/* Options de graphique */}
          {showOptions && (
            <Card className="mt-4 border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Options de graphique</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Fenêtre */}
                <div className="space-y-3">
                  <h5 className="text-xs font-medium">Fenêtre</h5>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-gray-600">X-Min</label>
                      <Input
                        type="number"
                        value={graphOptions.xMin}
                        onChange={(e) => setGraphOptions(prev => ({ ...prev, xMin: parseFloat(e.target.value) || -10 }))}
                        className="text-xs h-8"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">X-Max</label>
                      <Input
                        type="number"
                        value={graphOptions.xMax}
                        onChange={(e) => setGraphOptions(prev => ({ ...prev, xMax: parseFloat(e.target.value) || 10 }))}
                        className="text-xs h-8"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Y-Min</label>
                      <Input
                        type="number"
                        value={graphOptions.yMin}
                        onChange={(e) => setGraphOptions(prev => ({ ...prev, yMin: parseFloat(e.target.value) || -10 }))}
                        className="text-xs h-8"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Y-Max</label>
                      <Input
                        type="number"
                        value={graphOptions.yMax}
                        onChange={(e) => setGraphOptions(prev => ({ ...prev, yMax: parseFloat(e.target.value) || 10 }))}
                        className="text-xs h-8"
                      />
                    </div>
                  </div>
                </div>

                {/* Unités */}
                <div>
                  <label className="text-xs text-gray-600 mb-2 block">Unités</label>
                  <Select value={graphOptions.angleUnit} onValueChange={(value: 'rad' | 'deg' | 'grad') => setGraphOptions(prev => ({ ...prev, angleUnit: value }))}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rad">Radians</SelectItem>
                      <SelectItem value="deg">Degrés</SelectItem>
                      <SelectItem value="grad">Grades</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Épaisseur du trait */}
                <div>
                  <label className="text-xs text-gray-600 mb-2 block">Épaisseur du trait: {graphOptions.strokeWidth}px</label>
                  <Slider
                    value={[graphOptions.strokeWidth]}
                    onValueChange={(value) => setGraphOptions(prev => ({ ...prev, strokeWidth: value[0] }))}
                    max={5}
                    min={1}
                    step={0.5}
                    className="w-full"
                  />
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetGraph}
                  className="w-full"
                >
                  <RotateCcw className="w-3 h-3 mr-2" />
                  Réinitialiser
                </Button>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Graphique */}
      <Card className="xl:col-span-2 shadow-lg border-2">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Graphique de f(x) = {expression}</span>
            <Badge variant="outline" className="text-xs">
              Points: {graphData.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={graphData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis 
                  dataKey="x" 
                  type="number" 
                  scale="linear"
                  domain={[graphOptions.xMin, graphOptions.xMax]}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  dataKey="y"
                  type="number"
                  domain={[graphOptions.yMin, graphOptions.yMax]}
                  tick={{ fontSize: 12 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="y" 
                  stroke="#3b82f6" 
                  strokeWidth={graphOptions.strokeWidth}
                  dot={false}
                  connectNulls={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          {graphData.length === 0 && (
            <div className="flex items-center justify-center h-96 text-gray-500">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Entrez une expression et cliquez sur "Tracer" pour voir le graphique</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
