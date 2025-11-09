# AI Chatbot Design Guidelines

## Design Approach
**Reference-Based**: Drawing inspiration from ChatGPT, Linear, and Discord's minimal chat interfaces, optimized for the user's specified **black and white dark mode aesthetic**.

## Core Design Principles
1. **Minimal Monochrome**: Strict black and white palette with gray scale variations for depth and hierarchy
2. **Focus on Content**: Chat messages are the hero - UI chrome stays minimal and unobtrusive
3. **High Contrast**: Ensure excellent readability with strong contrast ratios throughout
4. **Conversational Flow**: Natural reading experience with clear visual distinction between user and AI messages

---

## Typography System

**Font Family**: Inter or SF Pro Display via Google Fonts CDN

**Hierarchy**:
- Chat messages: 15px (base), font-weight: 400
- User input: 15px, font-weight: 400
- Timestamps: 12px, font-weight: 400, reduced opacity
- System messages: 13px, font-weight: 500
- Header/title: 18px, font-weight: 600

---

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 3, 4, 6, and 8 consistently
- Message padding: p-4
- Container gaps: gap-3 or gap-4
- Section spacing: py-6 or py-8
- Input padding: p-3

**Structure**:
- Full viewport height layout (h-screen)
- Fixed header (if included): 60px height
- Scrollable message area: flex-1 with overflow-y-auto
- Fixed input bar at bottom: 80px height
- Max content width: max-w-4xl centered (messages shouldn't span full ultra-wide screens)

---

## Component Library

### 1. Message Bubbles
**User Messages** (right-aligned):
- Max-width: 75% of container
- Border radius: rounded-2xl with squared bottom-right corner (rounded-br-sm)
- Padding: px-4 py-3
- Margin: mb-3

**AI Messages** (left-aligned):
- Max-width: 85% of container (AI can be more verbose)
- Border radius: rounded-2xl with squared bottom-left corner (rounded-bl-sm)
- Padding: px-4 py-3
- Margin: mb-3
- Avatar/icon: 32x32px circle positioned to the left

**Message Metadata**:
- Timestamp: Small text below bubble, 8px margin
- Typing indicator: Three animated dots, 6px each, 4px gap between

### 2. Input Area
- Textarea (auto-expanding, max 5 lines)
- Send button: 40x40px icon button, positioned absolute right
- Border: 1px subtle border on container
- Padding: p-3
- Border radius: rounded-xl
- Shadow: Subtle shadow for depth (shadow-sm)

### 3. Header Bar
- Height: 60px
- Title: "AI Chat" or similar, centered or left-aligned
- Clear chat button: Icon button, right-aligned
- Border bottom: 1px subtle divider

### 4. Empty State
- Centered vertically and horizontally in message area
- Icon: 64x64px chat/robot icon
- Heading: "Start a conversation"
- Subtext: "Ask me anything..."
- Spacing: gap-4 between elements

### 5. System Messages
- Centered text in message area
- Reduced opacity (60-70%)
- Small text (13px)
- Padding: py-2

---

## Interaction Patterns

**Message Entry**:
- Auto-scroll to bottom on new messages
- Smooth scroll behavior
- Enter to send, Shift+Enter for new line

**Loading States**:
- Typing indicator for AI responses (animated dots)
- Disable input while waiting for response
- Subtle pulse on send button during processing

**Error Handling**:
- Toast notifications at top of viewport
- 4-second auto-dismiss
- Error icon + message text

**Animations**: 
- Message appearance: Fade-in with slight slide-up (200ms)
- Typing indicator: Pulsing dots
- NO other animations to keep performance optimal

---

## Accessibility
- Clear focus states on input and buttons (2px outline)
- Semantic HTML (main, section, button)
- ARIA labels for icon-only buttons
- Keyboard navigation support
- High contrast ratios (minimum 4.5:1 for text)

---

## Icons
**Library**: Heroicons (via CDN)
- Send: paper-airplane
- Clear chat: trash
- User avatar: user-circle
- AI avatar: sparkles or cpu-chip
- Error: exclamation-circle

---

## Images
No hero images or decorative imagery required. This is a utility-focused chat interface where the conversation IS the content.