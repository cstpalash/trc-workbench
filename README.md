# TRC Workbench - Technology Risk and Control Dashboard

A modern, configurable dashboard for Technology Risk and Control management in Cloud Foundational Services. Built with React, TypeScript, and Next.js, featuring drag-and-drop widgets, comprehensive event management, and professional UI design.

![TRC Workbench](https://img.shields.io/badge/TRC-Workbench-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![React](https://img.shields.io/badge/React-18.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC)

## 🚀 Features

### 📊 Dashboard Management
- **Configurable Widget System**: Drag-and-drop widgets with resize capabilities
- **Personalized Layouts**: Save and switch between multiple dashboard layouts
- **Grid-based Positioning**: Professional grid system with snap-to-grid functionality
- **Real-time State Management**: Powered by Zustand with persistent storage

### 📅 TRC Calendar Widget
- **Event Management**: Create, edit, and delete TRC events
- **Multiple Event Types**:
  - Internal Audits
  - Horizontal Audits
  - Regulatory Audits
  - Recertifications
  - CORE Issues
  - Compliance Reviews
  - Risk Assessments

### 🎨 Professional UI Design
- **Modern Design**: Clean, vibrant, and professional interface
- **Responsive Layout**: Works seamlessly across desktop and tablet devices
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation
- **Dark/Light Theme**: Automatic theme detection with manual override

### 🔧 Admin Features
- **Event Templates**: Quick-start templates for common event types
- **Bulk Operations**: Manage multiple events efficiently
- **Advanced Filtering**: Filter by event type, priority, status, and date ranges
- **Export Capabilities**: Export event data and calendar views

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS with custom animations
- **State Management**: Zustand with persistence
- **Drag & Drop**: @dnd-kit
- **Calendar**: react-big-calendar with date-fns
- **UI Components**: Headless UI with Heroicons
- **Testing**: Jest + React Testing Library
- **Type Safety**: Full TypeScript coverage

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles and animations
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Main dashboard page
├── components/            # React components
│   ├── dashboard/         # Dashboard layout components
│   │   ├── DashboardLayout.tsx
│   │   ├── DashboardToolbar.tsx
│   │   └── DraggableWidget.tsx
│   ├── widgets/           # Widget components
│   │   ├── TRCCalendarWidget.tsx
│   │   ├── WidgetContainer.tsx
│   │   ├── EventModal.tsx
│   │   └── AddEventModal.tsx
│   └── ui/                # Reusable UI components
├── stores/                # Zustand state management
│   ├── dashboardStore.ts  # Dashboard state and layout management
│   └── eventsStore.ts     # Events data management
├── types/                 # TypeScript type definitions
│   └── index.ts          # Core types and interfaces
├── lib/                   # Utility functions and configurations
│   ├── utils.ts          # Utility functions
│   └── theme.ts          # Theme configuration
└── __tests__/            # Test files
    └── TRCCalendarWidget.test.tsx
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd trc-workbench
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Start development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. **Open in browser**
Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## 🧪 Testing

### Run Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Coverage
- **Unit Tests**: Individual component testing
- **Integration Tests**: Widget interaction testing
- **Accessibility Tests**: WCAG compliance verification
- **User Interaction Tests**: Complete user workflows

## 📖 Usage Guide

### Dashboard Management

#### Edit Mode
1. Click the "Edit Layout" button in the toolbar
2. Drag widgets to reposition them
3. Click widget settings to configure properties
4. Use resize handles to adjust widget dimensions
5. Click "Exit Edit" to save changes

#### Layout Management
- **Create Layout**: Use "Duplicate" to create layout variations
- **Switch Layouts**: Use the layout dropdown in the toolbar
- **Default Layout**: Mark frequently used layouts as default

### Event Management

#### Creating Events
1. **Quick Add**: Click "Add Event" button
2. **Calendar Add**: Click on any calendar date/time slot
3. **Templates**: Use pre-configured event templates

#### Event Types and Priorities
- **Critical Priority**: Immediate attention required
- **High Priority**: Important, scheduled attention
- **Medium Priority**: Standard operational events
- **Low Priority**: Routine maintenance/reviews

#### Event Workflows
- **Scheduled** → **In Progress** → **Completed**
- **Overdue** status for missed deadlines
- **Cancelled** for discontinued events

## 🔧 Configuration

### Widget Configuration
Each widget supports configuration through the `config` prop:

```typescript
// TRC Calendar Widget Configuration
{
  view: 'month' | 'week' | 'day' | 'agenda',
  showEventTypes: EventType[],
  enableAdmin: boolean,
  filters: {
    priority: EventPriority[],
    status: EventStatus[]
  }
}
```

### Theme Customization
Modify `src/lib/theme.ts` to customize:
- Color schemes
- Event type colors
- Priority indicators
- Animation settings

### Store Persistence
Dashboard layouts and user preferences are automatically saved to localStorage:
- Dashboard layouts and active layout
- Event data (in production, this should connect to a backend API)
- User preferences and settings

## 🔒 Security & Compliance

- **Type Safety**: Full TypeScript coverage prevents runtime errors
- **Input Validation**: All forms include validation and error handling
- **XSS Prevention**: Proper sanitization of user inputs
- **Accessibility**: WCAG 2.1 AA compliance
- **Data Privacy**: Local storage with optional backend integration

## 🚀 Production Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables
Create `.env.local` for environment-specific configuration:
```
NEXT_PUBLIC_API_URL=your-api-endpoint
NEXT_PUBLIC_ENVIRONMENT=production
```

### Deployment Platforms
- **Vercel** (Recommended): Zero-config deployment
- **Netlify**: Static site deployment
- **AWS**: S3 + CloudFront
- **Docker**: Containerized deployment

## 🤝 Contributing

### Development Guidelines
1. **Code Quality**: ESLint + Prettier configuration
2. **Testing**: Maintain test coverage above 80%
3. **Type Safety**: All new code must be TypeScript
4. **Accessibility**: Test with screen readers
5. **Performance**: Optimize for Core Web Vitals

### Pull Request Process
1. Create feature branch from `main`
2. Add tests for new functionality
3. Update documentation
4. Ensure all checks pass
5. Request code review

## 📝 API Integration

The application is designed to work with a backend API. To integrate:

1. **Update Event Store**: Replace mock data with API calls
2. **Authentication**: Add auth provider to layout
3. **Real-time Updates**: Implement WebSocket connections
4. **Error Handling**: Add global error boundaries

Example API integration:
```typescript
// In eventsStore.ts
const addEvent = async (event: Omit<TRCEvent, 'id'>) => {
  const response = await fetch('/api/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event)
  });
  // Handle response and update state
};
```

## 📞 Support

For questions, issues, or feature requests:
- **Documentation**: Check the inline code documentation
- **Issues**: Create GitHub issue with reproduction steps
- **Discussions**: Use GitHub discussions for questions

## 📄 License

This project is licensed under the MIT License. See LICENSE file for details.

---

**TRC Workbench** - Professional Technology Risk and Control Management Dashboard

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
