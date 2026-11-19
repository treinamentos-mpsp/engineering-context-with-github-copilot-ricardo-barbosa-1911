import { useId, useState } from "react";

type TagAutocompleteProps = {
  availableTags: readonly string[];
  label: string;
  name?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  value: string;
};

function normalize(tag: string) {
  return tag.trim().toLowerCase();
}

function getSuggestions(value: string, availableTags: readonly string[]) {
  const parts = value.split(",");
  const token = normalize(parts[parts.length - 1]);
  if (!token) return [];

  const chosen = new Set(parts.slice(0, -1).map(normalize));
  return availableTags.filter((tag) => tag.startsWith(token) && !chosen.has(tag));
}

function applyTag(value: string, tag: string) {
  const prefix = value.slice(0, value.lastIndexOf(",") + 1);
  return prefix ? `${prefix} ${tag}` : tag;
}

export function TagAutocomplete({
  availableTags,
  label,
  name,
  onChange,
  placeholder,
  value,
}: TagAutocompleteProps) {
  const inputId = useId();
  const listboxId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const suggestions = getSuggestions(value, availableTags);
  const showList = isOpen && suggestions.length > 0;

  function select(tag: string) {
    onChange(applyTag(value, tag));
    setIsOpen(false);
  }

  return (
    <div className="tag-autocomplete">
      <label htmlFor={inputId}>{label}</label>
      <input
        aria-autocomplete="list"
        aria-controls={showList ? listboxId : undefined}
        aria-expanded={showList}
        autoComplete="off"
        id={inputId}
        name={name}
        onBlur={() => setIsOpen(false)}
        onChange={(event) => {
          onChange(event.target.value);
          setIsOpen(true);
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") setIsOpen(false);
        }}
        placeholder={placeholder}
        role="combobox"
        type="text"
        value={value}
      />
      {showList ? (
        <ul aria-label="Sugestões de tags" className="tag-suggestions" id={listboxId} role="listbox">
          {suggestions.map((tag) => (
            <li
              aria-selected="false"
              id={`${listboxId}-${tag}`}
              key={tag}
              onClick={() => select(tag)}
              onMouseDown={(event) => event.preventDefault()}
              role="option"
            >
              {tag}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
