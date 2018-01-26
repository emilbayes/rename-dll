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

### `rename-dll ./path/to/source.dll ./path/to/new.dll`

Generate a `.def` file based on `source.dll`,

## Install

```sh
npm install rename-dll
```

## License

[ISC](LICENSE)
