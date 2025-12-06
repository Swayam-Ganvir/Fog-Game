"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Play, Map, Eye, Compass, ChevronDown, Menu, X } from 'lucide-react';

export default function FogOfWarHomepage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [revealedAreas, setRevealedAreas] = useState(new Set());
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useEffect(() => {
        // Simulate revealing areas over time
        const interval = setInterval(() => {
            setRevealedAreas(prev => {
                const newSet = new Set(prev);
                const areaIndex = Math.floor(Math.random() * 20);
                newSet.add(areaIndex);
                return newSet;
            });
        }, 1500);

        return () => clearInterval(interval);
    }, []);

    const features = [
        {
            icon: <Map className="w-8 h-8" />,
            title: "Dynamic Exploration",
            description: "Uncover mysterious territories as you venture into the unknown"
        },
        {
            icon: <Eye className="w-8 h-8" />,
            title: "Fog of War",
            description: "Only see what's within your sight range, adding strategic depth"
        },
        {
            icon: <Compass className="w-8 h-8" />,
            title: "Strategic Movement",
            description: "Plan your path carefully through the shrouded landscape"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-100 text-gray-800 overflow-hidden scroll-smooth">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-20 left-10 w-32 h-16 bg-white/30 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute top-40 right-20 w-24 h-12 bg-gray-200/40 rounded-full blur-lg animate-pulse delay-300"></div>
                <div className="absolute bottom-40 left-1/4 w-40 h-20 bg-white/20 rounded-full blur-2xl animate-pulse delay-700"></div>

                {/* Grid pattern */}
                <div className="absolute inset-0 opacity-5">
                    {Array.from({ length: 20 }).map((_, i) => (
                        <div
                            key={i}
                            className={`absolute w-16 h-16 border border-gray-400 transition-all duration-1000 ${revealedAreas.has(i) ? 'opacity-30 bg-white/10' : 'opacity-0'
                                }`}
                            style={{
                                left: `${(i % 5) * 20}%`,
                                top: `${Math.floor(i / 5) * 25}%`,
                            }}
                        />
                    ))}
                </div>

                {/* Mouse follow effect */}
                <div
                    className="absolute w-96 h-96 bg-gradient-radial from-white/20 to-transparent rounded-full blur-3xl transition-all duration-300 pointer-events-none"
                    style={{
                        left: mousePosition.x - 192,
                        top: mousePosition.y - 192,
                    }}
                />
            </div>

            {/* Navigation */}
            <nav className="relative z-50 p-6">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg flex items-center justify-center">
                            <div className="w-4 h-4 bg-white rounded-sm opacity-80"></div>
                        </div>
                        Fog Explorer
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        <a href="#game" className="text-gray-600 hover:text-gray-800 transition-colors">Game</a>
                        <a href="#features" className="text-gray-600 hover:text-gray-800 transition-colors">Features</a>
                        <a href="#about" className="text-gray-600 hover:text-gray-800 transition-colors">About</a>
                        <Link href="/auth">
                            <button className="bg-gray-800 text-white px-6 py-2 rounded-full hover:bg-gray-700 transition-all transform hover:scale-105">
                                Play Now
                            </button>
                        </Link>

                    </div>

                    <button
                        className="md:hidden text-gray-600 hover:text-gray-800"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile menu */}
                {isMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 p-6">
                        <div className="flex flex-col gap-4">
                            <a href="#game" className="text-gray-600 hover:text-gray-800 transition-colors">Game</a>
                            <a href="#features" className="text-gray-600 hover:text-gray-800 transition-colors">Features</a>
                            <a href="#about" className="text-gray-600 hover:text-gray-800 transition-colors">About</a>
                            <Link href="/auth">
                            <button className="bg-gray-800 text-white px-6 py-2 rounded-full hover:bg-gray-700 transition-all w-full">
                                Play Now
                            </button>
                            </Link>
                            
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section id="game" className="relative z-20 container mx-auto px-6 py-20 text-center">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 bg-clip-text text-transparent leading-tight">
                        Explore the
                        <br />
                        <span className="relative">
                            Unknown
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent blur-xl animate-pulse"></div>
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
                        Navigate through mysterious lands shrouded in fog. Every step reveals new territories,
                        every decision shapes your journey through the unknown.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                        <Link href="/auth">
                        <button className="bg-gray-800 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-700 transition-all transform hover:scale-105 flex items-center gap-3 shadow-lg">
                            <Play className="w-5 h-5" />
                            Start Exploring
                        </button>
                        </Link>
                        

                        <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full text-lg font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all transform hover:scale-105">
                            Watch Trailer
                        </button>
                    </div>

                    {/* Scroll indicator */}
                    <div className="animate-bounce">
                        <ChevronDown className="w-8 h-8 text-gray-400 mx-auto" />
                    </div>
                </div>
            </section>

            {/* Interactive Demo Section */}
            <section className="relative z-20 container mx-auto px-6 py-20">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-800">
                        Experience the Mystery
                    </h2>
                    <p className="text-gray-600 text-center mb-12 text-lg">
                        Move your cursor to reveal the hidden world beneath the fog
                    </p>

                    <div className="relative bg-gradient-to-br from-gray-100 to-white rounded-2xl p-8 shadow-xl border border-gray-200 overflow-hidden">
                        {/* Demo grid */}
                        <div className="grid grid-cols-8 gap-2 h-64 relative">
                            {Array.from({ length: 64 }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`relative rounded-lg transition-all duration-500 ${Math.abs((i % 8) * 50 + Math.floor(i / 8) * 40 - mousePosition.x / 10) < 100 &&
                                            Math.abs(Math.floor(i / 8) * 40 - mousePosition.y / 10) < 100
                                            ? 'bg-gradient-to-br from-gray-200 to-gray-300 shadow-inner'
                                            : 'bg-gray-400'
                                        }`}
                                >
                                    {Math.abs((i % 8) * 50 + Math.floor(i / 8) * 40 - mousePosition.x / 10) < 80 &&
                                        Math.abs(Math.floor(i / 8) * 40 - mousePosition.y / 10) < 80 && (
                                            <div className="absolute inset-0 bg-green-200 rounded-lg opacity-50"></div>
                                        )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="relative z-20 container mx-auto px-6 py-20">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-800">
                        Game Features
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="bg-white/70 backdrop-blur-sm rounded-xl p-8 text-center hover:shadow-lg transition-all duration-300 hover:transform hover:scale-105 border border-gray-200">
                                <div className="text-gray-700 mb-4 flex justify-center">{feature.icon}</div>
                                <h3 className="text-xl font-semibold mb-3 text-gray-800">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="relative z-20 container mx-auto px-6 py-20">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
                        About the Game
                    </h2>
                    <p className="text-xl text-gray-600 leading-relaxed">
                        Fog Explorer is more than just a game – it’s an immersive journey into the unknown.
                        Inspired by strategy and adventure, it challenges players to reveal hidden paths,
                        make tactical decisions, and uncover the mysteries hidden in the fog.
                        Built with modern web technologies, it combines fun gameplay with interactive design,
                        perfect for explorers who love challenges.
                    </p>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative z-20 container mx-auto px-6 py-20">
                <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-12 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10"></div>
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Ready to Begin Your Journey?
                        </h2>
                        <p className="text-xl text-gray-300 mb-8">
                            Step into the fog and discover what lies beyond the veil of mystery.
                        </p>
                        <Link href="/auth">
                        <button className="bg-white text-gray-800 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg">
                            Play Now - Free
                        </button>
                        </Link>
                        
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-20 container mx-auto px-6 py-12 border-t border-gray-200">
                <div className="max-w-6xl mx-auto text-center text-gray-600">
                    <div className="flex justify-center items-center gap-2 mb-4">
                        <div className="w-6 h-6 bg-gradient-to-br from-gray-700 to-gray-900 rounded flex items-center justify-center">
                            <div className="w-3 h-3 bg-white rounded-sm opacity-80"></div>
                        </div>
                        <span className="font-semibold text-gray-800">Fog Explorer</span>
                    </div>
                    <p>&copy; 2024 Fog Explorer Game. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
