<!-- markdownlint-disable no-inline-html first-line-h1 -->
<p align="center">
<img src="https://tencuter.com/assets/img/logo.png" width="250">
</p>

### An image manipulation tool that works on tenor gifs. The discord "universal bot"

## Table of Contents

- [What is this?](#what-is-this)
- [How does it work?](#how-does-it-work)
- [Commands](#commands)
  - [WIP Commands](#work-in-progress-commands)
- [Credits](#credits)

## What is this?

s/o/cute is an image manipulation tool for Discord. It is written fully in Node.js and uses a mixture of node-canvas and sharp to manipulate images. s/o/cute is **not** a bot, it uses the discord substitute command to produce different images.

## How does it work?

s/o/cute works by using the discord substitute command to edit the link sent in tenor gifs.
For example, when you send a tenor gif on Discord, it will look something like this:

<img src="https://i.ibb.co/5WQxLzr/discordgif1.png" width="500">

---

This is what is actually sent:

<img src="https://i.ibb.co/47MR1S5/image.png" width="500">

The actual message is:

```txt
https://tenor.com/view/lol-haha-so-funny-lmao-gif-22433935
```

When s/o/cute is ran, it will edit the link to look like this:

```txt
https://tencuter.com/view/lol-haha-so-funny-lmao-gif-22433935
```

---

### Explanation

| s/ | o/ | cute |
| --- | --- | --- |
| This means "substitute", aka the edit command. | This means the part that should be edited is "o". | This is the part that "o" should be replaced with. |

**So:**

```tenor.com``` -> ```tencuter.com```

Tencuter.com is owned by me, so I can edit the result.

All the commands use the same method, but replace the /view/ part of the link with the command which links to another page.

---

## Commands

### s/o/cute

The initial command. Needed to run any other command.

### s/view/dog

Returns a random picture of a dog.

### s/view/cat

Returns a random picture of a cat.

### s/view/fox

Returns a random picture of a fox.

### s/view/pe

Returns the one and only pe.

### s/view/meme

Returns a random meme from r/memes.

### s/view/deepfry

Returns a deepfried version of your gif.

### s/view/fisheye

Returns your gif with a fisheye effect.

### s/view/caption/\[text]

Returns your gif with the text you provided as a caption.

### s/view/trash

Returns your gif with the "Are you sure you want to delete this?" overlay.

### s/view/blurple

Returns a blurpified version of your gif. (Thanks, [Blurple Project](https://github.com/project-blurple))

### s/view/blur

Returns your gif with a blur effect.

### s/view/8ball

Returns what the 8ball says.

### s/view/what

Returns a short description of what s/o/cute is.

### s/view/color

Returns a random color.

---

## Work in progress commands

These commands are still being worked on, are not released and may not be released at all.

### s/view/triggered

Returns a triggered version of your gif.

### s/view/flip

Returns your gif flipped horizontally.

### s/view/flipv

Returns your gif flipped vertically.

### s/view/changelog

Returns the changelog.

### s/view/invert

Returns your gif inverted.

### s/discordapp.net/tencuter.com

This command is used to replace discordapp.net with tencuter.com in the link. This is used to make the commands work with any gif.  

## Upcoming features

- [x] Port everything to express.js
- [x] Send images in embeds to show more information
- [x] Short links to share results with friends
- [x] Create error pages
- [ ] Make the commands work with discordapp.net links

Hopefully I'll be able to buy disccuterdapp.net soon so that this will work with any gif.

---

### Ask for a command/feature in issues or submit your own with a pull request

---

## Credits

- [node-canvas](https://github.com/Automattic/node-canvas) - Advanced image manipulation
- [canvasgif](https://github.com/newtykins/canvas-gif) - Gif manipulation for node-canvas
- [sharp](https://github.com/lovell/sharp) - Fast image manipulation
- [txnor-server](https://github.com/rebane2001/txnor-server) - The inspiration for this project, aka the discord s/e/x hack
- [esmBot](https://github.com/esmBot/esmBot) - Further inspiration for this project
- [NTTS](https://youtube.com/notexttospeech) - Bringing my attention to the discord s/e/x hack

---

## Donate

If you like this project, consider donating to help me keep it running. ❤️  

[![ko-fi](https://www.ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/kirbodev)
