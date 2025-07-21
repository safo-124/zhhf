'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Button } from '@/components/ui/button';
import { Bold, Italic, List } from 'lucide-react';

const TiptapToolbar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="border border-input bg-transparent rounded-t-md p-1 flex items-center gap-1">
      <Button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        variant={editor.isActive('bold') ? 'default' : 'ghost'}
        size="sm"
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        variant={editor.isActive('italic') ? 'default' : 'ghost'}
        size="sm"
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
        size="sm"
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  );
};

export function RichTextEditor({ initialContent, onUpdate }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent || '',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        // UPDATED LINE BELOW
        class: 'prose dark:prose-invert prose-sm sm:prose-base min-h-[200px] max-h-[400px] overflow-y-auto border-x border-b border-input rounded-b-md p-4 focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML());
    },
  });

  return (
    <div>
      <TiptapToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}