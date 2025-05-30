
import { LogoSettings } from '../types/logoTypes';
import { generateLogoSVG } from '../utils/svgGenerator';

interface LogoPreviewProps {
  logo: LogoSettings;
  className?: string;
}

export const LogoPreview = ({ logo, className = "" }: LogoPreviewProps) => {
  const svgContent = generateLogoSVG(logo);

  return (
    <div 
      className={`flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg ${className}`}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
};
