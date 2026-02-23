import { Home, Users, FileText, Zap, Shield, BarChart } from "lucide-react";

// This array will be the single source of truth for all feature-related content.
export const featureItems = [
  {
    slug: "property-management",
    icon: Home,
    title: "Property Management",
    description: "Effortlessly manage all your properties from a single dashboard. Add new minicités, apartments, and rooms with just a few clicks. Keep track of every unit, its status, and its history in one organized place, eliminating paperwork and confusion.",
    // You can add a specific image path for each feature later
    image: "/animations/property-management.json", 
  },
  {
    slug: "tenant-management",
    icon: Users,
    title: "Tenant Management",
    description: "Maintain a complete digital record of every tenant. Register new tenants, manage their sessions, and store contact information securely. When a tenant leaves, their records are archived for future reference, ensuring you always have a complete history.",
    image: "/animations/tenant-management.json",
  },
  {
    slug: "digital-contracts",
    icon: FileText,
    title: "Digital Contracts",
    description: "Go paperless by uploading and storing rental contracts directly within the app. Both you and your tenants can access the contract anytime, anywhere, eliminating the risk of lost documents and providing clarity on rental terms.",
    image: "/animations/digital-contracts.json",
  },
  {
    slug: "utility-billing",
    icon: Zap,
    title: "Utility Billing",
    description: "Automate the tedious process of calculating water and electricity bills. Simply enter the meter readings, and Bantus Rental instantly calculates the consumption and total amount due, generating a bill that can be sent to the tenant, saving you hours of manual work.",
    image: "/animations/utility-billing.json",
  },
  {
    slug: "issue-tracking",
    icon: Shield,
    title: "Issue Tracking",
    description: "Provide your tenants with a simple way to report maintenance issues. Receive instant notifications for new issues, track their status from 'Open' to 'Resolved', and maintain a log of all repairs, improving communication and tenant satisfaction.",
    image: "/animations/issue-tracking.json",
  },
  {
    slug: "reports-and-analytics",
    icon: BarChart,
    title: "Reports & Analytics",
    description: "Gain valuable insights into your rental business with clear, concise reports. Track income, monitor payment statuses, and view occupancy rates at a glance. Make informed decisions based on real-time data to optimize your property management strategy.",
    image: "/animations/reports-analytics.json",
  },
];
