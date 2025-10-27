interface HighlightProps {
  text: string;
  searchTerm: string;
  className?: string;
}

export function Highlight({
  text,
  searchTerm,
  className = "",
}: HighlightProps) {
  if (!searchTerm.trim()) {
    return <span className={className}>{text}</span>;
  }

  const parts = text.split(new RegExp(`(${searchTerm})`, "gi"));

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (part.toLowerCase() === searchTerm.toLowerCase()) {
          return (
            <mark
              key={index}
              className="bg-yellow-400 dark:bg-yellow-600 text-gray-900 dark:text-gray-900 font-semibold px-0.5 rounded"
            >
              {part}
            </mark>
          );
        }
        return part;
      })}
    </span>
  );
}
