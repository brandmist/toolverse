export interface Tool {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  icon: string;
  isPopular?: boolean;
  isNew?: boolean;
  // New Directory Metadata
  pricing?: 'Free' | 'Freemium' | 'Paid';
  rating?: number;
  reviews?: number;
  verified?: boolean;
  developer?: string;
  features?: string[];
  useCases?: string[];
  pros?: string[];
  cons?: string[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color?: string;
}

export const CATEGORIES: Category[] = [
  { id: 'text', name: 'Text Tools', description: 'Format, align, and manipulate text', icon: 'Type' },
  { id: 'image', name: 'Image Tools', description: 'Edit, convert, and optimize images', icon: 'Image' },
  { id: 'css', name: 'CSS Tools', description: 'Generators for shadows, gradients, and shapes', icon: 'Paintbrush' },
  { id: 'coding', name: 'Coding Tools', description: 'Minifiers, formatters, and utilities', icon: 'Code' },
  { id: 'color', name: 'Color Tools', description: 'Palettes, converters, and extractors', icon: 'Palette' },
  { id: 'social', name: 'Social Media', description: 'Generators for posts, tweets, and more', icon: 'Share2' },
  { id: 'pdf', name: 'PDF Tools', description: 'Merge, split, and convert PDF files', icon: 'FileText' },
  { id: 'utility', name: 'Utility Tools', description: 'Calculators, randomizers, and generators', icon: 'Wrench' },
];

const unsortedTools: Tool[] = [
  // Text
  { 
    id: 'case-converter', 
    name: 'Case Converter', 
    description: 'Convert text between uppercase, lowercase, camelCase, and more instantly.', 
    categoryId: 'text', 
    icon: 'TypeSquare', 
    isPopular: true,
    pricing: 'Free',
    rating: 4.9,
    reviews: 1240,
    verified: true,
    developer: 'SmarTools Official',
    features: ['Instant real-time conversion', '6+ formatting options', 'One-click copy to clipboard', '100% client-side privacy'],
    useCases: ['Formatting essay titles', 'Normalizing database strings', 'Generating programming variables (camelCase)'],
    pros: ['Lightning fast', 'No data leaves your browser', 'Zero ads'],
    cons: ['Does not support massive 100MB+ files']
  },
  { id: 'lorem-ipsum', name: 'Paragraph Generator', description: 'Generate placeholder text for diverse designs and layouts.', categoryId: 'text', icon: 'AlignLeft' },
  { id: 'letter-counter', name: 'Letter Counter', description: 'Count characters, words, sentences, and paragraphs in your text.', categoryId: 'text', icon: 'Hash', isPopular: true },
  { id: 'whitespace-remover', name: 'Whitespace Remover', description: 'Remove extra spaces, tabs, and line breaks from text.', categoryId: 'text', icon: 'Space' },
  { id: 'bionic-reading', name: 'Bionic Reading Converter', description: 'Convert text to bionic reading format for faster reading.', categoryId: 'text', icon: 'Eye', isNew: true },
  { id: 'markdown-to-html', name: 'Markdown to HTML Converter', description: 'Convert Markdown syntax to beautifully rendered HTML code.', categoryId: 'text', icon: 'FileCode2', isNew: true },
  { id: 'text-reverser', name: 'Text Reverser', description: 'Reverse any text, words, or sentences instantly.', categoryId: 'text', icon: 'RotateCcw', isNew: true },
  { id: 'duplicate-remover', name: 'Duplicate Line Remover', description: 'Remove duplicate lines from any list or text block.', categoryId: 'text', icon: 'ListMinus' },
  { id: 'text-diff', name: 'Text Diff Checker', description: 'Compare two texts and highlight differences side-by-side.', categoryId: 'text', icon: 'GitCompare', isNew: true },

  // Image Core
  { id: 'image-converter', name: 'Image Converter', description: 'Convert images between JPG, PNG, WEBP and GIF formats.', categoryId: 'image', icon: 'ArrowRightLeft', isNew: true, isPopular: true },
  { id: 'jpg-to-png', name: 'JPG to PNG Converter', description: 'Convert JPG images to PNG format client-side.', categoryId: 'image', icon: 'ArrowRightLeft' },
  { id: 'jpg-to-webp', name: 'JPG to WEBP Converter', description: 'Convert JPG images to WEBP format client-side.', categoryId: 'image', icon: 'ArrowRightLeft' },
  { id: 'png-to-webp', name: 'PNG to WEBP Converter', description: 'Convert PNG images to WEBP format client-side.', categoryId: 'image', icon: 'ArrowRightLeft' },
  { id: 'webp-to-png', name: 'WEBP to PNG Converter', description: 'Convert WEBP images to PNG format client-side.', categoryId: 'image', icon: 'ArrowRightLeft' },
  { id: 'webp-to-jpg', name: 'WEBP to JPG Converter', description: 'Convert WEBP images to JPG format client-side.', categoryId: 'image', icon: 'ArrowRightLeft' },
  { id: 'jpg-to-svg', name: 'JPG to SVG Converter', description: 'Convert JPG images to vector SVG formats.', categoryId: 'image', icon: 'ArrowRightLeft' },
  { id: 'png-to-svg', name: 'PNG to SVG Converter', description: 'Convert PNG images to vector SVG formats.', categoryId: 'image', icon: 'ArrowRightLeft' },
  { id: 'tiff-to-png', name: 'TIFF to PNG Converter', description: 'Convert TIFF files to standard PNG format.', categoryId: 'image', icon: 'ArrowRightLeft' },
  { id: 'tiff-to-jpg', name: 'TIFF to JPG Converter', description: 'Convert TIFF files to JPG format.', categoryId: 'image', icon: 'ArrowRightLeft' },
  { id: 'tiff-to-svg', name: 'TIFF to SVG Converter', description: 'Convert TIFF files to vector SVG format.', categoryId: 'image', icon: 'ArrowRightLeft' },
  { id: 'gif-to-png', name: 'GIF to PNG Converter', description: 'Convert GIF images to static PNG format.', categoryId: 'image', icon: 'ArrowRightLeft' },
  { id: 'gif-to-jpg', name: 'GIF to JPG Converter', description: 'Convert GIF images to JPG format.', categoryId: 'image', icon: 'ArrowRightLeft' },
  { id: 'gif-to-avif', name: 'GIF to AVIF Converter', description: 'Convert GIF images to modern AVIF format.', categoryId: 'image', icon: 'ArrowRightLeft' },
  { id: 'gif-to-apng', name: 'GIF to APNG Converter', description: 'Convert GIF images to animated APNG format.', categoryId: 'image', icon: 'ArrowRightLeft' },
  { id: 'webp-to-gif', name: 'WEBP to GIF Converter', description: 'Convert WEBP images to GIF format.', categoryId: 'image', icon: 'ArrowRightLeft' },
  { id: 'heic-to-jpg', name: 'HEIC to JPG Converter', description: 'Convert HEIC/HEIF photos to JPG format.', categoryId: 'image', icon: 'ArrowRightLeft' },
  { id: 'heic-to-png', name: 'HEIC to PNG Converter', description: 'Convert HEIC/HEIF photos to PNG format.', categoryId: 'image', icon: 'ArrowRightLeft' },
  { id: 'heic-to-avif', name: 'HEIC to AVIF Converter', description: 'Convert HEIC/HEIF photos to AVIF format.', categoryId: 'image', icon: 'ArrowRightLeft' },
  { id: 'svg-to-png', name: 'SVG to PNG Converter', description: 'Convert SVG vector drawings to PNG format.', categoryId: 'image', icon: 'ArrowRightLeft' },
  { id: 'png-to-tiff', name: 'PNG to TIFF Converter', description: 'Convert PNG images to TIFF format.', categoryId: 'image', icon: 'ArrowRightLeft' },
  { id: 'png-to-avif', name: 'PNG to AVIF Converter', description: 'Convert PNG images to AVIF format.', categoryId: 'image', icon: 'ArrowRightLeft' },
  { id: 'jpg-to-avif', name: 'JPG to AVIF Converter', description: 'Convert JPG images to AVIF format.', categoryId: 'image', icon: 'ArrowRightLeft' },
  { id: 'webp-to-avif', name: 'WEBP to AVIF Converter', description: 'Convert WEBP images to AVIF format.', categoryId: 'image', icon: 'ArrowRightLeft' },
  { id: 'image-filters', name: 'Image Filters / Flips', description: 'Apply black and white, sepia, blur, flip, and rotate transformations.', categoryId: 'image', icon: 'ImagePlus' },
  { id: 'image-cropper', name: 'Image Cropper', description: 'Crop images to exact dimensions or aspect ratios.', categoryId: 'image', icon: 'Crop' },
  { id: 'image-resizer', name: 'Image Resizer', description: 'Resize images by pixels or percentage.', categoryId: 'image', icon: 'Maximize' },
  { id: 'image-compressor', name: 'Image Compressor', description: 'Compress and optimize images to reduce file size without quality loss.', categoryId: 'image', icon: 'PackageOpen', isPopular: true, isNew: true },
  { id: 'image-watermark', name: 'Image Watermark', description: 'Add custom text or image watermarks to your photos.', categoryId: 'image', icon: 'Stamp', isNew: true },
  { id: 'color-extractor', name: 'Color Extractor', description: 'Extract dominant colors from any image.', categoryId: 'image', icon: 'Droplet', isPopular: true },
  { id: 'svg-blob', name: 'SVG Blob Generator', description: 'Generate random, organic SVG shapes for backgrounds.', categoryId: 'image', icon: 'Hexagon' },
  { id: 'image-to-base64', name: 'Image To Base64', description: 'Convert image files to Base64 encoded strings.', categoryId: 'image', icon: 'Code', isPopular: true },
  { id: 'favicon-generator', name: 'Favicon Generator', description: 'Generate favicon.ico files in multiple sizes from any image.', categoryId: 'image', icon: 'Bookmark', isNew: true },
  { id: 'image-placeholder', name: 'Placeholder Image Generator', description: 'Generate placeholder images with custom sizes and colors.', categoryId: 'image', icon: 'ImageOff', isNew: true },
  { id: 'exif-editor', name: 'EXIF Metadata Editor', description: 'View and strip camera/GPS EXIF metadata parameters client-side.', categoryId: 'image', icon: 'ShieldCheck', isNew: true },
  { id: 'svg-optimizer', name: 'SVG Path Optimizer', description: 'Optimize vector coordinates and minify SVG shapes.', categoryId: 'image', icon: 'Sparkles', isNew: true },
  { id: 'gif-maker', name: 'GIF Maker', description: 'Stitch uploaded frame images into an animated GIF.', categoryId: 'image', icon: 'FileImage', isNew: true },
  { id: 'pixel-art', name: 'Pixel Art Creator', description: 'An interactive canvas grid to paint and export retro pixel art.', categoryId: 'image', icon: 'Paintbrush', isNew: true },
  { id: 'change-photo-background', name: 'Change Background of Photo', description: 'Automatically isolate subjects and change or replace photo backgrounds.', categoryId: 'image', icon: 'ImagePlus', isNew: true },
  { id: 'profile-photo-maker', name: 'Profile Photo Maker', description: 'Create rounded profile photos with custom borders and shadows.', categoryId: 'image', icon: 'User', isNew: true },
  { id: 'make-round-image', name: 'Make Round Image', description: 'Crop and save images as round PNG shapes.', categoryId: 'image', icon: 'Compass', isNew: true },
  { id: 'blur-background-tool', name: 'Blur Background Tools', description: 'Automatically isolate subject and apply a soft lens blur to background.', categoryId: 'image', icon: 'Image', isNew: true },
  { id: 'remove-watermark-image', name: 'Remove Watermark', description: 'Remove watermark from photo by brush coordinates.', categoryId: 'image', icon: 'Trash2', isNew: true },
  { id: 'remove-person-photo', name: 'Remove Person from Photo', description: 'Brush coordinates to remove a person from photo.', categoryId: 'image', icon: 'UserMinus', isNew: true },
  { id: 'combine-images', name: 'Combine Images', description: 'Stitch multiple images horizontally or vertically.', categoryId: 'image', icon: 'LayoutGrid', isNew: true },
  { id: 'make-background-transparent', name: 'Make Background Transparent', description: 'Select color keys to erase photo background transparency.', categoryId: 'image', icon: 'Scissors', isNew: true },
  { id: 'add-text-to-image', name: 'Add Text to an Image', description: 'Place text layers over photo canvas layouts.', categoryId: 'image', icon: 'Type', isNew: true },
  { id: 'image-splitter', name: 'Image Splitter', description: 'Cut and slice images into sub-grid pieces downloaded as a ZIP.', categoryId: 'image', icon: 'LayoutGrid', isNew: true },
  { id: 'add-border-to-image', name: 'Add Border to Image', description: 'Stamp solid frames around image boundaries.', categoryId: 'image', icon: 'Square', isNew: true },
  { id: 'translate-image', name: 'Translate Image', description: 'Perform OCR and translate text blocks in-place on the image.', categoryId: 'image', icon: 'Languages', isNew: true },
  { id: 'pixelate-image', name: 'Pixelate Image', description: 'Convert pictures into retro pixelated graphics.', categoryId: 'image', icon: 'Grid', isNew: true },
  { id: 'collage-maker', name: 'Collage Maker', description: 'Combine up to 4 images inside collage template grids.', categoryId: 'image', icon: 'LayoutTemplate', isNew: true },
  { id: 'gif-to-mp4', name: 'GIF to MP4 Converter', description: 'Convert animated GIF files into MP4/WebM video frames.', categoryId: 'image', icon: 'Play', isNew: true },
  { id: 'chart-maker', name: 'Chart Maker', description: 'Create Bar, Line, or Pie charts and download them as images.', categoryId: 'image', icon: 'BarChart2', isNew: true },
  { id: 'font-awesome-to-png', name: 'Font Awesome to Png', description: 'Render popular vector icons as customizable PNG templates.', categoryId: 'image', icon: 'Sparkles', isNew: true },
  { id: 'jpg-to-tiff', name: 'JPG to TIFF Converter', description: 'Convert JPEG images to TIFF format.', categoryId: 'image', icon: 'FileImage', isNew: true },
  { id: 'webp-to-jpg', name: 'WebP to JPG Converter', description: 'Convert WebP image file frames to standard JPG format.', categoryId: 'image', icon: 'FileImage', isNew: true },
  { id: 'upscale-image', name: 'Upscale Image', description: 'Increase the resolution and sharpness of your image.', categoryId: 'image', icon: 'Maximize', isNew: true },
  { id: 'colorize-photo', name: 'Colorize Photo', description: 'Add beautiful color adjustments and custom color fills to black-and-white photos.', categoryId: 'image', icon: 'Palette', isNew: true },

  // Image AI
  { id: 'ai-image-generator', name: 'AI Image Generator', description: 'Generate images from text prompts using advanced AI models.', categoryId: 'image', icon: 'Sparkles', isPopular: true },
  { id: 'remove-background', name: 'Remove Background', description: 'Automatically isolate subjects and remove image backgrounds.', categoryId: 'image', icon: 'Scissors', isPopular: true },
  { id: 'cleanup-picture', name: 'Cleanup Picture', description: 'Remove objects, dust, people, or text from pictures using AI.', categoryId: 'image', icon: 'Eraser' },
  { id: 'unblur-image', name: 'Unblur / Upscale Image', description: 'Enhance low quality images using AI super-resolution.', categoryId: 'image', icon: 'Activity' },
  { id: 'image-to-text', name: 'Image To Text (OCR)', description: 'Extract and translate text directly from uploaded images.', categoryId: 'image', icon: 'Languages' },

  // PDF Tools
  { id: 'pdf-compress', name: 'PDF Compressor', description: 'Compress PDF files to reduce size while preserving quality.', categoryId: 'pdf', icon: 'FileDown', isPopular: true },
  { id: 'pdf-merge', name: 'PDF Merger', description: 'Merge multiple PDF files into a single document.', categoryId: 'pdf', icon: 'FilePlus2', isPopular: true },
  { id: 'pdf-split', name: 'PDF Splitter', description: 'Split a PDF into individual pages or custom page ranges.', categoryId: 'pdf', icon: 'FileMinus2' },
  { id: 'pdf-to-jpg', name: 'PDF to JPG', description: 'Extract images from PDF files to high-quality JPGs.', categoryId: 'pdf', icon: 'FileImage' },
  { id: 'pdf-metadata', name: 'PDF Metadata Editor', description: 'View, edit, or strip metadata from PDF documents.', categoryId: 'pdf', icon: 'ShieldCheck', isNew: true },
  { id: 'extract-pdf-pages', name: 'Extract PDF Pages', description: 'Select specific pages from a PDF and extract them into a new document.', categoryId: 'pdf', icon: 'Copy', isNew: true },
  { id: 'pdf-to-png', name: 'PDF to PNG Converter', description: 'Convert PDF pages to PNG image formats.', categoryId: 'pdf', icon: 'FileImage' },
  { id: 'pdf-to-images', name: 'PDF to Images Converter', description: 'Convert and download all PDF pages as a ZIP archive.', categoryId: 'pdf', icon: 'FileImage' },
  { id: 'vsd-to-pdf', name: 'VSD to PDF Converter', description: 'Convert Microsoft Visio VSD files to PDF format.', categoryId: 'pdf', icon: 'FileSpreadsheet' },
  { id: 'vsd-to-docx', name: 'VSD to DOCX Converter', description: 'Convert Microsoft Visio VSD files to Word document outline.', categoryId: 'pdf', icon: 'FileSpreadsheet' },
  { id: 'vsd-to-pptx', name: 'VSD to PPTX Converter', description: 'Convert Microsoft Visio VSD files to PowerPoint slides.', categoryId: 'pdf', icon: 'FileSpreadsheet' },
  { id: 'vsd-to-jpg', name: 'VSD to JPG Converter', description: 'Convert Microsoft Visio VSD files to JPG image.', categoryId: 'pdf', icon: 'FileSpreadsheet' },
  { id: 'vsdx-to-pdf', name: 'VSDX to PDF Converter', description: 'Convert Microsoft Visio VSDX drawings to PDF format.', categoryId: 'pdf', icon: 'FileSpreadsheet' },
  { id: 'vsdx-to-docx', name: 'VSDX to DOCX Converter', description: 'Convert Microsoft Visio VSDX drawings to Word document outline.', categoryId: 'pdf', icon: 'FileSpreadsheet' },
  { id: 'vsdx-to-pptx', name: 'VSDX to PPTX Converter', description: 'Convert Microsoft Visio VSDX drawings to PowerPoint slides.', categoryId: 'pdf', icon: 'FileSpreadsheet' },
  { id: 'vsdx-to-jpg', name: 'VSDX to JPG Converter', description: 'Convert Microsoft Visio VSDX drawings to JPG image.', categoryId: 'pdf', icon: 'FileSpreadsheet' },
  { id: 'image-to-pdf', name: 'Images To PDF', description: 'Combine one or multiple images into a single PDF document.', categoryId: 'pdf', icon: 'FileStack', isNew: true },
  { id: 'pdf-rotate', name: 'PDF Page Rotator', description: 'Rotate pages in a PDF file by 90, 180, or 270 degrees.', categoryId: 'pdf', icon: 'RotateCw' },
  { id: 'pdf-watermark', name: 'PDF Watermark', description: 'Add custom text watermarks to every page of a PDF.', categoryId: 'pdf', icon: 'Stamp' },
  { id: 'pdf-to-text', name: 'PDF To Text', description: 'Extract all plain text content from a PDF file instantly.', categoryId: 'pdf', icon: 'FileType2', isNew: true },
  { id: 'text-to-pdf', name: 'Text To PDF', description: 'Convert raw text directly into a formatted PDF document.', categoryId: 'pdf', icon: 'FileText', isNew: true },
  { id: 'visio-converter', name: 'Visio Converter (VSD/VSDX)', description: 'Convert Microsoft Visio files (.vsd, .vsdx) to PDF, DOCX, PPTX, or JPG.', categoryId: 'pdf', icon: 'FileSpreadsheet', isNew: true },
  { id: 'pdf-organizer', name: 'PDF Page Organizer', description: 'Reorder and delete pages from PDF documents visually.', categoryId: 'pdf', icon: 'Layers', isNew: true },
  { id: 'pdf-signer', name: 'PDF Signature Tool', description: 'Draw or upload a signature and stamp it onto PDF pages.', categoryId: 'pdf', icon: 'PenTool', isNew: true },
  { id: 'epub-to-pdf', name: 'EPUB to PDF Converter', description: 'Convert EPUB eBooks into printable PDF formatting.', categoryId: 'pdf', icon: 'FileText', isNew: true },
  { id: 'pdf-grayscale', name: 'PDF Grayscale Converter', description: 'Desaturate and convert colored PDFs to black and white layout.', categoryId: 'pdf', icon: 'FileText', isNew: true },
  { id: 'pdf-unlock', name: 'Unlock PDF', description: 'Remove the password from a PDF file (requires the password).', categoryId: 'pdf', icon: 'Unlock', isNew: true },
  { id: 'pdf-to-word', name: 'PDF to Word Converter', description: 'Convert a PDF into an editable Microsoft Word Document.', categoryId: 'pdf', icon: 'FileText', isNew: true },
  { id: 'word-to-pdf', name: 'Word to PDF Converter', description: 'Convert a Word Document to PDF format.', categoryId: 'pdf', icon: 'FileText', isNew: true },
  { id: 'pdf-to-powerpoint', name: 'PDF to PowerPoint Converter', description: 'Upload a PDF and convert it to a PowerPoint Presentation.', categoryId: 'pdf', icon: 'Presentation', isNew: true },
  { id: 'pptx-to-pdf', name: 'PowerPoint to PDF Converter', description: 'Upload a PowerPoint presentation and convert it to a PDF.', categoryId: 'pdf', icon: 'FileText', isNew: true },
  { id: 'pdf-crop', name: 'Crop PDF', description: 'Trim page margins and adjust layout boundaries in PDF pages.', categoryId: 'pdf', icon: 'Crop', isNew: true },
  { id: 'pdf-add-numbers', name: 'Add Numbers to PDF', description: 'Stamp running page index footers onto PDF documents.', categoryId: 'pdf', icon: 'Hash', isNew: true },
  { id: 'pdf-to-tiff', name: 'PDF to TIFF Converter', description: 'Convert PDF pages to TIFF images.', categoryId: 'pdf', icon: 'FileImage', isNew: true },
  { id: 'pdf-edit', name: 'Edit PDF / Annotate PDF', description: 'Place text labels, signatures, or notes anywhere on your PDF.', categoryId: 'pdf', icon: 'Edit', isNew: true },
  { id: 'pdf-protect', name: 'Protect PDF', description: 'Add password protection and wrap PDF documents client-side.', categoryId: 'pdf', icon: 'Lock', isNew: true },
  { id: 'pdf-extract-images', name: 'Extract Images from PDF', description: 'Scan and extract visual images embedded inside a PDF.', categoryId: 'pdf', icon: 'Download', isNew: true },
  { id: 'pdf-to-excel', name: 'PDF to Excel Converter', description: 'Convert PDF spreadsheet tables to Excel XLSX formatting.', categoryId: 'pdf', icon: 'FileSpreadsheet', isNew: true },
  { id: 'pdf-to-csv', name: 'PDF to CSV Converter', description: 'Extract tables from PDF to CSV spreadsheet format.', categoryId: 'pdf', icon: 'Table', isNew: true },
  { id: 'pdf-to-epub', name: 'PDF to EPUB Converter', description: 'Convert PDF eBooks to compliant reflowable EPUB format.', categoryId: 'pdf', icon: 'BookOpen', isNew: true },
  { id: 'pdf-translator', name: 'PDF Translator', description: 'Translate text inside PDF pages to another language.', categoryId: 'pdf', icon: 'Languages', isNew: true },
  { id: 'mobi-to-pdf', name: 'MOBI to PDF Converter', description: 'Convert MOBI eBooks to PDF documents.', categoryId: 'pdf', icon: 'FileText', isNew: true },
  { id: 'pdf-to-mobi', name: 'PDF to MOBI Converter', description: 'Convert PDF files to MOBI eBook format.', categoryId: 'pdf', icon: 'BookOpen', isNew: true },
  { id: 'azw3-to-pdf', name: 'AZW3 to PDF Converter', description: 'Convert AZW3 eBooks to PDF documents.', categoryId: 'pdf', icon: 'FileText', isNew: true },
  { id: 'heic-to-pdf', name: 'HEIC to PDF Converter', description: 'Convert HEIC/HEIF photos to PDF documents.', categoryId: 'pdf', icon: 'FileText', isNew: true },
  { id: 'tiff-to-pdf', name: 'TIFF to PDF Converter', description: 'Convert TIFF image layouts to PDF format.', categoryId: 'pdf', icon: 'FileText', isNew: true },
  { id: 'png-to-pdf', name: 'PNG to PDF Converter', description: 'Convert PNG images to PDF documents.', categoryId: 'pdf', icon: 'FileText', isNew: true },
  { id: 'jpg-to-pdf', name: 'JPG to PDF Converter', description: 'Convert JPG images to PDF documents.', categoryId: 'pdf', icon: 'FileText', isNew: true },
  { id: 'url-to-pdf', name: 'URL to PDF Converter', description: 'Enter a website URL link and compile the page layout as a PDF.', categoryId: 'pdf', icon: 'Globe', isNew: true },
  { id: 'pdf-page-deleter', name: 'PDF Page Deleter', description: 'Delete one or more pages visually from your PDF document.', categoryId: 'pdf', icon: 'Layers', isNew: true },
  { id: 'rearrange-pdf', name: 'Rearrange PDF Pages', description: 'Reorder pages of PDF documents visually.', categoryId: 'pdf', icon: 'Layers', isNew: true },
  { id: 'esign-pdf', name: 'eSign PDF Tool', description: 'Draw or upload a signature and stamp it onto PDF pages.', categoryId: 'pdf', icon: 'PenTool', isNew: true },
  { id: 'pdf-watermark-remover', name: 'PDF Watermark Remover', description: 'Remove Watermark from PDF pages client-side.', categoryId: 'pdf', icon: 'Trash2', isNew: true },
  { id: 'create-pdf', name: 'Create PDF', description: 'Free visual PDF Creator and Document composer.', categoryId: 'pdf', icon: 'FilePlus2', isNew: true },

  // CSS
  { id: 'css-shadow', name: 'CSS Box Shadow Generator', description: 'Visually generate CSS box shadows.', categoryId: 'css', icon: 'BoxSelect', isPopular: true },
  { id: 'css-gradient', name: 'CSS Gradient Generator', description: 'Create beautiful linear and radial gradients.', categoryId: 'css', icon: 'PaintBucket' },
  { id: 'css-glass', name: 'CSS Glassmorphism', description: 'Generate glassmorphism CSS effects easily.', categoryId: 'css', icon: 'Layers', isNew: true },
  { id: 'css-loader', name: 'CSS Loader Generator', description: 'Create simple loading spinners using CSS.', categoryId: 'css', icon: 'Loader' },
  { id: 'css-triangle', name: 'CSS Triangle Generator', description: 'Generate CSS triangles of any size and direction.', categoryId: 'css', icon: 'Triangle' },
  { id: 'css-border-radius', name: 'CSS Border Radius', description: 'Generate complex border-radius shapes visually.', categoryId: 'css', icon: 'RectangleHorizontal', isNew: true },

  // Coding
  { id: 'html-formatter', name: 'HTML Formatter', description: 'Prettify and format minified HTML code.', categoryId: 'coding', icon: 'Code2' },
  { id: 'json-viewer', name: 'JSON Tree Viewer', description: 'Format and view JSON data in a collapsible tree.', categoryId: 'coding', icon: 'Braces', isPopular: true },
  { id: 'json-formatter', name: 'JSON Formatter & Validator', description: 'Validate and beautifully format messy JSON data with syntax highlighting.', categoryId: 'coding', icon: 'Code', isNew: true },
  { id: 'svg-to-jsx', name: 'SVG to React JSX', description: 'Convert raw SVG code into a fully functional React component.', categoryId: 'coding', icon: 'Sparkles', isNew: true },
  { id: 'jwt-decoder', name: 'JWT Decoder', description: 'Decode JSON Web Tokens (JWT) safely in the browser.', categoryId: 'coding', icon: 'KeySquare' },
  { id: 'md5-generator', name: 'MD5 Generator', description: 'Generate MD5 hashes from text strings quickly.', categoryId: 'coding', icon: 'Lock' },
  { id: 'url-encoder', name: 'URL Encoder Decoder', description: 'Encode or decode strings to URL-friendly formats.', categoryId: 'coding', icon: 'Link' },
  { id: 'base64-encoder', name: 'Base64 Encoder', description: 'Encode or decode text to/from Base64 format.', categoryId: 'coding', icon: 'Binary' },
  { id: 'json-minifier', name: 'JSON Minifier', description: 'Minify JSON data to reduce file size for production use.', categoryId: 'coding', icon: 'Minimize2', isNew: true },
  { id: 'diff-checker', name: 'Code Diff Checker', description: 'Compare two code snippets and highlight all differences.', categoryId: 'coding', icon: 'GitCompare', isNew: true },
  { id: 'regex-explainer', name: 'RegEx Explainer', description: 'Visualize and break down regular expressions into logical flow steps.', categoryId: 'coding', icon: 'Code', isNew: true },
  { id: 'html-markdown', name: 'HTML ⇄ Markdown Converter', description: 'Translate formatted strings back and forth.', categoryId: 'coding', icon: 'Code', isNew: true },
  { id: 'sql-formatter', name: 'SQL Formatter', description: 'Clean and indent database SQL query strings.', categoryId: 'coding', icon: 'Code', isNew: true },

  // Color
  { id: 'color-palette', name: 'Palette Generator', description: 'Generate cohesive color palettes for your UI.', categoryId: 'color', icon: 'Palette', isPopular: true },
  { id: 'hex-rgba', name: 'HEX To RGBA', description: 'Convert HEX color codes to RGBA with opacity.', categoryId: 'color', icon: 'Pipette' },
  { id: 'color-shades', name: 'Color Shades Generator', description: 'Generate tints and shades of a base color.', categoryId: 'color', icon: 'SunMedium' },
  { id: 'rgb-hex', name: 'RGB To HEX', description: 'Convert RGB color values to HEX color codes.', categoryId: 'color', icon: 'Hash', isNew: true },
  { id: 'color-mixer', name: 'Color Mixer', description: 'Mix two colors together and see the blend result.', categoryId: 'color', icon: 'Blend', isNew: true },
  { id: 'color-contrast', name: 'WCAG Contrast Checker', description: 'Verify contrast ratio compliance for accessibility standards.', categoryId: 'color', icon: 'Palette', isNew: true },

  // Social
  { id: 'open-graph', name: 'Open Graph Generator', description: 'Generate meta tags for perfect social media sharing.', categoryId: 'social', icon: 'Share' },
  { id: 'tweet-image', name: 'Tweet To Image', description: 'Convert tweets into beautiful shareable card images.', categoryId: 'social', icon: 'Twitter' },
  { id: 'youtube-thumb', name: 'YouTube Thumbnail Grabber', description: 'Download high-quality thumbnails from YouTube videos.', categoryId: 'social', icon: 'Youtube' },

  // Utilities
  { id: 'password-generator', name: 'Password Generator', description: 'Generate strong, secure, random passwords.', categoryId: 'utility', icon: 'Key', isPopular: true },
  { id: 'qr-generator', name: 'QR Code Generator', description: 'Create QR codes for text, URLs, and more.', categoryId: 'utility', icon: 'QrCode', isPopular: true },
  { id: 'uuid-generator', name: 'UUID Generator', description: 'Generate random version 4 UUIDs instantly.', categoryId: 'utility', icon: 'Fingerprint' },
  { id: 'list-randomizer', name: 'List Randomizer', description: 'Shuffle lists of items into a random order.', categoryId: 'utility', icon: 'Shuffle' },
  { id: 'number-base', name: 'Number Base Converter', description: 'Convert numbers between binary, octal, decimal, and hexadecimal.', categoryId: 'utility', icon: 'Binary', isNew: true },
  { id: 'regex-tester', name: 'Regex Tester', description: 'Test and debug regular expressions with live match highlighting.', categoryId: 'utility', icon: 'SearchCode', isNew: true },
  { id: 'word-frequency', name: 'Word Frequency Counter', description: 'Analyze text and count how often each word appears.', categoryId: 'utility', icon: 'BarChart2', isNew: true },
  { id: 'json-to-csv', name: 'JSON to CSV Converter', description: 'Convert JSON arrays to CSV spreadsheet format.', categoryId: 'utility', icon: 'Table', isNew: true },
  { id: 'epoch-converter', name: 'Unix Epoch Converter', description: 'Translate seconds timestamps to standard calendar dates.', categoryId: 'utility', icon: 'Clock', isNew: true },
  { id: 'csv-json-yaml', name: 'CSV ⇄ JSON ⇄ YAML Converter', description: 'Translate tabular, object array, and configuration syntax.', categoryId: 'utility', icon: 'FileText', isNew: true },
];

export const TOOLS = [...unsortedTools].sort((a, b) => {
  // 1. Sort by Popularity (most used at top)
  if (a.isPopular && !b.isPopular) return -1;
  if (!a.isPopular && b.isPopular) return 1;
  // 2. Sort by "New" as a secondary metric
  if (a.isNew && !b.isNew) return -1;
  if (!a.isNew && b.isNew) return 1;
  // 3. Fallback to alphabetical
  return a.name.localeCompare(b.name);
});
