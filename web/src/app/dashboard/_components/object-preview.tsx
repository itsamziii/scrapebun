"use client";

import React, { useMemo } from "react";

interface ObjectPreviewProps {
  object: Record<string, any>;
}

export const ObjectPreview: React.FC<ObjectPreviewProps> = ({ object }) => {
  const formattedJson = useMemo(
    () => JSON.stringify(object, null, 2),
    [object],
  );

  const highlightedJson = useMemo(
    () => syntaxHighlight(formattedJson),
    [formattedJson],
  );

  return (
    <div className="max-h-[500px] overflow-auto rounded-lg border border-white/10 bg-white/5 p-4">
      <pre className="font-mono text-sm whitespace-pre text-white/70">
        <code dangerouslySetInnerHTML={{ __html: highlightedJson }} />
      </pre>
    </div>
  );
};

function syntaxHighlight(json: string) {
  json = json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    (match) => {
      let cls = "text-white/70"; // default soft white text
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = "text-teal-300"; // keys
        } else {
          cls = "text-yellow-300"; // strings
        }
      } else if (/true|false/.test(match)) {
        cls = "text-purple-300"; // booleans
      } else if (/null/.test(match)) {
        cls = "text-red-300"; // null
      } else if (/\d+/.test(match)) {
        cls = "text-blue-300"; // numbers
      }
      return `<span class="${cls}">${match}</span>`;
    },
  );
}
