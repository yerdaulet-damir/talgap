<p align="center">
  <img src="https://img.shields.io/badge/talgap-010042?style=for-the-badge&logoColor=white&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjEwIi8+PHBhdGggZD0iTTggMTRzMS41IDIgNCAyIDQtMiA0LTIiLz48bGluZSB4MT0iOSIgeTE9IjkiIHgyPSI5LjAxIiB5Mj0iOSIvPjxsaW5lIHgxPSIxNSIgeTE9IjkiIHgyPSIxNS4wMSIgeTI9IjkiLz48L3N2Zz4=" alt="Talgap" height="40"/>
</p>

<h1 align="center">talgap</h1>

<h4 align="center">
  <b>See the person, not the application.</b>
</h4>

<p align="center">AI-powered multidimensional candidate assessment for university admissions.<br/>Games, scenarios, voice analysis — 15 minutes instead of essays that predict nothing.</p>

<p align="center">
  <a href="#-quick-start"><img src="https://img.shields.io/badge/get_started-010042?style=flat-square" alt="Get Started"/></a>
  <a href="#-how-it-works"><img src="https://img.shields.io/badge/how_it_works-555?style=flat-square" alt="How It Works"/></a>
  <a href="#-dimensions"><img src="https://img.shields.io/badge/7_dimensions-555?style=flat-square" alt="Dimensions"/></a>
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/tech_stack-555?style=flat-square" alt="Tech Stack"/></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js_16-black?style=flat-square&logo=next.js" alt="Next.js"/>
  <img src="https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Supabase-3FCF8E?style=flat-square&logo=supabase&logoColor=white" alt="Supabase"/>
  <img src="https://img.shields.io/badge/Gemini_2.5_Flash-4285F4?style=flat-square&logo=google&logoColor=white" alt="Gemini"/>
  <img src="https://img.shields.io/badge/Tailwind_v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind"/>
  <img src="https://img.shields.io/badge/$0_total_cost-22c55e?style=flat-square" alt="$0 Cost"/>
</p>

<br/>

<p align="center">
  <img src="https://img.shields.io/badge/Decentrathon_5.0-Team_Decentraton-010042?style=for-the-badge" alt="Decentrathon 5.0"/>
  <img src="https://img.shields.io/badge/inVision_U-Partner-white?style=for-the-badge" alt="inVision U"/>
</p>

---

## The Problem

Traditional university admissions are broken:

| Metric | Finding | Source |
|:---|:---|:---|
| **25%** | SAT/UNT explains only a quarter of variance in first-year success | Richardson et al., 2012 — 241 datasets |
| **61%** | False positive rate of AI essay detectors on non-native speakers | Stanford HAI |
| **0** | Incremental validity of personal statements over GPA | Murphy et al., 2009 |

Essays are gameable. Standardized tests are narrow. Neither sees the whole person.

---

## The Solution

**talgap** replaces essays and standardized tests with a 15-minute adaptive assessment that measures 7 research-backed dimensions through games, scenarios, and voice analysis.

```
Candidate opens link → 15 min assessment → AI scores 7 dimensions → Committee dashboard
```

Three gaps in the industry that we close:

> **Adaptive AI + Assessment** — Kira Talent does video interviews but isn't adaptive. Duolingo is adaptive but not for admissions. We combine both: adaptive difficulty via Duolingo CAT model with 0.90 reliability.

> **Game-based assessment for universities** — Pymetrics collects 12,000+ data points in 25 min for corporate hiring. BART and Digit Span are validated in 500+ neuroscience studies. Nobody has applied them to admissions — this is whitespace.

> **Effectuation SJT for entrepreneurs** — Codreanu, Ahmetoglu & Stephan published a validated SJT for entrepreneurial selection (Journal of Business Venturing, 2025). We're the first to deploy it in an admissions context.

---

## How It Works

The assessment takes **15 minutes** and consists of 5 modules:

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│   01 ── Structured Questions ─────────────────────── 3 min          │
│         UCAS-style focused prompts. Keystroke dynamics               │
│         and paste detection run in background.                       │
│                                                                     │
│   02 ── Situational Judgment Tests ───────────────── 5 min          │
│         Adaptive SJT scenarios from Kazakh context.                  │
│         Elo engine selects next scenario by response level.          │
│                                                                     │
│   03 ── BART (Balloon Game) ──────────────────────── 2 min          │
│         Balloon Analogue Risk Task. Measures risk tolerance          │
│         and impulsivity. Validated neuroscience paradigm.            │
│                                                                     │
│   04 ── Digit Span ───────────────────────────────── 2 min          │
│         Working memory — one of the strongest cognitive              │
│         predictors. Non-verbal, minimal cultural bias.               │
│                                                                     │
│   05 ── Voice Response ───────────────────────────── 3 min          │
│         Whisper transcribes, Parselmouth analyzes pitch              │
│         variability, speaking rate, filler words.                    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Dimensions

Every candidate is scored across **7 research-backed dimensions**:

| # | Dimension | Data Source | Research Basis |
|:-:|:---|:---|:---|
| 1 | **Resourcefulness** | SJT scenarios | Codreanu et al. 2025 — effectuation SJT |
| 2 | **Growth Trajectory** | Candidate questionnaire | Thiel Fellowship — "trajectory, not snapshot" |
| 3 | **Social Leadership** | SJT: team scenarios | Rauch & Frese — proactive personality ρ = .27 |
| 4 | **Creative Problem-Solving** | Open question + BART | Baron & Markman — social adaptability |
| 5 | **Authentic Voice** | Behavioral telemetry + voice | CodeSignal — suspicion score approach |
| 6 | **Community Commitment** | Post-graduation plans | inVision U core value |
| 7 | **Cognitive Capacity** | Digit Span + BART timing | Pymetrics — 91 traits from 12 games |

Each dimension is scored 1–5 with rubric-based evaluation, confidence intervals, and evidence citations.

---

## Scoring Engine

```
                    ┌─────────────┐
                    │  Raw Input  │
                    │  (text,     │
                    │   games,    │
                    │   voice)    │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │  Telemetry  │
                    │  Analysis   │
                    │  (keystrokes│
                    │   paste,    │
                    │   timing)   │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
       ┌──────▼──────┐ ┌──▼───┐ ┌──────▼──────┐
       │   Gemini    │ │ Groq │ │  DeepSeek   │
       │  2.5 Flash  │ │      │ │             │
       └──────┬──────┘ └──┬───┘ └──────┬──────┘
              │            │            │
              └────────────┼────────────┘
                           │
                    ┌──────▼──────┐
                    │  Weighted   │
                    │  Composite  │
                    │  Score 0-100│
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │  Dashboard  │
                    │  + Fairness │
                    │  Analysis   │
                    └─────────────┘
```

**Authenticity layer:** Keystroke dynamics, paste detection, tab-switch monitoring, and typing cadence analysis produce a suspicion score — flagging potential AI-generated or copy-pasted responses without blocking candidates.

---

## Dashboard

The admissions committee gets:

- **Candidate Table** — sortable by any dimension, overall score, or authenticity flag
- **Radar Chart** — visual 7-dimension profile for each candidate
- **Waterfall Chart** — score decomposition showing how each dimension contributes
- **Candidate Comparison** — side-by-side dimension analysis
- **Fairness Panel** — bias detection across demographic groups

---

## Quick Start

```bash
# Clone the repository
git clone https://github.com/decentraton/talgap.git
cd talgap

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Supabase and Gemini API keys

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the landing page.

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
GEMINI_API_KEY=your_gemini_key
```

### Scripts

| Command | Description |
|:---|:---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run test` | Run Vitest tests |
| `npm run test:watch` | Run tests in watch mode |

---

## Tech Stack

| Layer | Technology | Why |
|:---|:---|:---|
| **Framework** | Next.js 16 + React 19 | App Router, Server Components, RSC streaming |
| **Styling** | Tailwind CSS v4 + shadcn/ui | Utility-first with accessible component primitives |
| **Database** | Supabase (PostgreSQL) | Auth, storage, real-time — all on free tier |
| **AI Scoring** | Gemini 2.5 Flash | Structured output, fast, generous free tier |
| **LLM Fallbacks** | Groq, DeepSeek | Multi-provider resilience |
| **Charts** | Recharts + Plotly.js | Radar charts, waterfall decomposition |
| **Flow Diagrams** | XYFlow (React Flow) | Assessment flow visualization |
| **Animation** | Framer Motion | Page transitions, micro-interactions |
| **Voice** | WaveSurfer.js | Audio recording and waveform display |
| **Validation** | Zod | Runtime type safety for LLM outputs |
| **Testing** | Vitest + Testing Library | Unit and component tests |

---

## Inspiration

<table>
  <tr>
    <td align="center" width="25%">
      <b>Minerva University</b><br/>
      <code>3.6% acceptance</code><br/>
      <sub>Test-blind admissions</sub>
    </td>
    <td align="center" width="25%">
      <b>Y Combinator</b><br/>
      <code>1–2% acceptance</code><br/>
      <sub>Determination > intelligence</sub>
    </td>
    <td align="center" width="25%">
      <b>Thiel Fellowship</b><br/>
      <code>$100B+ alumni</code><br/>
      <sub>Buterin, Field, et al.</sub>
    </td>
    <td align="center" width="25%">
      <b>Duolingo CAT</b><br/>
      <code>0.90 reliability</code><br/>
      <sub>Adaptive test-retest</sub>
    </td>
  </tr>
</table>

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── assess/          # Assessment submission endpoint
│   │   └── score/           # AI scoring endpoint
│   ├── assess/[sessionId]/  # Candidate assessment flow
│   ├── dashboard/           # Committee dashboard
│   │   ├── candidate/[id]/  # Individual candidate view
│   │   ├── compare/         # Side-by-side comparison
│   │   └── fairness/        # Bias analysis panel
│   └── page.tsx             # Landing page
├── components/
│   ├── assess/              # Assessment modules (BART, Digit Span, SJT, Voice)
│   ├── dashboard/           # Dashboard components (Radar, Waterfall, Table)
│   └── ui/                  # shadcn/ui primitives
└── lib/
    ├── assessment/          # Types, scenarios, telemetry
    ├── llm/                 # Multi-provider LLM abstraction
    ├── scoring/             # Rubrics, adaptive engine, types
    └── supabase/            # Database client
```

---

## Research References

<details>
<summary><b>Click to expand full bibliography</b></summary>

- Richardson, M., Abraham, C., & Bond, R. (2012). Psychological correlates of university students' academic performance: A systematic review and meta-analysis. *Psychological Bulletin*, 138(2), 353–387.
- Liang, W. et al. (2023). GPT detectors are biased against non-native English writers. *Stanford HAI*.
- Murphy, S. C. et al. (2009). The predictive validity of personal statements in admissions. *Medical Education*, 43(12), 1173–1177.
- Codreanu, D., Ahmetoglu, G., & Stephan, U. (2025). Situational judgment tests for entrepreneurial selection. *Journal of Business Venturing*, 40(1).
- Lejuez, C. W. et al. (2002). Evaluation of a behavioral measure of risk taking: The Balloon Analogue Risk Task (BART). *Journal of Experimental Psychology: Applied*, 8(2), 75–84.
- Rauch, A., & Frese, M. (2007). Let's put the person back into entrepreneurship research. *European Journal of Work and Organizational Psychology*, 16(4), 353–385.

</details>

---

<p align="center">
  <b>Built with conviction by Team Decentraton</b><br/>
  <sub>Decentrathon 5.0 &middot; inVision U &middot; $0 total infrastructure cost</sub>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-010042?style=flat-square" alt="License"/>
  <img src="https://img.shields.io/badge/PRs-welcome-22c55e?style=flat-square" alt="PRs Welcome"/>
</p>
