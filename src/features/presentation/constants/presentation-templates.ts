export const PRESENTATION_TEMPLATES = [
  {
    id: 'pitch-deck',
    label: 'Startup Pitch Deck',
    content:
      'Create a compelling pitch deck for a startup that solves a real-world problem. Include problem statement, solution, market opportunity, business model, traction, team, and funding ask.',
    slides: 10,
    style: 'minimal',
    tone: 'persuasive',
    layout: 'balanced',
  },
  {
    id: 'quarterly-review',
    label: 'Q2 Review',
    content:
      'Quarterly business review covering key metrics, achievements, challenges, and goals for the next quarter. Include revenue growth, user acquisition, product milestones, and team updates.',
    slides: 12,
    style: 'professional',
    tone: 'formal',
    layout: 'text-heavy',
  },
  {
    id: 'product-launch',
    label: 'Product Launch',
    content:
      'Announce a new product launch with key features, benefits, target audience, pricing, and go-to-market strategy. Highlight what makes this product unique.',
    slides: 8,
    style: 'creative',
    tone: 'persuasive',
    layout: 'visual',
  },
  {
    id: 'team-intro',
    label: 'Team Introduction',
    content:
      'Introduce the core team members, their backgrounds, expertise, and roles. Highlight key achievements and what each person brings to the table.',
    slides: 6,
    style: 'bold',
    tone: 'casual',
    layout: 'balanced',
  },
  {
    id: 'annual-report',
    label: 'Annual Report',
    content:
      'Comprehensive annual report covering financial performance, strategic initiatives, ESG goals, and future outlook. Include key charts and milestones.',
    slides: 15,
    style: 'professional',
    tone: 'formal',
    layout: 'text-heavy',
  },
] as const
