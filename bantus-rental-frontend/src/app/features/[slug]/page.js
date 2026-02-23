import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { FeatureContent } from "./FeatureContent"; // We will still use this for cleanliness

// This function is correct and does not need to change.
export async function generateStaticParams() {
  const { featureItems } = await import("@/lib/features");
  return featureItems.map((feature) => ({
    slug: feature.slug,
  }));
}

// --- THIS IS THE CORRECTED PAGE COMPONENT ---
// It is async.
export default async function FeaturePage(props) {
  // --- THIS IS THE FIX ---
  // We MUST await the props.params promise to get the actual params object.
  const params = await props.params;
  const slug = params.slug;

  return (
    <div className="bg-white">
      <Header />
      {/* We pass the resolved slug to the content component */}
      <FeatureContent slug={slug} />
      <Footer />
    </div>
  );
}
