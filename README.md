# node-gatling

This is a simple wrapper around the gatling binaries. It sets the
correct working directory for gatling to run and invokes the appropriate
shell command with the proper arguments.

For 2.x, the included gatling version is 2.2.3. There are
[breaking changes][] between gatling's 2.1 and 2.2 versions, which you
may want to review before updating.

## Usage

Install `node-gatling` and then use `gatling` like

```
gatling -s SimulationName -rf results/
```

See [the gatling docs][] for a list of all the command line arguments.

[breaking changes]: http://gatling.io/docs/2.2.3/migration_guides/2.1-to-2.2.html#to-2-2
[the gatling docs]: http://gatling.io/docs/2.2.3/general/configuration.html#command-line-options
