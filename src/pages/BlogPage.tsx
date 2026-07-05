import { useTranslation } from "react-i18next";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useLangPath } from "@/hooks/useLangPath";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { blogPosts } from "@/data/blog";
import { Calendar } from "lucide-react";

const BlogPage = () => {
  const { i18n } = useTranslation();
  const { lp } = useLangPath();
  const isEn = i18n.language === "en";

  usePageMeta(
    isEn ? "Blog | Breakfast Time" : "Blog | Breakfast Time",
    isEn
      ? "Tips, ideas and news about breakfast and brunch delivery around Antibes."
      : "Conseils, idées et actualités sur le petit-déjeuner et le brunch livrés autour d'Antibes.",
    "/blog"
  );

  const sortedPosts = [...blogPosts].sort((a, b) => b.date.localeCompare(a.date));

  const tr = (fr: string, en: string) => (isEn ? en : fr);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="pt-32 pb-16 px-6 text-center" style={{ backgroundColor: "#f4f1ea" }}>
        <div className="max-w-3xl mx-auto">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-5 leading-tight" style={{ color: "#2a2a08" }}>
            {tr("Le blog Breakfast Time", "The Breakfast Time blog")}
          </h1>
          <p className="text-base leading-relaxed max-w-xl mx-auto" style={{ color: "#5a5a40" }}>
            {tr(
              "Idées de brunch, conseils et actualités autour du petit-déjeuner livré à Antibes et ses environs.",
              "Brunch ideas, tips and news about breakfast delivery in and around Antibes."
            )}
          </p>
        </div>
      </div>

      <div className="py-16 px-6 flex-1">
        <div className="max-w-4xl mx-auto grid gap-8 sm:grid-cols-2">
          {sortedPosts.map((post) => (
            <a
              key={post.slug}
              href={lp(`/blog/${post.slug}`)}
              className="block rounded-2xl overflow-hidden border transition-transform hover:scale-[1.02]"
              style={{ borderColor: "rgba(58,58,10,0.1)" }}
            >
              <img
                src={post.image}
                alt={isEn ? post.title_en : post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-5">
                <div
                  className="flex items-center gap-1.5 text-xs font-medium mb-2"
                  style={{ color: "#7a7020" }}
                >
                  <Calendar size={12} />
                  {new Date(post.date).toLocaleDateString(isEn ? "en-GB" : "fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
                <h2 className="font-display text-xl font-bold mb-2" style={{ color: "#2a2a08" }}>
                  {isEn ? post.title_en : post.title}
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: "#5a5a40" }}>
                  {isEn ? post.excerpt_en : post.excerpt}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BlogPage;
