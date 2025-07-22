"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Github, ExternalLink, Brain, Zap, Globe, Database } from "lucide-react"
import { FloatingChat } from "@/components/floating-chat";

const projects = [
  {
    id: 1,
    title: "AI-Powered E-commerce Platform",
    description:
      "A full-stack e-commerce solution with AI-driven product recommendations, dynamic pricing, and intelligent inventory management.",
    image: "/placeholder.svg?height=300&width=500",
    technologies: ["Next.js", "TensorFlow", "PostgreSQL", "Stripe", "AWS"],
    category: "AI/ML",
    icon: Brain,
    github: "#",
    demo: "#",
    featured: true,
  },
  {
    id: 2,
    title: "Real-time Chat Application",
    description:
      "Scalable chat application with WebSocket connections, message encryption, and AI-powered content moderation.",
    image: "/placeholder.svg?height=300&width=500",
    technologies: ["React", "Node.js", "Socket.io", "MongoDB", "Redis"],
    category: "Web App",
    icon: Zap,
    github: "#",
    demo: "#",
    featured: false,
  },
  {
    id: 3,
    title: "Smart Analytics Dashboard",
    description:
      "Business intelligence dashboard with predictive analytics, real-time data visualization, and automated reporting.",
    image: "/placeholder.svg?height=300&width=500",
    technologies: ["Vue.js", "Python", "FastAPI", "D3.js", "Docker"],
    category: "Analytics",
    icon: Database,
    github: "#",
    demo: "#",
    featured: true,
  },
  {
    id: 4,
    title: "AI Content Generator",
    description:
      "Content creation platform using GPT models for generating blog posts, social media content, and marketing copy.",
    image: "/placeholder.svg?height=300&width=500",
    technologies: ["React", "OpenAI API", "Node.js", "Prisma", "Vercel"],
    category: "AI/ML",
    icon: Brain,
    github: "#",
    demo: "#",
    featured: false,
  },
  {
    id: 5,
    title: "Blockchain Voting System",
    description:
      "Secure and transparent voting platform built on blockchain technology with smart contracts and decentralized storage.",
    image: "/placeholder.svg?height=300&width=500",
    technologies: ["Solidity", "Web3.js", "React", "IPFS", "Ethereum"],
    category: "Blockchain",
    icon: Globe,
    github: "#",
    demo: "#",
    featured: true,
  },
  {
    id: 6,
    title: "IoT Monitoring Dashboard",
    description:
      "Real-time monitoring system for IoT devices with data visualization, alerts, and predictive maintenance features.",
    image: "/placeholder.svg?height=300&width=500",
    technologies: ["Angular", "Node.js", "InfluxDB", "MQTT", "Grafana"],
    category: "IoT",
    icon: Zap,
    github: "#",
    demo: "#",
    featured: false,
  },
]

const categories = ["All", "AI/ML", "Web App", "Analytics", "Blockchain", "IoT"]

export default function ShowcasePage() {
  return (
    <div className="relative min-h-screen pt-20 pb-16 text-primary bg-gradient-to-br from-primary/7 via-primary/1 to-accent/5">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 hover:text-primary">Project Showcase</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore my portfolio of innovative projects spanning AI/ML, web development, blockchain, and IoT solutions.
            Each project represents a unique challenge solved with cutting-edge technology.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category, index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
            >
              <Badge
                variant={category === "All" ? "default" : "secondary"}
                className="text-sm py-2 px-4 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {category}
              </Badge>
            </motion.div>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1, duration: 0.8 }}
              whileHover={{ y: -10 }}
              className={project.featured ? "md:col-span-2 lg:col-span-1" : ""}
            >
              <Card className="h-full overflow-hidden group hover:shadow-2xl transition-all duration-300 glass">
                <div className="relative overflow-hidden">
                  <img
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                      {project.category}
                    </Badge>
                  </div>
                  <div className="absolute top-4 left-4">
                    <project.icon className="h-6 w-6 text-primary" />
                  </div>
                  {project.featured && (
                    <div className="absolute bottom-4 left-4">
                      <Badge className="bg-primary/90 backdrop-blur-sm">Featured</Badge>
                    </div>
                  )}
                </div>

                <CardHeader>
                  <CardTitle className="group-hover:text-primary transition-colors">{project.title}</CardTitle>
                  <CardDescription className="line-clamp-3">{project.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <Badge key={tech} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1 group/btn bg-transparent">
                      <Github className="mr-2 h-4 w-4 group-hover/btn:animate-spin" />
                      Code
                    </Button>
                    <Button size="sm" className="flex-1 group/btn">
                      <ExternalLink className="mr-2 h-4 w-4 group-hover/btn:animate-bounce" />
                      Demo
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Load More Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="text-center mt-12"
        >
          <Button size="lg" variant="outline" className="group bg-transparent">
            Load More Projects
            <motion.div
              className="ml-2"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <Zap className="h-4 w-4" />
            </motion.div>
          </Button>
        </motion.div>
      </div>

      {/* Floating Chatbot */}
      <FloatingChat hideInput={true} />
    </div>
  )
}
