# @fuweichin/fs-r
fs recursive functions, inspired by POSIX and Apache Commons IO.

[![npm version](https://img.shields.io/npm/v/@fuweichin/fs-r.svg)](https://www.npmjs.org/package/@fuweichin/fs-r)

## Features
+ copy directory recursively
	+ overwrite existing dest?
	+ read symbolic link?
	+ preserve file date?
	+ given filepath and stats, tell if file need to be copied?
+ mkdir recursively
+ remove directory recursively

## Installation
```sh
npm install --save @fuweichin/fs-r
```

## Documentation
see [doc/api.md](doc/api.md).

## Examples
see [spec/indexSpec.js](spec/indexSpec.js).
