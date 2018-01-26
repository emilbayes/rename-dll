# `rename-dll`

> CLI for renaming DLL files on Windows, generating a new .lib file

## Usage

```ps
rename-dll source.dll dest.dll
```

When linking agains shared libraries on Windows (Dynamically Linked Libraries)
you use a `.lib` file which defines all exported symbols as well as the name of
the `.dll` file. If you want to rename the DLL, eg. to version it and avoid
collisions (DLL Hell), you need to regenerate this `.lib` file, which is binary.
This module does this automatically for you!

## API

### `rename-dll [--arch=x64] SRC DEST`

Generate a `.def` file based on `SRC`, compile it to a `.lib` file next to
`DEST` and rename the `SRC` to `DEST`. Optionally choose an architecture;
possible values are `x86`/`ia32`, `x64`, `arm` and `arm64`.

## Install

```sh
npm install rename-dll
```

## License

[ISC](LICENSE)
