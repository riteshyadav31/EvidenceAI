# Contributing to EvidenceAI

First off, thanks for taking the time to contribute! ❤️

All types of contributions are encouraged and valued — bug fixes, new features, documentation, tests, improvements, and ideas. Please read the relevant section before making your contribution to keep things smooth for everyone.

> If you like EvidenceAI but don't have time to contribute, you can also support the project by:
> - ⭐ Starring the repository
> - Sharing it with others who may find it useful
> - Sharing feedback or ideas
> - Mentioning it in relevant communities or projects

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [I Have a Question](#i-have-a-question)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Enhancements](#suggesting-enhancements)
- [Your First Code Contribution](#your-first-code-contribution)
- [Styleguides](#styleguides)
- [Commit Messages](#commit-messages)

---

## Code of Conduct

This project is governed by the [Code of Conduct](./CODE_OF_CONDUCT.md).

By participating in EvidenceAI, you are expected to follow the project's standards for respectful and constructive collaboration.

Please report unacceptable behavior to the project maintainer through the contact information provided in the repository.

---

## I Have a Question

Before opening an issue:

1. Read the [README](./README.md) carefully.
2. Search existing issues to check whether your question has already been answered.
3. Make sure your project setup follows the documented installation instructions.

If you still need help, open an issue with as much relevant context as possible, including:

- Operating system
- Node.js/Python version, if applicable
- Browser or runtime version
- Error messages
- Steps to reproduce the problem
- Relevant logs or screenshots

---

## Reporting Bugs

### Before Submitting

Please make sure that:

- You are using the latest version of EvidenceAI.
- Your dependencies are installed correctly.
- Required environment variables are configured.
- The issue has not already been reported.
- The problem can be reproduced consistently, if possible.

### How to Submit a Good Bug Report

> ⚠️ **Do NOT report security vulnerabilities in public issues.**

For security-related issues, please follow the instructions in [SECURITY.md](./SECURITY.md).

For regular bugs, open an issue and include:

- A clear title and description
- Step-by-step reproduction instructions
- Expected behavior
- Actual behavior
- Your environment details
- Relevant screenshots or terminal output
- Any additional information that may help reproduce the issue

---

## Suggesting Enhancements

Before suggesting a new feature:

- Check existing issues and discussions.
- Make sure the feature is not already available.
- Consider whether the proposed improvement would benefit EvidenceAI users.

When opening a feature request, include:

- A clear title
- A description of the proposed feature
- The problem it solves
- Why the feature would be useful
- Alternatives you considered
- Screenshots, diagrams, or examples if helpful

---

## Your First Code Contribution

1. Fork the repository and clone it locally.
2. Set up the project using the instructions in the [README](./README.md).
3. Create a new branch:

```bash
git checkout -b feat/your-feature-name
```

4. Make your changes.
5. Test your changes locally.
6. Commit your changes using the project's commit message convention.
7. Push your branch:

```bash
git push origin feat/your-feature-name
```

8. Open a Pull Request against the `main` branch.
9. Clearly describe what you changed and why.

> **Legal:** By contributing, you confirm that you have the right to contribute the submitted content and agree that your contribution may be distributed under the project's applicable license.

---

## Styleguides

### Code Style

- Follow the existing project structure and coding conventions.
- Keep functions and modules small and focused.
- Use meaningful variable and function names.
- Avoid unnecessary complexity.
- Remove unused variables and imports.
- Add comments only where they improve understanding.
- Keep security and error handling in mind when modifying backend or AI-related functionality.

### Documentation

When adding or changing functionality:

- Update the README when necessary.
- Document new configuration options.
- Include useful examples where appropriate.
- Keep documentation clear and easy to understand.

### Testing

Before submitting a Pull Request:

- Run the available tests.
- Check that existing functionality still works.
- Test new functionality where applicable.
- Make sure there are no obvious linting or build errors.

---

## Commit Messages

Use the **Conventional Commits** format:

```text
feat: add evidence citation support
fix: handle empty document uploads
docs: update README with RAG architecture
refactor: improve document retrieval pipeline
test: add tests for evidence extraction
chore: update dependencies
```

Common types:

- `feat` — new feature
- `fix` — bug fix
- `docs` — documentation changes
- `refactor` — code restructuring without changing behavior
- `test` — adding or modifying tests
- `chore` — maintenance tasks

---

## Pull Requests

Before submitting a Pull Request:

- Make sure your branch is up to date.
- Keep the Pull Request focused on one change where possible.
- Provide a clear title and description.
- Explain important implementation decisions.
- Include screenshots or examples when they help explain the change.
- Make sure tests and checks pass.

Maintainers may request changes before a Pull Request is merged.

---

## Community Guidelines

EvidenceAI aims to maintain a welcoming and collaborative environment.

Please:

- Be respectful and professional.
- Give constructive feedback.
- Be open to different technical approaches.
- Focus discussions on the project and its goals.
- Help other contributors when possible.

---

## License

By contributing to EvidenceAI, you agree that your contributions may be distributed under the license specified in the project's [LICENSE](./LICENSE) file.