"use client";

import { useState } from "react";
import { TagAutocomplete } from "@/components/upload/TagAutocomplete";

type TagsFieldProps = {
  availableTags: readonly string[];
};

export function TagsField({ availableTags }: TagsFieldProps) {
  const [value, setValue] = useState("");

  return (
    <div className="full-field">
      <TagAutocomplete
        availableTags={availableTags}
        label="Tags separadas por virgula"
        name="tags"
        onChange={setValue}
        placeholder="wedding, portrait, outdoor..."
        value={value}
      />
      <small>Use termos consistentes para melhorar a busca na galeria.</small>
    </div>
  );
}
