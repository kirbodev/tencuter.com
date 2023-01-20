for (image of document.querySelectorAll("img")) {
  image.addEventListener("ondragstart", function (event) {
    event.preventDefault();
  });
}

const commands = [
  {
    name: "dog",
    description: "Returns a random picture of a dog.",
    tags: [],
    keywords: ["dog", "animal", "doggo"],
  },
  {
    name: "cat",
    description: "Returns a random picture of a cat.",
    tags: [],
    keywords: ["cat", "animal", "kitty", "kitten"],
  },
  {
    name: "fox",
    description: "Returns a random picture of a fox.",
    tags: [],
    keywords: ["fox", "animal"],
  },
  {
    name: "pe",
    description: "Returns the one and only pe.",
    tags: [],
    keywords: ["god", "pe"],
  },
  {
    name: "meme",
    description: "Returns a random meme from r/memes.",
    tags: [],
    keywords: ["meme", "funny", "reddit"],
  },
  {
    name: "deepfry",
    description: "Returns a deepfried version of your gif.",
    tags: [],
    keywords: ["deepfry", "image", "gif"],
  },
  {
    name: "fisheye",
    description: "Returns your gif with a fisheye effect.",
    tags: [],
    keywords: ["fisheye", "image", "gif"],
  },
  {
    name: "caption/[text]",
    description: "Returns your gif with the text you provided as a caption.",
    tags: [],
    keywords: ["caption", "image", "gif", "text"],
  },
  {
    name: "trash",
    description:
      'Returns your gif with the "Are you sure you want to delete this?" overlay.',
    tags: [],
    keywords: ["trash", "image", "gif"],
  },
  {
    name: "blurple",
    description:
      'Returns a blurpified version of your gif. (Check out <a href="https://projectblurple.com" target="_blank">Project Blurple</a>.)',
    tags: [],
    keywords: ["blurple", "image", "gif", "discord"],
  },
  {
    name: "what",
    description: "Returns a short description of what s/o/cute is.",
    tags: [],
    keywords: ["what", "info", "about", "description"],
  },
  {
    name: "blur",
    description: "Returns your gif with a blur effect.",
    keywords: ["blur", "image", "gif"],
  },
  {
    name: "8ball",
    description: "Returns what the 8ball says.",
    keywords: ["8ball", "fun", "magic"],
  },
  {
    name: "triggered",
    description: "Returns a triggered version of your gif.",
    tags: ["wip"],
    keywords: ["triggered", "image", "gif"],
  },
  {
    name: "color",
    description: "Returns a random color.",
    tags: ["wip"],
    keywords: ["color", "random", "hex"],
  },
  {
    name: "flip",
    description: "Returns your gif flipped horizontally.",
    tags: ["wip"],
    keywords: ["flip", "image", "gif"],
  },
  {
    name: "flipv",
    description: "Returns your gif flipped vertically.",
    tags: ["wip"],
    keywords: ["flipv", "image", "gif"],
  },
  {
    name: "changelog",
    description: "Returns the changelog.",
    tags: ["wip"],
    keywords: ["changelog", "updates", "changes"],
  },
  {
    name: "invert",
    description: "Returns your gif inverted.",
    tags: ["wip"],
    keywords: ["invert", "image", "gif"],
  },
];

const commandList = document.getElementById("command-list");
const wipCommandList = document.getElementById("wip-command-list");

for (const command of commands) {
  if (command.tags.includes("wip")) {
    wipCommandList.innerHTML += createCommandCard(command);
  } else {
    commandList.innerHTML += createCommandCard(command);
  }
}

commandList.addEventListener("mousemove", (e) => {
  for (const card of document.querySelectorAll(
    "#command-list > div > .command-card"
  )) {
    const rect = card.getBoundingClientRect(),
      x = e.clientX - rect.left,
      y = e.clientY - rect.top;
    card.style.setProperty("--x", `${x}px`);
    card.style.setProperty("--y", `${y}px`);
  }
});

wipCommandList.addEventListener("mousemove", (e) => {
  for (const card of document.querySelectorAll(
    "#wip-command-list > div > .command-card"
  )) {
    const rect = card.getBoundingClientRect(),
      x = e.clientX - rect.left,
      y = e.clientY - rect.top;
    card.style.setProperty("--x", `${x}px`);
    card.style.setProperty("--y", `${y}px`);
  }
});

const fuse = new Fuse(commands, {
  includeScore: true,
  keys: ["name", "description", "tags", "keywords"],
  threshold: 0.3,
  useExtendedSearch: true,
});

const cmdinput = document.querySelector("#command-search");

cmdinput.addEventListener("input", (e) => {
  if (e.target.value.length > 1) {
    const results = fuse.search(e.target.value);
    document.querySelector("#wip-commands > h2").classList.add("d-none");
    document.querySelector("#wip-commands > p").classList.add("d-none");
    for (const card of document.querySelectorAll(".command-card-parent")) {
      if (
        results.some(
          (result) => result.item.name === card.id.replace("command-", "")
        )
      ) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    }
    if (results.length === 0) {
      document.getElementById("no-results").classList.remove("d-none");
    } else {
      document.getElementById("no-results").classList.add("d-none");
    }
  } else {
    for (const card of document.querySelectorAll(".command-card-parent")) {
      card.style.display = "block";
    }
    document.getElementById("no-results").classList.add("d-none");
    document.querySelector("#wip-commands > h2").classList.remove("d-none");
    document.querySelector("#wip-commands > p").classList.remove("d-none");
  }
});

function createCommandCard(command) {
  if (command.tags.includes("wip")) {
    return `<div class="col command-card-parent" id="command-${command.name}">
            <div class="command-card card h-100">
                <div class="card-body poppins">
                    <h5 class="card-title"><span class="socute-prefix">s/view/</span>${command.name}<span class="badge bg-warning ms-2">WIP</span></h5>
                    <p class="card-text">${command.description}</p>
                </div>
            </div>
        </div>`;
  } else {
    return `<div class="col command-card-parent" id="command-${command.name}">
            <div class="command-card card h-100">
                <div class="card-body poppins">
                    <h5 class="card-title"><span class="socute-prefix">s/view/</span>${command.name}</h5>
                    <p class="card-text">${command.description}</p>
                </div>
            </div>
        </div>`;
  }
}

// Sidebar close on link click

const offcanvas = new bootstrap.Offcanvas("#sidebar");
const sidebarLinks = document.querySelectorAll("#sidebar .nav-link");

for (const link of sidebarLinks) {
  link.addEventListener("click", () => {
    setTimeout(() => {
      offcanvas.hide();
    }, 500);
  });
}
