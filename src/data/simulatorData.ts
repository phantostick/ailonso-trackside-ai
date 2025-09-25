export interface SimulatorConfig {
  tires: 'soft' | 'medium' | 'hard' | 'wet' | 'intermediate';
  aero: 'low' | 'medium' | 'high';
  engineMode: 'conservative' | 'balanced' | 'aggressive' | 'qualifying';
  fuel: number; // percentage
}

export interface SimulatorResult {
  lapTime: number; // in seconds
  tireWear: number; // percentage
  fuelLeft: number; // percentage
  reliability: number; // percentage
  commentary: string;
  sector1: number;
  sector2: number;
  sector3: number;
}

export const SIMULATOR_CIRCUITS = [
  {
    id: 'monza',
    name: 'Monza',
    baseTime: 80.5, // Base lap time in seconds
    characteristics: {
      straight_speed_importance: 0.8,
      cornering_importance: 0.4,
      tire_wear_factor: 0.6,
    }
  },
  {
    id: 'monaco',
    name: 'Monaco',
    baseTime: 72.3,
    characteristics: {
      straight_speed_importance: 0.3,
      cornering_importance: 0.9,
      tire_wear_factor: 0.4,
    }
  },
  {
    id: 'silverstone',
    name: 'Silverstone',
    baseTime: 87.2,
    characteristics: {
      straight_speed_importance: 0.6,
      cornering_importance: 0.7,
      tire_wear_factor: 0.7,
    }
  }
];

export const calculateLapTime = (config: SimulatorConfig, circuit = SIMULATOR_CIRCUITS[0]): SimulatorResult => {
  let lapTime = circuit.baseTime;
  let tireWear = 0;
  let reliabilityImpact = 0;
  
  // Tire compound effects
  const tireEffects = {
    soft: { speed: -1.5, wear: 8, reliability: -2 },
    medium: { speed: -0.5, wear: 5, reliability: 0 },
    hard: { speed: 0.8, wear: 3, reliability: 1 },
    wet: { speed: 3.0, wear: 2, reliability: -1 },
    intermediate: { speed: 2.0, wear: 4, reliability: 0 }
  };
  
  // Aerodynamics effects
  const aeroEffects = {
    low: { speed: -0.8, cornering: 0.5, reliability: 1 },
    medium: { speed: 0, cornering: 0, reliability: 0 },
    high: { speed: 0.6, cornering: -0.8, reliability: -1 }
  };
  
  // Engine mode effects
  const engineEffects = {
    conservative: { speed: 1.2, reliability: 3, fuel: 0.7 },
    balanced: { speed: 0, reliability: 0, fuel: 1.0 },
    aggressive: { speed: -0.8, reliability: -3, fuel: 1.4 },
    qualifying: { speed: -1.8, reliability: -5, fuel: 2.0 }
  };
  
  // Apply tire effects
  lapTime += tireEffects[config.tires].speed;
  tireWear += tireEffects[config.tires].wear;
  reliabilityImpact += tireEffects[config.tires].reliability;
  
  // Apply aero effects (more important for cornering circuits)
  const aeroImpact = aeroEffects[config.aero];
  lapTime += aeroImpact.speed * (1 - circuit.characteristics.straight_speed_importance);
  lapTime += aeroImpact.cornering * circuit.characteristics.cornering_importance;
  reliabilityImpact += aeroImpact.reliability;
  
  // Apply engine effects
  const engineImpact = engineEffects[config.engineMode];
  lapTime += engineImpact.speed;
  reliabilityImpact += engineImpact.reliability;
  
  // Fuel weight penalty (heavier = slower)
  const fuelWeight = config.fuel / 100;
  lapTime += fuelWeight * 0.8;
  
  // Calculate tire wear based on circuit and config
  tireWear *= circuit.characteristics.tire_wear_factor;
  if (config.engineMode === 'aggressive') tireWear *= 1.2;
  if (config.engineMode === 'conservative') tireWear *= 0.8;
  
  // Calculate fuel consumption
  const fuelConsumption = engineImpact.fuel * 2.5; // ~2.5% per lap baseline
  const fuelLeft = Math.max(0, config.fuel - fuelConsumption);
  
  // Calculate reliability
  const baseReliability = 90;
  const reliability = Math.max(50, Math.min(98, baseReliability + reliabilityImpact));
  
  // Generate sector times (roughly 1/3 each with some variation)
  const sector1 = lapTime * (0.30 + (Math.random() * 0.1 - 0.05));
  const sector2 = lapTime * (0.35 + (Math.random() * 0.1 - 0.05));
  const sector3 = lapTime - sector1 - sector2;
  
  // Generate Alonso's commentary
  const commentary = generateAlonsoCommentary(config, lapTime, circuit.baseTime, reliability);
  
  return {
    lapTime: Math.round(lapTime * 1000) / 1000,
    tireWear: Math.round(tireWear * 10) / 10,
    fuelLeft: Math.round(fuelLeft * 10) / 10,
    reliability: Math.round(reliability),
    commentary,
    sector1: Math.round(sector1 * 1000) / 1000,
    sector2: Math.round(sector2 * 1000) / 1000,
    sector3: Math.round(sector3 * 1000) / 1000
  };
};

const generateAlonsoCommentary = (
  config: SimulatorConfig, 
  lapTime: number, 
  baseTime: number, 
  reliability: number
): string => {
  const timeDiff = lapTime - baseTime;
  const commentaries = [];
  
  // Performance feedback
  if (timeDiff < -1.0) {
    commentaries.push("¡Fantástico! That's a really quick lap time. The setup is working well.");
  } else if (timeDiff < 0) {
    commentaries.push("Good pace! We found some time with this configuration.");
  } else if (timeDiff < 1.0) {
    commentaries.push("Not bad, but I think we can find more performance.");
  } else {
    commentaries.push("We need to work on the setup - the car is not feeling optimal.");
  }
  
  // Tire strategy feedback
  if (config.tires === 'soft') {
    commentaries.push("Soft tires give us good grip, but watch the degradation in the race.");
  } else if (config.tires === 'hard') {
    commentaries.push("Hard compound is consistent, good for long stints.");
  }
  
  // Engine mode feedback
  if (config.engineMode === 'aggressive') {
    commentaries.push("Aggressive mode gives us speed but monitor the reliability.");
  } else if (config.engineMode === 'qualifying') {
    commentaries.push("Full qualifying mode! Maximum attack, but only for one lap.");
  }
  
  // Reliability warning
  if (reliability < 80) {
    commentaries.push("I'm feeling some issues with the car - we need to be careful.");
  } else if (reliability > 95) {
    commentaries.push("The car feels strong and reliable today.");
  }
  
  return commentaries[Math.floor(Math.random() * commentaries.length)];
};

export const formatLapTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toFixed(3).padStart(6, '0')}`;
};