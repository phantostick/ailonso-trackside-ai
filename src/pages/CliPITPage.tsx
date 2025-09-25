import { useState } from 'react';

export default function CliPITPage() {
  const [isComingSoon] = useState(true);

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 text-center">
      <div className="racing-card p-12">
        {/* Icon */}
        <div className="text-8xl mb-8 animate-racing-pulse">📹</div>
        
        {/* Title */}
        <h1 className="racing-title text-5xl mb-6">CliPIT</h1>
        <p className="racing-subtitle text-xl mb-8">
          AI-Powered Video Analysis Tool
        </p>

        {/* Description */}
        <div className="max-w-2xl mx-auto space-y-6 text-muted-foreground mb-12">
          <p>
            CliPIT will revolutionize how you analyze racing footage. Upload your videos 
            and get AI-powered insights from Fernando Alonso's expertise.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div className="racing-card p-4 bg-primary/5">
              <h3 className="font-semibold text-foreground mb-2">🎯 Precise Analysis</h3>
              <p className="text-sm">
                Frame-by-frame analysis of racing lines, braking points, and overtaking opportunities.
              </p>
            </div>
            
            <div className="racing-card p-4 bg-accent/5">
              <h3 className="font-semibold text-foreground mb-2">🏎️ Setup Recommendations</h3>
              <p className="text-sm">
                AI-driven car setup suggestions based on your driving style and track conditions.
              </p>
            </div>
            
            <div className="racing-card p-4 bg-racing-blue/5">
              <h3 className="font-semibold text-foreground mb-2">📊 Performance Metrics</h3>
              <p className="text-sm">
                Detailed telemetry analysis with sector times, speed traces, and G-force data.
              </p>
            </div>
            
            <div className="racing-card p-4 bg-racing-amber/5">
              <h3 className="font-semibold text-foreground mb-2">💬 Alonso Commentary</h3>
              <p className="text-sm">
                Get personalized feedback and coaching tips from AI Fernando on your footage.
              </p>
            </div>
          </div>
        </div>

        {/* Coming Soon Badge */}
        <div className="inline-flex items-center space-x-3 bg-secondary/50 px-6 py-3 rounded-full border border-border mb-8">
          <div className="w-3 h-3 bg-accent rounded-full animate-racing-pulse"></div>
          <span className="font-semibold">Coming Soon</span>
        </div>

        {/* Notification Signup */}
        <div className="max-w-md mx-auto">
          <p className="text-sm text-muted-foreground mb-4">
            Be the first to know when CliPIT launches
          </p>
          <div className="flex space-x-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="racing-select flex-1"
            />
            <button className="racing-button-primary px-6">
              Notify Me
            </button>
          </div>
        </div>

        {/* Development Progress */}
        <div className="mt-12 pt-8 border-t border-border">
          <h3 className="font-semibold mb-4">Development Progress</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-primary rounded-full"></div>
              <span className="text-sm">AI Model Training - Complete</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-primary rounded-full"></div>
              <span className="text-sm">Video Processing Engine - Complete</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-accent rounded-full animate-pulse"></div>
              <span className="text-sm">User Interface - In Progress</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-muted rounded-full"></div>
              <span className="text-sm text-muted-foreground">Beta Testing - Upcoming</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}