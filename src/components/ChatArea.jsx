import { useRef, useEffect } from 'react'
import { PanelLeft, Sparkles, Plus, Trash2, Volume2, Square } from 'lucide-react'
import ChatMessage from './ChatMessage'
import WelcomeScreen from './WelcomeScreen'
import ChatInput from './ChatInput'

export default function ChatArea({
  onToggleSidebar,
  messages,
  input,
  setInput,
  onSend,
  onNewChat,
  onClearChat,
  onRegenerate,
  onSelectSuggestion,
  isLoading,
  isChatLoading = false,
  activeFile,
  onUploadFile,
  onRemoveFile,
  activeImage,
  onUploadImage,
  onRemoveImage,
  isUploading,
  uploadProgressText,
  uploadError,
  onDismissError,
  uploadSuccess,
  onDismissSuccess,
  speakingMessageId,
  onToggleSpeak,
  onStopSpeaking,
  voiceRate,
  setVoiceRate,
  voiceLang,
  setVoiceLang,
  isWebSearch,
  setIsWebSearch,
}) {
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  return (
    <div className="flex-1 flex flex-col h-full bg-neutral-950 text-neutral-100 overflow-hidden relative">
      {/* Top Navbar */}
      <header className="h-14 shrink-0 flex items-center justify-between px-3 sm:px-6 border-b border-neutral-900 bg-neutral-950/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          {/* Mobile Sidebar Toggle */}
          <button
            type="button"
            onClick={onToggleSidebar}
            className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors md:hidden cursor-pointer"
            aria-label="Toggle sidebar"
          >
            <PanelLeft className="h-5 w-5" />
          </button>

          {/* Model Status Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-xs text-neutral-300">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            <span className="font-semibold text-white">Bujju AI</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-medium ${
                isLoading
                  ? 'bg-amber-500/10 text-amber-400 animate-pulse'
                  : 'bg-emerald-500/10 text-emerald-400'
              }`}
            >
              {isLoading ? 'Thinking...' : 'Connected'}
            </span>
          </div>

          {/* Web Search indicator if enabled */}
          {isWebSearch && (
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-medium text-emerald-400">
              🌐 Web Search On
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-1.5">
          {/* Global Stop Speaking button if active */}
          {speakingMessageId && (
            <button
              type="button"
              onClick={onStopSpeaking}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-300 hover:text-rose-200 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-colors cursor-pointer animate-pulse"
              title="Stop speaking"
            >
              <Square className="h-3 w-3 fill-current" />
              <span>Stop Speaking</span>
            </button>
          )}

          <button
            type="button"
            onClick={onNewChat}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-neutral-300 hover:text-white hover:bg-neutral-900 border border-transparent hover:border-neutral-800 transition-colors cursor-pointer"
            title="Start new chat"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">New Chat</span>
          </button>

          {messages.length > 0 && (
            <button
              type="button"
              onClick={onClearChat}
              disabled={isLoading}
              className={`p-1.5 rounded-lg transition-colors ${
                isLoading
                  ? 'text-neutral-600 cursor-not-allowed'
                  : 'text-neutral-400 hover:text-rose-400 hover:bg-neutral-900 cursor-pointer'
              }`}
              title="Clear chat messages"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </header>

      {/* Main Chat Body (Scrollable) */}
      <div className="flex-1 overflow-y-auto flex flex-col">
        {isChatLoading ? (
          <div className="flex-1 flex items-center justify-center text-neutral-400">
            <div className="flex flex-col items-center gap-2.5">
              <div className="h-6 w-6 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
              <span className="text-xs text-neutral-400">Loading conversation...</span>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <WelcomeScreen onSelectSuggestion={onSelectSuggestion} />
        ) : (
          <div className="py-4 space-y-1">
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                message={msg}
                onRegenerate={msg.sender === 'ai' ? onRegenerate : undefined}
                isSpeaking={speakingMessageId === msg.id}
                onToggleSpeak={msg.sender === 'ai' ? onToggleSpeak : undefined}
              />
            ))}

            {/* Loading / Typing Indicator */}
            {isLoading && (
              <div className="w-full py-4 px-3 sm:px-6 bg-neutral-900/30 border-y border-neutral-800/40">
                <div className="max-w-3xl mx-auto flex items-start gap-3.5 sm:gap-4">
                  <div className="shrink-0 pt-0.5">
                    <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-md shadow-emerald-500/20 text-white animate-pulse">
                      <Sparkles className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white">Bujju AI</span>
                      <span className="text-[11px] text-neutral-500">generating response...</span>
                    </div>
                    <div className="flex items-center gap-1.5 py-1">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} className="h-4" />
          </div>
        )}
      </div>

      {/* Global Speaking Float Bar */}
      {speakingMessageId && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 px-4 py-2 rounded-full bg-neutral-900/95 border border-emerald-500/40 text-xs text-white shadow-2xl backdrop-blur-md animate-fade-in">
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-emerald-400 animate-pulse" />
            <span className="font-medium text-emerald-400">Bujju AI is reading aloud</span>
            <span className="text-neutral-400 text-[11px]">({voiceRate}x)</span>
          </div>
          <button
            type="button"
            onClick={onStopSpeaking}
            className="px-2.5 py-0.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer text-[11px] font-medium"
          >
            Stop
          </button>
        </div>
      )}

      {/* Message Input Bar */}
      <ChatInput
        input={input}
        setInput={setInput}
        onSend={onSend}
        isGenerating={isLoading}
        activeFile={activeFile}
        onUploadFile={onUploadFile}
        onRemoveFile={onRemoveFile}
        activeImage={activeImage}
        onUploadImage={onUploadImage}
        onRemoveImage={onRemoveImage}
        isUploading={isUploading}
        uploadProgressText={uploadProgressText}
        uploadError={uploadError}
        onDismissError={onDismissError}
        uploadSuccess={uploadSuccess}
        onDismissSuccess={onDismissSuccess}
        isWebSearch={isWebSearch}
        setIsWebSearch={setIsWebSearch}
        voiceRate={voiceRate}
        setVoiceRate={setVoiceRate}
        voiceLang={voiceLang}
        setVoiceLang={setVoiceLang}
      />
    </div>
  )
}
