"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Home, ChartBarBig, ForkKnife, FlaskRoundIcon, Cog, Github, ArrowRight, Sparkles } from "lucide-react"
import { FloatingChat } from "@/components/floating-chat";
import Link from "next/link"
import Image from "next/image"

const projects = [
  {
    "id": 4,
    "title": "Chartix",
    "description": "Transform Your Data into Beautiful Insights. Upload your CSV or Excel files and let AI generate stunning visualizations in seconds. No coding required",
    "image": "/chartix.jpg",
    "technologies": ["Next.js", "PostgreSQL", "AI SDK", "Supabase", "Vercel AI Gateway"],
    "category": "XLSX + Prompt = Visualization",
    "icon": ChartBarBig,
    "github": "https://github.com/Tejas252/chartix-new",
    "demo": "https://chartix.vercel.app",
    "featured": false,
    "hobby": true,
    "gradient": "from-blue-500/20 to-purple-500/20"
  },
  {
    "id": 3,
    "title": "OSSPhere",
    "description": "MVP development project where I lead the team, integrating AI-powered methodologies to enhance efficiency and quality. Building the future of open source collaboration.",
    "image": "https://ossphere-six.vercel.app/api/og/home",
    "technologies": ["Next.js", "GraphQL", "AI SDK", "OpenAI", "Typesense", "PostgreSQL", "Docker", "NextAuth"],
    "category": "AI-Powered Platform",
    "icon": FlaskRoundIcon,
    "home": "https://ossphere.dev",
    "demo": "#",
    "featured": false,
    "gradient": "from-violet-500/20 to-purple-500/20"
  },
  {
    "id": 5,
    "title": "Browser Automation System",
    "description": "Automated browser workflows to handle authentication with HITL for OTP, download bills from secure platforms, and process them via third-party APIs. Built from research to production readiness.",
    "image": "",
    "technologies": ["Playwright", "Next.js", "Node.js", "Express.js", "MongoDB", "Mongoose"],
    "category": "Automation & AI Integration",
    "icon": Cog,
    "github": "#",
    "demo": "#",
    "featured": false,
    "gradient": "from-sky-500/20 to-indigo-500/20"
  },
  {
    "id": 1,
    "title": "Designtrack",
    "description": "Dedicated furniture showroom management platform offering extensive customizations and modules. Integrates with QuickBooks for comprehensive billing tracking and provides detailed reports for sales trends and commission management.",
    "image": "https://www.designtrack.co/images/logos/Logo.svg",
    "technologies": ["Next.js", "Node.js", "MongoDB", "GraphQL", "S3", "Cognito", "QuickBooks"],
    "category": "Full Stack CRM",
    "icon": ChartBarBig,
    "home": "https://showroomsoftware.com/design-track",
    "demo": "https://designtrack.co",
    "featured": true,
    "gradient": "from-emerald-500/20 to-teal-500/20"
  },
  {
    "id": 2,
    "title": "LOKO",
    "description": "Online food ordering platform connecting customers with partnered restaurants. Features real-time order tracking and seamless delivery partner integration for efficient food delivery services.",
    "image": "/loko.svg",
    "technologies": ["Next.js", "Node.js", "MongoDB", "Typesense", "S3", "Firebase", "GraphQL", "Stripe"],
    "category": "Food Delivery Platform",
    "icon": ForkKnife,
    "home": "http://145.223.18.19:3000",
    "demo": "http://145.223.18.19:3000",
    "featured": false,
    "gradient": "from-orange-500/20 to-red-500/20"
  },
]

// Helper function to generate short form of project name
function getShortForm(title: string): string {
  const words = title.trim().split(/\s+/);
  if (words.length > 1) {
    // Multiple words: take first letter of each word
    return words.map(word => word[0]?.toUpperCase() || '').join('');
  } else {
    // Single word: if 4 chars or less, use as-is, otherwise use first 2 chars
    const trimmed = title.trim();
    if (trimmed.length <= 4) {
      return trimmed.toUpperCase();
    }
    return trimmed.substring(0, 2).toUpperCase();
  }
}

export default function ShowcasePage() {
  return (
    <div className="relative min-h-screen pt-20 pb-16 text-primary overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0">
        {/* Main gradient background - Light/Dark mode optimized */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-primary/2 to-accent/6 dark:from-primary/8 dark:via-primary/2 dark:to-accent/6" />
        
        {/* Radial gradients for depth - Light mode enhanced */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_800x600_at_50%_-50%,var(--tw-gradient-stops))] from-primary/20 via-primary/8 to-transparent dark:from-primary/15 dark:via-primary/5 dark:to-transparent" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_600x800_at_100%_100%,var(--tw-gradient-stops))] from-accent/18 via-accent/6 to-transparent dark:from-accent/12 dark:via-accent/3 dark:to-transparent" />
        
        {/* Animated gradient orbs - Light mode enhanced */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-primary/30 to-accent/15 rounded-full blur-3xl animate-pulse dark:from-primary/20 dark:to-accent/10" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-accent/25 to-primary/12 rounded-full blur-3xl animate-pulse dark:from-accent/15 dark:to-primary/8" style={{ animationDelay: '1s' }} />
        
        {/* Subtle grid pattern overlay - Light mode enhanced */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] dark:bg-[size:50px_50px]" />
        
        {/* Additional depth layers - Light mode enhanced */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent dark:from-background/20 dark:via-transparent dark:to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Hero Section - Mobile Responsive */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16 lg:mb-20 px-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-full bg-primary/15 backdrop-blur-sm border border-primary/30 mb-4 sm:mb-6 shadow-sm dark:bg-primary/10 dark:border-primary/20"
          >
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
            <span className="text-xs sm:text-sm font-medium text-primary">Portfolio Showcase</span>
          </motion.div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent leading-tight dark:from-primary dark:to-primary/60">
            Project Showcase
          </h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-base sm:text-lg lg:text-xl text-muted-foreground/90 max-w-2xl sm:max-w-3xl mx-auto leading-relaxed px-4 dark:text-muted-foreground"
          >
            Explore my collection of innovative projects that showcase expertise in modern web development, 
            AI integration, and full-stack solutions.
          </motion.p>
        </motion.div>

        {/* Projects Grid - Mobile-First Responsive Layout */}
        <div className="space-y-12 md:space-y-16">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.2, duration: 0.8 }}
              className="group"
            >
              <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 glass border-primary/20 shadow-lg dark:border-primary/10 dark:shadow-none">
                <CardContent className="p-0">
                  {/* Mobile Layout - Stacked */}
                  <div className="flex flex-col lg:hidden">
                    {/* Image Section */}
                    <div className="relative">
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        transition={{ duration: 0.3 }}
                        className="relative overflow-hidden bg-gradient-to-br from-background/60 to-background/30 backdrop-blur-sm shadow-inner dark:from-background/50 dark:to-background/20"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 to-accent/6 dark:from-primary/5 dark:to-accent/5" />
                        <div className="relative h-48 sm:h-56 flex items-center justify-center p-4 sm:p-6">
                          {project.image ? (
                            <img
                              src={project.image}
                              alt={project.title}
                              className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-105 filter drop-shadow-lg"
                            />
                          ) : (
                            <div className="flex items-center justify-center w-full h-full">
                              <span className="text-4xl sm:text-5xl font-bold text-primary/70 dark:text-primary/60">
                                {getShortForm(project.title)}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        {/* Badges - Mobile */}
                        <div className="absolute top-3 left-3 flex flex-col gap-1">
                          <Badge className={`bg-gradient-to-r ${project.gradient} backdrop-blur-sm border border-white/20 text-foreground shadow-lg text-xs dark:border-0`}>
                            {project.category}
                          </Badge>
                          {project.featured && (
                            <Badge className="bg-primary/95 backdrop-blur-sm border border-white/20 shadow-lg text-xs dark:border-0 dark:bg-primary/90">
                              <Sparkles className="w-3 h-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                          {project.hobby && (
                            <Badge className="relative px-3 py-1.5 flex items-center gap-1 bg-gradient-to-r from-[#4de8c7]/90 via-[#12c2e9]/90 to-[#4776e6]/90 text-white font-semibold border-0 rounded-full shadow-lg before:absolute before:inset-x-0 before:bottom-0 before:h-[2px] before:bg-gradient-to-r before:from-[#D4FC79] before:to-[#96E6A1] before:opacity-70 overflow-hidden animate-pulse-sparkle">
                              <span className="animate-bounce"><Sparkles className="w-3 h-3 text-yellow-300 drop-shadow-glow mr-0.5" /></span>
                              <span className="tracking-wide drop-shadow-md">Passion Project</span>
                              <span className="inline-block animate-pulse ml-1 text-emerald-200/80 text-[15px] font-bold">★</span>
                            </Badge>
                          )}
                        </div>
                        
                        <div className="absolute top-3 right-3">
                          <div className="p-2 rounded-full bg-background/90 backdrop-blur-sm shadow-lg border border-primary/20">
                            <project.icon className="h-4 w-4 text-primary" />
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    {/* Content Section - Mobile */}
                    <div className="p-4 sm:p-6 space-y-4">
                      <div className="space-y-3">
                        <h2 className="text-xl sm:text-2xl font-bold text-primary">
                          {project.title}
                        </h2>
                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                          {project.description}
                        </p>
                      </div>

                      {/* Technologies - Mobile */}
                      <div className="space-y-2">
                        <h3 className="text-xs font-semibold text-primary/80 uppercase tracking-wide">Technologies</h3>
                        <div className="flex flex-wrap gap-1.5">
                          {project.technologies.map((tech) => (
                            <Badge 
                              key={tech} 
                              variant="outline" 
                              className="text-xs bg-background/70 backdrop-blur-sm border-primary/30 hover:border-primary/50 transition-colors shadow-sm dark:bg-background/50 dark:border-primary/20 dark:hover:border-primary/40"
                            >
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons - Mobile */}
                      <div className="flex flex-col gap-2 pt-2">
                        <Link href={project?.home || project?.github as string} target="_blank" rel="noopener noreferrer">
                          <Button 
                            variant="outline" 
                            className="w-full group/btn bg-background/70 backdrop-blur-sm border-primary/30 hover:border-primary/50 hover:bg-primary/8 transition-all duration-300 shadow-sm dark:bg-background/50 dark:border-primary/20 dark:hover:border-primary/40 dark:hover:bg-primary/5"
                          >
                            {project?.home ? (
                              <>
                                <Home className="mr-2 h-4 w-4 group-hover/btn:animate-spin" />
                                Visit Website
                              </>
                            ) : (
                              <>
                                <Github className="mr-2 h-4 w-4 group-hover/btn:animate-spin" />
                                View Source
                              </>
                            )}
                          </Button>
                        </Link>
                        
                        <a href={project.demo} target="_blank" rel="noopener noreferrer">
                          <Button 
                            className="w-full group/btn bg-primary hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl"
                          >
                            <ExternalLink className="mr-2 h-4 w-4 group-hover/btn:animate-bounce" />
                            Live Demo
                            <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                          </Button>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Layout - Side by Side */}
                  <div className={`hidden lg:flex ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} items-center gap-8 xl:gap-12`}>
                    {/* Image Section */}
                    <div className="flex-1">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-background/60 to-background/30 backdrop-blur-sm border border-primary/20 shadow-inner dark:from-background/50 dark:to-background/20 dark:border-primary/10"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 to-accent/6 dark:from-primary/5 dark:to-accent/5" />
                        <div className="relative h-80 xl:h-96 flex items-center justify-center p-8">
                          {project.image ? (
                            <img
                              src={project.image}
                              alt={project.title}
                              className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-105 filter drop-shadow-xl"
                            />
                          ) : (
                            <div className="flex items-center justify-center w-full h-full">
                              <span className="text-6xl xl:text-7xl font-bold text-primary/70 dark:text-primary/60">
                                {getShortForm(project.title)}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        {/* Badges - Desktop */}
                        <div className="absolute top-4 left-4 flex gap-2">
                          <Badge className={`bg-gradient-to-r ${project.gradient} backdrop-blur-sm border border-white/20 text-foreground shadow-lg dark:border-0`}>
                            {project.category}
                          </Badge>
                          {project.featured && (
                            <Badge className="bg-primary/95 backdrop-blur-sm border border-white/20 shadow-lg dark:border-0 dark:bg-primary/90">
                              <Sparkles className="w-3 h-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                          {project.hobby && (
                            <Badge className="bg-accent/95 backdrop-blur-sm border border-white/20 shadow-lg dark:border-0 dark:bg-accent/90">
                              Owner
                            </Badge>
                          )}
                        </div>
                        
                        <div className="absolute top-4 right-4">
                          <div className="p-3 rounded-full bg-background/90 backdrop-blur-sm shadow-lg border border-primary/20">
                            <project.icon className="h-6 w-6 text-primary" />
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    {/* Content Section - Desktop */}
                    <div className="flex-1 space-y-6 p-6">
                      <div className="space-y-4">
                        <h2 className="text-3xl xl:text-4xl font-bold text-primary group-hover:text-primary/80 transition-colors">
                          {project.title}
                        </h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                          {project.description}
                        </p>
                      </div>

                      {/* Technologies - Desktop */}
                      <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-primary/80 uppercase tracking-wide">Technologies Used</h3>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech) => (
                            <Badge 
                              key={tech} 
                              variant="outline" 
                              className="text-xs bg-background/70 backdrop-blur-sm border-primary/30 hover:border-primary/50 transition-colors shadow-sm dark:bg-background/50 dark:border-primary/20 dark:hover:border-primary/40"
                            >
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons - Desktop */}
                      <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <Link href={project?.home || project?.github as string} target="_blank" rel="noopener noreferrer" className="flex-1">
                          <Button 
                            variant="outline" 
                            className="w-full group/btn bg-background/70 backdrop-blur-sm border-primary/30 hover:border-primary/50 hover:bg-primary/8 transition-all duration-300 shadow-sm dark:bg-background/50 dark:border-primary/20 dark:hover:border-primary/40 dark:hover:bg-primary/5"
                          >
                            {project?.home ? (
                              <>
                                <Home className="mr-2 h-4 w-4 group-hover/btn:animate-spin" />
                                Visit Website
                              </>
                            ) : (
                              <>
                                <Github className="mr-2 h-4 w-4 group-hover/btn:animate-spin" />
                                View Source
                              </>
                            )}
                          </Button>
                        </Link>
                        
                        <a href={project.demo} target="_blank" rel="noopener noreferrer" className="flex-1">
                          <Button 
                            className="w-full group/btn bg-primary hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl"
                          >
                            <ExternalLink className="mr-2 h-4 w-4 group-hover/btn:animate-bounce" />
                            Live Demo
                            <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                          </Button>
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Call to Action - Mobile Responsive */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="text-center mt-12 sm:mt-16 lg:mt-20 px-4"
        >
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-xl" />
            <Button 
              size="lg" 
              variant="outline" 
              className="relative group bg-background/70 backdrop-blur-sm border-primary/30 hover:border-primary/50 hover:bg-primary/8 transition-all duration-300 text-sm sm:text-base px-6 py-3 shadow-sm dark:bg-background/50 dark:border-primary/20 dark:hover:border-primary/40 dark:hover:bg-primary/5"
            >
              <span className="mr-2 sm:mr-3">Building More Projects</span>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                <Cog className="h-4 w-4 sm:h-5 sm:w-5" />
              </motion.div>
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Floating Chatbot */}
      <FloatingChat hideInput={true} />
    </div>
  )
}
