/**
 * Web Speech API utilities for Bujju AI (Step 9)
 * Handles Speech Recognition (STT) and Speech Synthesis (TTS).
 */

// Supported languages list (easy to extend for Indian languages)
export const SUPPORTED_VOICE_LANGUAGES = [
  { code: 'en-US', label: 'English', native: 'English' },
  { code: 'ta-IN', label: 'Tamil', native: 'தமிழ்' },
  { code: 'hi-IN', label: 'Hindi', native: 'हिन्दी' },
  { code: 'ml-IN', label: 'Malayalam', native: 'മലയാളം' },
  { code: 'te-IN', label: 'Telugu', native: 'తెలుగు' },
]

// Speed options for TTS
export const VOICE_SPEEDS = [0.8, 1.0, 1.2]

/**
 * Check if the browser supports Speech Recognition
 */
export function isSpeechRecognitionSupported() {
  if (typeof window === 'undefined') return false
  return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition)
}

/**
 * Check if the browser supports Speech Synthesis (TTS)
 */
export function isSpeechSynthesisSupported() {
  if (typeof window === 'undefined') return false
  return Boolean(window.speechSynthesis && typeof window.SpeechSynthesisUtterance !== 'undefined')
}

/**
 * Get SpeechRecognition constructor safely
 */
export function getSpeechRecognitionClass() {
  if (typeof window === 'undefined') return null
  return window.SpeechRecognition || window.webkitSpeechRecognition || null
}

/**
 * Clean markdown and formatting from text for natural speech synthesis
 */
export function cleanTextForSpeech(text) {
  if (!text || typeof text !== 'string') return ''

  return text
    // Remove image attachment tags like [Image attached: filename.jpg]
    .replace(/\[Image attached:[^\]]*\]/gi, '')
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, 'Code block omitted.')
    // Remove inline code
    .replace(/`([^`]+)`/g, '$1')
    // Remove markdown headers
    .replace(/^#{1,6}\s+/gm, '')
    // Remove markdown bullet points and numbering
    .replace(/^(\*|-|\d+\.)\s+/gm, '')
    // Remove bold and italic markers
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    // Remove markdown links [text](url) -> text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove blockquotes
    .replace(/^>\s+/gm, '')
    // Remove extra whitespace and line breaks
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

// Track current active utterance listener / state
let activeUtterances = []

/**
 * Stop any ongoing SpeechSynthesis immediately
 */
export function stopSpeaking() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  try {
    window.speechSynthesis.cancel()
    activeUtterances = []
  } catch (err) {
    console.warn('Error cancelling speech synthesis:', err)
  }
}

/**
 * Speak text using Web SpeechSynthesis API with sentence chunking
 * to prevent Chromium 15-second speech cutoff bugs.
 */
export function speakText(text, options = {}) {
  const {
    rate = 1.0,
    lang = 'en-US',
    onStart,
    onEnd,
    onError,
  } = options

  if (!isSpeechSynthesisSupported()) {
    if (onError) onError(new Error('Speech synthesis is not supported in this browser.'))
    return
  }

  // Always cancel any prior speech first so only one response speaks at a time
  stopSpeaking()

  const clean = cleanTextForSpeech(text)
  if (!clean) {
    if (onEnd) onEnd()
    return
  }

  // Split into manageable chunks (by punctuation) to ensure smooth playback
  const sentences = clean.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [clean]
  let currentSentenceIndex = 0

  const speakNextSentence = () => {
    if (currentSentenceIndex >= sentences.length) {
      if (onEnd) onEnd()
      return
    }

    const sentenceText = sentences[currentSentenceIndex].trim()
    if (!sentenceText) {
      currentSentenceIndex++
      speakNextSentence()
      return
    }

    const utterance = new window.SpeechSynthesisUtterance(sentenceText)
    utterance.rate = rate
    utterance.lang = lang

    // Try to pick a voice matching the language if available
    const voices = window.speechSynthesis.getVoices()
    if (voices && voices.length > 0) {
      const matchingVoice = voices.find((v) => v.lang === lang || v.lang.startsWith(lang.slice(0, 2)))
      if (matchingVoice) {
        utterance.voice = matchingVoice
      }
    }

    utterance.onstart = () => {
      if (currentSentenceIndex === 0 && onStart) {
        onStart()
      }
    }

    utterance.onend = () => {
      currentSentenceIndex++
      speakNextSentence()
    }

    utterance.onerror = (event) => {
      // Ignore user-initiated cancellation errors
      if (event.error === 'canceled' || event.error === 'interrupted') {
        if (onEnd) onEnd()
        return
      }
      console.warn('Speech synthesis utterance error:', event.error)
      if (onError) onError(new Error(event.error || 'Speech synthesis error.'))
      if (onEnd) onEnd()
    }

    activeUtterances.push(utterance)
    window.speechSynthesis.speak(utterance)
  }

  speakNextSentence()
}
