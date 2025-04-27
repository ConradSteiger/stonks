"use client";

import { Github } from "lucide-react";

export function GitHubLink() {
  return (
    <a
      href="https://github.com/your-username/stonks"
      target="_blank"
      rel="noopener noreferrer"
      className="p-2 rounded-md hover:bg-accent flex items-center justify-center"
      aria-label="View source code on GitHub"
    >
      <Github className="h-[1.2rem] w-[1.2rem]" />
      <span className="sr-only">GitHub</span>
    </a>
  );
}