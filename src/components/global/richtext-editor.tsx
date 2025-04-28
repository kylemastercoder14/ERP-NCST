import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextEditorMenuBar from "./text-editor-menubar";

type TextEditorProps = {
  onChange: (content: string) => void;
  value?: string; // Add this line
  placeholder?: string; // Add this line
  disabled?: boolean; // Add this line
};

export default function RichTextEditor({
  onChange,
  value,
  placeholder,
  disabled,
}: TextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[60px] with-list cursor-text rounded-md border p-5 ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 prose prose-sm",
      },
    },
    immediatelyRender: false,
  });
  return (
    <div>
      <TextEditorMenuBar editor={editor} />
      <EditorContent
        editor={editor}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );
}
