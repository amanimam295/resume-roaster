# 🔥 Resume Roaster

> Upload a resume. Get roasted. Then get an actual rewrite.

Resume Roaster is a single-process web app that takes a résumé (PDF upload, `.txt` upload, or pasted text), sends it to an AI critic, and returns a brutally funny — but **specific and fair** — roast: a score, a savage headline, line-by-line roast points, a no-jokes "real talk" assessment, and concrete rewrite suggestions you can actually use.

The roast targets the **writing and presentation** — weak verbs, vague impact, no numbers, buzzword soup — never the person.

---

## 🎯 Why This Exists

Normal resume feedback falls into two buckets: **generic** ("use more action verbs!") or **expensive and slow** (career coaches, workshops, long waits). Resume Roaster gives specific, quoted, actionable feedback in seconds, for free.

The roast is the hook — the diagnosis and rewrites are the payload:

1. **A score + savage headline** — instant, attention-grabbing verdict
2. **Roast points** — jokes anchored to *your actual text* (a quote or section, then the critique)
3. **"Real talk"** — a serious, joke-free summary of your single biggest problem
4. **Rewrite suggestions** — concrete fixes, including before/after bullet examples

---

## 🎓 How It Helps Students

Students are the perfect audience because they have the exact failure modes the roaster targets:

- **Vague, unquantified bullets** — "worked on a project," "helped organize an event." The roaster quotes the line and asks *what, how much, what result* — feedback that sticks because it points at *your* words.
- **Buzzword stuffing** — "detail-oriented team player" with zero evidence. It catches that.
- **No career-coach access** — career centers have limited slots and long waits; this is on-demand and repeatable.
- **A gamified feedback loop** — the 0–100 score lets students edit → re-roast → watch the score climb. Iteration becomes fun instead of a chore, which is how the skill ("every bullet needs a number") actually gets learned.
- **Teaches by example** — before/after rewrite suggestions show the *pattern* for fixing bullets, so students generalize it beyond the lines that were roasted.
- **Harsh but safe** — the prompt forbids mocking things a person can't change (name, school, background) and roasts only the writing. The "real talk" section ensures there's genuine advice under the jokes.
- **Works on the real artifact** — you upload the actual PDF you'd send to a recruiter, not a rewritten approximation.

Bonus: the codebase itself is a compact, readable example of wiring an LLM API into a real app — file uploads, prompt design, forcing structured JSON output, and guardrails against prompt injection — with zero build-step complexity.

---

## ✨ Features

- 📎 **Three ways in** — drag & drop a PDF, choose a `.txt` file, or just paste the text
- 🎯 **Specific, not generic** — the AI must anchor every joke to a real excerpt or section from *your* resume
- 📊 **A 0–100 score** plus a one-line verdict headline
- 🃏 **Cue-card roast points** — 3–6 critiques, each quoting what it's roasting
- 🧊 **"Real talk" section** — an honest, joke-free summary of your biggest issue
- 🛠️ **Rewrite suggestions** — 3–5 actionable fixes, including before/after bullet examples
- 🎭 **Zero build step** — plain HTML/CSS/JS frontend served by the same Express server

---

## 🧱 Tech Stack

| Layer     | Tech                                                          |
| --------- | ------------------------------------------------------------- |
| Backend   | Node.js + Express, `multer` (uploads), `pdf-parse` (PDF text) |
| Frontend  | Vanilla HTML / CSS / JS — no framework, no bundler            |
| AI        | Google Gemini API (`gemini-3.6-flash`, JSON mode)             |
| Config    | `dotenv`                                                      |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (the server uses the built-in `fetch`)
- A [Google Gemini API key](https://aistudio.google.com/apikey) (free tier available)

### Install & run

```bash
# 1. Install dependencies
npm install

# 2. Create your env file
cp .env.example .env

# 3. Edit .env and paste in your key
#    GEMINI_API_KEY=... (get one at aistudio.google.com/apikey)

# 4. Start the server
npm start
```

Then open **http://localhost:3000**.

For development with auto-restart on file changes:

```bash
npm run dev
```

### Environment variables

| Variable            | Required | Default | Description                  |
| ------------------- | -------- | ------- | ---------------------------- |
| `GEMINI_API_KEY` | ✅ yes   | —       | Your Google Gemini API key   |
| `PORT`              | no       | `3000`  | Port the server listens on   |

> ⚠️ Without `GEMINI_API_KEY` the server still boots (and the UI loads fine), but `/api/roast` returns a clear error message.

---

## 🎬 How It Works

1. The frontend posts to `POST /api/roast` — either a `resume` file via `multipart/form-data` or raw pasted text as JSON.
2. The server extracts plain text (PDFs go through `pdf-parse`; everything else is read as UTF-8).
3. The text (capped at ~12,000 characters) is wrapped in a prompt that demands **strict JSON** back and instructs the model to treat the resume as *data, not instructions*.
4. The server parses the model's JSON response and returns it; the frontend renders it as score, headline, cue cards, real talk, and rewrite tips.

### API endpoints

| Method | Path          | Description                                                      |
| ------ | ------------- | ---------------------------------------------------------------- |
| `POST` | `/api/roast`  | Roast a resume. Accepts a `resume` file **or** `{ "text": ... }` |
| `GET`  | `/api/health` | Health check — returns `{ "ok": true }`                          |

**Example response:**

```json
{
  "score": 42,
  "headline": "This resume has 'detail-oriented' in it. It does not have a single number in it.",
  "roast_points": [
    { "quote_or_area": "Work experience", "roast": "..." },
    { "quote_or_area": "Skills section", "roast": "..." }
  ],
  "real_talk": "...",
  "rewrite_suggestions": ["..."]
}
```

---

## 📁 Project Structure

```
resume-roaster/
├── server.js          # Express app, /api/roast route, prompt + Gemini call
├── package.json
├── .env.example       # Template for GEMINI_API_KEY / PORT
└── public/            # Frontend (served statically)
    ├── index.html     # Single-page UI: hero, dropzone, results
    ├── style.css      # Stage-light "comedy club" theme
    └── app.js         # File drop/paste handling, fetch, rendering
```

---

## 📏 Limits & Guardrails

- **Upload size:** max **5 MB** per file
- **Accepted types:** `.pdf` and `.txt` (server treats any non-PDF as plain text)
- **Minimum text:** at least ~40 characters of resume content
- **Prompt injection:** the prompt explicitly tells the model to treat resume content strictly as data to critique — even if it contains text that looks like commands
- **Fair roasting:** the model is instructed to never invent facts about the person and never mock things they can't change (name, school, age, hardship gaps)

---

## 💡 Ideas for the Future

- 🖼️ "Share my roast" image export
- 🌶️ Roast-intensity slider — mild / medium / no mercy
- ⚖️ Side-by-side comparison of two resume versions
