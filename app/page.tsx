"use client";
import BorderFrame from "@/components/border-frame";
import { FloatingChat } from "@/components/floating-chat";
import { Boxes } from "@/components/ui/background-boxes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {  Code, Download, Github, Link, Linkedin, Mail, Rocket } from "lucide-react";
import {
  motion,
  useTransform,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "motion/react";
import Image from "next/image";
import { useState } from "react";

export default function Home() {

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  console.log("🚀 ~ Home ~ hoveredIndex:", hoveredIndex)
  const springConfig = { stiffness: 100, damping: 5 };
  const x = useMotionValue(0); // going to set this value on mouse move
  // rotate the tooltip
  const rotate = useSpring(
    useTransform(x, [-100, 100], [-45, 45]),
    springConfig,
  );
  // translate the tooltip
  const translateX = useSpring(
    useTransform(x, [-100, 100], [-50, 50]),
    springConfig,
  );
  const handleMouseMove = (event: any) => {
    // console.log("🚀 ~ handleMouseMove ~ event:", event)
    const halfWidth = event.target.offsetWidth / 2;
    x.set(event.nativeEvent.offsetX - halfWidth); // set the x value, which is then used in transform and rotate
  };

  const skills = [
  "React",
  "Next.js",
  "TypeScript",
  "Python",
  "AI/ML",
  "Node.js",
  "TensorFlow",
  "PyTorch",
  "AWS",
  "Docker",
  "GraphQL",
  "PostgreSQL",
]

const stats = [
  { label: "Projects Completed", value: "50+" },
  { label: "Years Experience", value: "5+" },
  { label: "AI Models Deployed", value: "15+" },
  { label: "Happy Clients", value: "30+" },
]

  return (
    <>
      <div className="h-screen relative w-full overflow-hidden bg-background flex flex-col items-center justify-center rounded-lg border">
        <div className="absolute inset-0 w-full h-full bg-background z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
        <div className="h-1/2 z-30 flex flex-col items-center">
        <Boxes />
          <div className="text-6xl text-primary z-30 group relative -mr-4" 
          onMouseEnter={() => setHoveredIndex(1)}
          onMouseLeave={() => setHoveredIndex(null)}>
            <AnimatePresence mode="popLayout">
              { hoveredIndex === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.6 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: {
                      type: "spring",
                      stiffness: 260,
                      damping: 10,
                    },
                  }}
                  exit={{ opacity: 0, y: 20, scale: 0.6 }}
                  style={{
                    translateX: translateX,
                    rotate: rotate,
                    whiteSpace: "nowrap",
                  }}
                  className="absolute -top-35 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center justify-center rounded-4xl bg-transparent border-dashed border-2 border-primary px-4 py-2 text-xs shadow-xl"
                >
                  <div className="absolute inset-x-10 -bottom-px z-30 h-px w-[20%] bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
                  <div className="absolute -bottom-px left-10 z-30 h-px w-[40%] bg-gradient-to-r from-transparent via-primary to-transparent" />
                  <div className="relative z-30 text-base font-bold text-white">
                    <Image
                      src="/me.jpeg"
                      alt="Savaliya"
                      width={100}
                      height={100}
                      className="rounded-full"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div  onMouseMove={handleMouseMove} >
            Tejas Savaliya
            </div>
          </div>
          <div className="text-xl text-card-foreground z-30 mt-1">
            MERN Stack Developer
          </div>
          <div className="text-card-foreground text-md text-center w-1/2 z-30 mt-4">
            🖥️ Full of energy and expertise in Mern stack web development! 🌟 Crafting innovative and user-friendly websites is my passion. Let's collaborate and bring your ideas to life! 🌐💪
          </div>
           <motion.div
              className="flex flex-wrap justify-center gap-4 my-8  z-30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <Button size="lg" className="group">
                {/* <Link href="/showcase"> */}
                  <Rocket className="mr-2 h-5 w-5 group-hover:animate-bounce" />
                  View Projects
                {/* </Link> */}
              </Button>
              <Button size="lg" variant="outline" className="group bg-transparent">
                <Download className="mr-2 h-5 w-5 group-hover:animate-bounce" />
                Download CV
              </Button>
            </motion.div>
           <motion.div
              className="flex justify-center gap-4 mb-12 z-30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              <Button size="icon" variant="ghost" className="hover:scale-110 transition-transform text-primary">
                <Github className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost" className="hover:scale-110 transition-transform text-primary">
                <Linkedin className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost" className="hover:scale-110 transition-transform text-primary">
                <Mail className="h-5 w-5" />
              </Button>
            </motion.div>
           
        </div>
        <FloatingChat />

      </div>
      <div>
        <div className="w-full overflow-hidden">
           <BorderFrame>

        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="my-16 z-30"
          >
            <h2 className="text-2xl font-semibold mb-6 flex items-center justify-center gap-2 text-primary/70">
              <Code className="h-6 w-6" />
              Tech Stack
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.4 + index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.1 }}
                >
                  <Badge
                    variant="secondary"
                    className="text-sm py-2 px-4 hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    {skill}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 my-16 px-4 z-30"
          >
            {stats.map((stat, index) => (
              <motion.div key={stat.label} whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
                <Card className="p-6 text-center glass hover:shadow-lg transition-all duration-300">
                  <BorderFrame>
                  <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </BorderFrame>
                </Card>
              </motion.div>
            ))}
          </motion.div>
           </BorderFrame>

        </div>
      </div>
    </>
  );
}
