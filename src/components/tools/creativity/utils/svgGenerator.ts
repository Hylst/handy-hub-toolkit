
import { LogoSettings } from '../types/logoTypes';

export const generateLogoSVG = (logo: LogoSettings): string => {
  const { text, fontSize, fontFamily, fontWeight, textColor, backgroundColor, 
          shape, shapeColor, icon, iconSize, iconColor, layout, padding, 
          borderWidth, borderColor } = logo;

  // Calculer les dimensions
  const textWidth = text.length * fontSize * 0.6;
  const hasIcon = layout !== 'text-only';
  const hasText = layout !== 'icon-only';
  
  let totalWidth, totalHeight;
  
  if (layout === 'horizontal') {
    totalWidth = (hasIcon ? iconSize : 0) + (hasText ? textWidth : 0) + 
                 (hasIcon && hasText ? padding * 0.5 : 0) + padding * 2;
    totalHeight = Math.max(hasIcon ? iconSize : 0, hasText ? fontSize : 0) + padding * 2;
  } else {
    totalWidth = Math.max(hasIcon ? iconSize : 0, hasText ? textWidth : 0) + padding * 2;
    totalHeight = (hasIcon ? iconSize : 0) + (hasText ? fontSize : 0) + 
                  (hasIcon && hasText ? padding * 0.5 : 0) + padding * 2;
  }

  // Générer le SVG
  let svgContent = `
    <svg width="${totalWidth}" height="${totalHeight}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          .logo-text { 
            font-family: ${fontFamily}; 
            font-size: ${fontSize}px; 
            font-weight: ${fontWeight}; 
            fill: ${textColor}; 
            text-anchor: middle; 
            dominant-baseline: central;
          }
          .logo-icon { 
            font-size: ${iconSize}px; 
            text-anchor: middle; 
            dominant-baseline: central;
          }
        </style>
      </defs>
  `;

  // Forme de fond
  if (shape !== 'none') {
    const shapeProps = `fill="${backgroundColor}" stroke="${borderWidth > 0 ? borderColor : 'none'}" stroke-width="${borderWidth}"`;
    
    switch (shape) {
      case 'circle':
        const radius = Math.min(totalWidth, totalHeight) / 2;
        svgContent += `<circle cx="${totalWidth/2}" cy="${totalHeight/2}" r="${radius}" ${shapeProps}/>`;
        break;
      case 'square':
        svgContent += `<rect x="0" y="0" width="${totalWidth}" height="${totalHeight}" ${shapeProps}/>`;
        break;
      case 'rounded':
        svgContent += `<rect x="0" y="0" width="${totalWidth}" height="${totalHeight}" rx="8" ry="8" ${shapeProps}/>`;
        break;
      case 'hexagon':
        const centerX = totalWidth / 2;
        const centerY = totalHeight / 2;
        const hexRadius = Math.min(totalWidth, totalHeight) / 2.2;
        const hexPoints = [];
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3;
          const x = centerX + hexRadius * Math.cos(angle);
          const y = centerY + hexRadius * Math.sin(angle);
          hexPoints.push(`${x},${y}`);
        }
        svgContent += `<polygon points="${hexPoints.join(' ')}" ${shapeProps}/>`;
        break;
    }
  } else {
    // Fond rectangulaire simple
    svgContent += `<rect x="0" y="0" width="${totalWidth}" height="${totalHeight}" fill="${backgroundColor}" stroke="${borderWidth > 0 ? borderColor : 'none'}" stroke-width="${borderWidth}"/>`;
  }

  // Positionnement du contenu
  let iconX = 0, iconY = 0, textX = 0, textY = 0;
  
  if (layout === 'horizontal') {
    if (hasIcon && hasText) {
      iconX = padding + iconSize / 2;
      iconY = totalHeight / 2;
      textX = iconX + iconSize / 2 + padding * 0.5 + textWidth / 2;
      textY = totalHeight / 2;
    } else if (hasIcon) {
      iconX = totalWidth / 2;
      iconY = totalHeight / 2;
    } else {
      textX = totalWidth / 2;
      textY = totalHeight / 2;
    }
  } else if (layout === 'vertical') {
    if (hasIcon && hasText) {
      iconX = totalWidth / 2;
      iconY = padding + iconSize / 2;
      textX = totalWidth / 2;
      textY = iconY + iconSize / 2 + padding * 0.5 + fontSize / 2;
    } else if (hasIcon) {
      iconX = totalWidth / 2;
      iconY = totalHeight / 2;
    } else {
      textX = totalWidth / 2;
      textY = totalHeight / 2;
    }
  } else if (layout === 'icon-only') {
    iconX = totalWidth / 2;
    iconY = totalHeight / 2;
  } else {
    textX = totalWidth / 2;
    textY = totalHeight / 2;
  }

  // Ajouter l'icône
  if (hasIcon) {
    svgContent += `<text x="${iconX}" y="${iconY}" class="logo-icon" fill="${iconColor}">${icon}</text>`;
  }

  // Ajouter le texte
  if (hasText) {
    svgContent += `<text x="${textX}" y="${textY}" class="logo-text">${text}</text>`;
  }

  svgContent += `</svg>`;
  return svgContent;
};

export const downloadSVG = (svgContent: string, filename: string) => {
  const blob = new Blob([svgContent], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export const downloadPNG = (svgContent: string, filename: string) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();
  
  img.onload = () => {
    canvas.width = img.width * 2; // 2x pour la qualité
    canvas.height = img.height * 2;
    ctx?.scale(2, 2);
    ctx?.drawImage(img, 0, 0);
    
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
      }
    }, 'image/png');
  };
  
  img.src = 'data:image/svg+xml;base64,' + btoa(svgContent);
};
