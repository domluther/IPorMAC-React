# 🎓 GCSE CS Reusable Component Library

A comprehensive set of reusable React components for creating consistent GCSE Computer Science practice sites. Built with React, TypeScript, Tailwind CSS, and shadcn/ui.

## 🚀 Quick Start

### 1. Basic Site Setup

```tsx
import { QuizLayout } from "@/components/QuizLayout";
import { getSiteConfig, detectCurrentSite } from "@/lib/siteConfig";

export function MyQuizSite() {
  const siteConfig = getSiteConfig("my-site-key");
  
  return (
    <QuizLayout
      title={siteConfig.title}
      subtitle={siteConfig.subtitle}
      titleIcon={siteConfig.icon}
    >
      {/* Your quiz content here */}
    </QuizLayout>
  );
}
```

### 2. Full Quiz Implementation

```tsx
import { QuizFramework } from "@/components/QuizFramework";
import { StatsModal } from "@/components/StatsModal";
import { ScoreManager } from "@/lib/scoreManager";

// See examples/NumberSystemsQuiz.tsx for complete example
```

## 📦 Components

### Core Layout Components

#### `QuizLayout`
Main layout wrapper providing consistent header, navigation, and structure.

**Props:**
- `title: string` - Site title
- `subtitle: string` - Site description  
- `titleIcon?: string` - Icon/emoji (default: "🎓")
- `scoreButton?: ReactNode` - Score button component
- `children: ReactNode` - Main content

#### `Header`
Configurable header with responsive typography and score button positioning.

**Props:**
- `title?: string` - Header title
- `subtitle?: string` - Header subtitle
- `scoreButton?: ReactNode` - Score button component

### Interactive Components

#### `QuizFramework<T>`
Generic quiz framework handling questions, answers, feedback, and keyboard shortcuts.

**Props:**
- `question: QuizQuestion<T>` - Current question data
- `answers: QuizAnswer[]` - Answer options
- `questionRenderer: (content: T) => ReactNode` - Custom question renderer
- `onAnswerSelect: (answerId: number) => void` - Answer selection handler
- `onNextQuestion: () => void` - Next question handler
- `feedback?: FeedbackState` - Answer feedback
- `streak?: number` - Current streak count
- `hintPanel?: ReactNode` - Optional hints
- `showHints?: boolean` - Hint visibility
- `onToggleHints?: () => void` - Toggle hints

**Features:**
- ✅ Keyboard shortcuts (1-9 for answers, Enter/Space for next)
- ✅ Automatic feedback display
- ✅ Streak tracking
- ✅ Responsive design
- ✅ Loading states

#### `StatsModal`
Comprehensive statistics modal showing progress, levels, and breakdowns.

**Props:**
- `isOpen: boolean` - Modal visibility
- `onClose: () => void` - Close handler
- `scoreManager: ScoreManager` - Score manager instance
- `title?: string` - Modal title
- `headerIcon?: string` - Header icon

**Features:**
- ✅ Level progression display
- ✅ Overall statistics grid
- ✅ Category-wise breakdown
- ✅ Progress bars and visual feedback
- ✅ Reset scores functionality

### Navigation Components

#### `SiteNavigationV2`
Enhanced navigation using shadcn/ui dropdown with responsive design.

**Props:**
- `menuItems: NavMenuItem[]` - Navigation menu items
- `currentSiteId?: string` - Current site identifier
- `title?: string` - Navigation title
- `icon?: string` - Navigation icon
- `compact?: boolean` - Compact mode

### Utility Components

#### `ScoreButton`
Responsive score display button (already existing).

**Props:**
- `levelEmoji: string` - Level emoji
- `levelTitle: string` - Level title
- `points: number` - Current points
- `onClick?: () => void` - Click handler

## 🔧 Configuration System

### Site Configuration

Create consistent site configurations using the `SiteConfig` interface:

```tsx
import { SITE_CONFIGS, getSiteConfig, detectCurrentSite } from "@/lib/siteConfig";

// Get config for current site
const currentSite = detectCurrentSite();
const config = getSiteConfig(currentSite);

// Define custom site
const customSite: SiteConfig = {
  siteKey: "my-quiz",
  title: "My Quiz Site",
  subtitle: "Learn something awesome",
  icon: "🧠",
  primaryColor: "blue",
  scoring: {
    pointsPerCorrect: 10,
    pointsPerIncorrect: -2,
  }
};
```

### Score Management

The `ScoreManager` class handles all scoring logic:

```tsx
import { ScoreManager } from "@/lib/scoreManager";

const scoreManager = new ScoreManager("my-site-key");

// Record scores
scoreManager.recordScore("question-1", 100, 100, "category-1");

// Get statistics
const stats = scoreManager.getOverallStats();
const breakdown = scoreManager.getScoresByType();

// Manage streaks
scoreManager.updateStreak(isCorrect);
const currentStreak = scoreManager.getStreak();
```

## 🎨 Styling & Theming

### Consistent Design System

All components use:
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** for base components
- **Consistent color palette** (indigo/purple gradients)
- **Responsive breakpoints** (sm:, xl: breakpoints)
- **Animation classes** for smooth interactions

### Custom Animations

Available animation classes:
- `animate-gentle-bounce` - Subtle bounce effect
- `text-shadow` - Text shadow utility
- Gradient backgrounds for visual appeal

## 🎯 Best Practices

### 1. Component Composition

```tsx
// ✅ Good: Compose reusable components
<QuizLayout title="My Quiz" subtitle="Learn stuff">
  <QuizFramework
    question={question}
    answers={answers}
    questionRenderer={CustomRenderer}
    onAnswerSelect={handleAnswer}
  />
</QuizLayout>

// ❌ Avoid: Building everything from scratch
```

### 2. Type Safety

```tsx
// ✅ Good: Define question types
interface MyQuestionType {
  content: string;
  difficulty: "easy" | "medium" | "hard";
}

<QuizFramework<MyQuestionType>
  questionRenderer={(content) => <div>{content.content}</div>}
/>
```

### 3. Configuration-Driven

```tsx
// ✅ Good: Use site configuration
const config = getSiteConfig("my-site");

// ❌ Avoid: Hardcoded values
const title = "Hardcoded Title";
```

## 📱 Responsive Design

All components are fully responsive:
- **Mobile-first** approach
- **Hamburger navigation** on smaller screens
- **Compact score display** on mobile
- **Touch-friendly** interactions
- **Readable typography** at all sizes

## ⌨️ Keyboard Shortcuts

Built-in keyboard support:
- **1-9**: Select answers
- **Enter/Space**: Next question
- **H**: Toggle hints
- **Escape**: Close modals

## 🔄 Migration Guide

### From Legacy Components

1. **Replace custom layout** with `QuizLayout`
2. **Use `QuizFramework`** instead of custom quiz logic
3. **Switch to `StatsModal`** for statistics
4. **Update site config** using the configuration system

### Example Migration

```tsx
// Before (legacy)
<div className="min-h-screen">
  <Header scoreButton={<ScoreButton />} />
  <main>
    {/* Custom quiz logic */}
  </main>
</div>

// After (reusable)
<QuizLayout 
  title="Quiz" 
  subtitle="Description"
  scoreButton={<ScoreButton />}
>
  <QuizFramework 
    question={question}
    answers={answers}
    // ... other props
  />
</QuizLayout>
```

## 📊 Performance

- **Lazy loading** for heavy components
- **Efficient re-renders** with proper state management
- **Minimal bundle size** with tree-shaking
- **Fast development** with Vite HMR

## 🧪 Testing

Components are designed for testability:
- **Clear prop interfaces**
- **Predictable behavior**
- **Accessible markup**
- **Keyboard navigation**

## 🚀 Deployment

Each site can be deployed independently while sharing the component library:
- **Shared components** via npm package or monorepo
- **Site-specific configurations**
- **Independent deployments**
- **Consistent user experience**

---

## 🎉 Getting Started

1. Copy the reusable components to your project
2. Configure your site in `siteConfig.ts`
3. Implement your question renderer
4. Add custom scoring logic
5. Deploy your GCSE CS practice site!

See `examples/NumberSystemsQuiz.tsx` for a complete implementation example.
