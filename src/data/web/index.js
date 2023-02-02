const data = await fetch("/api/data/all");
const json = await data.json();

document.querySelector("#webcount").innerHTML = json.totalvisits;
document.querySelector("#uniquecount").innerHTML = json.uniquevisits;
document.querySelector("#cmdcount").innerHTML = json.usageCount;

for (const cmd of Object.keys(json.cmdusage)) {
  const cmdname = cmd;
  const cmduses = json.cmdusage[cmd];
  document.querySelector("#cmdusage").innerHTML += `<h3 class="statname"><span class="commandname">${cmdname}</span> usage: <span class="commanduse">${cmduses}</span></h3>`
}