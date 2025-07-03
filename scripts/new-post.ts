import { input } from "@inquirer/prompts";
import fs from "fs";
import path from "path";

process.on("uncaughtException", (error) => {
  if (error instanceof Error && error.name === "ExitPromptError") {
    console.log("✌🏽");
  } else {
    console.log("rethrowing");
    throw error;
  }
});

const createPost = async () => {
  const title = await input({
    message: "post title?",
  });

  const slug = title.toLowerCase().replace(/\s+/g, "-");

  const description = await input({
    message: "post description?",
  });

  const tags = await input({
    message: "post tags? comma separated, please",
  });

  const date = new Date().toISOString().split("T")[0];

  const post = `---
title: ${title}
slug: ${slug}
description: ${description}
date: ${date}
tags: ${JSON.stringify(tags.replace(" ", "").split(","))}
---


`;

  const postPath = path.join(__dirname, "..", "src", "posts", `${slug}.md`);
  fs.writeFileSync(postPath, post);

  console.log(`post created at ${postPath}`);
};

try {
  await createPost();
} catch (error) {
  if (error instanceof Error && error.name === "ExitPromptError") {
    console.log("bye!");
  } else {
    console.log("rethrowing");
    throw error;
  }
}
