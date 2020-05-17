[![Build Status](https://travis-ci.com/datacite/akita.svg?branch=master)](https://travis-ci.com/datacite/akita)

# Akita

The web frontend for the DataCite Common DOI Search service (under development).

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

* `yarn test`

### Linting

* `yarn lint`

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
