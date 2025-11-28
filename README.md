# Akita
[![Identifier](https://img.shields.io/badge/doi-10.14454%2Fqgk4--zs88-fca709.svg)](https://doi.org/10.14454/qgk4-zs88)
![Release](https://github.com/datacite/akita/workflows/Release/badge.svg)
[![Maintainability](https://api.codeclimate.com/v1/badges/b34c0096505296b18f19/maintainability)](https://codeclimate.com/github/datacite/akita/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/b34c0096505296b18f19/test_coverage)](https://codeclimate.com/github/datacite/akita/test_coverage)
[![akita](https://img.shields.io/endpoint?url=https://dashboard.cypress.io/badge/detailed/yur1cf/master&style=flat&logo=cypress)](https://dashboard.cypress.io/projects/yur1cf/runs)


## Introduction

Akita is the web frontend for **[DataCite Commons](https://commons.datacite.org)**, a discovery service that connects research outputs, people, and organizations. It provides a unified search interface to explore the research landscape using persistent identifiers (PIDs).

Key features include:
*   **Works Search**: Discover research outputs (datasets, software, text, etc.) via DOIs.
*   **People Search**: Find researchers and their contributions via ORCID IDs.
*   **Organization Search**: Explore research institutions and their outputs via ROR IDs.
*   **Repository Search**: Find data repositories via DataCite Client IDs and re3data IDs.
*   **Visualization**: View connections and statistics related to research entities.

## Tech Stack

*   **Frontend:** [Next.js](https://nextjs.org/) (React framework), [Apollo Client](https://www.apollographql.com/docs/react/) (GraphQL), [React Bootstrap](https://react-bootstrap.github.io/) (UI components).
*   **Backend:** [Flask](https://flask.palletsprojects.com/) (Python microframework) for specific API endpoints.
*   **Testing:** [Cypress](https://www.cypress.io/) (End-to-End testing).

## Project Structure

*   `api/`: Python Flask application for backend services (e.g. related works graph).
*   `src/`: Main source code for the Next.js frontend.
    *   `app/`: Next.js App Router pages/routes.
    *   `components/`: Reusable React components.
    *   `data/`: GraphQL queries, constants, and data fetching logic.
*   `cypress/`: End-to-End tests.
*   `public/`: Static assets.

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (with NPM) - Suggestion is to use a version manager like [N](https://github.com/tj/n)
* [Yarn 1 Classic](https://classic.yarnpkg.com/lang/en/)
* [Python 3](https://www.python.org/) (with pip3)

## Installation

* `git clone <repository-url>` this repository
* `yarn install`
* `cp .env.example .env` (and configure environment variables as needed)
* `pip3 install -r api/requirements.txt` (optional, handled by `yarn dev-all`)

## Environment Variables

The application uses several environment variables for configuration. You can set these in a `.env` file in the root directory. A `.env.example` file is provided as a template.

| Variable | Description | Default (if not set) |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | DataCite API URL | `https://api.stage.datacite.org` |
| `NEXT_PUBLIC_PROFILES_URL` | DataCite Profiles URL | `https://profiles.stage.datacite.org` |
| `NEXT_PUBLIC_ORCID_API_URL` | ORCID API URL | `https://pub.sandbox.orcid.org/v3.0` |
| `NEXT_PUBLIC_ID_BASE` | Base URL for DOI resolution | `https://handle.stage.datacite.org/` |
| `NEXT_PUBLIC_GA_TRACKING_ID` | Google Analytics Tracking ID | - |
| `SENTRY_DSN` | Sentry DSN for error tracking | - |
| `NEXT_PUBLIC_JWT_PUBLIC_KEY` | Public key for verifying JWTs | - |
| `NEXT_PUBLIC_FEATURE_FLAGS` | Comma-separated list of feature flags | - |

## Running / Client

* `yarn dev-all` (runs both Next.js frontend and Python API)
* Visit your app at [http://localhost:3000](http://localhost:3000).

Note: `yarn dev` only runs the frontend. If you need the API, use `yarn dev-all` or run `yarn api` in a separate terminal.

## Running / Server

* `yarn build`
* `yarn start`
* Visit your app at [http://localhost:3000](http://localhost:3000).

### Running Tests

*   `yarn cy:run`: Runs Cypress tests in headless mode.
*   `yarn cy:open`: Opens the Cypress Test Runner for interactive testing.

### Linting and Formatting

*   `yarn lint`: Runs ESLint to check for code quality issues.
*   `yarn prettier-format`: Formats code using Prettier.
*   `yarn type-check`: Runs TypeScript compiler to check for type errors.

### Deploying

The application is built and deployed using Vercel and GitHub Actions

### Contributing

1.  **Fork** the project.
2.  **Create** a feature branch (`git checkout -b feature/my-new-feature`).
3.  **Commit** your changes (`git commit -am 'Add some feature'`).
4.  **Push** to the branch (`git push origin feature/my-new-feature`).
5.  **Create** a new Pull Request.

Please ensure you:
*   Write tests for new features or bug fixes.
*   Follow the existing code style.
*   Do not modify the `Rakefile`, version, or history files directly (if applicable).

## Resources

*   [DataCite Commons](https://commons.datacite.org): The live service.
*   [DataCite API Documentation](https://support.datacite.org/docs/api-reference): Reference for the DataCite REST API.
*   [DataCite GraphQL API Guide](https://support.datacite.org/docs/datacite-graphql-api-guide): Guide for using the DataCite GraphQL API.
*   [DataCite Support](https://support.datacite.org/): General support documentation.

## License
**akita** is released under the [MIT License](https://github.com/datacite/akita/blob/master/LICENSE).
