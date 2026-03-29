import { motion } from "framer-motion";
import { Mail, Github, Linkedin } from "lucide-react";

import ishitaImg      from "../../assets/team/Ishita.jpg";
import ahanaImg       from "../../assets/team/Ahana.jpg";
import soumyadityaImg from "../../assets/team/soumyaditya.jpeg";
import avradeepImg    from "../../assets/team/Avradeep.png";

const TEAM = [
  {
    name: "Ishita Dey",
    role: "MERN Developer & ML developer",
    image: ishitaImg,
    email: "ishitadey955@gmail.com",
    github: "https://github.com/",
    linkedin: "https://linkedin.com/",
    delay: 0.0,
  },
  {
    name: "Soumyadipta Seal",
    role: "Backend Developer & Data Analyst",
    image: soumyadityaImg,
    email: "s.seal.a.b.c@gmail.com",
    github: "https://github.com/",
    linkedin: "https://linkedin.com/",
    delay: 0.08,
  },
  {
    name: "Ahana Mallick",
    role: "MERN Developer",
    image: ahanaImg,
    email: "anamac3803@gmail.com",
    github: "https://github.com/",
    linkedin: "https://linkedin.com/",
    delay: 0.16,
  },
  {
    name: "Avradeep Halder",
    role: "Frontend Developer & ML Engineer",
    image: avradeepImg,
    email: "avradeephalderaa@gmail.com",
    github: "https://github.com/",
    linkedin: "https://linkedin.com/",
    delay: 0.24,
  },
];

function MemberCard({ name, role, image, email, github, linkedin, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay }}
      className="group relative bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden
        hover:border-green-500/30 hover:bg-white/[0.05] transition-all duration-300"
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"
        style={{ background: "radial-gradient(circle at 50% 0%, rgba(0,166,81,0.18) 0%, transparent 70%)" }}
      />

      {/* Photo */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.style.display = "none";
            e.target.nextSibling.style.display = "flex";
          }}
        />

        {/* Fallback initials */}
        <div className="hidden w-full h-full bg-gradient-to-br from-green-500/10 to-emerald-700/10 items-center justify-center">
          <span className="text-green-500/30 font-black text-3xl uppercase tracking-widest">
            {name.charAt(0)}
          </span>
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#020805]/95 via-[#020805]/20 to-transparent" />

        {/* Social icons */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
          <a
            href={`mailto:${email}`}
            className="w-7 h-7 bg-black/60 border border-white/10 rounded-lg flex items-center justify-center text-white/50 hover:text-green-400 hover:border-green-500/40 transition"
          >
            <Mail size={12} />
          </a>

          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className="w-7 h-7 bg-black/60 border border-white/10 rounded-lg flex items-center justify-center text-white/50 hover:text-green-400 hover:border-green-500/40 transition"
          >
            <Github size={12} />
          </a>

          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="w-7 h-7 bg-black/60 border border-white/10 rounded-lg flex items-center justify-center text-white/50 hover:text-green-400 hover:border-green-500/40 transition"
          >
            <Linkedin size={12} />
          </a>
        </div>
      </div>

      {/* Info */}
      <div className="relative z-10 p-4 sm:p-5 text-center">
        <h3 className="text-white font-black text-sm sm:text-[0.95rem] uppercase mb-1">
          {name}
        </h3>
        <p className="text-green-500 font-bold text-[0.65rem] sm:text-[0.7rem] uppercase tracking-wider">
          {role}
        </p>
      </div>

      {/* Bottom line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-green-500 to-emerald-600 opacity-0 group-hover:opacity-100 transition" />
    </motion.div>
  );
}

export default function Team() {
  return (
    <section className="relative bg-[#020805] py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-green-700/5 blur-3xl rounded-full" />
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-600/4 blur-3xl rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14 sm:mb-16"
        >
          <h2 className="text-3xl font-black text-white mb-3">
            Meet Our <span className="text-green-400">Team</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            A passionate group building smart agriculture solutions.
          </p>
        </motion.div>

        {/* ✅ CENTERED GRID */}
        <div className="flex justify-center">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {TEAM.map((member) => (
              <MemberCard key={member.name} {...member} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}