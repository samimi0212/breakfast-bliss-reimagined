import { useTranslation } from "react-i18next";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useLangPath } from "@/hooks/useLangPath";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NotFound from "./NotFound";
import { getBlogPostBySlug } from "@/data/blog";
import { Calendar, ShoppingBag } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const BlogPostPage = () => {
  const { slug } = useParams();
  const { i18n } = useTranslation();
  const { lp } = useLangPath();
  const navigate = useNavigate();
  const isEn = i18n.language === "en";
  const post = slug ? getBlogPostBySlug(slug) : undefined;

  usePageMeta(
    post ? (isEn ? post.metaTitle_en : post.metaTitle) : "Page introuvable | Breakfast Time",
    post ? (isEn ? post.metaDesc_en : post.metaDesc) : "",
    `/blog/${slug}`
  );

  if (!post) return <NotFound />;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="pt-32 pb-10 px-6" style={{ backgroundColor: "#f4f1ea" }}>
        <div className="max-w-2xl mx-auto text-center">
          <div
            className="inline-flex items-center gap-1.5 text-xs font-medium mb-4"
            style={{ color: "#7a7020" }}
          >
            <Calendar size={12} />
            {new Date(post.date).toLocaleDateString(isEn ? "en-GB" : "fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold leading-tight" style={{ color: "#2a2a08" }}>
            {isEn ? post.title_en : post.title}
          </h1>
        </div>
      </div>

      <img src={post.image} alt={isEn ? post.title_en : post.title} className="w-full h-72 object-cover" />

      <div className="py-16 px-6 flex-1">
        <div className="max-w-2xl mx-auto">
          {post.blocks.map((block, i) =>
            block.type === "h2" ? (
              <h2 key={i} className="font-display text-2xl font-bold mt-10 mb-4" style={{ color: "#2a2a08" }}>
                {isEn ? block.text_en : block.text}
              </h2>
            ) : (
              <p key={i} className="text-base leading-relaxed mb-5" style={{ color: "#3a3a2a" }}>
                {isEn ? block.text_en : block.text}
              </p>
            )
          )}

          <button
            onClick={() => navigate(lp("/carte"))}
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold transition-all hover:scale-105 mt-6"
            style={{ backgroundColor: "#DFF057", color: "#3a3a0a" }}
          >
            <ShoppingBag size={16} />
            {isEn ? "See our menu" : "Voir la carte"}
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BlogPostPage;
