# 🤝 Contributing to Grand Eagle Logistics

Thank you for your interest in contributing to Grand Eagle Logistics! This document provides guidelines and instructions for contributing to the project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)

---

## 🤝 Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors. Please be respectful and professional in all interactions.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Git
- A GitHub account

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/grand-eagle-logistics.git
   cd grand-eagle-logistics
   ```

3. Add the upstream repository:
   ```bash
   git remote add upstream https://github.com/msawah/grand-eagle-logistics.git
   ```

4. Install dependencies:
   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd ../frontend
   npm install
   ```

---

## 🔄 Development Workflow

### 1. Create a Branch

Always create a new branch for your work:

```bash
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Adding or updating tests

### 2. Make Your Changes

- Write clean, readable code
- Follow the coding standards below
- Test your changes thoroughly
- Update documentation if needed

### 3. Keep Your Branch Updated

Regularly sync with the upstream repository:

```bash
git fetch upstream
git rebase upstream/main
```

---

## 📝 Coding Standards

### TypeScript

- Use TypeScript for all new code
- Enable strict mode in tsconfig.json
- Avoid using `any` type
- Use interfaces for object shapes
- Use enums for fixed sets of values

### Code Style

**General:**
- Use 2 spaces for indentation
- Use semicolons
- Use single quotes for strings
- Max line length: 100 characters
- Use meaningful variable names

**Functions:**
```typescript
// Good
async function getUserById(userId: string): Promise<User> {
  // ...
}

// Bad
async function get(id: any) {
  // ...
}
```

**Naming Conventions:**
- Variables and functions: `camelCase`
- Classes and interfaces: `PascalCase`
- Constants: `UPPER_SNAKE_CASE`
- Private properties: `_prefixed`

### Backend

- Use Prisma for database operations
- Implement proper error handling
- Use middleware for authentication/authorization
- Validate input data
- Use service layer for business logic
- Keep controllers thin

### Frontend

- Use functional components
- Use React hooks
- Keep components small and focused
- Use TypeScript interfaces for props
- Use Tailwind CSS for styling
- Avoid inline styles

---

## 📝 Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**

```bash
feat(auth): add JWT refresh token functionality

Implemented refresh token rotation to improve security.
Users now receive a new refresh token with each access token refresh.

Closes #123
```

```bash
fix(shipments): correct POD validation logic

Fixed issue where POD submissions were failing due to incorrect
GPS coordinate validation.

Fixes #456
```

### Commit Best Practices

- Make atomic commits (one logical change per commit)
- Write clear, descriptive commit messages
- Reference issue numbers when applicable
- Don't commit commented-out code
- Don't commit console.log statements

---

## 🔍 Pull Request Process

### Before Submitting

1. **Update your branch:**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run tests:**
   ```bash
   # Backend
   cd backend
   npm test

   # Frontend
   cd ../frontend
   npm test
   ```

3. **Lint your code:**
   ```bash
   # Backend
   cd backend
   npm run lint

   # Frontend
   cd ../frontend
   npm run lint
   ```

4. **Build the project:**
   ```bash
   # Backend
   cd backend
   npm run build

   # Frontend
   cd ../frontend
   npm run build
   ```

### Creating a Pull Request

1. Push your branch to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

2. Go to the [repository](https://github.com/msawah/grand-eagle-logistics) on GitHub

3. Click "New Pull Request"

4. Select your branch

5. Fill out the PR template:

```markdown
## Description
Brief description of what this PR does

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How has this been tested?

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code where necessary
- [ ] I have updated the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix/feature works
- [ ] New and existing tests pass locally
```

### PR Review Process

1. A maintainer will review your PR
2. Address any requested changes
3. Once approved, your PR will be merged

---

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm test                 # Run all tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Generate coverage report
```

### Frontend Tests

```bash
cd frontend
npm test                 # Run all tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Generate coverage report
```

### Writing Tests

**Backend Example:**
```typescript
describe('AuthService', () => {
  it('should register a new user', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'password123',
      role: 'SHIPPER'
    };

    const user = await authService.register(userData);

    expect(user).toBeDefined();
    expect(user.email).toBe(userData.email);
  });
});
```

**Frontend Example:**
```typescript
describe('LoginPage', () => {
  it('should render login form', () => {
    render(<LoginPage />);

    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });
});
```

---

## 🐛 Reporting Bugs

When reporting bugs, please include:

1. **Description:** Clear description of the bug
2. **Steps to Reproduce:** Detailed steps to reproduce the issue
3. **Expected Behavior:** What you expected to happen
4. **Actual Behavior:** What actually happened
5. **Screenshots:** If applicable
6. **Environment:**
   - OS
   - Node.js version
   - Browser (if frontend issue)

---

## 💡 Feature Requests

When requesting features, please include:

1. **Description:** Clear description of the feature
2. **Use Case:** Why is this feature needed?
3. **Proposed Solution:** How should it work?
4. **Alternatives:** Any alternative solutions you've considered

---

## 📞 Getting Help

- 💬 **Discussions:** Use GitHub Discussions for questions
- 🐛 **Issues:** Report bugs via GitHub Issues
- 📧 **Email:** Contact the maintainers directly

---

## 📄 License

By contributing to Grand Eagle Logistics, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to Grand Eagle Logistics! 🦅**
