import { useState } from 'react'
import {
  Sparkles,
  User,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  AlertCircle,
  Volume2,
  VolumeX,
  ExternalLink,
} from 'lucide-react'

export default function ChatMessage({ message, onRegenerate, isSpeaking = false, onToggleSpeak }) {
  const [copied, setCopied] = useState(false)
  const [feedback, setFeedback] = useState(null) // 'like' | 'dislike' | null

  const isAi = message.sender === 'ai'
  const isError = Boolean(message.isError)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Simple formatter for bold, bullet points, headers and blockquotes
  const formatText = (content) => {
    const lines = content.split('\n')
    return lines.map((line, idx) => {
      if (line.startsWith('### ')) {
        return (
          <h4 key={idx} className="text-base font-semibold text-white mt-3 mb-1">
            {line.replace('### ', '')}
          </h4>
        )
      }
      if (line.startsWith('* ') || line.startsWith('- ')) {
        const itemText = line.slice(2)
        return (
          <li key={idx} className="ml-4 list-disc text-neutral-300 my-0.5 leading-relaxed">
            {renderInlineMarkdown(itemText)}
          </li>
        )
      }
      if (line.startsWith('> ')) {
        return (
          <blockquote
            key={idx}
            className="border-l-2 border-emerald-500/70 pl-3 my-2 text-sm italic text-neutral-300 bg-neutral-800/40 py-1 rounded-r"
          >
            {renderInlineMarkdown(line.replace('> ', ''))}
          </blockquote>
        )
      }
      if (line.trim() === '') {
        return <div key={idx} className="h-2" />
      }
      return (
        <p key={idx} className="leading-relaxed text-neutral-200 my-1">
          {renderInlineMarkdown(line)}
        </p>
      )
    })
  }

  const renderInlineMarkdown = (text) => {
    const parts = text.split(/(\*\*.*?\*\*)/g)
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-semibold text-white">
            {part.slice(2, -2)}
          </strong>
        )
      }
      return part
    })
  }

  return (
    <div
      className={`group w-full py-4 px-3 sm:px-6 transition-colors duration-150 ${
        isError
          ? 'bg-rose-950/20 border-y border-rose-900/50'
          : isAi
          ? 'bg-neutral-900/40 border-y border-neutral-800/40'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-3xl mx-auto flex items-start gap-3.5 sm:gap-4">
        {/* Avatar */}
        <div className="shrink-0 pt-0.5">
          {isError ? (
            <div className="h-8 w-8 rounded-xl bg-rose-600/30 border border-rose-500/50 flex items-center justify-center text-rose-300 shadow-sm">
              <AlertCircle className="h-4 w-4" />
            </div>
          ) : isAi ? (
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-md shadow-emerald-500/20 text-white">
              <Sparkles className="h-4 w-4" />
            </div>
          ) : (
            <div className="h-8 w-8 rounded-xl bg-neutral-700 border border-neutral-600 flex items-center justify-center text-neutral-300 shadow-sm">
              <User className="h-4 w-4" />
            </div>
          )}
        </div>

        {/* Message Content */}
        <div className="flex-1 min-w-0 space-y-1">
          {/* Header (Author + Timestamp) */}
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-semibold ${
                isError ? 'text-rose-400' : 'text-white'
              }`}
            >
              {isError ? 'System Notice' : isAi ? 'Bujju AI' : 'You'}
            </span>
            <span className="text-[11px] text-neutral-500">{message.timestamp}</span>
          </div>

          {/* Body */}
          <div className="text-sm md:text-base text-neutral-200">
            {isError ? (
              <p className="text-rose-300 leading-relaxed">{message.text}</p>
            ) : isAi ? (
              <div className="space-y-1">
                {formatText(message.text)}
                {message.sources && message.sources.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-neutral-800/80">
                    <div className="text-[11px] font-semibold text-neutral-400 mb-1.5 flex items-center gap-1.5">
                      <span>🌐 Sources & Grounding</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {message.sources.map((src, i) => (
                        <a
                          key={i}
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-800/80 hover:bg-neutral-800 text-[11px] text-emerald-400 hover:text-emerald-300 transition-colors border border-neutral-700/60"
                        >
                          <span className="truncate max-w-[200px]">{src.title || src.url}</span>
                          <ExternalLink className="h-3 w-3 shrink-0" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-1.5">
                {message.text.split('\n').map((line, idx) => {
                  if (line.startsWith('[Image attached: ') && line.endsWith(']')) {
                    const imgName = line.slice(17, -1)
                    return (
                      <div
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-800/90 border border-neutral-700/80 text-xs text-neutral-300 mb-1"
                      >
                        <span className="text-sm">🖼️</span>
                        <span className="font-medium text-white">{imgName}</span>
                      </div>
                    )
                  }
                  return (
                    <p key={idx} className="whitespace-pre-wrap leading-relaxed text-neutral-200">
                      {line}
                    </p>
                  )
                })}
              </div>
            )}
          </div>

          {/* AI Action toolbar (speaker, copy, thumbs up/down, regenerate) */}
          {isAi && !isError && (
            <div className="flex items-center gap-1.5 pt-2 text-neutral-400">
              {onToggleSpeak && (
                <button
                  type="button"
                  onClick={() => onToggleSpeak(message)}
                  className={`p-1.5 rounded-md transition-colors cursor-pointer text-xs flex items-center gap-1 ${
                    isSpeaking
                      ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30'
                      : 'hover:bg-neutral-800 hover:text-neutral-200'
                  }`}
                  title={isSpeaking ? 'Stop speaking' : 'Read aloud'}
                  aria-label={isSpeaking ? 'Stop speaking' : 'Read aloud'}
                >
                  {isSpeaking ? (
                    <>
                      <VolumeX className="h-3.5 w-3.5 animate-pulse text-emerald-400" />
                      <span className="text-[11px] font-medium text-emerald-400">Stop speaking</span>
                    </>
                  ) : (
                    <Volume2 className="h-3.5 w-3.5" />
                  )}
                </button>
              )}

              <button
                type="button"
                onClick={handleCopy}
                className="p-1.5 rounded-md hover:bg-neutral-800 hover:text-neutral-200 transition-colors cursor-pointer text-xs flex items-center gap-1"
                title="Copy response"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-[11px] text-emerald-400">Copied</span>
                  </>
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setFeedback(feedback === 'like' ? null : 'like')}
                className={`p-1.5 rounded-md hover:bg-neutral-800 transition-colors cursor-pointer ${
                  feedback === 'like'
                    ? 'text-emerald-400 bg-neutral-800'
                    : 'hover:text-neutral-200'
                }`}
                title="Good response"
              >
                <ThumbsUp className="h-3.5 w-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setFeedback(feedback === 'dislike' ? null : 'dislike')}
                className={`p-1.5 rounded-md hover:bg-neutral-800 transition-colors cursor-pointer ${
                  feedback === 'dislike'
                    ? 'text-rose-400 bg-neutral-800'
                    : 'hover:text-neutral-200'
                }`}
                title="Bad response"
              >
                <ThumbsDown className="h-3.5 w-3.5" />
              </button>

              {onRegenerate && (
                <button
                  type="button"
                  onClick={onRegenerate}
                  className="p-1.5 rounded-md hover:bg-neutral-800 hover:text-neutral-200 transition-colors cursor-pointer"
                  title="Regenerate response"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
