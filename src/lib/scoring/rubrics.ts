import { Rubric, Dimension } from './types'

export const RUBRICS: Record<Dimension, Rubric> = {
  resourcefulness: {
    dimension: 'resourcefulness',
    description: 'Ability to create solutions with limited resources, adapt to constraints, and find unconventional approaches',
    levels: {
      1: 'Gives up when faced with constraints. Sees only obstacles. No alternative solutions proposed.',
      2: 'Acknowledges constraints but proposes only obvious or insufficient solutions.',
      3: 'Proposes at least one viable alternative. Shows some flexibility in thinking.',
      4: 'Proposes multiple alternatives. Demonstrates clear ability to work within constraints creatively.',
      5: 'Reframes the constraint as an opportunity. Proposes novel solutions that others would not think of. Shows evidence of having done this in real life.',
    },
    weight: 0.15,
  },

  growth_trajectory: {
    dimension: 'growth_trajectory',
    description: 'Evidence of personal development, learning from failures, and trajectory of improvement over time',
    levels: {
      1: 'No evidence of growth or learning. Static self-description with no reflection.',
      2: 'Mentions growth vaguely but without specific examples or genuine reflection.',
      3: 'Describes at least one specific growth experience with some self-awareness.',
      4: 'Shows clear trajectory of improvement with concrete examples. Demonstrates learning from setbacks.',
      5: 'Compelling narrative of transformation. Multiple examples of turning failures into growth. Deep self-awareness about strengths and weaknesses.',
    },
    weight: 0.15,
  },

  social_leadership: {
    dimension: 'social_leadership',
    description: 'Ability to mobilize others, resolve conflicts, and take initiative in group settings',
    levels: {
      1: 'Passive in group settings. Avoids conflict. No evidence of initiative.',
      2: 'Participates in groups but does not lead or take initiative.',
      3: 'Shows some initiative. Can describe a situation where they influenced a group outcome.',
      4: 'Clear evidence of mobilizing others. Handles conflict constructively. Takes responsibility.',
      5: 'Natural leader who empowers others. Creates new initiatives from scratch. Evidence of sustained impact on a community or group.',
    },
    weight: 0.15,
  },

  creative_problem_solving: {
    dimension: 'creative_problem_solving',
    description: 'Ability to approach problems from unusual angles, combine ideas from different domains, and generate original solutions',
    levels: {
      1: 'Applies only conventional approaches. Cannot see beyond the obvious solution.',
      2: 'Attempts creative thinking but stays within familiar frameworks.',
      3: 'Shows some originality in approach. Can combine ideas from different sources.',
      4: 'Demonstrates genuine creativity with practical implementation ideas.',
      5: 'Highly original thinker. Combines cross-domain knowledge. Solutions show both creativity and feasibility.',
    },
    weight: 0.15,
  },

  authentic_voice: {
    dimension: 'authentic_voice',
    description: 'Genuineness of expression, personal perspective, and absence of formulaic or AI-generated content',
    levels: {
      1: 'Generic, formulaic responses. Could have been written by anyone. No personal perspective.',
      2: 'Mostly generic with occasional hints of personal experience.',
      3: 'Shows genuine personal perspective. Voice is distinguishable. Some unique details.',
      4: 'Clearly authentic voice with specific personal details and genuine emotional expression.',
      5: 'Unmistakably personal and genuine. Rich with specific details, cultural context, and honest self-reflection. Could not have been written by someone else.',
    },
    weight: 0.10,
  },

  community_commitment: {
    dimension: 'community_commitment',
    description: 'Evidence of giving back to community, plans to create positive impact, and alignment with inVision U mission',
    levels: {
      1: 'No mention of community or giving back. Purely self-focused goals.',
      2: 'Vague mentions of wanting to help but no concrete examples or plans.',
      3: 'At least one example of community involvement. Some vision for future impact.',
      4: 'Clear track record of community service. Articulate plans for creating impact post-graduation.',
      5: 'Deep commitment to community evident through sustained action. Specific, actionable plans to bring knowledge back to their community. Vision aligned with inVision U values.',
    },
    weight: 0.15,
  },

  cognitive_capacity: {
    dimension: 'cognitive_capacity',
    description: 'Working memory, risk calibration, processing speed, and cognitive flexibility as measured by behavioral tasks',
    levels: {
      1: 'Below average working memory (digit span ≤ 4). Poor risk calibration in BART. Slow processing.',
      2: 'Below average on most cognitive measures. Digit span 5. Inconsistent BART performance.',
      3: 'Average cognitive performance. Digit span 6. Moderate risk calibration in BART.',
      4: 'Above average. Digit span 7+. Good risk-reward balance in BART. Quick processing.',
      5: 'Exceptional cognitive capacity. Digit span 8+. Optimal BART strategy. Fast and accurate.',
    },
    weight: 0.15,
  },
}

export function getRubricPrompt(dimension: Dimension): string {
  const rubric = RUBRICS[dimension]
  return `
## Scoring Dimension: ${rubric.dimension}
${rubric.description}

### Rubric (score 1-5):
1: ${rubric.levels[1]}
2: ${rubric.levels[2]}
3: ${rubric.levels[3]}
4: ${rubric.levels[4]}
5: ${rubric.levels[5]}

Instructions:
- First provide chain-of-thought reasoning about the candidate's response
- Then assign a score from 1-5 based STRICTLY on the rubric above
- List specific evidence from the response that supports your score
- Rate your confidence in this score from 0 to 1
`
}
