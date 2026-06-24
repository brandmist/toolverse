import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Clock, Calendar, Share2, Twitter, Linkedin, Facebook, Tag } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { BLOGS } from '../data/blogs'
import { AdBanner } from '../components/ui/AdBanner'

export function BlogDetail() {
  const { slug } = useParams()
  
  const post = BLOGS.find(b => b.id === slug) || BLOGS[0];

  if (!post) {
    return (
      <div className="pt-24 pb-20 min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Blog Post Not Found</h1>
          <Link to="/" className="text-primary hover:underline">Return Home</Link>
        </div>
      </div>
    )
  }

  const pageUrl = `https://smartools.pages.dev/blog/${post.id}`;

  // Schema.org Article structured data
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.metaDescription || post.title,
    "datePublished": new Date(post.date).toISOString(),
    "dateModified": new Date(post.date).toISOString(),
    "author": {
      "@type": "Person",
      "name": post.author.name,
      "jobTitle": post.author.role
    },
    "publisher": {
      "@type": "Organization",
      "name": "SmarTools",
      "url": "https://smartools.pages.dev"
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": pageUrl
    }
  };

  // Breadcrumb structured data
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://smartools.pages.dev"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://smartools.pages.dev/blog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.title,
        "item": pageUrl
      }
    ]
  };

  const shareOnTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(post.title)}`, '_blank');
  };

  const shareOnLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`, '_blank');
  };

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`, '_blank');
  };

  return (
    <>
      <Helmet>
        <title>{post.title} | SmarTools Blog</title>
        <meta name="description" content={post.metaDescription || post.title} />
        <link rel="canonical" href={pageUrl} />
        {/* Open Graph */}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.metaDescription || post.title} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:site_name" content="SmarTools" />
        <meta property="article:published_time" content={new Date(post.date).toISOString()} />
        <meta property="article:author" content={post.author.name} />
        {post.tags?.map(tag => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.metaDescription || post.title} />
        {/* Schema */}
        <script type="application/ld+json">
          {JSON.stringify(articleSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>

      <div className="pt-24 pb-20 min-h-screen bg-surface">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/blog" className="inline-flex items-center text-sm font-semibold text-text-muted hover:text-text-primary transition-colors mb-12 bg-card border border-border px-4 py-2 rounded-full shadow-sm hover:shadow-md">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>

          <article>
            <header className="mb-12">
              <span className="text-button-primary font-bold text-sm tracking-widest uppercase mb-4 block">
                {post.category}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-text-primary mb-6 tracking-tight leading-tight">
                {post.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-text-muted text-sm border-b border-border pb-8 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center font-bold text-text-primary shadow-sm">
                    {post.author.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-text-primary">{post.author.name}</p>
                    <p className="text-xs">{post.author.role}</p>
                  </div>
                </div>
                <div className="w-px h-8 bg-border hidden sm:block"></div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {post.date}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {post.readTime}
                </div>
              </div>
            </header>

            <div className="flex justify-center w-full mb-8">
              <AdBanner adKey="1026c12149117e16c7ccce72edad6371" height={90} width={728} className="hidden md:flex" />
              <AdBanner adKey="820ae9a9c66d98143fc406aca9ac626f" height={60} width={468} className="hidden sm:flex md:hidden" />
              <AdBanner adKey="bab1185fa7522837a82e6dbf5c6015d5" height={50} width={320} className="sm:hidden" />
            </div>

          <div 
            className="prose prose-lg max-w-none text-text-muted prose-headings:font-extrabold prose-headings:text-text-primary prose-headings:tracking-tight prose-a:text-button-primary prose-a:font-bold hover:prose-a:underline prose-strong:text-text-primary prose-blockquote:border-l-4 prose-blockquote:border-text-primary prose-blockquote:bg-card prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-blockquote:text-text-primary prose-blockquote:shadow-sm prose-table:border-collapse prose-td:border prose-td:border-border prose-th:border prose-th:border-border prose-th:bg-surface prose-code:bg-surface prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-pre:bg-[#111827] prose-pre:text-[#A7F3D0] prose-pre:rounded-xl prose-pre:shadow-inner"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-border">
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="w-4 h-4 text-text-muted shrink-0" />
                {post.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-surface border border-border rounded-full text-xs font-semibold text-text-secondary">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <footer className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <span className="font-bold text-text-primary">Share this article:</span>
              <div className="flex gap-2">
                <button onClick={shareOnTwitter} className="p-3 bg-card border border-border rounded-full hover:bg-surface text-text-primary transition-colors shadow-sm" aria-label="Share on Twitter">
                  <Twitter className="w-5 h-5" />
                </button>
                <button onClick={shareOnLinkedIn} className="p-3 bg-card border border-border rounded-full hover:bg-surface text-text-primary transition-colors shadow-sm" aria-label="Share on LinkedIn">
                  <Linkedin className="w-5 h-5" />
                </button>
                <button onClick={shareOnFacebook} className="p-3 bg-card border border-border rounded-full hover:bg-surface text-text-primary transition-colors shadow-sm" aria-label="Share on Facebook">
                  <Facebook className="w-5 h-5" />
                </button>
              </div>
            </div>
          </footer>
          <div className="flex justify-center w-full mt-12">
            <AdBanner adKey="52d14c4cfc4b28a541def0f2dbd7b118" height={250} width={300} />
          </div>
        </article>
      </div>
    </div>
    </>
  )
}
