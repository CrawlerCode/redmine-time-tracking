/**
 * Converts Markdown to Textile format
 *
 * @see https://www.redmine.org/projects/redmine/wiki/RedmineTextFormattingMarkdown
 * @see https://www.redmine.org/projects/redmine/wiki/RedmineTextFormattingTextile
 */
export function markdownToTextile(markdown: string): string {
  let result = markdown;

  // ATX headings h1–h6
  result = result.replace(/^#{6}\s+(.+)$/gm, "h6. $1\n");
  result = result.replace(/^#{5}\s+(.+)$/gm, "h5. $1\n");
  result = result.replace(/^#{4}\s+(.+)$/gm, "h4. $1\n");
  result = result.replace(/^#{3}\s+(.+)$/gm, "h3. $1\n");
  result = result.replace(/^#{2}\s+(.+)$/gm, "h2. $1\n");
  result = result.replace(/^#\s+(.+)$/gm, "h1. $1\n");

  // Code block
  result = result.replace(/```(\w+)?\n([\s\S]*?)```/gm, (_: string, lang: string | undefined, code: string) => {
    const langAttr = lang ? ` class="${lang}"` : "";
    return `<pre><code${langAttr}>${code.trimEnd()}</code></pre>`;
  });

  // Inline code
  result = result.replace(/`([^`]+)`/g, "@$1@");

  // Bold+italic ***text*** or ___text___ → *_text_*
  result = result.replace(/\*\*\*(.+?)\*\*\*/g, "*_$1_*");
  result = result.replace(/___(.+?)___/g, "*_$1_*");

  // Italic *text* → _text_
  result = result.replace(/(?<![*_])\*(?![*_])([^*]+?)(?<![*_])\*(?![*_])/g, "_$1_");

  // Bold **text** or __text__ → *text*
  result = result.replace(/\*\*(.+?)\*\*/g, "*$1*");
  result = result.replace(/__(.+?)__/g, "*$1*");

  // Strikethrough ~~text~~ or <del>text</del> → -text-
  result = result.replace(/~~(.+?)~~/g, "-$1-");
  result = result.replace(/<del>(.+?)<\/del>/g, "-$1-");

  // Underline <ins>text</ins> → +text+
  result = result.replace(/<ins>(.+?)<\/ins>/g, "+$1+");

  // Images ![alt](url) → !url(alt)!
  result = result.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt: string | undefined, url: string) => (alt ? `!${url}(${alt})!` : `!${url}!`));

  // Links [text](url) → "text":url
  result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '"$1":$2');

  // Horizontal rules --- or *** or ___
  result = result.replace(/^(?:---+|\*\*\*+|___+)$/gm, "----");

  // Lists
  result = result.replace(/^([ \t]*)[-*]\s+(.+)$/gm, (_, indent: string, content: string) => {
    const level = Math.floor(indent.length / 2) + 1;
    return "*".repeat(level) + " " + content;
  });
  result = result.replace(/^([ \t]*)\d+\.\s+(.+)$/gm, (_, indent: string, content: string) => {
    const level = Math.floor(indent.length / 2) + 1;
    return "#".repeat(level) + " " + content;
  });

  // Tables
  result = result.replace(/(?:^\|.+\|$\n?)+/gm, (table: string) => {
    const lines = table.trim().split("\n");

    if (lines.length < 2) return table; // Not a valid table
    if (!/^\|[\s|:-]+\|$/.test(lines[1]!)) return table; // Missing separator row

    const alignments = lines[1]!
      .slice(1, -1)
      .split("|")
      .map((cell) => {
        const trimmed = cell.trim();
        if (/^:-+$/.test(trimmed)) return "<"; // Left align
        if (/^-+:$/.test(trimmed)) return ">"; // Right align
        if (/^:-+:$/.test(trimmed)) return "="; // Center align
        return "<"; // Default to left align
      });

    const headerRow =
      "|" +
      lines[0]!
        .slice(1, -1)
        .split("|")
        .map((cell) => cell.trim())
        .map((cell, i) => `_${alignments[i]}. ${cell}`)
        .join("|") +
      "|";

    const bodyRows = lines.slice(2).map((line) => {
      const cells = line
        .slice(1, -1)
        .split("|")
        .map((cell) => cell.trim());
      return "|" + cells.map((cell, i) => `${alignments[i]}. ${cell}`).join("|") + "|";
    });

    return [headerRow, ...bodyRows].join("\n") + "\n";
  });

  return result;
}
