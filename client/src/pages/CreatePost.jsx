import React, { useState, useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { toast, Toaster } from "react-hot-toast";
import { useCreateNewPostMutation, useGetAllBlogsQuery } from "../redux/blog/blogApi";

// Toolbar component for rich text editor
const EditorToolbar = ({ editor }) => {
  if (!editor) return null;

  const buttons = [
    { 
      action: () => editor.chain().focus().toggleBold().run(), 
      icon: "B", 
      title: "Bold", 
      active: editor.isActive("bold"),
      className: "font-bold"
    },
    { 
      action: () => editor.chain().focus().toggleItalic().run(), 
      icon: "I", 
      title: "Italic", 
      active: editor.isActive("italic"),
      className: "italic"
    },
    { 
      action: () => editor.chain().focus().toggleUnderline().run(), 
      icon: "U", 
      title: "Underline", 
      active: editor.isActive("underline"),
      className: "underline"
    },
    { 
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), 
      icon: "H1", 
      title: "Heading 1", 
      active: editor.isActive("heading", { level: 1 }),
      className: "text-xl font-bold"
    },
    { 
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), 
      icon: "H2", 
      title: "Heading 2", 
      active: editor.isActive("heading", { level: 2 }),
      className: "text-lg font-bold"
    },
    { 
      action: () => editor.chain().focus().toggleBulletList().run(), 
      icon: "•", 
      title: "Bullet List", 
      active: editor.isActive("bulletList")
    },
    { 
      action: () => editor.chain().focus().toggleOrderedList().run(), 
      icon: "1.", 
      title: "Numbered List", 
      active: editor.isActive("orderedList")
    },
    { 
      action: () => editor.chain().focus().toggleBlockquote().run(), 
      icon: "❝", 
      title: "Quote", 
      active: editor.isActive("blockquote")
    },
    { 
      action: () => editor.chain().focus().setParagraph().run(), 
      icon: "P", 
      title: "Paragraph", 
      active: editor.isActive("paragraph")
    },
  ];

  return (
    <div className="flex flex-wrap gap-1 p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
      {buttons.map((btn, idx) => (
        <button
          key={idx}
          type="button"
          onClick={btn.action}
          className={`px-3 py-2 rounded text-sm font-medium transition-all ${btn.active ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'} ${btn.className || ''}`}
          title={btn.title}
        >
          {btn.icon}
        </button>
      ))}
      
      {/* Clear formatting button */}
      <button
        type="button"
        onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
        className="px-3 py-2 rounded text-sm font-medium bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
        title="Clear Formatting"
      >
        Clear
      </button>
    </div>
  );
};

export default function CreatePost() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const { data: blogs, error, isLoading:getAllBlogsLoading } = useGetAllBlogsQuery();
  
  const { id } = useParams();
  const selectedBlog = blogs?.find((blog) => blog._id === id);
  
  const [title, setTitle] = useState(selectedBlog ? selectedBlog?.title :"")
  // mutation
  const [createNewPost, { isLoading }] = useCreateNewPostMutation();
  // Content editor configuration
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({
        placeholder: "Write your blog content here... Use the toolbar above for formatting.",
      }),
    ],
    content: selectedBlog ? selectedBlog?.content: "",
    onUpdate: ({ editor }) => {
      setCharCount(editor.getText().length);
    },
    editorProps: {
      attributes: {
        class: "focus:outline-none min-h-[300px] p-4",
      },
    },
  });

  // Character limit
  const MAX_CHARS = 10000;
  const TITLE_MAX_CHARS = 150;

  // Handle form submission
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!editor) {
      toast.error("Editor is not ready");
      return;
    }

    const trimmedTitle = title.trim();
    const content = editor.getHTML();

    // Validation
    if (!trimmedTitle) {
      toast.error("Please enter a title");
      return;
    }

    if (trimmedTitle.length < 5) {
      toast.error("Title should be at least 5 characters");
      return;
    }

    if (trimmedTitle.length > TITLE_MAX_CHARS) {
      toast.error(`Title cannot exceed ${TITLE_MAX_CHARS} characters`);
      return;
    }

    if (!content || content === "<p></p>" || editor.getText().trim().length === 0) {
      toast.error("Please enter some content");
      editor.commands.focus();
      return;
    }

    if (charCount > MAX_CHARS) {
      toast.error(`Content exceeds ${MAX_CHARS} characters limit`);
      return;
    }

    try {

      const result= await createNewPost({title:title,content:content})

      if(result?.data){
        toast.success("Post published successfully!")
      }
      setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      console.error("Error saving post:", error);
      toast.error("Failed to publish post. Please try again.");
    } finally {
      console.log("object")
    }
  }, [title, editor, charCount, navigate]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (!isSubmitting) {
          handleSubmit(e);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleSubmit, isSubmitting]);

  // Clear editor content
  const handleClearEditor = () => {
    if (editor) {
      editor.commands.clearContent();
      toast.success("Editor cleared!");
    }
  };

  useEffect(() => {
  if (editor && selectedBlog) {
    editor.commands.setContent(selectedBlog.content || "");
    setTitle(selectedBlog.title || "");
  }
}, [editor, selectedBlog]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center py-8 px-4">
      <Toaster 
        position="top-right" 
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
      
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-xl w-full max-w-4xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
            Create New Blog Post
          </h2>
          <p className="text-gray-600 text-center">
            Write your title and use the rich text editor for content
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Title Field - Simple Input */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-gray-700 font-semibold">
                Title
              </label>
              <span className={`text-sm ${title?.length > TITLE_MAX_CHARS ? 'text-red-600' : 'text-gray-500'}`}>
                {title?.length}/{TITLE_MAX_CHARS} characters
              </span>
            </div>
            <input
              type="text"
              placeholder="Enter post title here..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={TITLE_MAX_CHARS}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-medium"
            />
            {title?.length > TITLE_MAX_CHARS - 20 && (
              <p className="text-sm text-orange-600 mt-1">
                Title is getting long. Consider keeping it concise.
              </p>
            )}
          </div>

          {/* Content Field - Rich Text Editor */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-gray-700 font-semibold">
                Content
              </label>
              <div className="flex gap-4 items-center">
                <span className={`text-sm ${charCount > MAX_CHARS ? 'text-red-600' : 'text-gray-500'}`}>
                  {charCount}/{MAX_CHARS} characters
                </span>
                <button
                  type="button"
                  onClick={handleClearEditor}
                  className="text-sm text-red-600 hover:text-red-800 font-medium"
                >
                  Clear Editor
                </button>
              </div>
            </div>
            
            {/* Editor with Toolbar */}
            <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm">
              <EditorToolbar editor={editor} />
              <div className="bg-white">
                <EditorContent
                  editor={editor}
                  className="prose prose-sm sm:prose lg:prose-lg max-w-none min-h-[400px] max-h-[600px] overflow-y-auto"
                />
              </div>
            </div>
            
            {charCount > MAX_CHARS && (
              <p className="text-sm text-red-600 mt-2">
                ⚠️ Character limit exceeded! Please shorten your content.
              </p>
            )}
            
            {/* Editor Tips */}
            <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800 font-medium mb-1">💡 Editor Tips:</p>
              <ul className="text-xs text-blue-700 list-disc list-inside space-y-1">
                <li>Use toolbar buttons or keyboard shortcuts (Ctrl+B, Ctrl+I)</li>
                <li>Paste formatted text from other editors</li>
                <li>Use headings to structure your content</li>
                <li>Save frequently with Ctrl+S</li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || charCount > MAX_CHARS || !title?.trim()}
              className="px-6 py-3 rounded-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex-1 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Publishing...
                </>
              ) : (
                "Publish Post"
              )}
            </button>
          </div>

          {/* Keyboard Shortcut Hint */}
          <div className="text-center text-sm text-gray-500 mt-4">
            <p>💡 Tip: Use <kbd className="px-2 py-1 bg-gray-100 rounded border">Ctrl</kbd> + <kbd className="px-2 py-1 bg-gray-100 rounded border">S</kbd> to save your post</p>
          </div>
        </form>
      </div>
    </div>
  );
}