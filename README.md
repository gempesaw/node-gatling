# npm-gatling

npm wrapper around the gatling binaries.

Sets the correct working directory for gatling to run and invokes the ```gatling.bat``` file with all of the passed parameters.

In npm package version 1.0.0, the included gatling version is 2.1.5. In npm package version 2.0.0, the included gatling version is 2.2.3. There are [breaking changes](http://gatling.io/docs/2.2.3/migration_guides/2.1-to-2.2.html#to-2-2 "http://gatling.io/docs/2.2.3/migration_guides/2.1-to-2.2.html#to-2-2") between gatling's 2.1 and 2.2 versions, which you may want to review before updating.

## Usage

Simply install ```npm-gatling``` and call ```gatling``` as you would when using the original gatling binaries.

### Install
```
  npm i npm-gatling --save
```

### Run
```
  gatling -s SimulationName -rf ~/results/
```

> Note: '~' is replaced with the current working directory.

> This helps us achieve relative file paths when running gatling from project directories.

----------

See [the gatling docs](http://gatling.io/docs/2.2.3/general/configuration.html#command-line-options "http://gatling.io/docs/2.2.3/general/configuration.html#command-line-options") for a list of all the command line arguments.
