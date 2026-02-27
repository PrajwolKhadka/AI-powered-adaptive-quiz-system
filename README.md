# 🚀 Adaptive Quiz System with AI Feedback

An intelligent examination platform that leverages **Item Response Theory (IRT)** to dynamically adjust question difficulty based on student performance and provides personalized AI-generated feedback upon completion.

---

## Key Features

### Adaptive Testing (IRT-lite)
- Uses a **sigmoid-based probability function** to select the next best question.
- Keeps the quiz challenging but not discouraging.
- Dynamically adapts based on student performance.

### Dynamic Difficulty Scaling
- Weighted performance: Recent answers carry more importance than older ones.
- Tracks the student’s current learning state.
- Automatically adjusts difficulty based on performance trends.

###  Bias Correction
- Detects streaks of correct/incorrect answers.
- Triggers easier or harder questions accordingly.

### AI-Powered Feedback
- Integrated with **Google Gemini (AIFeedbackService)**.
- Analyzes:
  - Weak subjects
  - Accuracy patterns
  - Time spent per question
- Generates actionable study recommendations in natural language.

### Session Management
- Maintains a consistent question pool per student.
- Prevents duplicate submissions.
- Ensures clean statistical tracking.

### Time Tracking
- Tracks response time per question.
- Includes average time in final performance evaluation.

---

## Adaptive Algorithm

The core logic is implemented inside `getNextQuestion()`.

### Mathematical Model

The system calculates probability using:

\[
P(\text{correct}) = \frac{1}{1 + e^{-(-3D + 4U + 2R)}}
\]

Where:

| Variable | Meaning |
|----------|----------|
| **U** | Weighted historical user accuracy |
| **R** | Recent accuracy (last 5 questions) |
| **D** | Question difficulty |

### Question Selection Strategy

- Compute probability for all candidate questions.
- Select the question where:
P(correct) ≈ 0.7

This creates a **Goldilocks zone**:
- Not too easy   
- Not too hard 
- Optimally challenging 

---

## 🛠 Tech Stack

- **Backend:** Node.js + TypeScript  
- **Database:** MongoDB (Mongoose)  
- **AI Integration:** Google Gemini API  
- **Architecture:** Repository Pattern + DTOs  

---

## Project Structure (Service Layer)

### `StudentQuizService.ts`

Core functions:

- `submitAnswer()`  
  → Validates and stores student responses.

- `getNextQuestion()`  
  → The "brain" of the system.  
  → Calculates IRT scores and selects the best question.

- `deduplicateAnswers()`  
  → Ensures statistics remain accurate across repeated sessions.

- `aiService`  
  → Generates performance feedback based on:
  - Weak subjects
  - Accuracy
  - Time performance

---

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB instance
- Google Gemini API Key

---

### Installation

Clone the repository:

```bash
git clone https://github.com/PrajwolKhadka/AI-powered-adaptive-quiz-system.git

npm install

PORT=3000
MONGO_URI=mongodb://localhost:27017/quizdb
AI_API_KEY=your_gemini_key_here

npm run dev


