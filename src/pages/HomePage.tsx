import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-background via-background to-card bg-cover bg-center"
      style={{ backgroundImage: "url('/images/WhatsApp Image 2025-10-02 at 20.14.20.jpeg')" }}
    >
      {/* Overlay to improve readability */}
      <div className="min-h-screen bg-black/40">
        {/* Hero Section */}
        <section className="relative py-20 px-8">
          <div className="max-w-4xl mx-auto text-center">
            {/* Main Title */}
            <div className="mb-8">
              <h1 className="racing-title text-6xl md:text-8xl mb-4 text-white">
                Ask Alonso
              </h1>
              <p className="racing-subtitle text-xl md:text-2xl mb-2 text-white">
                Your Personal F1 Racing Coach
              </p>
              <p className="text-white max-w-2xl mx-auto">
                Experience Formula 1 like never before. Ask Alonso anything, test your knowledge, 
                simulate race strategies, and customize your AMF1 gear.
              </p>
            </div>

            {/* Avatar Image Placeholder */}
            <div className="flex justify-center mb-12">
              <img 
                src="/amf1_ava.jpeg" 
                alt="Alonso Avatar" 
                className="w-40 h-40 rounded-full border-4 border-white shadow-lg object-cover"
              />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <Link
                to="/trivia"
                className="racing-card p-6 hover:scale-105 transition-all duration-300 racing-glow group"
              >
                <div className="text-4xl mb-3">🏁</div>
                <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors text-white">
                  Green-Light Trivia
                </h3>
                <p className="text-sm text-white">
                  Test your F1 knowledge and earn AMF1 points
                </p>
              </Link>

              <Link
                to="/simulator"
                className="racing-card p-6 hover:scale-105 transition-all duration-300 racing-glow group"
              >
                <div className="text-4xl mb-3">🏆</div>
                <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors text-white">
                  Racecraft Simulator
                </h3>
                <p className="text-sm text-white">
                  Configure your car and run virtual laps
                </p>
              </Link>

              <Link
                to="/clipit"
                className="racing-card p-6 hover:scale-105 transition-all duration-300 racing-glow group"
              >
                <div className="text-4xl mb-3">📹</div>
                <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors text-white">
                  CliPIT
                </h3>
                <p className="text-sm text-white">
                  Alonso captures highlight moments and delivers rights-cleared, auto-captioned clips ready for TikTok, Instagram, and Stories.
                </p>
              </Link>

              <Link
                to="/merch"
                className="racing-card p-6 hover:scale-105 transition-all duration-300 racing-glow group"
              >
                <div className="text-4xl mb-3">👕</div>
                <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors text-white">
                  Style Studio
                </h3>
                <p className="text-sm text-white">
                  Alonso guided outfitting: fans answer a few quick prompts and get smart bundles—jerseys, caps, layers—optimized for the event's weather and circuit.
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
        <section className="py-16 px-8 bg-card/50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="racing-title text-4xl mb-4 text-white">Why Choose Ask Alonso?</h2>
              <p className="text-lg text-white">
                The most comprehensive F1 AI experience on the web
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🤖</span>
                </div>
                <h3 className="racing-subtitle mb-3 text-white">AI-Powered Insights</h3>
                <p className="text-white">
                  Get expert racing advice powered by advanced AI, trained on Fernando's decades of F1 experience.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎮</span>
                </div>
                <h3 className="racing-subtitle mb-3 text-white">Interactive Simulations</h3>
                <p className="text-white">
                  Experience realistic racing scenarios with our advanced simulator and strategy tools.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-racing-amber/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🏆</span>
                </div>
                <h3 className="racing-subtitle mb-3 text-white">Competitive Gaming</h3>
                <p className="text-white">
                  Compete with other fans, earn AMF1 points, and climb the leaderboards.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
