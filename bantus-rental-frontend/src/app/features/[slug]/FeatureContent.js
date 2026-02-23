// This component will do all the work.
// It's async so it can load the animation data.

import { featureItems } from "@/lib/features";
import Link from "next/link";
import { LottiePlayer } from "@/components/animations/LottiePlayer";
import fs from 'fs/promises';
import path from 'path';

export async function FeatureContent({ slug }) {
  const feature = featureItems.find((item) => item.slug === slug);

  if (!feature) {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold">Feature not found</h1>
        <p className="text-gray-500 mt-2">The feature with slug "{slug}" could not be located.</p>
        <Link href="/" className="text-orange-500 hover:underline mt-4 inline-block">
          Return to Homepage
        </Link>
      </div>
    );
  }

  let animationData = null;
  if (feature.image) {
    try {
      const filePath = path.join(process.cwd(), 'public', feature.image);
      const fileContents = await fs.readFile(filePath, 'utf8');
      animationData = JSON.parse(fileContents);
    } catch (error) {
      console.error(`Could not load animation for ${slug}:`, error);
    }
  }

  const { icon: Icon, title, description } = feature;

  return (
    <main className="bg-[#FBF5EE]">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Icon className="mx-auto h-16 w-16 text-orange-500" />
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            {title}
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            {description}
          </p>
          <div className="mt-10">
            <LottiePlayer animationData={animationData} />
          </div>
          <div className="mt-10">
            <Link
              href="/register"
              className="rounded-md bg-orange-600 px-6 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-orange-500"
            >
              Sign Up Now
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
