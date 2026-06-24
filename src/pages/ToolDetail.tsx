import { useParams, Navigate, Link } from 'react-router-dom'
import { Share2, Heart, CheckCircle2, HelpCircle, Star, Check, X, ShieldCheck } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { useEffect, Suspense, lazy } from 'react'
import { toast } from 'sonner'
import { TOOLS, CATEGORIES } from '../data/tools'
const Icon = lazy(() => import('../components/ui/icon').then(m => ({ default: m.Icon })))
import { useStore } from '../store/useStore'

// Tool Implementations
const AdBanner = lazy(() => import('../components/ui/AdBanner').then(m => ({ default: m.AdBanner })))
const NativeAd = lazy(() => import('../components/ui/NativeAd').then(m => ({ default: m.NativeAd })))
const CaseConverter = lazy(() => import('../components/ui/CaseConverter').then(m => ({ default: m.CaseConverter })))
const PasswordGenerator = lazy(() => import('../components/ui/PasswordGenerator').then(m => ({ default: m.PasswordGenerator })))
const LetterCounter = lazy(() => import('../components/ui/LetterCounter').then(m => ({ default: m.LetterCounter })))
const WhitespaceRemover = lazy(() => import('../components/ui/WhitespaceRemover').then(m => ({ default: m.WhitespaceRemover })))
const UrlEncoder = lazy(() => import('../components/ui/UrlEncoder').then(m => ({ default: m.UrlEncoder })))
const ColorPaletteGenerator = lazy(() => import('../components/ui/ColorPaletteGenerator').then(m => ({ default: m.ColorPaletteGenerator })))
const QrGenerator = lazy(() => import('../components/ui/QrGenerator').then(m => ({ default: m.QrGenerator })))
const JsonViewer = lazy(() => import('../components/ui/JsonViewer').then(m => ({ default: m.JsonViewer })))
const LoremIpsum = lazy(() => import('../components/ui/MiscTools').then(m => ({ default: m.LoremIpsum })))
const BionicReading = lazy(() => import('../components/ui/MiscTools').then(m => ({ default: m.BionicReading })))
const Base64Encoder = lazy(() => import('../components/ui/MiscTools').then(m => ({ default: m.Base64Encoder })))
const Md5Generator = lazy(() => import('../components/ui/MiscTools').then(m => ({ default: m.Md5Generator })))
const UUIDGenerator = lazy(() => import('../components/ui/MiscTools').then(m => ({ default: m.UUIDGenerator })))
const GenericPlaceholder = lazy(() => import('../components/ui/MiscTools').then(m => ({ default: m.GenericPlaceholder })))
const JsonFormatter = lazy(() => import('../components/ui/MiscTools').then(m => ({ default: m.JsonFormatter })))
const SvgToJsx = lazy(() => import('../components/ui/MiscTools').then(m => ({ default: m.SvgToJsx })))
const MarkdownToHtml = lazy(() => import('../components/ui/MiscTools').then(m => ({ default: m.MarkdownToHtml })))
const ListRandomizer = lazy(() => import('../components/ui/UtilityTools').then(m => ({ default: m.ListRandomizer })))
const CssShadowGenerator = lazy(() => import('../components/ui/CSSTools').then(m => ({ default: m.CssShadowGenerator })))
const CssGlassmorphism = lazy(() => import('../components/ui/CSSTools').then(m => ({ default: m.CssGlassmorphism })))
const CssGradientGenerator = lazy(() => import('../components/ui/CSSTools').then(m => ({ default: m.CssGradientGenerator })))
const CssLoaderGenerator = lazy(() => import('../components/ui/CSSTools').then(m => ({ default: m.CssLoaderGenerator })))
const CssTriangleGenerator = lazy(() => import('../components/ui/CSSTools').then(m => ({ default: m.CssTriangleGenerator })))
const ImageToBase64 = lazy(() => import('../components/ui/ImageTools').then(m => ({ default: m.ImageToBase64 })))
const SvgBlobGenerator = lazy(() => import('../components/ui/ImageTools').then(m => ({ default: m.SvgBlobGenerator })))
const ImageResizer = lazy(() => import('../components/ui/ImageTools').then(m => ({ default: m.ImageResizer })))
const ColorExtractor = lazy(() => import('../components/ui/ImageTools').then(m => ({ default: m.ColorExtractor })))
const ImageCropper = lazy(() => import('../components/ui/ImageTools').then(m => ({ default: m.ImageCropper })))
const ImageConverter = lazy(() => import('../components/ui/ImageToolsExtras').then(m => ({ default: m.ImageConverter })))
const ImageFilters = lazy(() => import('../components/ui/ImageToolsExtras').then(m => ({ default: m.ImageFilters })))
const AIImageGenerator = lazy(() => import('../components/ui/AITools').then(m => ({ default: m.AIImageGenerator })))
const RemoveBackground = lazy(() => import('../components/ui/AITools').then(m => ({ default: m.RemoveBackground })))
const CleanupPicture = lazy(() => import('../components/ui/AITools').then(m => ({ default: m.CleanupPicture })))
const UnblurImage = lazy(() => import('../components/ui/AITools').then(m => ({ default: m.UnblurImage })))
const ImageToText = lazy(() => import('../components/ui/AITools').then(m => ({ default: m.ImageToText })))
const HtmlFormatter = lazy(() => import('../components/ui/CodingTools').then(m => ({ default: m.HtmlFormatter })))
const JwtDecoder = lazy(() => import('../components/ui/CodingTools').then(m => ({ default: m.JwtDecoder })))
const HexRgba = lazy(() => import('../components/ui/ColorTools').then(m => ({ default: m.HexRgba })))
const ColorShades = lazy(() => import('../components/ui/ColorTools').then(m => ({ default: m.ColorShades })))
const OpenGraphGenerator = lazy(() => import('../components/ui/SocialTools').then(m => ({ default: m.OpenGraphGenerator })))
const TweetToImage = lazy(() => import('../components/ui/SocialTools').then(m => ({ default: m.TweetToImage })))
const YoutubeThumbnail = lazy(() => import('../components/ui/SocialTools').then(m => ({ default: m.YoutubeThumbnail })))
const TextReverser = lazy(() => import('../components/ui/TextTools').then(m => ({ default: m.TextReverser })))
const DuplicateRemover = lazy(() => import('../components/ui/TextTools').then(m => ({ default: m.DuplicateRemover })))
const TextDiff = lazy(() => import('../components/ui/TextTools').then(m => ({ default: m.TextDiff })))
const RgbHex = lazy(() => import('../components/ui/NewColorTools').then(m => ({ default: m.RgbHex })))
const ColorMixer = lazy(() => import('../components/ui/NewColorTools').then(m => ({ default: m.ColorMixer })))
const NumberBaseConverter = lazy(() => import('../components/ui/NewUtilityTools').then(m => ({ default: m.NumberBaseConverter })))
const RegexTester = lazy(() => import('../components/ui/NewUtilityTools').then(m => ({ default: m.RegexTester })))
const WordFrequency = lazy(() => import('../components/ui/NewUtilityTools').then(m => ({ default: m.WordFrequency })))
const JsonToCsv = lazy(() => import('../components/ui/NewUtilityTools').then(m => ({ default: m.JsonToCsv })))
const JsonMinifier = lazy(() => import('../components/ui/NewCodingTools').then(m => ({ default: m.JsonMinifier })))
const DiffChecker = lazy(() => import('../components/ui/NewCodingTools').then(m => ({ default: m.DiffChecker })))
const JsonToTs = lazy(() => import('../components/ui/NewCodingTools').then(m => ({ default: m.JsonToTs })))
const CsvJsonConverter = lazy(() => import('../components/ui/NewCodingTools').then(m => ({ default: m.CsvJsonConverter })))
const BcryptGenerator = lazy(() => import('../components/ui/NewUtilityTools').then(m => ({ default: m.BcryptGenerator })))
const RobotsTxtGenerator = lazy(() => import('../components/ui/NewUtilityTools').then(m => ({ default: m.RobotsTxtGenerator })))
const SitemapGenerator = lazy(() => import('../components/ui/NewUtilityTools').then(m => ({ default: m.SitemapGenerator })))
const CssAnimationGenerator = lazy(() => import('../components/ui/CSSTools').then(m => ({ default: m.CssAnimationGenerator })))
const MetaTagGenerator = lazy(() => import('../components/ui/SocialTools').then(m => ({ default: m.MetaTagGenerator })))
const CssBorderRadius = lazy(() => import('../components/ui/NewCodingTools').then(m => ({ default: m.CssBorderRadius })))
const ImageCompressor = lazy(() => import('../components/ui/ImageToolsNew').then(m => ({ default: m.ImageCompressor })))
const ImageWatermark = lazy(() => import('../components/ui/ImageToolsNew').then(m => ({ default: m.ImageWatermark })))
const FaviconGenerator = lazy(() => import('../components/ui/ImageToolsNew').then(m => ({ default: m.FaviconGenerator })))
const ImagePlaceholder = lazy(() => import('../components/ui/ImageToolsNew').then(m => ({ default: m.ImagePlaceholder })))
const PdfCompressor = lazy(() => import('../components/ui/PdfTools').then(m => ({ default: m.PdfCompressor })))
const PdfMerger = lazy(() => import('../components/ui/PdfTools').then(m => ({ default: m.PdfMerger })))
const PdfSplitter = lazy(() => import('../components/ui/PdfTools').then(m => ({ default: m.PdfSplitter })))
const PdfToImage = lazy(() => import('../components/ui/PdfTools').then(m => ({ default: m.PdfToImage })))
const ImagesToPdf = lazy(() => import('../components/ui/PdfTools').then(m => ({ default: m.ImagesToPdf })))
const PdfRotate = lazy(() => import('../components/ui/PdfTools').then(m => ({ default: m.PdfRotate })))
const PdfWatermark = lazy(() => import('../components/ui/PdfTools').then(m => ({ default: m.PdfWatermark })))
const PdfToText = lazy(() => import('../components/ui/PdfTools').then(m => ({ default: m.PdfToText })))
const TextToPdf = lazy(() => import('../components/ui/PdfTools').then(m => ({ default: m.TextToPdf })))
const VisioConverter = lazy(() => import('../components/ui/VisioConverter').then(m => ({ default: m.VisioConverter })))
const PdfOrganizer = lazy(() => import('../components/ui/NewPdfTools').then(m => ({ default: m.PdfOrganizer })))
const PdfSigner = lazy(() => import('../components/ui/NewPdfTools').then(m => ({ default: m.PdfSigner })))
const EpubToPdf = lazy(() => import('../components/ui/NewPdfTools').then(m => ({ default: m.EpubToPdf })))
const PdfGrayscale = lazy(() => import('../components/ui/NewPdfTools').then(m => ({ default: m.PdfGrayscale })))
const PdfMetadataEditor = lazy(() => import('../components/ui/NewPdfTools').then(m => ({ default: m.PdfMetadataEditor })))
const ExtractPdfPages = lazy(() => import('../components/ui/NewPdfTools').then(m => ({ default: m.ExtractPdfPages })))
const ExifEditor = lazy(() => import('../components/ui/NewImageTools').then(m => ({ default: m.ExifEditor })))
const SvgOptimizer = lazy(() => import('../components/ui/NewImageTools').then(m => ({ default: m.SvgOptimizer })))
const GifMaker = lazy(() => import('../components/ui/NewImageTools').then(m => ({ default: m.GifMaker })))
const PixelArtCreator = lazy(() => import('../components/ui/NewImageTools').then(m => ({ default: m.PixelArtCreator })))
const RegExExplainer = lazy(() => import('../components/ui/NewDeveloperTools').then(m => ({ default: m.RegExExplainer })))
const HtmlMarkdown = lazy(() => import('../components/ui/NewDeveloperTools').then(m => ({ default: m.HtmlMarkdown })))
const SqlFormatter = lazy(() => import('../components/ui/NewDeveloperTools').then(m => ({ default: m.SqlFormatter })))
const ColorContrast = lazy(() => import('../components/ui/NewDeveloperTools').then(m => ({ default: m.ColorContrast })))
const EpochConverter = lazy(() => import('../components/ui/NewDeveloperTools').then(m => ({ default: m.EpochConverter })))
const CsvJsonYaml = lazy(() => import('../components/ui/NewDeveloperTools').then(m => ({ default: m.CsvJsonYaml })))
const PercentageCalculator = lazy(() => import('../components/ui/MathTools').then(m => ({ default: m.PercentageCalculator })))
const BmiCalculator = lazy(() => import('../components/ui/MathTools').then(m => ({ default: m.BmiCalculator })))
const AgeCalculator = lazy(() => import('../components/ui/MathTools').then(m => ({ default: m.AgeCalculator })))
const SimpleInterestCalculator = lazy(() => import('../components/ui/MathTools').then(m => ({ default: m.SimpleInterestCalculator })))
const CompoundInterestCalculator = lazy(() => import('../components/ui/MathTools').then(m => ({ default: m.CompoundInterestCalculator })))
const LoanCalculator = lazy(() => import('../components/ui/MathTools').then(m => ({ default: m.LoanCalculator })))
const SipCalculator = lazy(() => import('../components/ui/MathTools').then(m => ({ default: m.SipCalculator })))
const CurrencyConverter = lazy(() => import('../components/ui/MathTools').then(m => ({ default: m.CurrencyConverter })))
const PdfUnlock = lazy(() => import('../components/ui/MorePdfTools').then(m => ({ default: m.PdfUnlock })))
const PdfToWord = lazy(() => import('../components/ui/MorePdfTools').then(m => ({ default: m.PdfToWord })))
const PdfToPptx = lazy(() => import('../components/ui/MorePdfTools').then(m => ({ default: m.PdfToPptx })))
const DocxToPdf = lazy(() => import('../components/ui/MorePdfTools').then(m => ({ default: m.DocxToPdf })))
const PdfExtractImages = lazy(() => import('../components/ui/MorePdfTools').then(m => ({ default: m.PdfExtractImages })))
const PdfCrop = lazy(() => import('../components/ui/MorePdfTools').then(m => ({ default: m.PdfCrop })))
const PdfAddNumbers = lazy(() => import('../components/ui/MorePdfTools').then(m => ({ default: m.PdfAddNumbers })))
const PdfToTiff = lazy(() => import('../components/ui/MorePdfTools').then(m => ({ default: m.PdfToTiff })))
const PdfEdit = lazy(() => import('../components/ui/MorePdfTools').then(m => ({ default: m.PdfEdit })))
const PdfProtect = lazy(() => import('../components/ui/MorePdfTools').then(m => ({ default: m.PdfProtect })))
const ChangePhotoBackground = lazy(() => import('../components/ui/MoreImageTools').then(m => ({ default: m.ChangePhotoBackground })))
const PdfToExcel = lazy(() => import('../components/ui/ExtraPdfTools').then(m => ({ default: m.PdfToExcel })))
const PdfToCsv = lazy(() => import('../components/ui/ExtraPdfTools').then(m => ({ default: m.PdfToCsv })))
const PdfToEpub = lazy(() => import('../components/ui/ExtraPdfTools').then(m => ({ default: m.PdfToEpub })))
const PdfTranslator = lazy(() => import('../components/ui/ExtraPdfTools').then(m => ({ default: m.PdfTranslator })))
const MobiToPdf = lazy(() => import('../components/ui/ExtraPdfTools').then(m => ({ default: m.MobiToPdf })))
const PdfToMobi = lazy(() => import('../components/ui/ExtraPdfTools').then(m => ({ default: m.PdfToMobi })))
const Azw3ToPdf = lazy(() => import('../components/ui/ExtraPdfTools').then(m => ({ default: m.Azw3ToPdf })))
const PptxToPdf = lazy(() => import('../components/ui/ExtraPdfTools').then(m => ({ default: m.PptxToPdf })))
const UrlToPdf = lazy(() => import('../components/ui/ExtraPdfTools').then(m => ({ default: m.UrlToPdf })))
const PdfWatermarkRemover = lazy(() => import('../components/ui/ExtraPdfTools').then(m => ({ default: m.PdfWatermarkRemover })))
const CreatePdf = lazy(() => import('../components/ui/ExtraPdfTools').then(m => ({ default: m.CreatePdf })))
const ImageSpecificToPdf = lazy(() => import('../components/ui/ExtraPdfTools').then(m => ({ default: m.ImageSpecificToPdf })))
const ProfilePhotoMaker = lazy(() => import('../components/ui/ExtraImageTools').then(m => ({ default: m.ProfilePhotoMaker })))
const BlurBackgroundTool = lazy(() => import('../components/ui/ExtraImageTools').then(m => ({ default: m.BlurBackgroundTool })))
const RemoveWatermarkImage = lazy(() => import('../components/ui/ExtraImageTools').then(m => ({ default: m.RemoveWatermarkImage })))
const CombineImages = lazy(() => import('../components/ui/ExtraImageTools').then(m => ({ default: m.CombineImages })))
const MakeBackgroundTransparent = lazy(() => import('../components/ui/ExtraImageTools').then(m => ({ default: m.MakeBackgroundTransparent })))
const AddTextToImage = lazy(() => import('../components/ui/ExtraImageTools').then(m => ({ default: m.AddTextToImage })))
const ImageSplitter = lazy(() => import('../components/ui/ExtraImageTools').then(m => ({ default: m.ImageSplitter })))
const AddBorderToImage = lazy(() => import('../components/ui/ExtraImageTools').then(m => ({ default: m.AddBorderToImage })))
const TranslateImage = lazy(() => import('../components/ui/ExtraImageTools').then(m => ({ default: m.TranslateImage })))
const PixelateImage = lazy(() => import('../components/ui/ExtraImageTools').then(m => ({ default: m.PixelateImage })))
const CollageMaker = lazy(() => import('../components/ui/ExtraImageTools').then(m => ({ default: m.CollageMaker })))
const GifToMp4 = lazy(() => import('../components/ui/ExtraImageTools').then(m => ({ default: m.GifToMp4 })))
const ChartMaker = lazy(() => import('../components/ui/ExtraImageTools').then(m => ({ default: m.ChartMaker })))
const FontAwesomeToPng = lazy(() => import('../components/ui/ExtraImageTools').then(m => ({ default: m.FontAwesomeToPng })))
const PngToEps = lazy(() => import('../components/ui/ExtraImageTools').then(m => ({ default: m.PngToEps })))
const JpgToTiff = lazy(() => import('../components/ui/ExtraImageTools').then(m => ({ default: m.JpgToTiff })))
const WebpToJpg = lazy(() => import('../components/ui/ExtraImageTools').then(m => ({ default: m.WebpToJpg })))

export function ToolDetail() {
  const { id } = useParams()
  const tool = TOOLS.find(t => t.id === id)
  const { favorites, toggleFavorite, addRecentlyUsed, recentlyUsed } = useStore()

  useEffect(() => {
    if (tool) {
      addRecentlyUsed(tool.id)
    }
  }, [tool, addRecentlyUsed])

  if (!tool) {
    return <Navigate to="/tools" replace />
  }

  const category = CATEGORIES.find(c => c.id === tool.categoryId)
  const isFavorite = favorites.includes(tool.id)
  const relatedTools = TOOLS.filter(t => t.categoryId === tool.categoryId && t.id !== tool.id).slice(0, 3)
  
  // Safely get recently used tools, making sure they exist and aren't the current tool
  const recentToolsList = recentlyUsed
    .filter(tId => tId !== tool.id)
    .map(tId => TOOLS.find(t => t.id === tId))
    .filter(Boolean)
    .slice(0, 3)

  // Generate JSON-LD Schema for SEO
  const schemaOrgJSONLD = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": tool.name,
    "description": tool.description,
    "applicationCategory": category?.name || "UtilityApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    ...(tool.rating && tool.reviews ? {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": tool.rating.toString(),
        "ratingCount": tool.reviews.toString()
      }
    } : {})
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": `How to use ${tool.name}`,
    "description": `Step by step guide on how to use the free ${tool.name} tool.`,
    "step": [
      {
        "@type": "HowToStep",
        "name": "Step 1: Access the Tool",
        "text": `Open the ${tool.name} interface on SmarTools.`
      },
      {
        "@type": "HowToStep",
        "name": "Step 2: Provide Input",
        "text": "Upload your file or paste your text/data into the designated input area."
      },
      {
        "@type": "HowToStep",
        "name": "Step 3: Process and Download",
        "text": "Click the process button or let the tool automatically convert your data, then copy or download the result."
      }
    ]
  };

  const renderToolInterface = () => {
    switch (tool.id) {
      case 'case-converter': return <CaseConverter />
      case 'password-generator': return <PasswordGenerator />
      case 'letter-counter': return <LetterCounter />
      case 'whitespace-remover': return <WhitespaceRemover />
      case 'url-encoder': return <UrlEncoder />
      case 'color-palette': return <ColorPaletteGenerator />
      case 'qr-generator': return <QrGenerator />
      case 'json-viewer': return <JsonViewer />
      case 'json-formatter': return <JsonFormatter />
      case 'svg-to-jsx': return <SvgToJsx />
      case 'lorem-ipsum': return <LoremIpsum />
      case 'bionic-reading': return <BionicReading />
      case 'base64-encoder': return <Base64Encoder />
      case 'markdown-to-html': return <MarkdownToHtml />
      case 'md5-generator': return <Md5Generator />
      case 'uuid-generator': return <UUIDGenerator />
      case 'list-randomizer': return <ListRandomizer />
      case 'text-reverser': return <TextReverser />
      case 'duplicate-remover': return <DuplicateRemover />
      case 'text-diff': return <TextDiff />
      case 'css-shadow': return <CssShadowGenerator />
      case 'css-glass': return <CssGlassmorphism />
      case 'css-gradient': return <CssGradientGenerator />
      case 'css-loader': return <CssLoaderGenerator />
      case 'css-triangle': return <CssTriangleGenerator />
      case 'css-border-radius': return <CssBorderRadius />
      case 'image-to-base64': return <ImageToBase64 />
      case 'svg-blob': return <SvgBlobGenerator />
      case 'image-resizer': return <ImageResizer />
      case 'image-converter': return <ImageConverter />
      case 'jpg-to-png':
      case 'webp-to-png':
      case 'gif-to-png':
      case 'heic-to-png':
      case 'psd-to-png':
      case 'svg-to-png': return <ImageConverter defaultTarget="png" />
      case 'webp-to-jpg':
      case 'gif-to-jpg':
      case 'heic-to-jpg': return <ImageConverter defaultTarget="jpeg" />
      case 'jpg-to-webp':
      case 'png-to-webp': return <ImageConverter defaultTarget="webp" />
      case 'jpg-to-svg':
      case 'png-to-svg':
      case 'tiff-to-svg': return <ImageConverter defaultTarget="svg" />
      case 'png-to-tiff': return <ImageConverter defaultTarget="tiff" />
      case 'webp-to-gif': return <ImageConverter defaultTarget="gif" />
      case 'gif-to-avif':
      case 'heic-to-avif':
      case 'png-to-avif':
      case 'jpg-to-avif':
      case 'webp-to-avif': return <ImageConverter defaultTarget="avif" />
      case 'gif-to-apng': return <ImageConverter defaultTarget="apng" />
      case 'tiff-to-png': return <ImageConverter defaultTarget="png" />
      case 'tiff-to-jpg': return <ImageConverter defaultTarget="jpeg" />
      case 'image-filters': return <ImageFilters />
      case 'image-cropper': return <ImageCropper />
      case 'color-extractor': return <ColorExtractor />
      case 'ai-image-generator': return <AIImageGenerator />
      case 'remove-background': return <RemoveBackground />
      case 'cleanup-picture': return <CleanupPicture />
      case 'unblur-image': return <UnblurImage />
      case 'image-to-text': return <ImageToText />
      case 'html-formatter': return <HtmlFormatter />
      case 'jwt-decoder': return <JwtDecoder />
      case 'json-minifier': return <JsonMinifier />
      case 'diff-checker': return <DiffChecker />
      case 'json-to-ts': return <JsonToTs />
      case 'csv-json-converter': return <CsvJsonConverter />
      case 'bcrypt-generator': return <BcryptGenerator />
      case 'robots-txt-generator': return <RobotsTxtGenerator />
      case 'sitemap-generator': return <SitemapGenerator />
      case 'css-animation-generator': return <CssAnimationGenerator />
      case 'meta-tag-generator': return <MetaTagGenerator />
      case 'hex-rgba': return <HexRgba />
      case 'color-shades': return <ColorShades />
      case 'rgb-hex': return <RgbHex />
      case 'color-mixer': return <ColorMixer />
      case 'open-graph': return <OpenGraphGenerator />
      case 'tweet-image': return <TweetToImage />
      case 'youtube-thumb': return <YoutubeThumbnail />
      case 'number-base': return <NumberBaseConverter />
      case 'percentage-calculator': return <PercentageCalculator />
      case 'bmi-calculator': return <BmiCalculator />
      case 'age-calculator': return <AgeCalculator />
      case 'simple-interest-calculator': return <SimpleInterestCalculator />
      case 'compound-interest-calculator': return <CompoundInterestCalculator />
      case 'loan-calculator': return <LoanCalculator />
      case 'sip-calculator': return <SipCalculator />
      case 'currency-converter': return <CurrencyConverter />
      case 'regex-tester': return <RegexTester />
      case 'word-frequency': return <WordFrequency />
      case 'json-to-csv': return <JsonToCsv />
      case 'image-compressor': return <ImageCompressor />
      case 'image-watermark': return <ImageWatermark />
      case 'favicon-generator': return <FaviconGenerator />
      case 'image-placeholder': return <ImagePlaceholder />
      case 'pdf-compress': return <PdfCompressor />
      case 'pdf-merge': return <PdfMerger />
      case 'pdf-split': return <PdfSplitter />
      case 'pdf-to-image': return <PdfToImage />
      case 'pdf-to-jpg': return <PdfToImage defaultFormat="jpeg" />
      case 'pdf-to-png': return <PdfToImage defaultFormat="png" />
      case 'pdf-to-images': return <PdfToImage defaultFormat="png" />
      case 'vsd-to-pdf':
      case 'vsdx-to-pdf': return <VisioConverter defaultTarget="pdf" />
      case 'vsd-to-docx':
      case 'vsdx-to-docx': return <VisioConverter defaultTarget="docx" />
      case 'vsd-to-pptx':
      case 'vsdx-to-pptx': return <VisioConverter defaultTarget="pptx" />
      case 'vsd-to-jpg':
      case 'vsdx-to-jpg': return <VisioConverter defaultTarget="jpg" />
      case 'image-to-pdf': return <ImagesToPdf />
      case 'pdf-rotate': return <PdfRotate />
      case 'pdf-watermark': return <PdfWatermark />
      case 'pdf-to-text': return <PdfToText />
      case 'text-to-pdf': return <TextToPdf />
      case 'visio-converter': return <VisioConverter />
      case 'pdf-organizer': return <PdfOrganizer />
      case 'pdf-signer': return <PdfSigner />
      case 'epub-to-pdf': return <EpubToPdf />
      case 'pdf-grayscale': return <PdfGrayscale />
      case 'pdf-metadata': return <PdfMetadataEditor />
      case 'extract-pdf-pages': return <ExtractPdfPages />
      case 'pdf-unlock': return <PdfUnlock />
      case 'pdf-to-word': return <PdfToWord />
      case 'word-to-pdf': return <DocxToPdf />
      case 'pdf-to-powerpoint': return <PdfToPptx />
      case 'pptx-to-pdf': return <PptxToPdf />
      case 'pdf-crop': return <PdfCrop />
      case 'pdf-add-numbers': return <PdfAddNumbers />
      case 'pdf-to-tiff': return <PdfToTiff />
      case 'pdf-edit': return <PdfEdit />
      case 'pdf-protect': return <PdfProtect />
      case 'pdf-extract-images': return <PdfExtractImages />
      case 'pdf-to-excel': return <PdfToExcel />
      case 'pdf-to-csv': return <PdfToCsv />
      case 'pdf-to-epub': return <PdfToEpub />
      case 'pdf-translator': return <PdfTranslator />
      case 'mobi-to-pdf': return <MobiToPdf />
      case 'pdf-to-mobi': return <PdfToMobi />
      case 'azw3-to-pdf': return <Azw3ToPdf />
      case 'heic-to-pdf': return <ImageSpecificToPdf targetType="heic" />
      case 'tiff-to-pdf': return <ImageSpecificToPdf targetType="tiff" />
      case 'png-to-pdf': return <ImageSpecificToPdf targetType="png" />
      case 'jpg-to-pdf': return <ImageSpecificToPdf targetType="jpg" />
      case 'url-to-pdf': return <UrlToPdf />
      case 'pdf-watermark-remover': return <PdfWatermarkRemover />
      case 'create-pdf': return <CreatePdf />
      case 'pdf-page-deleter':
      case 'rearrange-pdf': return <PdfOrganizer />
      case 'esign-pdf': return <PdfSigner />
      case 'change-photo-background': return <ChangePhotoBackground />
      case 'exif-editor': return <ExifEditor />
      case 'svg-optimizer': return <SvgOptimizer />
      case 'gif-maker': return <GifMaker />
      case 'pixel-art': return <PixelArtCreator />
      case 'regex-explainer': return <RegExExplainer />
      case 'html-markdown': return <HtmlMarkdown />
      case 'sql-formatter': return <SqlFormatter />
      case 'color-contrast': return <ColorContrast />
      case 'epoch-converter': return <EpochConverter />
      case 'csv-json-yaml': return <CsvJsonYaml />
      case 'profile-photo-maker':
      case 'make-round-image': return <ProfilePhotoMaker />
      case 'blur-background-tool': return <BlurBackgroundTool />
      case 'remove-watermark-image':
      case 'remove-person-photo': return <RemoveWatermarkImage />
      case 'combine-images': return <CombineImages />
      case 'make-background-transparent': return <MakeBackgroundTransparent />
      case 'add-text-to-image': return <AddTextToImage />
      case 'image-splitter': return <ImageSplitter />
      case 'add-border-to-image': return <AddBorderToImage />
      case 'translate-image': return <TranslateImage />
      case 'pixelate-image': return <PixelateImage />
      case 'collage-maker': return <CollageMaker />
      case 'gif-to-mp4': return <GifToMp4 />
      case 'chart-maker': return <ChartMaker />
      case 'font-awesome-to-png': return <FontAwesomeToPng />
      case 'png-to-eps': return <PngToEps />
      case 'jpg-to-tiff': return <JpgToTiff />
      case 'upscale-image': return <UnblurImage />
      case 'colorize-photo': return <ImageFilters />
      default: return <GenericPlaceholder name={tool.name} />
    }
  }

  return (
    <>
      <Helmet>
        <title>{tool.name} — Free Online Tool | SmarTools</title>
        <meta name="description" content={`Free online ${tool.name}. ${tool.description} No installation or sign-up required. Secure and fast.`} />
        <meta property="og:title" content={`${tool.name} — Free Online Tool`} />
        <meta property="og:description" content={tool.description} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href={`https://smartools.pages.dev/tool/${tool.id}`} />
        <script type="application/ld+json">
          {JSON.stringify(schemaOrgJSONLD)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(howToSchema)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-white">
        {/* ── Page header ── */}
        <div className="bg-white border-b border-[#E5E7EB] pt-20 pb-8">
          <div className="max-w-[960px] mx-auto px-6">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-3 text-[13px] text-[#9CA3AF] mb-6">
              <Link to="/" className="hover:text-[#111827] transition-colors">Home</Link>
              <span>/</span>
              {category && <Link to={`/category/${category.id}`} className="hover:text-[#111827] transition-colors">{category.name}</Link>}
              <span>/</span>
              <span className="text-[#374151] font-medium">{tool.name}</span>
            </nav>

            {/* Tool header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl flex items-center justify-center text-[#374151] shrink-0">
                  <Icon name={tool.icon} className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-[28px] font-bold text-[#111827] tracking-tight leading-tight">{tool.name}</h1>
                    {tool.isPopular && <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#111827] text-white rounded-md">Popular</span>}
                    {tool.isNew && <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#F3F4F6] text-[#374151] border border-[#E5E7EB] rounded-md">New</span>}
                  </div>
                  <p className="text-[14px] text-[#6B7280] leading-relaxed max-w-xl">{tool.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => {
                    toggleFavorite(tool.id);
                    if (!isFavorite) {
                      toast.success(`Added ${tool.name} to favorites`);
                    }
                  }}
                  aria-label={isFavorite ? `Remove ${tool.name} from favorites` : `Add ${tool.name} to favorites`}
                  aria-pressed={isFavorite}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg border text-[13px] font-semibold transition-all ${
                    isFavorite
                      ? 'bg-[#FEF2F2] text-[#EF4444] border-[#FECACA]'
                      : 'bg-white text-[#6B7280] border-[#E5E7EB] hover:border-[#D1D5DB] hover:text-[#111827]'
                  }`}
                >
                  <Heart className="w-4 h-4" fill={isFavorite ? '#EF4444' : 'none'} stroke={isFavorite ? '#EF4444' : 'currentColor'} />
                  {isFavorite ? 'Saved' : 'Save'}
                </button>
                <button
                  onClick={async () => { 
                    const url = window.location.href;
                    const title = `${tool.name} - SmarTools`;
                    if (navigator.share) {
                      try {
                        await navigator.share({ title, url });
                      } catch (err) {
                        console.error('Share failed:', err);
                      }
                    } else {
                      navigator.clipboard.writeText(url); 
                      toast.success("Link copied to clipboard!");
                    }
                  }}
                  aria-label="Share tool"
                  className="flex items-center gap-3 px-4 py-2 bg-white text-[#6B7280] border border-[#E5E7EB] hover:border-[#D1D5DB] hover:text-[#111827] rounded-lg text-[13px] font-semibold transition-all"
                >
                  <Share2 className="w-4 h-4" /> Share
                </button>
              </div>
            </div>
          </div>
            {/* ── Directory Layout ── */}
        <div className="max-w-[960px] mx-auto px-6 py-10 flex flex-col gap-12">
          
          {/* Top Ad Banner */}
          <div className="flex justify-center w-full">
            <AdBanner adKey="1026c12149117e16c7ccce72edad6371" height={90} width={728} className="hidden md:flex" />
            <AdBanner adKey="820ae9a9c66d98143fc406aca9ac626f" height={60} width={468} className="hidden sm:flex md:hidden" />
            <AdBanner adKey="bab1185fa7522837a82e6dbf5c6015d5" height={50} width={320} className="sm:hidden" />
          </div>

          {/* The Actual Tool Interface */}
          <div className="w-full">
            <Suspense fallback={<div className="flex items-center justify-center p-12 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
              {renderToolInterface()}
            </Suspense>
          </div>

          <div className="flex justify-center w-full">
            <AdBanner adKey="52d14c4cfc4b28a541def0f2dbd7b118" height={250} width={300} />
          </div>

          {/* Rich Directory Content: Features & Use Cases */}
          {(tool.features || tool.useCases || tool.pros || tool.cons) ? (
            <div className="flex flex-col gap-12">
              
              {/* Horizontal Meta Bar */}
              <div className="flex flex-wrap items-center gap-6 p-6 bg-[#FAFAFA] border border-[#E5E7EB] rounded-2xl">
                <div className="flex-1 min-w-[120px]">
                  <div className="text-[12px] font-bold text-[#6B7280] uppercase tracking-wider mb-1">Pricing</div>
                  <div className="text-xl font-extrabold text-[#111827]">{tool.pricing || 'Free'}</div>
                </div>
                {tool.rating && (
                  <div className="flex-1 min-w-[120px]">
                    <div className="text-[12px] font-bold text-[#6B7280] uppercase tracking-wider mb-1">Rating</div>
                    <div className="flex items-center gap-1.5">
                      <Star className="w-5 h-5 fill-[#F59E0B] text-[#F59E0B]" />
                      <span className="text-lg font-bold text-[#111827]">{tool.rating}</span>
                      <span className="text-[12px] text-[#6B7280] font-medium ml-1">({tool.reviews})</span>
                    </div>
                  </div>
                )}
                <div className="flex-1 min-w-[120px]">
                  <div className="text-[12px] font-bold text-[#6B7280] uppercase tracking-wider mb-1">Developer</div>
                  <div className="text-[15px] font-semibold text-[#111827] flex items-center gap-1">
                    {tool.developer || 'SmarTools Official'}
                    {tool.verified && <ShieldCheck className="w-4 h-4 text-[#3B82F6]" />}
                  </div>
                </div>
                <div className="flex-1 min-w-[120px]">
                  <div className="text-[12px] font-bold text-[#6B7280] uppercase tracking-wider mb-1">Platform</div>
                  <div className="text-[15px] font-semibold text-[#111827]">Web Browser</div>
                </div>
              </div>

              {tool.features && (
                <div>
                  <h2 className="text-2xl font-bold text-[#111827] mb-6">Key Features</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {tool.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3 p-5 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm">
                        <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
                        <span className="text-[15px] font-medium text-[#374151]">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(tool.pros || tool.cons) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {tool.pros && (
                    <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-2xl p-6">
                      <h3 className="text-[16px] font-bold text-[#166534] mb-4 flex items-center gap-2">
                        <Check className="w-5 h-5" strokeWidth={3} /> Pros
                      </h3>
                      <div className="space-y-3">
                        {tool.pros.map((pro, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#166534] mt-2 shrink-0"></div>
                            <span className="text-[14px] text-[#15803D] font-medium">{pro}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {tool.cons && (
                    <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-2xl p-6">
                      <h3 className="text-[16px] font-bold text-[#991B1B] mb-4 flex items-center gap-2">
                        <X className="w-5 h-5" strokeWidth={3} /> Cons
                      </h3>
                      <div className="space-y-3">
                        {tool.cons.map((con, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#991B1B] mt-2 shrink-0"></div>
                            <span className="text-[14px] text-[#B91C1C] font-medium">{con}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {tool.useCases && (
                <div>
                  <h2 className="text-2xl font-bold text-[#111827] mb-6">Common Use Cases</h2>
                  <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm">
                    <ul className="space-y-4">
                      {tool.useCases.map((useCase, i) => (
                        <li key={i} className="flex items-start gap-4 text-[15px] text-[#4B5563] leading-relaxed pb-4 border-b border-[#F3F4F6] last:border-0 last:pb-0">
                          <span className="w-7 h-7 bg-[#FAFAFA] border border-[#E5E7EB] rounded-full text-[13px] font-bold text-[#111827] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">{i + 1}</span>
                          {useCase}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Fallback Content for tools not yet enriched */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#FAFAFA] border border-[#E5E7EB] rounded-2xl p-6 sm:p-8">
                <h2 className="text-[18px] font-semibold text-[#111827] mb-5 flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-[#6B7280]" /> How to use
                </h2>
                <p className="text-[15px] text-[#4B5563] leading-relaxed mb-6">
                  Our {tool.name.toLowerCase()} is completely intuitive. All processing happens locally in your browser — your data never leaves your machine.
                </p>
                <ol className="space-y-3">
                  {['Upload or input your data', 'Adjust the available settings', 'Download or copy your result'].map((step, i) => (
                    <li key={i} className="flex items-start gap-3 text-[14px] text-[#6B7280]">
                      <span className="w-6 h-6 bg-white border border-[#E5E7EB] shadow-sm rounded-full text-[12px] font-bold text-[#111827] flex items-center justify-center shrink-0">{i + 1}</span>
                      <span className="pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="bg-[#FAFAFA] border border-[#E5E7EB] rounded-2xl p-6 sm:p-8">
                <h2 className="text-[18px] font-semibold text-[#111827] mb-6 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#6B7280]" /> Why use {tool.name}?
                </h2>
                <div className="space-y-5">
                  {[
                    { title: '100% Free & Unlimited', desc: 'No usage limits, paywalls, or hidden fees — ever.' },
                    { title: 'Secure & Private',       desc: 'Files are processed locally; they never touch our servers.' },
                    { title: 'No Account Needed',      desc: 'Open the tool and start immediately. Zero friction.' },
                  ].map(item => (
                    <div key={item.title} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0" />
                      <div>
                        <div className="text-[14px] font-bold text-[#111827] mb-1">{item.title}</div>
                        <div className="text-[14px] text-[#6B7280] leading-relaxed">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Related Tools Widget */}
          {(relatedTools.length > 0) && (
            <div className="mt-8 pt-10 border-t border-[#E5E7EB]">
              <h2 className="text-2xl font-bold text-[#111827] mb-6">Similar Tools</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {relatedTools.map(rt => (
                  <Link key={rt.id} to={`/tool/${rt.id}`} className="flex items-center gap-4 p-4 bg-white border border-[#E5E7EB] rounded-2xl hover:border-[#D1D5DB] hover:shadow-[0_4px_12px_rgb(0,0,0,0.06)] transition-all group">
                    <div className="w-12 h-12 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl flex items-center justify-center text-[#374151] shrink-0 group-hover:bg-[#111827] group-hover:text-white transition-all">
                      <Icon name={rt.icon} className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-[15px] font-semibold text-[#111827] group-hover:text-black leading-tight mb-1">{rt.name}</div>
                      <div className="text-[13px] text-[#6B7280] line-clamp-1">{rt.description}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-center w-full py-8">
            <a 
              href="https://www.effectivecpmnetwork.com/jaj11f6qd?key=4fb306169b7dffbec2b625cff9337f14" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 bg-[#111827] text-white font-bold rounded-xl hover:bg-[#1F2937] transition-all shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-0.5"
            >
              Unlock Premium Features
            </a>
          </div>
        </div>        </div>
      </div>
    </>
  )
}
