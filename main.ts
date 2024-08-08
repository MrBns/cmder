import { parse } from "@std/yaml";

interface Command {
  name: string;
  args: string[];
}

interface CommandFile {
  commands: Command[];
}

function isCommand(cnt: unknown): cnt is Command {
  if (typeof cnt === "object" && cnt !== null) {
    return "name" in cnt && "args" in cnt;
  } else {
    return false;
  }
}

async function main() {
  const fileContent = await Deno.readTextFile("./commands.yaml");
  const commands = parse(fileContent) as CommandFile;
  console.log(commands);

  if (Array.isArray(commands.commands)) {
    for (const cmd of commands.commands) {
      if (isCommand(cmd)) {
        const output = await new Deno.Command(cmd.name, { args: cmd.args }).output();
        if (output.success) {
          const outputText = new TextDecoder().decode(output.stdout);
          console.log(outputText.trim());
        } else {
          const outputText = new TextDecoder().decode(output.stderr);
          console.error(outputText);
        }
      }
    }
  }
}

main();
