# Discord s/o/cute hack
An image manipulation tool that works on tenor gifs. The discord "universal bot".
## Table of Contents
  - [What is this?](#what-is-this)
  - [How does it work?](#how-does-it-work)
  - [Commands](#commands)
  - - [WIP Commands](#work-in-progress-commands)
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
```
https://tenor.com/view/lol-haha-so-funny-lmao-gif-22433935
```

When s/o/cute is ran, it will edit the link to look like this:   
```
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
### s/view/pe
Returns the one and only pe.
### s/view/meme
Returns a random meme from r/memes.
### s/view/deepfry
Returns a deepfried version of your gif.
### s/view/caption/\[text]
Returns your gif with the text you provided as a caption.
### s/view/trash
Returns your gif with the "Are you sure you want to delete this?" overlay.
### s/view/what
Returns a short description of what s/o/cute is.
### s/view/blurple
Returns a blurpified version of your gif. (Thanks, [Blurple Project](https://github.com/project-blurple))
### s/view/fox
Returns a random picture of a fox.

---

## Work in progress commands

These commands are still being worked on, are not released and may not be released at all.
### s/view/fisheye
Returns your gif with a fisheye effect.
### s/view/blur
Returns your gif with a blur effect.

#### Ask for a command in issues or submit your own with a pull request! 

---

## Credits
- [node-canvas](https://github.com/Automattic/node-canvas) - Advanced image manipulation
- [canvasgif](https://github.com/newtykins/canvas-gif) - Gif manipulation for node-canvas
- [sharp](https://github.com/lovell/sharp) - Fast image manipulation
- [txnor-server](https://github.com/rebane2001/txnor-server) - The inspiration for this project, aka the discord s/e/x hack
- [esmBot](https://github.com/esmBot/esmBot) - Further inspiration for this project

---

## Donate
If you like this project, consider donating to help me keep it running. ❤️  

[![ko-fi](https://www.ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/kirbodev)