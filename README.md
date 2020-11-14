# Akita
[![Identifier](https://img.shields.io/badge/doi-10.14454%2Fqgk4--zs88-fca709.svg)](https://doi.org/10.14454/qgk4-zs88)
[![Build Status](https://travis-ci.com/datacite/akita.svg?branch=master)](https://travis-ci.com/datacite/akita)
[![Maintainability](https://api.codeclimate.com/v1/badges/b34c0096505296b18f19/maintainability)](https://codeclimate.com/github/datacite/akita/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/b34c0096505296b18f19/test_coverage)](https://codeclimate.com/github/datacite/akita/test_coverage)
[![akita](https://img.shields.io/endpoint?url=https://dashboard.cypress.io/badge/detailed/yur1cf/master&style=flat&logo=cypress)](https://dashboard.cypress.io/projects/yur1cf/runs)

The web frontend for the DataCite Commons service.

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (with NPM)

## Installation

* `git clone <repository-url>` this repository

## Running / Client

* `yarn dev`
* Visit your app at [http://localhost:3000](http://localhost:3000).

## Running / Server

* `yarn build`
* `yarn start`
* Visit your app at [http://localhost:3000](http://localhost:3000).

### Running Tests

* `yarn cy:run`
* `yarn cy:open`

### Linting

* `yarn lint`

### Type Checking

* `yarn type-check`

### Deploying

The application is built as a Docker container `datacite/akita`.

### Note on Patches/Pull Requests

* Fork the project
* Write tests for your new feature or a test that reproduces a bug
* Implement your feature or make a bug fix
* Do not mess with Rakefile, version or history
* Commit, push and make a pull request. Bonus points for topical branches.

## License
**akita** is released under the [MIT License](https://github.com/datacite/akita/blob/master/LICENSE).
