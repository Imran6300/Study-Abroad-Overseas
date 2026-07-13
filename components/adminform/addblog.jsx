// components/adminform/BlogPostForm.jsx

import { useState, useRef, useEffect } from "react";
import {
  FileText,
  Image as ImageIcon,
  Globe,
  Tag,
  Calendar,
  Star,
  BookOpen,
  Layout,
  X,
} from "lucide-react";

// Tiptap imports
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";

export default function BlogPostForm({
  mode = "add",
  initialData,
  onSuccess,
  onCancel,
  isSubmitting = false,
}) {
  const safeData = initialData || {};
  const isEdit = mode === "edit";

  const [formData, setFormData] = useState({
    title: safeData.title || "",
    metaTitle: safeData.metaTitle || "",
    metaDescription: safeData.metaDescription || "",
    excerpt: safeData.excerpt || "",
    status: safeData.status || "Draft",
    publishDate: safeData.publishDate
      ? new Date(safeData.publishDate).toISOString().slice(0, 16)
      : "",
    featured: safeData.featured || false,
    focusCountry: safeData.focusCountry || "",
    focusUniversity: safeData.focusUniversity || "",
    focusCourseLevel: safeData.focusCourseLevel || "",
    tags: safeData.tags?.join(", ") || "",
    estimatedReadTime: safeData.estimatedReadTime || "8 min",
  });

  // Image handling states
  const [previewUrl, setPreviewUrl] = useState(
    safeData.coverImage?.url || null,
  );
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Tiptap editor setup – with SSR fix
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: {
          rel: "noopener noreferrer",
        },
      }),
    ],
    content: safeData.content || "<p>Start writing your article here...</p>",
    immediatelyRender: false, // ← Critical: prevents SSR + hydration mismatch
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[380px] px-4 py-3",
      },
    },
  });

  // Clean up object URL on unmount / change
  useEffect(() => {
    return () => {
      if (typeof previewUrl === "string" && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Prompts for a URL and applies it to the current selection as a link.
  // If the selection already has a link, pre-fills the prompt with the
  // existing URL so it's easy to edit rather than re-type.
  const handleSetLink = () => {
    if (!editor) return;

    const previousUrl = editor.getAttributes("link").href || "";
    const url = window.prompt("Enter URL", previousUrl);

    // Cancelled prompt
    if (url === null) return;

    // Empty string clears the link
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url, target: "_blank" })
      .run();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleImageDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const removeImage = (e) => {
    e.stopPropagation();

    if (typeof previewUrl === "string" && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(null);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const submitData = new FormData();

    // Append all text/checkbox fields
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "tags") {
        const tagsArray = value
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);
        submitData.append("tags", JSON.stringify(tagsArray));
      } else if (key !== "coverImage") {
        submitData.append(key, value);
      }
    });

    // Append rich content (HTML)
    if (editor) {
      submitData.append("content", editor.getHTML());
    }

    // Append image file if selected
    if (selectedFile) {
      submitData.append("coverImage", selectedFile);
    }

    onSuccess(submitData);
  };

  const metaTitleLength = formData.metaTitle.length;
  const metaDescLength = formData.metaDescription.length;

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-6">
      {/* ==================== MAIN CONTENT ==================== */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 pb-2 border-b border-gray-200">
          <FileText className="text-sky-600" size={20} />
          <h3 className="text-lg font-semibold text-gray-800">
            Article Basics
          </h3>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1">
            Article Title <span className="text-red-600 text-base">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            maxLength={100}
            className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-400 transition-all shadow-sm text-gray-900 placeholder-gray-400"
            placeholder="Study in Canada 2026: Top Universities, Scholarships & Visa Guide"
          />
          <p className="mt-1.5 text-xs text-gray-500">
            Best: 55–65 characters for search results
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Short Excerpt / Preview Text
          </label>
          <textarea
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            rows={4}
            className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-400 transition-all shadow-sm text-gray-900 placeholder-gray-400 resize-y"
            placeholder="Discover the best Canadian universities for 2026 intake, scholarships for Indian students, IELTS tips, and complete visa process..."
          />
        </div>
      </div>

      {/* ==================== SEO META ==================== */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 pb-2 border-b border-gray-200">
          <Globe className="text-sky-600" size={20} />
          <h3 className="text-lg font-semibold text-gray-800">SEO Settings</h3>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Meta Title
          </label>
          <input
            type="text"
            name="metaTitle"
            value={formData.metaTitle}
            onChange={handleChange}
            maxLength={85}
            className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-400 transition-all shadow-sm"
            placeholder="Best Canada Universities 2026 for Indians | Khizar Overseas"
          />
          <div className="mt-1.5 flex justify-between text-xs">
            <span className="text-gray-500">60 characters recommended</span>
            <span
              className={
                metaTitleLength > 60 ? "text-amber-600" : "text-gray-500"
              }
            >
              {metaTitleLength} / 60
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Meta Description
          </label>
          <textarea
            name="metaDescription"
            value={formData.metaDescription}
            onChange={handleChange}
            rows={3}
            maxLength={250}
            className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-400 transition-all shadow-sm resize-y"
            placeholder="Explore top universities in Canada for 2026, high-acceptance scholarships, student visa tips & application guide for Indian students..."
          />
          <div className="mt-1.5 flex justify-between text-xs">
            <span className="text-gray-500">150–160 characters ideal</span>
            <span
              className={
                metaDescLength > 160 ? "text-amber-600" : "text-gray-500"
              }
            >
              {metaDescLength} / 160
            </span>
          </div>
        </div>
      </div>

      {/* ==================== FEATURED IMAGE DROPZONE ==================== */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 pb-2 border-b border-gray-200">
          <ImageIcon className="text-sky-600" size={20} />
          <h3 className="text-lg font-semibold text-gray-800">
            Featured Image
          </h3>
        </div>

        <div>
          <div
            className={`
              border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer
              ${isDragging ? "border-sky-500 bg-sky-50 ring-2 ring-sky-200" : "border-gray-300 hover:border-sky-400 hover:bg-gray-50"}
            `}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleImageDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleImageChange}
            />

            {previewUrl ? (
              <div className="space-y-4">
                <div className="relative mx-auto w-full max-w-md rounded-lg overflow-hidden shadow-lg">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-64 object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-3 right-3 bg-red-600 text-white rounded-full p-2 hover:bg-red-700 transition-colors shadow-md"
                  >
                    <X size={18} />
                  </button>
                </div>

                {selectedFile && (
                  <div className="text-sm text-gray-700 font-medium">
                    {selectedFile.name} •{" "}
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                )}

                <p className="text-sm text-gray-500">
                  Click or drag to replace image
                </p>
              </div>
            ) : (
              <div className="space-y-4 py-6">
                <div className="mx-auto w-20 h-20 bg-sky-100 rounded-full flex items-center justify-center">
                  <ImageIcon className="text-sky-600" size={32} />
                </div>
                <p className="text-lg font-medium text-gray-700">
                  Drag & drop your image here
                </p>
                <p className="text-sm text-gray-500">or</p>
                <button
                  type="button"
                  className="px-6 py-3 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition-colors font-medium shadow-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  Choose File
                </button>
                <p className="text-xs text-gray-500 mt-4">
                  JPG, PNG, WebP • Recommended: 1200×800 or larger • Max 5MB
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Alt text will be generated from article title
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ==================== TARGETING & TAXONOMY ==================== */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 pb-2 border-b border-gray-200">
          <BookOpen className="text-sky-600" size={20} />
          <h3 className="text-lg font-semibold text-gray-800">
            Content Targeting
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Focus Country
            </label>
            <input
              type="text"
              name="focusCountry"
              value={formData.focusCountry}
              onChange={handleChange}
              className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 shadow-sm"
              placeholder="Canada / UK / Germany / Australia..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Focus University
            </label>
            <input
              type="text"
              name="focusUniversity"
              value={formData.focusUniversity}
              onChange={handleChange}
              className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 shadow-sm"
              placeholder="University of Toronto / ETH Zurich..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Course Level
            </label>
            <select
              name="focusCourseLevel"
              value={formData.focusCourseLevel}
              onChange={handleChange}
              className="block w-full px-4 py-3 border border-gray-300 bg-white rounded-xl focus:ring-2 focus:ring-sky-500 shadow-sm"
            >
              <option value="">Any Level</option>
              <option value="Undergraduate">Undergraduate (UG)</option>
              <option value="Postgraduate">Postgraduate / Masters</option>
              <option value="PhD">PhD / Doctoral</option>
              <option value="Diploma">Diploma / Certificate</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
            <Tag size={16} />
            Tags / Keywords (comma separated)
          </label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 shadow-sm"
            placeholder="study in canada, canada student visa 2026, scholarships for indians, ielts preparation..."
          />
        </div>
      </div>

      {/* ==================== PUBLISHING OPTIONS ==================== */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 pb-2 border-b border-gray-200">
          <Calendar className="text-sky-600" size={20} />
          <h3 className="text-lg font-semibold text-gray-800">Publishing</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="block w-full px-4 py-3 border border-gray-300 bg-white rounded-xl focus:ring-2 focus:ring-sky-500 shadow-sm"
            >
              <option value="Draft">Draft</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Published">Published</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Publish Date
            </label>
            <input
              type="datetime-local"
              name="publishDate"
              value={formData.publishDate}
              onChange={handleChange}
              className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 shadow-sm"
            />
          </div>

          <div className="flex items-center pt-6 sm:pt-0">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="w-5 h-5 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
              />
              <div className="flex items-center gap-1.5">
                <Star
                  size={16}
                  className="text-amber-500"
                  fill={formData.featured ? "currentColor" : "none"}
                />
                <span className="text-sm font-medium text-gray-700">
                  Featured Post
                </span>
              </div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Est. Reading Time
            </label>
            <input
              type="text"
              name="estimatedReadTime"
              value={formData.estimatedReadTime}
              onChange={handleChange}
              className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 shadow-sm"
              placeholder="8 min"
            />
          </div>
        </div>
      </div>

      {/* ==================== ARTICLE CONTENT WITH TIPTAP ==================== */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 pb-2 border-b border-gray-200">
          <Layout className="text-sky-600" size={20} />
          <h3 className="text-lg font-semibold text-gray-800">
            Article Content
          </h3>
        </div>

        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
          <div className="bg-gray-50 px-4 py-3 border-b text-sm font-medium text-gray-600">
            Full Article Body
          </div>

          <div className="border-b p-2 flex gap-2 bg-gray-50">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className="px-2 py-1 border rounded"
            >
              Bold
            </button>

            <button
              type="button"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              className="px-2 py-1 border rounded"
            >
              H1
            </button>

            <button
              type="button"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className="px-2 py-1 border rounded"
            >
              H2
            </button>

            <button
              type="button"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              className="px-2 py-1 border rounded"
            >
              H3
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className="px-2 py-1 border rounded"
            >
              Bullet List
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className="px-2 py-1 border rounded"
            >
              Number List
            </button>

            <button
              type="button"
              onClick={handleSetLink}
              className={`px-2 py-1 border rounded ${
                editor?.isActive("link") ? "bg-sky-100 border-sky-400" : ""
              }`}
            >
              Link
            </button>

            <button
              type="button"
              onClick={() =>
                editor.chain().focus().extendMarkRange("link").unsetLink().run()
              }
              disabled={!editor?.isActive("link")}
              className="px-2 py-1 border rounded disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Unlink
            </button>
          </div>

          <div className="min-h-[480px] bg-white">
            {editor && <EditorContent editor={editor} />}
          </div>
        </div>
      </div>

      {/* ==================== ACTIONS ==================== */}
      <div className="flex justify-end gap-4 pt-10 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-8 py-3.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`
            px-8 py-3.5 rounded-xl font-medium text-white shadow-md transition-all min-w-[160px]
            ${isSubmitting ? "bg-sky-400 cursor-not-allowed" : "bg-sky-600 hover:bg-sky-700 active:bg-sky-800"}
          `}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
              Saving...
            </span>
          ) : isEdit ? (
            "Update Article"
          ) : (
            "Publish Article"
          )}
        </button>
      </div>
    </form>
  );
}
