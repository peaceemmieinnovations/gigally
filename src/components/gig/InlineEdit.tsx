import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Pencil, Check, X } from "lucide-react";
import { cleanMarkdown } from "@/lib/format";

interface InlineEditProps {
  value: string;
  onSave: (value: string) => void | Promise<void>;
  multiline?: boolean;
  className?: string;
  placeholder?: string;
  maxLength?: number;
}

export const InlineEdit = ({ value, onSave, multiline, className, placeholder, maxLength }: InlineEditProps) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value || "");

  useEffect(() => setDraft(value || ""), [value]);

  const save = async () => {
    if (draft !== value) await onSave(draft);
    setEditing(false);
  };
  const cancel = () => { setDraft(value || ""); setEditing(false); };

  if (!editing) {
    return (
      <div className="group relative">
        <div className={className}>{cleanMarkdown(value || placeholder || "")}</div>
        <Button variant="ghost" size="icon" className="absolute -top-1 -right-1 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setEditing(true)}>
          <Pencil className="h-3.5 w-3.5" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {multiline ? (
        <Textarea value={draft} onChange={(e) => setDraft(e.target.value)} maxLength={maxLength} className="min-h-[120px]" placeholder={placeholder} autoFocus />
      ) : (
        <Input value={draft} onChange={(e) => setDraft(e.target.value)} maxLength={maxLength} placeholder={placeholder} autoFocus />
      )}
      <div className="flex items-center justify-between">
        {maxLength && <span className="text-xs text-muted-foreground">{draft.length}/{maxLength}</span>}
        <div className="flex gap-1.5 ml-auto">
          <Button size="sm" variant="outline" onClick={cancel}><X className="h-3.5 w-3.5 mr-1" /> Cancel</Button>
          <Button size="sm" onClick={save} className="gradient-btn text-primary-foreground"><Check className="h-3.5 w-3.5 mr-1" /> Save</Button>
        </div>
      </div>
    </div>
  );
};

interface TagsEditProps {
  tags: string[];
  onSave: (tags: string[]) => void | Promise<void>;
}

export const TagsEdit = ({ tags, onSave }: TagsEditProps) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState((tags || []).join(", "));

  useEffect(() => setDraft((tags || []).join(", ")), [tags]);

  const save = async () => {
    const next = draft.split(",").map((t) => t.trim()).filter(Boolean);
    await onSave(next);
    setEditing(false);
  };

  if (!editing) {
    return (
      <div className="group relative">
        <div className="flex flex-wrap gap-1.5 pr-8">
          {tags?.map((tag, i) => (
            <span key={i} className="text-xs bg-secondary/10 text-secondary-foreground border px-2 py-0.5 rounded-md">{cleanMarkdown(tag)}</span>
          ))}
        </div>
        <Button variant="ghost" size="icon" className="absolute -top-1 -right-1 h-7 w-7 opacity-0 group-hover:opacity-100" onClick={() => setEditing(true)}>
          <Pencil className="h-3.5 w-3.5" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Textarea value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Comma-separated tags" className="min-h-[80px]" autoFocus />
      <div className="flex gap-1.5 justify-end">
        <Button size="sm" variant="outline" onClick={() => { setDraft((tags || []).join(", ")); setEditing(false); }}><X className="h-3.5 w-3.5 mr-1" /> Cancel</Button>
        <Button size="sm" onClick={save} className="gradient-btn text-primary-foreground"><Check className="h-3.5 w-3.5 mr-1" /> Save</Button>
      </div>
    </div>
  );
};