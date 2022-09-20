# the `t3` cli

CLI for your create-t3-app projects.

## Installing and Usage

```shell
pnpm install -g t3-cli@latest
t3 --help
```

```
Usage: t3-tools [commands]

A CLI for the T3 Tools

Options:
  -V, --version   output the version number
  -h, --help      display help for command

Commands:
  packages        Check if all packages are installed
  check           Runs checks on your codebase
  help [command]  display help for command
```

## Features

### `t3 check`

Checks your code for common errors like environment variables that weren't declared on your schema files.

### `t3 packages`

Currently, it shows the installed packages that you have. The option to add a package will be added soon.

### `t3 migrate [package]`

Runs the migrations for the specified package. If no package is specified, it will default to the latest updated 
package.

## Limitations

Currently, the CLI relies on your project being created with [t3-oss/create-t3-app](https://github.com/t3-oss/create-t3-app). Support for largely different file structures will be added at a later time.

## License

It's the [BSD-3-Clause](LICENSE) license.
