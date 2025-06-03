
import { BMICalculatorAdvanced } from './health/BMICalculatorAdvanced';

export const BMICalculator = () => {
  return (
    <BMICalculatorAdvanced 
      data={{}} 
      onDataChange={(data) => {
        // Pour compatibilité avec l'ancien composant
        console.log('BMI data updated:', data);
      }} 
    />
  );
};
