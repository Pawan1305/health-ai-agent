import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  Brain,
  Shield,
  Stethoscope,
  Pill,
  BookOpen,
  MessageSquare,
  Zap,
  ChevronRight,
  Heart,
  Dna,
  ClipboardList,
  ArrowRight,
} from 'lucide-react';

/* ── Reusable fade-in section wrapper ── */
function Section({ children, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Feature card with scroll-triggered animation ── */
function FeatureCard({ feature, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const Icon = feature.icon;
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="glass-card glow-border rounded-2xl p-6 group hover:border-cyan-500/30 transition-all duration-300 cursor-default"
    >
      <div
        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
        style={{ boxShadow: `0 8px 24px ${feature.glow}` }}
      >
        <Icon size={22} className="text-white" />
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
      <p className="text-sm text-gray-400 leading-relaxed">{feature.desc}</p>
    </motion.div>
  );
}

/* ── Step card with scroll-triggered animation ── */
function StepCard({ step, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const Icon = step.icon;
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="text-center relative"
    >
      <div className="inline-flex flex-col items-center">
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border-2 border-cyan-500/40 flex items-center justify-center pulse-ring">
            <Icon size={32} className="text-cyan-400" />
          </div>
          <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white">
            {index + 1}
          </div>
        </div>
        <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">{step.desc}</p>
      </div>
    </motion.div>
  );
}

const features = [
  {
    icon: Stethoscope,
    title: 'Symptom Analysis',
    desc: 'Describe your symptoms and get clear, evidence-based information about potential causes and next steps.',
    color: 'from-cyan-500 to-blue-600',
    glow: 'rgba(6,182,212,0.3)',
  },
  {
    icon: Pill,
    title: 'Medication Information',
    desc: 'Get detailed info on medications, dosages, interactions, and side effects.',
    color: 'from-violet-500 to-indigo-600',
    glow: 'rgba(99,102,241,0.3)',
  },
  {
    icon: BookOpen,
    title: 'Condition Education',
    desc: 'Understand medical conditions, treatment options, and lifestyle management strategies.',
    color: 'from-emerald-500 to-teal-600',
    glow: 'rgba(16,185,129,0.3)',
  },
  {
    icon: ClipboardList,
    title: 'Medical Context',
    desc: 'Add your health profile — conditions, medications, allergies — for truly personalized responses.',
    color: 'from-rose-500 to-pink-600',
    glow: 'rgba(244,63,94,0.3)',
  },
  {
    icon: MessageSquare,
    title: 'Conversation History',
    desc: 'All your health discussions are saved, so you can reference past conversations anytime.',
    color: 'from-amber-500 to-orange-600',
    glow: 'rgba(245,158,11,0.3)',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    desc: 'Your health context is stored locally on your device. Only anonymized queries reach the AI.',
    color: 'from-sky-500 to-cyan-600',
    glow: 'rgba(14,165,233,0.3)',
  },
];

const steps = [
  {
    number: '01',
    icon: ClipboardList,
    title: 'Add Your Context',
    desc: 'Enter your medical history, current medications, allergies, and health goals for personalized responses.',
  },
  {
    number: '02',
    icon: MessageSquare,
    title: 'Ask Anything',
    desc: 'Chat naturally about symptoms, conditions, medications, nutrition, or any health-related question.',
  },
  {
    number: '03',
    icon: Brain,
    title: 'Get Smart Answers',
    desc: 'Receive detailed, markdown-formatted answers synthesized from multiple AI systems in real-time.',
  },
];

const stats = [
  { label: 'Questions Answered', value: '10M+', icon: MessageSquare },
  { label: 'Medical Topics', value: '500+', icon: BookOpen },
  { label: 'Response Accuracy', value: '98%', icon: Activity },
  { label: 'Always Available', value: '24/7', icon: Zap },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen animated-bg text-white overflow-x-hidden">

      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 glass-card border-b border-cyan-500/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-indigo-500 rounded-lg flex items-center justify-center">
            <Activity size={16} className="text-white" />
          </div>
          <span className="text-lg font-bold gradient-text">MediMind AI</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
          <a href="#features" className="hover:text-cyan-400 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-cyan-400 transition-colors">How It Works</a>
          <a href="#about" className="hover:text-cyan-400 transition-colors">About</a>
        </div>
        <button
          onClick={() => navigate('/chat')}
          className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 hover:scale-105"
        >
          Launch App <ChevronRight size={16} />
        </button>
      </nav>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 px-6">
        {/* Background orbs */}
        <div className="orb w-96 h-96 bg-cyan-500/10 top-20 -left-20" />
        <div className="orb w-80 h-80 bg-indigo-500/10 bottom-20 -right-20" style={{ animationDelay: '3s' }} />
        <div className="orb w-64 h-64 bg-emerald-500/8 top-1/3 right-1/4" style={{ animationDelay: '6s' }} />

        {/* Floating medical icons */}
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-28 right-16 hidden lg:block"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 border border-cyan-500/30 flex items-center justify-center">
            <Heart size={24} className="text-cyan-400 animate-heartbeat" />
          </div>
        </motion.div>
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-48 left-16 hidden lg:block"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-indigo-500/5 border border-indigo-500/30 flex items-center justify-center">
            <Dna size={24} className="text-indigo-400" />
          </div>
        </motion.div>
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-32 left-24 hidden lg:block"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/30 flex items-center justify-center">
            <Stethoscope size={20} className="text-emerald-400" />
          </div>
        </motion.div>

        {/* Hero content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full px-4 py-1.5 text-sm text-cyan-400 mb-8"
          >
            <Zap size={14} />
            Powered by Multiple AI Engines
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold leading-tight mb-6"
          >
            Your AI{' '}
            <span className="gradient-text">Healthcare</span>
            <br />
            Companion
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Get instant, personalized answers to your health questions. Powered by advanced AI,
            informed by your medical context, available 24/7.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => navigate('/chat')}
              className="group flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold px-8 py-4 rounded-2xl hover:shadow-2xl hover:shadow-cyan-500/40 transition-all duration-300 hover:scale-105 text-base animate-pulse-glow"
            >
              Start Free Chat
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="#features"
              className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white font-semibold px-8 py-4 rounded-2xl hover:bg-white/10 transition-all duration-300 text-base"
            >
              Explore Features
            </a>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-2xl mx-auto"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="glass-card rounded-2xl p-4 text-center">
                <div className="text-2xl font-extrabold gradient-text-blue">{stat.value}</div>
                <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2.5 bg-cyan-400 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <Section className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 rounded-full px-4 py-1.5 text-sm text-indigo-400 mb-6">
              <Brain size={14} /> AI-Powered Features
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4">
              Everything you need for
              <br />
              <span className="gradient-text">smarter health decisions</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto text-lg">
              MediMind combines medical knowledge with personal context to give you the most relevant health information.
            </p>
          </Section>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <FeatureCard key={feature.title} feature={feature} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="py-24 px-6 relative">
        <div className="orb w-64 h-64 bg-indigo-500/10 top-0 right-0" />
        <div className="max-w-5xl mx-auto">
          <Section className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-4 py-1.5 text-sm text-emerald-400 mb-6">
              <Zap size={14} /> Simple & Fast
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4">
              Get started in{' '}
              <span className="gradient-text">3 easy steps</span>
            </h2>
          </Section>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* connector line */}
            <div className="hidden md:block absolute top-20 left-1/3 right-1/3 h-px bg-gradient-to-r from-cyan-500/50 to-indigo-500/50" />

            {steps.map((step, i) => (
              <StepCard key={step.number} step={step} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section id="about" className="py-24 px-6">
        <Section className="max-w-3xl mx-auto text-center">
          <div className="glass-card glow-border rounded-3xl p-12 relative overflow-hidden">
            <div className="orb w-48 h-48 bg-cyan-500/15 -top-10 -left-10" />
            <div className="orb w-48 h-48 bg-indigo-500/15 -bottom-10 -right-10" />
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center mx-auto mb-6">
                <Activity size={28} className="text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
                Ready to take control of{' '}
                <span className="gradient-text">your health?</span>
              </h2>
              <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
                Join thousands of people using MediMind AI to make more informed health decisions.
                100% free. No signup required.
              </p>
              <button
                onClick={() => navigate('/chat')}
                className="group inline-flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold px-10 py-4 rounded-2xl hover:shadow-2xl hover:shadow-cyan-500/40 transition-all duration-300 hover:scale-105 text-lg"
              >
                Start Chatting Free
                <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="text-gray-600 text-sm mt-4">No credit card required · Powered by multiple AI systems</p>
            </div>
          </div>
        </Section>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 py-8 px-6 text-center text-gray-600 text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-5 h-5 bg-gradient-to-br from-cyan-400 to-indigo-500 rounded-md flex items-center justify-center">
            <Activity size={10} className="text-white" />
          </div>
          <span className="text-gray-400 font-semibold">MediMind AI</span>
        </div>
        <p>⚠️ For educational purposes only. Always consult a qualified healthcare professional.</p>
        <p className="mt-1">Built with MERN + Multi-AI Intelligence · Free & Open Source</p>
      </footer>

    </div>
  );
}
