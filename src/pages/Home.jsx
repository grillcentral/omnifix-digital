import BlogPreview from "@/components/home/BlogPreview.jsx";
import FeaturedProducts from "@/components/home/FeaturedProducts.jsx";
import HeroSection from "@/components/home/HeroSection.jsx";
import ServicesSection from "@/components/home/ServicesSection.jsx";
import TestimonialsSection from "@/components/home/TestimonialsSection.jsx";
import WhyUsSection from "@/components/home/WhyUsSection.jsx";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturedProducts />
      <ServicesSection />
      <WhyUsSection />
      <TestimonialsSection />
      <BlogPreview />
    </>
  );
}
