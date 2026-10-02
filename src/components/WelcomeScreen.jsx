import { Sparkles, ArrowRight } from 'lucide-react'
import { SUGGESTIONS } from '../data/dummyData'

export default function WelcomeScreen({ onSelectSuggestion }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 max-w-3xl mx-auto w-full my-auto text-center">
      {/* Brand Icon Emblem */}
      <div className="relative mb-6">
        <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-3xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 flex items-center justify-center shadow-xl shadow-emerald-500/20 transform transition-transform hover:scale-105 duration-300">
          <Sparkles className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
        </div>
        <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-400 border-2 border-neutral-900 animate-pulse" />
      </div>

      {/* Heading & Tagline */}
      <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
        How can <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Bujju AI</span> assist you today?
      </h2>
      <p className="mt-3 text-sm sm:text-base text-neutral-400 max-w-lg leading-relaxed">
        Ask questions, brainstorm new ideas, write code, or draft content with a clean, fast, and modern interface.
      </p>

      {/* Suggestion Cards */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left">
        {SUGGESTIONS.map((item, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onSelectSuggestion(item.description)}
            className="group p-4 rounded-xl bg-neutral-900/60 hover:bg-neutral-800/80 border border-neutral-800 hover:border-emerald-500/50 transition-all duration-200 shadow-xs flex flex-col justify-between text-left cursor-pointer"
          >
            <div>
              <span className="text-xs font-semibold text-emerald-400 block mb-1">
                {item.title}
              </span>
              <p className="text-xs sm:text-sm text-neutral-300 group-hover:text-white transition-colors line-clamp-2">
                &ldquo;{item.description}&rdquo;
              </p>
            </div>
            <div className="mt-2.5 flex items-center text-xs text-neutral-500 group-hover:text-emerald-400 transition-colors">
              <span>Try this prompt</span>
              <ArrowRight className="h-3 w-3 ml-1 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
