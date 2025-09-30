/**
 * Speech utility for reading alert information using Web Speech API
 */

interface SpeechOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  lang?: string;
}

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private isSupported: boolean = false;
  private isEnabled: boolean = true;
  private isSpeaking: boolean = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.isSupported = true;

      // Handle speech end events
      if (this.synth) {
        this.synth.onvoiceschanged = () => {
          // Voices loaded
        };
      }
    }
  }

  /**
   * Check if speech synthesis is supported
   */
  isAvailable(): boolean {
    return this.isSupported;
  }

  /**
   * Enable or disable speech functionality
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  /**
   * Check if speech is currently enabled
   */
  getEnabled(): boolean {
    return this.isEnabled;
  }

  /**
   * Speak the given text with options
   */
  speak(text: string, options: SpeechOptions = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.isSupported || !this.isEnabled || !this.synth) {
        resolve();
        return;
      }

      // Cancel any ongoing speech
      this.synth.cancel();

      const utterance = new SpeechSynthesisUtterance(text);

      // Set default options
      utterance.rate = options.rate ?? 1;
      utterance.pitch = options.pitch ?? 1;
      utterance.volume = options.volume ?? 0.8;
      utterance.lang = options.lang ?? 'en-US';

      utterance.onstart = () => {
        this.isSpeaking = true;
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        resolve();
      };

      utterance.onerror = (event) => {
        this.isSpeaking = false;
        console.error('Speech synthesis error:', event);
        reject(new Error('Speech synthesis failed'));
      };

      this.synth.speak(utterance);
    });
  }

  /**
   * Stop current speech
   */
  stop(): void {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
    }
  }

  /**
   * Check if currently speaking
   */
  isCurrentlySpeaking(): boolean {
    return this.isSpeaking;
  }

  /**
   * Get available voices
   */
  getVoices(): SpeechSynthesisVoice[] {
    if (!this.synth) return [];
    return this.synth.getVoices();
  }

  /**
   * Speak alert information in a structured way
   */
  async speakAlert(alertInfo: {
    alertType: string;
    vehicleModel: string;
    plate: string;
    customerName?: string;
    time?: string;
  }): Promise<void> {
    if (!this.isEnabled) return;

    const text = this.formatAlertText(alertInfo);
    await this.speak(text, {
      rate: 0.9,
      pitch: 1,
      volume: 0.8
    });
  }

  /**
   * Format alert information into readable text
   */
  private formatAlertText(alertInfo: {
    alertType: string;
    vehicleModel: string;
    plate: string;
    customerName?: string;
    time?: string;
  }): string {
    const parts = [];

    // Add alert type
    parts.push(`${alertInfo.alertType}`);

    // Add vehicle information
   /*  parts.push(`for ${alertInfo.vehicleModel}`);

    // Add license plate
    parts.push(`with plate number ${alertInfo.plate}`); */

    // Add customer name if available
    /* if (alertInfo.customerName) {
      parts.push(`belonging to ${alertInfo.customerName}`);
    }

    // Add time if available
    if (alertInfo.time) {
      parts.push(`at ${alertInfo.time}`);
    }
 */
    return parts.join(' ');
  }
}

// Create singleton instance
const speechService = new SpeechService();

export default speechService;
