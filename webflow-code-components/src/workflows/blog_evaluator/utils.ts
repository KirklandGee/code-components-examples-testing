export function createWorkflowOutput(
  blogContent: { url: string; title: string },
  score: number
) {
  return {
    url: blogContent.url,
    title: blogContent.title,
    signalToNoiseScore: score,
    confidence: 0.85,
    summary: `Signal-to-noise score: ${score}/100`
  };
}
