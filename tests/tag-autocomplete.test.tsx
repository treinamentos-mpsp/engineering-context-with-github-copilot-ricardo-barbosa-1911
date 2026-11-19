import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { TagAutocomplete } from "../src/components/upload/TagAutocomplete";

const LOCAL_TAGS = ["portrait", "wedding", "wildlife"];

function ControlledTagAutocomplete() {
  const [value, setValue] = useState("");
  return (
    <TagAutocomplete
      availableTags={LOCAL_TAGS}
      label="Tags"
      onChange={setValue}
      value={value}
    />
  );
}

describe("TagAutocomplete", () => {
  it("selects a suggestion after a comma-separated value and closes the list", async () => {
    const user = userEvent.setup();
    render(<ControlledTagAutocomplete />);
    const input = screen.getByRole("combobox", { name: "Tags" });

    await user.type(input, "portrait, WI");

    const option = screen.getByRole("option", { name: "wildlife" });
    await user.click(option);

    expect(input).toHaveValue("portrait, wildlife");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(input).toHaveAttribute("aria-expanded", "false");
  });

  it("keeps the typed value and hides suggestions when no tag matches", async () => {
    const user = userEvent.setup();
    render(<ControlledTagAutocomplete />);
    const input = screen.getByRole("combobox", { name: "Tags" });

    await user.type(input, "w");

    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getAllByRole("option").map((option) => option.textContent)).toEqual([
      "wedding",
      "wildlife",
    ]);

    await user.type(input, "zzz");

    expect(input).toHaveValue("wzzz");
    expect(screen.queryAllByRole("option")).toHaveLength(0);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(input).toHaveAttribute("aria-expanded", "false");
  });
});
