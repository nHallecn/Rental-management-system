// src/components/landing/Footer.js
import Link from 'next/link';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';

const FooterLink = ({ href, children }) => (
  <Link
    href={href}
    className="text-sm leading-6 text-gray-400 hover:text-white transition"
  >
    {children}
  </Link>
);

export const Footer = () => (
  <footer className="bg-[#3A2A1A] text-white" aria-labelledby="footer-heading">
    <h2 id="footer-heading" className="sr-only">Footer</h2>

    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <div className="grid grid-cols-1 gap-10 xl:grid-cols-3 xl:gap-8">

        {/* Brand + Social */}
        <div className="space-y-5">
          <img
            className="h-20"
            src="/bantus-logo-white.svg"
            alt="Bantus Rental"
          />
          <p className="text-sm text-gray-300 max-w-sm">
            The complete rental management solution for Cameroonian landlords.
          </p>

          <div className="flex items-center gap-5 text-gray-400">
            <Link href="#" className="hover:text-white"><FaFacebookF /></Link>
            <Link href="#" className="hover:text-white"><FaInstagram /></Link>
            <Link href="#" className="hover:text-white"><FaLinkedinIn /></Link>
            <Link href="#" className="hover:text-white"><FaXTwitter /></Link>
          </div>
        </div>

        {/* Links */}
        <div className="xl:col-span-2 grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Features</h3>
            <ul className="mt-4 space-y-3">
              <li><FooterLink href="#">Collect Rent</FooterLink></li>
              <li><FooterLink href="#">Manage Tenants</FooterLink></li>
              <li><FooterLink href="#">Utility Billing</FooterLink></li>
              <li><FooterLink href="#">Reports & Analytics</FooterLink></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Resources</h3>
            <ul className="mt-4 space-y-3">
              <li><FooterLink href="#">Rental Tips</FooterLink></li>
              <li><FooterLink href="#">Lease Templates</FooterLink></li>
              <li><FooterLink href="#">Maintenance Guide</FooterLink></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Company</h3>
            <ul className="mt-4 space-y-3">
              <li><FooterLink href="#">About Bantus</FooterLink></li>
              <li><FooterLink href="#">Contact Us</FooterLink></li>
              <li><FooterLink href="#">Terms of Service</FooterLink></li>
              <li><FooterLink href="#">Privacy Policy</FooterLink></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Support</h3>
            <ul className="mt-4 space-y-3 text-sm text-gray-300">
              <li>support@bantusrental.com</li>
              <li>+237 672 433 563</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  </footer>
);
