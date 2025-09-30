import monzaImage from '@/assets/circuits/monza.png';
import monacoImage from '@/assets/circuits/monaco.png';
import silverstoneImage from '@/assets/circuits/silverstone.png';

interface CircuitImageProps {
  circuitId: string;
  className?: string;
}

const CIRCUIT_IMAGES: Record<string, string> = {
  monza: monzaImage,
  monaco: monacoImage,
  silverstone: silverstoneImage,
};

export default function CircuitImage({ circuitId, className = '' }: CircuitImageProps) {
  const image = CIRCUIT_IMAGES[circuitId] || monzaImage;

  return (
    <div className={`flex items-center justify-center w-full h-full ${className}`}>
      <img 
        src={image} 
        alt={`${circuitId} circuit layout`}
        className="w-full h-full object-contain"
      />
    </div>
  );
}
