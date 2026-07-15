export class VoiceCoach {
  private voices: SpeechSynthesisVoice[] = [];

  refresh() {
    if (!('speechSynthesis' in window)) return [];
    this.voices = window.speechSynthesis.getVoices();
    return this.voices.filter(v => /^en/i.test(v.lang));
  }

  speak(text: string, enabled: boolean, voiceName: string, style: 'calm'|'direct'|'gruff') {
    if (!enabled || !('speechSynthesis' in window)) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = style === 'direct' ? 1.02 : style === 'gruff' ? 0.84 : 0.92;
    utterance.pitch = style === 'gruff' ? 0.72 : 0.96;
    const voice = this.voices.find(v => v.name === voiceName);
    if (voice) utterance.voice = voice;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }
}
