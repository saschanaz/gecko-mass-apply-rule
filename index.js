// /**
//  * @param {string} a
//  * @param {string} b
//  * @returns
//  */
// function subdirFirst(a, b) {
//   if (a.startsWith(b)) {
//     return -1;
//   }
//   if (b.startsWith(a)) {
//     return 1;
//   }
//   return a.localeCompare(b);
// }

/**
 * @param {string[]} cmd
 */
async function run(cmd) {
  const process = Deno.run({
    cmd,
    stdout: "piped",
    stderr: "piped"
  });

  const output = await process.output() // "piped" must be set
  const outStr = new TextDecoder().decode(output);
  return outStr;
}

Deno.chdir("../gecko-dev");

const output = await run(["git", "diff", "--name-only"])
let list = output.split("\n");

// const set = new Set(
//   list
//     .map((item) => {
//       const index = item.lastIndexOf("/");
//       return item.slice(0, index);
//     })
//     .sort(subdirFirst)
// );

// console.log(set);

const chunkSize = 25;

let i = 1;
while (list.length > 0) {
  const items = list.slice(0, chunkSize);
  await run(["git", "add", ...items])
  await run(["git", "commit", "-m", `Bug 1768189 - Part ${i}: Apply modernize-concat-nested-namespaces to ${items[0]} ... r=andi`])
  list = list.slice(chunkSize)
  ++i;
}
