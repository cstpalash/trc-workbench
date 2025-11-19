# 🚀 TRC Workbench

A comprehensive Technology Risk and Control (TRC) workbench built with Next.js 16, featuring configurable widgets, advanced event management, and entity association capabilities.

![Next.js](https://img.shields.io/badge/Next.js-16.0.3-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![React](https://img.shields.io/badge/React-18-61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.0-38B2AC)

## ✨ Features

### 🎯 Core Capabilities
- **Dashboard Management**: Configurable widget layouts with drag-and-drop functionality
- **TRC Calendar**: Full-featured calendar for audit events, recertifications, and CORE issues
- **Entity Association**: Advanced entity management with hierarchical relationships
- **Team Assignment**: Visual team member assignment with photos and role-based organization
- **Professional UI**: Modern, responsive design with animations and accessibility features

### 📋 Event Management
- **Event Types**: Internal/Horizontal/Regulatory Audits, Recertifications, CORE Issues, Compliance Reviews
- **Priority Levels**: Critical, High, Medium, Low with visual indicators
- **Status Tracking**: Scheduled, In Progress, Completed, Cancelled, Overdue
- **Team Assignment**: Role-based assignment (TRC, PSL, Product Lead, AO)
- **Entity Association**: Link events to platforms and products with type categorization

### 🏗️ Entity System
- **Platforms**: Atlas Core, Atlas Marketplace
- **Products**: AWS services categorized by type
  - **Storage**: Aurora MySQL, Aurora Postgres, S3
  - **Compute**: EC2, ECS
- **Type Tags**: Visual categorization for better organization
- **Hierarchical Support**: Extensible structure for complex relationships

### 👥 User Management
- **Role-Based Access**: TRC Admin, TRC Manager, Auditor, Viewer roles
- **Persona System**: TRC, PSL, Product Lead, AO, CFS Leadership
- **Permission Control**: Granular permissions for different operations
- **User Switching**: Easy persona switching for testing and demo

## 🛠️ Technology Stack

- **Framework**: Next.js 16 with App Router and Turbopack
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS with custom theme system
- **State Management**: Zustand with persistence
- **UI Components**: Headless UI for accessibility
- **Icons**: Heroicons for consistent iconography
- **Testing**: Jest + React Testing Library
- **Calendar**: FullCalendar integration with custom styling

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/cstpalash/trc-workbench.git
   cd trc-workbench
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### Build for Production

```bash
npm run build
npm start
```

### Run Tests

```bash
npm test
npm run test:watch
```

## 📸 Screenshots

### Dashboard Overview
Modern, responsive dashboard with configurable widgets and drag-and-drop layout management.

### TRC Calendar
Full-featured calendar with event management, filtering, and visual indicators for different event types and priorities.

### Entity Association
Advanced entity management system with platforms, products, and type categorization for comprehensive event tracking.

### Team Assignment
Visual team member assignment with user photos, role-based organization, and intuitive selection interface.

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js app router
├── components/            
│   ├── dashboard/         # Dashboard layout components
│   ├── ui/               # Reusable UI components
│   └── widgets/          # Widget components (Calendar, etc.)
├── stores/               # Zustand state management
│   ├── dashboardStore.ts # Dashboard configuration
│   ├── eventsStore.ts    # Event management
│   ├── entitiesStore.ts  # Entity relationships
│   └── userStore.ts      # User management
├── types/                # TypeScript type definitions
├── lib/                  # Utility functions and configs
├── styles/               # Global styles and themes
└── __tests__/            # Test suites
```

## 🎨 Design System

### Color Palette
- **Primary**: Blue tones for actions and selections
- **Success**: Green for completed states
- **Warning**: Orange for pending/overdue items
- **Error**: Red for critical issues
- **Neutral**: Gray scale for text and backgrounds

### Typography
- **Headers**: Inter font family with appropriate weights
- **Body**: Consistent sizing and line heights
- **Code**: Monospace for technical content

### Components
- **Cards**: Consistent border radius and shadows
- **Buttons**: Multiple variants (primary, secondary, ghost)
- **Forms**: Unified input styling with proper focus states
- **Modals**: Accessible dialog patterns with proper overlays

## 🧪 Testing Strategy

### Component Testing
- Unit tests for individual components
- Integration tests for widget interactions
- Accessibility testing with React Testing Library

### E2E Scenarios
- Event creation and management workflows
- Entity association functionality
- Team assignment processes
- Calendar navigation and filtering

### Test Coverage
- Components: 85%+ coverage target
- Business logic: 90%+ coverage target
- Critical paths: 100% coverage requirement

## 🔧 Configuration

### Widget Configuration
Widgets are configured through the dashboard store with support for:
- Position and sizing
- Visibility toggles
- Custom properties per widget type
- Responsive behavior settings

### Theme Customization
The theme system supports:
- Color palette customization
- Typography scaling
- Component variant overrides
- Dark mode preparation (future)

### Environment Variables
```env
# Database connections (when implemented)
DATABASE_URL=

# Authentication (when implemented)
AUTH_SECRET=

# External APIs (when implemented)
CALENDAR_API_KEY=
```

## 🗺️ Roadmap

### Phase 1 ✅ (Completed)
- [x] Basic dashboard layout
- [x] TRC Calendar widget
- [x] Event management system
- [x] Entity association
- [x] Team assignment with photos
- [x] Responsive design

### Phase 2 🚧 (In Progress)
- [ ] Backend API integration
- [ ] Real-time notifications
- [ ] Advanced filtering and search
- [ ] Export capabilities
- [ ] Mobile app considerations

### Phase 3 📋 (Planned)
- [ ] Integration with external calendar systems
- [ ] Advanced reporting and analytics
- [ ] Automated compliance workflows
- [ ] Multi-tenant support
- [ ] Advanced role-based permissions

### Phase 4 🔮 (Future)
- [ ] AI-powered risk assessment
- [ ] Predictive analytics
- [ ] Workflow automation
- [ ] Advanced integrations
- [ ] Enterprise features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write tests for new functionality
- Follow the established code style
- Update documentation for new features
- Ensure accessibility compliance

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with Next.js and the React ecosystem
- UI components inspired by modern design systems
- Calendar functionality powered by FullCalendar
- Icons provided by Heroicons
- Testing utilities from React Testing Library

## 📞 Support

For questions, issues, or contributions:

- **Issues**: [GitHub Issues](https://github.com/cstpalash/trc-workbench/issues)
- **Discussions**: [GitHub Discussions](https://github.com/cstpalash/trc-workbench/discussions)
- **Documentation**: Available in the `/docs` folder

---

**Built with ❤️ for Technology Risk & Control teams**