[![CircleCI](https://circleci.com/gh/jcputney/scorm-again.svg?style=svg)](https://circleci.com/gh/jcputney/scorm-again) [![Maintainability](https://api.codeclimate.com/v1/badges/e0495751f495319f3372/maintainability)](https://codeclimate.com/github/jcputney/scorm-again/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/e0495751f495319f3372/test_coverage)](https://codeclimate.com/github/jcputney/scorm-again/test_coverage) 

## SCORM Again
This project was created to modernize the SCORM JavaScript runtime, and to provide a stable, tested platform for running AICC, SCORM 1.2, and SCORM 2004 modules. This module is designed to be LMS agnostic, and is written to be able to be run without a backing LMS, logging all function calls and data instead of committing, if an LMS endpoint is not configured.

### What is this not?
1. This is not an LMS
1. This does not handle the uploading and verification of SCORM/AICC modules
1. This project does not **currently** support the TinCan/xAPI runtime, but is it something I am considering in the very near future.
1. This project is __NOT__ complete!! 