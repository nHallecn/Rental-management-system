import { featureItems } from "@/lib/features";
import Link from "next/link";

export const FeaturesDropdown = () => {
  return (
    <div className="absolute left-1/2 top-full -translate-x-1/2 pt-4 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-300 z-20">
      <div className="w-[560px] rounded-xl bg-white p-8 shadow-xl">
        <div className="grid grid-cols-2 gap-x-12 gap-y-8">
          {featureItems.map((item) => (
            // --- VERIFY THIS LINK ---
            <Link
              key={item.slug}
              href={`/features/${item.slug}`} // This must be correct
              className="flex items-start gap-4 group/featureitem"
            >
              <item.icon className="h-6 w-6 text-orange-500" />
              <span className="text-sm font-semibold text-gray-900 group-hover/featureitem:text-orange-500">
                {item.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
