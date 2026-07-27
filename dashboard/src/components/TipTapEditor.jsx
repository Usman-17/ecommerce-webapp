import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import UnderlineExt from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";

import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
  Heading1,
  Heading2,
  Heading3,
  Type,
  Minus,
} from "lucide-react";

const TiptapEditor = ({
  value = "",
  onChange,
  isDarkMode = false,
  placeholder = "Write your content here...",
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        textAlign: false,
      }),
      UnderlineExt,
      Link.configure({ openOnClick: false }),
      Image.configure({ inline: true, allowBase64: true }),
      Placeholder.configure({ placeholder }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: `tiptap-editor-content ${isDarkMode ? "dark" : "light"}`,
      },
    },
  });

  if (!editor) return null;

  const btnClass = (active) =>
    `p-1.5 rounded transition-colors ${
      active
        ? "bg-purple-600 text-white"
        : isDarkMode
          ? "text-gray-300 hover:bg-gray-800 hover:text-white"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    }`;

  const handleAddLink = () => {
    const url = window.prompt("Enter URL:");
    if (url) editor.chain().focus().toggleLink({ href: url }).run();
    else editor.chain().focus().unsetLink().run();
  };

  const handleAddImage = () => {
    const url = window.prompt("Enter image URL:");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const ToolbarButton = ({ onClick, isActive, children, title }) => (
    <button
      type="button"
      onClick={onClick}
      className={btnClass(isActive)}
      title={title}
    >
      {children}
    </button>
  );

  return (
    <div
      className={`rounded-md overflow-hidden border ${
        isDarkMode ? "border-white/10 bg-[#1A162B]" : "border-gray-200 bg-white"
      }`}
    >
      <style>{`
        .tiptap-editor-content p[style*="text-align: left"],
        .tiptap-editor-content h1[style*="text-align: left"],
        .tiptap-editor-content h2[style*="text-align: left"],
        .tiptap-editor-content h3[style*="text-align: left"],
        .tiptap-editor-content li[style*="text-align: left"] { text-align: left !important; }

        .tiptap-editor-content p[style*="text-align: center"],
        .tiptap-editor-content h1[style*="text-align: center"],
        .tiptap-editor-content h2[style*="text-align: center"],
        .tiptap-editor-content h3[style*="text-align: center"],
        .tiptap-editor-content li[style*="text-align: center"] { text-align: center !important; }

        .tiptap-editor-content p[style*="text-align: right"],
        .tiptap-editor-content h1[style*="text-align: right"],
        .tiptap-editor-content h2[style*="text-align: right"],
        .tiptap-editor-content h3[style*="text-align: right"],
        .tiptap-editor-content li[style*="text-align: right"] { text-align: right !important; }

        .tiptap-editor-content p[style*="text-align: justify"],
        .tiptap-editor-content h1[style*="text-align: justify"],
        .tiptap-editor-content h2[style*="text-align: justify"],
        .tiptap-editor-content h3[style*="text-align: justify"],
        .tiptap-editor-content li[style*="text-align: justify"] { text-align: justify !important; }
      `}</style>
      <div
        className={`flex flex-wrap items-center gap-1 p-2 border-b ${
          isDarkMode
            ? "border-gray-800 bg-[#0d0c1a]/80"
            : "border-gray-200 bg-gray-50"
        }`}
      >
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          isActive={editor.isActive("heading", { level: 1 })}
          title="Heading 1"
        >
          <Heading1 size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          isActive={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          <Heading2 size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          isActive={editor.isActive("heading", { level: 3 })}
          title="Heading 3"
        >
          <Heading3 size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setParagraph().run()}
          isActive={editor.isActive("paragraph")}
          title="Paragraph"
        >
          <Type size={16} />
        </ToolbarButton>

        <div
          className={`w-px h-5 mx-1 ${isDarkMode ? "bg-gray-700" : "bg-gray-300"}`}
        />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          title="Bold"
        >
          <Bold size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          title="Italic"
        >
          <Italic size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive("underline")}
          title="Underline"
        >
          <Underline size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive("strike")}
          title="Strikethrough"
        >
          <Strikethrough size={16} />
        </ToolbarButton>

        <div
          className={`w-px h-5 mx-1 ${isDarkMode ? "bg-gray-700" : "bg-gray-300"}`}
        />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          title="Bullet List"
        >
          <List size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          title="Ordered List"
        >
          <ListOrdered size={16} />
        </ToolbarButton>

        <div
          className={`w-px h-5 mx-1 ${isDarkMode ? "bg-gray-700" : "bg-gray-300"}`}
        />

        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          isActive={editor.isActive({ textAlign: "left" })}
          title="Align Left"
        >
          <AlignLeft size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          isActive={editor.isActive({ textAlign: "center" })}
          title="Align Center"
        >
          <AlignCenter size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          isActive={editor.isActive({ textAlign: "right" })}
          title="Align Right"
        >
          <AlignRight size={16} />
        </ToolbarButton>

        <div
          className={`w-px h-5 mx-1 ${isDarkMode ? "bg-gray-700" : "bg-gray-300"}`}
        />

        <ToolbarButton
          onClick={handleAddLink}
          isActive={editor.isActive("link")}
          title="Add Link"
        >
          <LinkIcon size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={handleAddImage} title="Add Image">
          <ImageIcon size={16} />
        </ToolbarButton>

        <div
          className={`w-px h-5 mx-1 ${isDarkMode ? "bg-gray-700" : "bg-gray-300"}`}
        />

        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal Rule"
        >
          <Minus size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          title="Undo"
        >
          <Undo size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          title="Redo"
        >
          <Redo size={16} />
        </ToolbarButton>
      </div>

      <EditorContent
        editor={editor}
        className={`tiptap-wrapper [&_.tiptap-editor-content.ProseMirror]:outline-none [&_.tiptap-editor-content.ProseMirror]:p-3 [&_.tiptap-editor-content.ProseMirror]:min-h-[200px] [&_.tiptap-editor-content.ProseMirror]:text-sm [&_.tiptap-editor-content.ProseMirror]:sm:text-[15px]
          ${
            isDarkMode
              ? "[&_.tiptap-editor-content.ProseMirror]:text-gray-200 [&_.tiptap-editor-content.ProseMirror]:placeholder-gray-500"
              : "[&_.tiptap-editor-content.ProseMirror]:text-gray-800 [&_.tiptap-editor-content.ProseMirror]:placeholder-gray-400"
          }
          [&_.tiptap-editor-content.ProseMirror_ul]:list-disc [&_.tiptap-editor-content.ProseMirror_ul]:pl-6
          [&_.tiptap-editor-content.ProseMirror_ol]:list-decimal [&_.tiptap-editor-content.ProseMirror_ol]:pl-6
          [&_.tiptap-editor-content.ProseMirror_h1]:text-2xl [&_.tiptap-editor-content.ProseMirror_h1]:font-bold
          [&_.tiptap-editor-content.ProseMirror_h2]:text-xl [&_.tiptap-editor-content.ProseMirror_h2]:font-bold
          [&_.tiptap-editor-content.ProseMirror_h3]:text-lg [&_.tiptap-editor-content.ProseMirror_h3]:font-semibold
          [&_.tiptap-editor-content.ProseMirror_a]:text-purple-500 [&_.tiptap-editor-content.ProseMirror_a]:underline
          [&_.tiptap-editor-content.ProseMirror_img]:max-w-full [&_.tiptap-editor-content.ProseMirror_img]:rounded
        `}
      />
    </div>
  );
};

export default TiptapEditor;
