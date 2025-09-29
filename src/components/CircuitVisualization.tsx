import { useEffect, useRef } from 'react';

interface CircuitVisualizationProps {
  circuitId: string;
  isRunning: boolean;
  progress?: number;
}

interface CircuitLayout {
  name: string;
  path: string;
  sectors: number[][];
  startFinish: [number, number];
}

const CIRCUIT_LAYOUTS: Record<string, CircuitLayout> = {
  monza: {
    name: 'Monza',
    path: 'M 50 150 Q 100 50 200 80 L 400 90 Q 450 100 480 130 L 500 200 Q 480 250 450 280 L 300 300 Q 250 320 200 300 L 100 280 Q 60 250 50 200 Z',
    sectors: [[50, 150, 200, 80], [200, 80, 480, 130], [480, 130, 50, 150]],
    startFinish: [50, 150]
  },
  monaco: {
    name: 'Monaco',
    path: 'M 80 200 Q 120 120 200 100 Q 280 90 350 120 Q 420 150 450 200 Q 460 250 430 290 Q 400 320 350 340 Q 300 350 250 340 Q 200 330 160 300 Q 120 270 100 240 Q 80 220 80 200 Z',
    sectors: [[80, 200, 200, 100], [200, 100, 450, 200], [450, 200, 80, 200]],
    startFinish: [80, 200]
  },
  silverstone: {
    name: 'Silverstone',
    path: 'M 70 180 Q 120 100 220 110 Q 320 120 400 150 Q 480 180 500 240 Q 520 300 480 350 Q 440 400 380 420 Q 320 440 260 430 Q 200 420 150 390 Q 100 360 80 320 Q 60 280 60 240 Q 60 200 70 180 Z',
    sectors: [[70, 180, 220, 110], [220, 110, 500, 240], [500, 240, 70, 180]],
    startFinish: [70, 180]
  }
};

export default function CircuitVisualization({ circuitId, isRunning, progress = 0 }: CircuitVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const carPositionRef = useRef(0);

  useEffect(() => {
    drawCircuit();
    
    if (isRunning) {
      startAnimation();
    } else {
      stopAnimation();
    }

    return () => stopAnimation();
  }, [circuitId, isRunning]);

  const drawCircuit = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const layout = CIRCUIT_LAYOUTS[circuitId] || CIRCUIT_LAYOUTS.monza;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw track background
    ctx.fillStyle = 'rgba(34, 197, 94, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw circuit outline (grass/runoff)
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.3)';
    ctx.lineWidth = 20;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    const path = new Path2D(layout.path);
    ctx.stroke(path);
    
    // Draw main track
    ctx.strokeStyle = 'rgba(156, 163, 175, 0.8)';
    ctx.lineWidth = 12;
    ctx.stroke(path);
    
    // Draw racing line
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.6)';
    ctx.lineWidth = 3;
    ctx.setLineDash([5, 5]);
    ctx.stroke(path);
    ctx.setLineDash([]);
    
    // Draw sector markers
    layout.sectors.forEach((sector, index) => {
      ctx.fillStyle = index === 0 ? '#ef4444' : index === 1 ? '#eab308' : '#22c55e';
      ctx.beginPath();
      ctx.arc(sector[0], sector[1], 6, 0, Math.PI * 2);
      ctx.fill();
      
      // Sector labels
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.font = '12px ui-sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`S${index + 1}`, sector[0], sector[1] - 12);
    });
    
    // Draw start/finish line
    const [startX, startY] = layout.startFinish;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.setLineDash([8, 4]);
    ctx.beginPath();
    ctx.moveTo(startX - 15, startY - 15);
    ctx.lineTo(startX + 15, startY + 15);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw car if running
    if (isRunning) {
      drawCar(ctx, layout);
    }
    
    // Draw circuit info
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = 'bold 16px ui-sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(layout.name, 20, 30);
    
    ctx.font = '12px ui-sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillText(`${layout.sectors.length} Sectors`, 20, 50);
  };

const drawCar = (ctx: CanvasRenderingContext2D, layout: CircuitLayout) => {
    // Simple parametric approach for car animation along circuit path
    const progress = (carPositionRef.current % 1000) / 1000;
    
    // Calculate approximate position along the circuit based on progress
    let x, y;
    
    if (layout.name === 'Monza') {
      // Monza: rectangular-ish circuit
      const t = progress * 4; // 4 segments
      if (t < 1) {
        x = 50 + (200 - 50) * t;
        y = 150 + (80 - 150) * t;
      } else if (t < 2) {
        x = 200 + (480 - 200) * (t - 1);
        y = 80 + (130 - 80) * (t - 1);
      } else if (t < 3) {
        x = 480 + (200 - 480) * (t - 2);
        y = 130 + (300 - 130) * (t - 2);
      } else {
        x = 200 + (50 - 200) * (t - 3);
        y = 300 + (150 - 300) * (t - 3);
      }
    } else if (layout.name === 'Monaco') {
      // Monaco: tight street circuit
      const angle = progress * Math.PI * 2;
      const centerX = 265;
      const centerY = 220;
      const radiusX = 185;
      const radiusY = 120;
      x = centerX + Math.cos(angle) * radiusX;
      y = centerY + Math.sin(angle) * radiusY;
    } else {
      // Silverstone: flowing circuit
      const angle = progress * Math.PI * 2;
      const centerX = 290;
      const centerY = 300;
      const radiusX = 220;
      const radiusY = 180;
      x = centerX + Math.cos(angle) * radiusX;
      y = centerY + Math.sin(angle) * radiusY;
    }
    
    ctx.save();
    
    // Draw car shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(x + 2, y + 2, 8, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw car body (Aston Martin green)
    ctx.fillStyle = '#00594D';
    ctx.beginPath();
    ctx.ellipse(x, y, 8, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw car details (yellow accents)
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Add car number
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 8px ui-sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('14', x, y + 2);
    
    ctx.restore();
  };

  const startAnimation = () => {
    const animate = () => {
      carPositionRef.current += 8; // Faster animation
      drawCircuit();
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();
  };

  const stopAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    carPositionRef.current = 0;
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-background to-muted/50 rounded-lg overflow-hidden">
      <canvas
        ref={canvasRef}
        width={600}
        height={300}
        className="w-full h-full object-contain"
      />
      
      {!isRunning && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <div className="text-center">
            <div className="text-4xl mb-2">🏁</div>
            <div className="text-sm text-muted-foreground">Ready to race</div>
          </div>
        </div>
      )}
    </div>
  );
}