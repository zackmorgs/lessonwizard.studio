import React, { useState, useEffect, useRef } from "react";
import { getTags, createTag } from "../services/tagService";

function normalize(value) {
  return value.toLowerCase().replace(/\s+/g, "-");
}

export default function TagPicker({ value = [], onChange }) {
  const [allTags, setAllTags] = useState([]);
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    getTags()
      .then(setAllTags)
      .catch(() => {});
  }, []);

  useEffect(() => {
    const normalized = normalize(input);
    if (!normalized) {
      setSuggestions([]);
      return;
    }
    const filtered = allTags.filter(
      (t) => t.name.includes(normalized) && !value.includes(t.name)
    );
    setSuggestions(filtered);
  }, [input, allTags, value]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleInputChange(e) {
    const normalized = normalize(e.target.value);
    setInput(normalized);
    setOpen(true);
  }

  function addTag(name) {
    if (!value.includes(name)) {
      onChange([...value, name]);
    }
    setInput("");
    setOpen(false);
  }

  function removeTag(name) {
    onChange(value.filter((t) => t !== name));
  }

  async function handleCreate() {
    const name = normalize(input);
    if (!name) return;

    const existing = allTags.find((t) => t.name === name);
    if (existing) {
      addTag(name);
      return;
    }

    try {
      const created = await createTag(name);
      setAllTags((prev) => [...prev, created]);
      addTag(name);
    } catch {
      // tag may already exist server-side; add it anyway
      addTag(name);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      if (suggestions.length > 0) {
        addTag(suggestions[0].name);
      } else if (input) {
        handleCreate();
      }
    }
  }

  const showCreate =
    input && !allTags.some((t) => t.name === normalize(input)) && !value.includes(normalize(input));

  return (
    <div ref={containerRef} className="relative">
      {/* Selected tags */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {value.map((name) => (
            <span key={name} className="tag-link flex items-center gap-1 px-2 py-1">
              {name}
              <button
                type="button"
                onClick={() => removeTag(name)}
                className="ml-1 text-xs leading-none hover:opacity-70"
                aria-label={`Remove ${name}`}
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input */}
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => input && setOpen(true)}
        placeholder="Add a tag..."
        className="input w-full"
        autoComplete="off"
      />

      {/* Dropdown */}
      {open && (suggestions.length > 0 || showCreate) && (
        <ul className="absolute z-10 mt-1 w-full bg-white border rounded shadow-md max-h-48 overflow-y-auto">
          {suggestions.map((tag) => (
            <li key={tag.id}>
              <button
                type="button"
                onMouseDown={() => addTag(tag.name)}
                className="w-full text-left px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-sm"
              >
                {tag.name}
              </button>
            </li>
          ))}
          {showCreate && (
            <li>
              <button
                type="button"
                onMouseDown={handleCreate}
                className="w-full text-left px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-sm text-blue-500"
              >
                Create &ldquo;{normalize(input)}&rdquo;
              </button>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
