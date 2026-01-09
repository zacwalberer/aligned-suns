declare module 'vader-sentiment' {
  interface SentimentScores {
    neg: number
    neu: number
    pos: number
    compound: number
  }

  interface SentimentIntensityAnalyzer {
    polarity_scores(text: string): SentimentScores
  }

  const vader: {
    SentimentIntensityAnalyzer: SentimentIntensityAnalyzer
  }

  export default vader
}
