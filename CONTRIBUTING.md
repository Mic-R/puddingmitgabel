# 🤝 Contributing to Pudding mit Gabel

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Have fun! 🥄

## How to Contribute

### Reporting Bugs

1. Check if the bug is already reported in Issues
2. Create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (OS, browser, Node version)

### Suggesting Features

1. Check existing issues and discussions
2. Create a new issue with:
   - Clear description of the feature
   - Use cases and benefits
   - Possible implementation approach
   - UI mockups if applicable

### Pull Requests

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the code style
   - Write clear commit messages
   - Add tests if applicable
   - Update documentation

4. **Test your changes**
   ```bash
   npm run dev
   # Test manually in the browser
   ```

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Describe what you changed and why
   - Reference related issues
   - Add screenshots for UI changes

## Development Setup

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Git

### Setup Steps

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/puddingmitgabel.git
cd puddingmitgabel

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your database credentials

# Setup database
npx prisma generate
npx prisma db push
npx prisma db seed

# Start development server
npm run dev
```

### Project Structure

```
puddingmitgabel/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── events/            # Event pages
│   └── cms/               # CMS dashboard
├── components/            # React components
├── lib/                   # Utilities and services
│   ├── auth/             # Auth configuration
│   ├── prisma.ts         # Database client
│   └── contentModerator.ts
├── prisma/               # Database schema and migrations
└── public/               # Static assets
```

## Code Style

### TypeScript

- Use TypeScript for type safety
- Prefer interfaces over types
- Use meaningful variable names
- Add JSDoc comments for complex functions

```typescript
// Good
interface EventFormData {
  title: string;
  description: string;
  location: string;
  date: Date;
}

// Bad
interface Data {
  t: string;
  d: string;
}
```

### React Components

- Use functional components
- Use hooks for state management
- Keep components focused and small
- Use Mantine components when possible

```tsx
// Good
export default function EventCard({ event }: { event: Event }) {
  const [loading, setLoading] = useState(false);
  
  return (
    <Card>
      <Title>{event.title}</Title>
    </Card>
  );
}
```

### API Routes

- Follow RESTful conventions
- Handle errors properly
- Return consistent response formats
- Validate input

```typescript
// Good
export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    if (!data.title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }
    
    // ... handle request
    
    return NextResponse.json({ event });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## Database Changes

When modifying the Prisma schema:

1. Update `prisma/schema.prisma`
2. Generate Prisma client: `npx prisma generate`
3. Push changes: `npx prisma db push`
4. Update seed if needed: `prisma/seed.ts`
5. Test thoroughly

## Testing

Currently, the project doesn't have automated tests. If you want to add tests:

- Use Jest for unit tests
- Use Playwright for E2E tests
- Add tests in `__tests__` directories
- Update CI/CD configuration

## Documentation

- Update README.md for new features
- Add inline comments for complex logic
- Update DEPLOYMENT.md for deployment changes
- Keep CONTRIBUTING.md current

## Commit Messages

Follow conventional commits:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

Examples:
```
feat: add event image upload functionality
fix: resolve authentication redirect issue
docs: update installation instructions
```

## Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation
- `refactor/description` - Refactoring

## Areas for Contribution

### High Priority

- [ ] Add image upload for events
- [ ] Email notifications for event approval
- [ ] Event search and filtering
- [ ] User profile pages
- [ ] Automated tests

### Nice to Have

- [ ] Event categories/tags
- [ ] Event favorites/bookmarks
- [ ] RSS feed for events
- [ ] i18n support (English translation)
- [ ] Dark mode toggle
- [ ] Event calendar view
- [ ] Social sharing buttons
- [ ] Event attendance tracking

### Infrastructure

- [ ] CI/CD pipeline
- [ ] Docker compose for development
- [ ] Performance monitoring
- [ ] Error tracking (Sentry)
- [ ] Analytics

## Getting Help

- Create a discussion on GitHub
- Ask in pull request comments
- Review existing code and documentation
- Check closed issues for similar problems

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Thank You!

Every contribution helps make Pudding mit Gabel better! 🥄🍮

---

Happy coding! If you have questions, don't hesitate to ask.
