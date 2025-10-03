import AvatarTTS from '@/components/AvatarTTS';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Title */}
          <div className="mb-8">
            <h1 className="racing-title text-4xl sm:text-6xl md:text-8xl mb-4 px-4">
              Ask Alonso
            </h1>
            <p className="racing-subtitle text-lg sm:text-xl md:text-2xl mb-2 px-4">
              Your Personal F1 Racing Coach
            </p>
            <p className="text-muted-foreground max-w-2xl mx-auto px-4 text-sm sm:text-base">
              Experience Formula 1 like never before. Ask Alonso anything, test your knowledge, 
              simulate race strategies, and customize your AMF1 gear.
            </p>
          </div>

          {/* Avatar TTS Component */}
          <AvatarTTS className="mb-12" />

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto px-4">
            <Link
              to="/trivia"
              className="racing-card p-4 sm:p-6 hover:scale-105 transition-all duration-300 racing-glow group"
            >
              <div className="text-3xl sm:text-4xl mb-3">🚦</div>
              <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors text-sm sm:text-base">
                Green-Light Trivia
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground break-words">
                Test your F1 knowledge and earn AMF1 points
              </p>
            </Link>

            <Link
              to="/simulator"
              className="racing-card p-4 sm:p-6 hover:scale-105 transition-all duration-300 racing-glow group"
            >
              <div className="text-3xl sm:text-4xl mb-3">🏁</div>
              <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors text-sm sm:text-base">
                Racecraft Simulator
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground break-words">
                Configure your car and run virtual laps
              </p>
            </Link>

            <Link
              to="/clipit"
              className="racing-card p-4 sm:p-6 hover:scale-105 transition-all duration-300 racing-glow group"
            >
              <div className="text-3xl sm:text-4xl mb-3">📹</div>
              <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors text-sm sm:text-base">
                CliPIT
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground break-words">
                Capture highlight moments with auto-captioned clips ready for social media
              </p>
            </Link>

            <Link
              to="/merch"
              className="racing-card p-4 sm:p-6 hover:scale-105 transition-all duration-300 racing-glow group"
            >
              <div className="text-3xl sm:text-4xl mb-3">👕</div>
              <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors text-sm sm:text-base">
                Style Studio
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground break-words">
                Get smart outfit bundles optimized for race events and weather
              </p>
            </Link>
          </div>
        </div>

        {/* Background Decorative Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/4 -left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 -right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-12 sm:py-16 px-4 sm:px-8 bg-card/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="racing-title text-2xl sm:text-3xl md:text-4xl mb-4 px-4">Why Choose Ask Alonso?</h2>
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg px-4">
              The most comprehensive F1 AI experience on the web
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center px-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-xl sm:text-2xl">🤖</span>
              </div>
              <h3 className="racing-subtitle mb-3 text-sm sm:text-base">AI-Powered Insights</h3>
              <p className="text-muted-foreground text-xs sm:text-sm break-words">
                Get expert racing advice powered by advanced AI, trained on Fernando's decades of F1 experience.
              </p>
            </div>

            <div className="text-center px-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-xl sm:text-2xl">🎮</span>
              </div>
              <h3 className="racing-subtitle mb-3 text-sm sm:text-base">Interactive Simulations</h3>
              <p className="text-muted-foreground text-xs sm:text-sm break-words">
                Experience realistic racing scenarios with our advanced simulator and strategy tools.
              </p>
            </div>

            <div className="text-center px-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-racing-amber/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-xl sm:text-2xl">🏆</span>
              </div>
              <h3 className="racing-subtitle mb-3 text-sm sm:text-base">Competitive Gaming</h3>
              <p className="text-muted-foreground text-xs sm:text-sm break-words">
                Compete with other fans, earn AMF1 points, and climb the leaderboards.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
