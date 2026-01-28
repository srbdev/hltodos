# hltodos

A Visual Studio Code extension that highlights todo comments like `TODO:`, `NOTE:`, `FIX:`, `WARN:`, etc.

![hltodos screenshot](https://github.com/srbdev/media/blob/master/png/hltodos-0.0.9.png?raw=true)

## Features

- Highlights common comment patterns with color-coded backgrounds
- Works with any language
- Updates in real-time as you type

## Supported Patterns

| Pattern | Color |
|---------|-------|
| `TODO:` | Blue |
| `FIX:` / `FIXME:` | Red |
| `HACK:` | Yellow |
| `NOTE:` | Green |
| `INFO:` | White |
| `PERF:` | Magenta |
| `WARN:` / `WARNING:` | Yellow |

## Requirements

- VS Code 1.96.0 or higher

## Build and Package

```sh
npm run package
```

Or with Docker:

```sh
docker build -t hltodos-builder .
docker run --rm -u $(id -u):$(id -g) -v $(pwd):/app hltodos-builder
```

## Install

```sh
code --install-extension hltodos-<version>.vsix
```

## Credits

This extension is heavily inspired by the Neovim plugin
[Todo Comments](https://github.com/folke/todo-comments.nvim).

## License

MIT
