
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LogoSettings } from '../types/logoTypes';
import { fontFamilies, iconOptions, shapes, layouts } from '../data/logoPresets';

interface LogoControlsProps {
  logo: LogoSettings;
  onUpdate: (updates: Partial<LogoSettings>) => void;
}

export const LogoControls = ({ logo, onUpdate }: LogoControlsProps) => {
  return (
    <div className="space-y-6">
      {/* Texte du logo */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Texte du logo</Label>
        <Input
          value={logo.text}
          onChange={(e) => onUpdate({ text: e.target.value })}
          placeholder="Mon Logo"
          className="w-full"
        />
      </div>

      {/* Disposition */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Disposition</Label>
        <div className="grid grid-cols-2 gap-2">
          {layouts.map((layout) => (
            <Button
              key={layout.key}
              onClick={() => onUpdate({ layout: layout.key })}
              variant={logo.layout === layout.key ? "default" : "outline"}
              size="sm"
              className="flex items-center gap-2"
            >
              <span>{layout.icon}</span>
              <span className="text-xs">{layout.name}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Icône */}
      {logo.layout !== 'text-only' && (
        <div>
          <Label className="text-sm font-medium mb-3 block">Icône</Label>
          <div className="grid grid-cols-8 gap-2 max-h-32 overflow-y-auto mb-3">
            {iconOptions.map((iconOption) => (
              <Button
                key={iconOption}
                onClick={() => onUpdate({ icon: iconOption })}
                variant={logo.icon === iconOption ? "default" : "outline"}
                size="sm"
                className="aspect-square p-1"
              >
                {iconOption}
              </Button>
            ))}
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <Label className="text-xs text-gray-500 mb-1 block">Taille: {logo.iconSize}px</Label>
              <input
                type="range"
                min="16"
                max="64"
                value={logo.iconSize}
                onChange={(e) => onUpdate({ iconSize: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-500 mb-1 block">Couleur</Label>
              <input
                type="color"
                value={logo.iconColor}
                onChange={(e) => onUpdate({ iconColor: e.target.value })}
                className="w-12 h-8 rounded border cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Police et texte */}
      {logo.layout !== 'icon-only' && (
        <div className="space-y-3">
          <div>
            <Label className="text-sm font-medium mb-2 block">Police</Label>
            <select
              value={logo.fontFamily}
              onChange={(e) => onUpdate({ fontFamily: e.target.value })}
              className="w-full p-2 border rounded-md text-sm bg-background"
            >
              {fontFamilies.map((font) => (
                <option key={font.value} value={font.value}>
                  {font.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-gray-500 mb-1 block">Taille: {logo.fontSize}px</Label>
              <input
                type="range"
                min="12"
                max="48"
                value={logo.fontSize}
                onChange={(e) => onUpdate({ fontSize: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-500 mb-1 block">Couleur</Label>
              <input
                type="color"
                value={logo.textColor}
                onChange={(e) => onUpdate({ textColor: e.target.value })}
                className="w-full h-8 rounded border cursor-pointer"
              />
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">Graisse</Label>
            <div className="grid grid-cols-3 gap-2">
              {['300', '400', '700'].map((weight) => (
                <Button
                  key={weight}
                  onClick={() => onUpdate({ fontWeight: weight })}
                  variant={logo.fontWeight === weight ? "default" : "outline"}
                  size="sm"
                  className="text-xs"
                >
                  {weight === '300' ? 'Light' : weight === '400' ? 'Normal' : 'Bold'}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Forme et couleurs */}
      <div className="space-y-3">
        <div>
          <Label className="text-sm font-medium mb-2 block">Forme de fond</Label>
          <div className="grid grid-cols-3 gap-2">
            {shapes.map((shape) => (
              <Button
                key={shape.key}
                onClick={() => onUpdate({ shape: shape.key })}
                variant={logo.shape === shape.key ? "default" : "outline"}
                size="sm"
                className="flex items-center gap-1"
              >
                <span>{shape.icon}</span>
                <span className="text-xs">{shape.name}</span>
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs text-gray-500 mb-1 block">Couleur de fond</Label>
            <input
              type="color"
              value={logo.backgroundColor}
              onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
              className="w-full h-8 rounded border cursor-pointer"
            />
          </div>
          <div>
            <Label className="text-xs text-gray-500 mb-1 block">Couleur forme</Label>
            <input
              type="color"
              value={logo.shapeColor}
              onChange={(e) => onUpdate({ shapeColor: e.target.value })}
              className="w-full h-8 rounded border cursor-pointer"
            />
          </div>
        </div>

        <div>
          <Label className="text-xs text-gray-500 mb-1 block">Espacement: {logo.padding}px</Label>
          <input
            type="range"
            min="8"
            max="40"
            value={logo.padding}
            onChange={(e) => onUpdate({ padding: parseInt(e.target.value) })}
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs text-gray-500 mb-1 block">Bordure: {logo.borderWidth}px</Label>
            <input
              type="range"
              min="0"
              max="8"
              value={logo.borderWidth}
              onChange={(e) => onUpdate({ borderWidth: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>
          <div>
            <Label className="text-xs text-gray-500 mb-1 block">Couleur bordure</Label>
            <input
              type="color"
              value={logo.borderColor}
              onChange={(e) => onUpdate({ borderColor: e.target.value })}
              className="w-full h-8 rounded border cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
