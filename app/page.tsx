"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, Radar, Brain, Rocket, Github, Twitter, Zap, Download, BookOpen, Code2 } from "lucide-react"

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [glowPosition, setGlowPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
      setGlowPosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <div
        className="fixed pointer-events-none z-40 w-96 h-96 rounded-full blur-3xl opacity-20 transition-all duration-100"
        style={{
          background: "radial-gradient(circle, rgba(255, 107, 53, 0.4) 0%, transparent 70%)",
          left: `${glowPosition.x - 192}px`,
          top: `${glowPosition.y - 192}px`,
        }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src="/Martian-Logo.png" alt="Martian Logo" className="w-8 h-8" />
            <span className="text-xl font-bold">Martian</span>
          </div>
          <div className="hidden md:flex gap-8">
            <a href="#how-it-works" className="text-sm hover:text-primary transition">
              How It Works
            </a>
            <a href="#whitepaper" className="text-sm hover:text-primary transition">
              Whitepaper
            </a>
            <a href="#downloads" className="text-sm hover:text-primary transition">
              Downloads
            </a>
            <a href="#open-source" className="text-sm hover:text-primary transition">
              Open Source
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          {/* Background gradient orbs */}
          <div className="absolute top-20 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-0 left-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>

          <svg className="absolute inset-0 w-full h-full opacity-10" preserveAspectRatio="none">
            <defs>
              <style>{`
                @keyframes neuronPulse {
                  0%, 100% { opacity: 0.3; }
                  50% { opacity: 1; }
                }
                .neuron-dot { animation: neuronPulse 3s infinite; }
                .neuron-dot:nth-child(2) { animation-delay: 0.5s; }
                .neuron-dot:nth-child(3) { animation-delay: 1s; }
                .neuron-dot:nth-child(4) { animation-delay: 1.5s; }
                .neuron-dot:nth-child(5) { animation-delay: 2s; }
              `}</style>
            </defs>
            <circle cx="10%" cy="20%" r="4" fill="currentColor" className="neuron-dot text-primary" />
            <circle cx="30%" cy="15%" r="4" fill="currentColor" className="neuron-dot text-accent" />
            <circle cx="50%" cy="25%" r="4" fill="currentColor" className="neuron-dot text-primary" />
            <circle cx="70%" cy="18%" r="4" fill="currentColor" className="neuron-dot text-accent" />
            <circle cx="85%" cy="30%" r="4" fill="currentColor" className="neuron-dot text-primary" />
            <line
              x1="10%"
              y1="20%"
              x2="30%"
              y2="15%"
              stroke="currentColor"
              strokeWidth="1"
              className="text-primary opacity-30"
            />
            <line
              x1="30%"
              y1="15%"
              x2="50%"
              y2="25%"
              stroke="currentColor"
              strokeWidth="1"
              className="text-accent opacity-30"
            />
            <line
              x1="50%"
              y1="25%"
              x2="70%"
              y2="18%"
              stroke="currentColor"
              strokeWidth="1"
              className="text-primary opacity-30"
            />
            <line
              x1="70%"
              y1="18%"
              x2="85%"
              y2="30%"
              stroke="currentColor"
              strokeWidth="1"
              className="text-accent opacity-30"
            />
          </svg>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance">
            Autonomous Arbitrage on Solana
            <span className="block text-primary">Powered by AI</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 text-balance max-w-2xl mx-auto">
            Martian deploys intelligent agents to monitor Raydium, Orca, and SegaSwap, executing profitable trades
            automatically across Solana and Sonic blockchains.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/connect-wallet">
              <Button size="lg" className="gap-2 bg-primary hover:bg-primary/90">
                Launch Dashboard
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-card/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Radar,
                title: "Perceive",
                description: "Real-time monitoring of liquidity pools across Raydium, Orca, and SegaSwap",
              },
              {
                icon: Brain,
                title: "Reason",
                description: "AI agent analyzes price discrepancies and calculates profitable arbitrage opportunities",
              },
              {
                icon: Rocket,
                title: "Act",
                description: "Executes trades instantly via Sanctum Gateway for reliable transaction settlement",
              },
            ].map((step, idx) => {
              const Icon = step.icon
              return (
                <Card
                  key={idx}
                  className="p-8 border-border/50 bg-background/50 hover:bg-background/80 transition group cursor-pointer"
                >
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/40 transition">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section id="tech-stack" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Powered By</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { name: "Solana", logo: "/icons8-solana-64.png" },
              { name: "Sonic", logo: "/sonic-svm-logo.png" },
              { name: "Fetch.ai", logo: "/icons8-ai-30.png" },
              { name: "Sanctum", logo: "/sanctum.png" },
            ].map((tech, idx) => (
              <Card
                key={idx}
                className="p-8 border-border/50 bg-background/50 text-center hover:border-primary/50 transition flex flex-col items-center justify-center"
              >
                <img src={tech.logo} alt={tech.name} className="h-12 mb-4" />
                <h3 className="font-semibold">{tech.name}</h3>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Whitepaper Section */}
      <section id="whitepaper" className="py-20 px-4 sm:px-6 lg:px-8 bg-card/50 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <div className="w-16 h-16 bg-accent/20 rounded-lg flex items-center justify-center mb-6">
                <BookOpen className="w-8 h-8 text-accent" />
              </div>
              <h2 className="text-4xl font-bold mb-4">Read Our Whitepaper</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Dive deep into the technical architecture, AI algorithms, and arbitrage strategies that power Martian.
                Our comprehensive whitepaper details the sophisticated mechanisms behind autonomous DeFi trading.
              </p>
              <a href="https://notion.so" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="gap-2 bg-accent hover:bg-accent/90">
                  Read Whitepaper
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </a>
            </div>
            <div className="flex-1">
              <Card className="p-8 border-accent/30 bg-accent/5 backdrop-blur">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold">Advanced AI Architecture</h4>
                      <p className="text-sm text-muted-foreground">Multi-agent reinforcement learning system</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold">Cross-Chain Arbitrage</h4>
                      <p className="text-sm text-muted-foreground">Solana and Sonic SVM optimization</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold">Risk Management</h4>
                      <p className="text-sm text-muted-foreground">Sophisticated slippage and MEV protection</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Downloads Section */}
      <section id="downloads" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Get Started with CLI</h2>
          <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
            Download the Martian CLI to deploy and manage your autonomous arbitrage agent locally.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                os: "Windows",
                icon: "/icons8-windows-30.png",
                description: "Download for Windows 10/11 (64-bit)",
                link: "#",
              },
              {
                os: "macOS",
                icon: "/icons8-mac-30.png",
                description: "Download for macOS 11+ (Intel & Apple Silicon)",
                link: "#",
              },
              {
                os: "Linux",
                icon: "/icons8-linux-26.png",
                description: "Download for Linux (Ubuntu, Debian, Fedora)",
                link: "#",
              },
            ].map((platform, idx) => (
              <Card
                key={idx}
                className="p-8 border-border/50 bg-background/50 hover:bg-background/80 transition flex flex-col"
              >
                <img src={platform.icon} alt={`${platform.os} logo`} className="h-12 w-12 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{platform.os}</h3>
                <p className="text-sm text-muted-foreground mb-6 flex-1">{platform.description}</p>
                <a href={platform.link}>
                  <Button className="w-full gap-2 bg-primary hover:bg-primary/90">
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                </a>
              </Card>
            ))}
          </div>
          <div className="mt-12 p-8 bg-card/50 border border-border/50 rounded-lg">
            <h3 className="font-semibold mb-4">Or install via package manager:</h3>
            <div className="space-y-3 font-mono text-sm">
              <div className="p-3 bg-background/50 rounded border border-border/50">
                <span className="text-muted-foreground"># macOS with Homebrew</span>
                <div>brew install martian-cli</div>
              </div>
              <div className="p-3 bg-background/50 rounded border border-border/50">
                <span className="text-muted-foreground"># Linux with apt</span>
                <div>sudo apt install martian-cli</div>
              </div>
              <div className="p-3 bg-background/50 rounded border border-border/50">
                <span className="text-muted-foreground"># Or use npm</span>
                <div>npm install -g @martian/cli</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Open Source Section */}
      <section id="open-source" className="py-20 px-4 sm:px-6 lg:px-8 bg-card/50 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 order-2 md:order-1">
              <Card className="p-8 border-primary/30 bg-primary/5 backdrop-blur">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold">Fully Open Source</h4>
                      <p className="text-sm text-muted-foreground">MIT licensed, community-driven development</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold">Transparent & Auditable</h4>
                      <p className="text-sm text-muted-foreground">All code publicly available for review</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold">Community Contributions</h4>
                      <p className="text-sm text-muted-foreground">Join developers building the future of DeFi</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            <div className="flex-1 order-1 md:order-2">
              <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center mb-6">
                <Code2 className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-4xl font-bold mb-4">Open Source</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Martian is built on open-source principles. Explore our codebase, contribute improvements, and help
                shape the future of autonomous DeFi arbitrage.
              </p>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="gap-2 bg-primary hover:bg-primary/90">
                  <Github className="w-4 h-4" />
                  View on GitHub
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/Martian-Logo.png" alt="Martian Logo" className="w-6 h-6" />
                <span className="font-bold">Martian</span>
              </div>
              <p className="text-sm text-muted-foreground">Autonomous DeFi arbitrage powered by AI</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition">
                    API Reference
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition">
                    Guides
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition">
                    Discord
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition">
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition">
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>&copy; 2025 Martian. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-primary transition">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="hover:text-primary transition">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="hover:text-primary transition">
                <Zap className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
