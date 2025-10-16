"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle, Code2, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import { useTranslation } from "@/hooks/use-translation";

// ==================== DATA LAYER ====================

const HERO_DATA = {
  typing: {
    baseText: "Transform your ideas into production-grade web experiences.",
    speed: 35,
    cursorDelay: 900,
  },

  tagline: "Next.js & Node.js Specialist",

  title: {
    line1: "Creative Idea To",
    line2: "Excellent Products",
  },

  description:
    "We are 50+ professional software engineers with more than 15 years of expertise in crafting high-performance, tailor-made digital solutions.",

  ctas: [
    {
      id: "contact",
      text: "Get Consultant",
      href: "/contact",
      variant: "primary",
      icon: ArrowRight,
    },
    {
      id: "services",
      text: "Our Services",
      href: "/services",
      variant: "secondary",
      icon: ArrowRight,
    },
  ],

  backgroundImages: [
    {
      src: "assets/images/code.png",
      alt: "Background slide image",
    },
    {
      src: "/task-management-app.png",
      alt: "Background slide image",
    },
    {
      src: "/developer-portfolio-template.jpg",
      alt: "Background slide image",
    },
  ],

  techStack: [
    { name: "Next.js", icon: Code2 },
    { name: "Node.js", icon: Server },
    { name: "TypeScript", icon: null },
    { name: "Tailwind CSS", icon: null },
    { name: "Prisma", icon: null },
    { name: "PostgreSQL", icon: null },
  ],

  valueBullets: [
    { text: "15+ years experience", icon: CheckCircle },
    { text: "120+ delivered projects", icon: CheckCircle },
    { text: "Performance & accessibility first", icon: CheckCircle },
  ],

  swiper: {
    autoplayDelay: 5000,
    effect: "fade",
  },
};

// Translation keys mapping
const TRANSLATION_KEYS = {
  tagline: "hero-tagline",
  titleLine1: "hero-title-line1",
  titleLine2: "hero-title-line2",
  description: "hero-description",
  typing: "hero-typing",
  ctaContact: "hero-cta-contact",
  ctaServices: "hero-cta-services",
  bullet1: "hero-bullet-1",
  bullet2: "hero-bullet-2",
  bullet3: "hero-bullet-3",
  bgSlideAlt: "bg-slide-alt",
};

// ==================== COMPONENT ====================

const HeroSection = () => {
  const { t, currentLanguage, translate } = useTranslation();
  const [typedText, setTypedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const isArabic = currentLanguage === "ar";

  // Typing animation effect
  useEffect(() => {
    let cancelled = false;
    let index = 0;
    setTypedText("");
    setShowCursor(true);

    const startTyping = (text: string) => {
      const timer = setInterval(() => {
        if (cancelled) {
          clearInterval(timer);
          return;
        }
        if (index < text.length) {
          setTypedText(text.slice(0, index + 1));
          index++;
        } else {
          clearInterval(timer);
          setTimeout(
            () => !cancelled && setShowCursor(false),
            HERO_DATA.typing.cursorDelay
          );
        }
      }, HERO_DATA.typing.speed);
    };

    const run = async () => {
      try {
        const translated = await translate(HERO_DATA.typing.baseText, {
          sourceLanguage: "en",
          targetLanguage: currentLanguage,
          key: TRANSLATION_KEYS.typing,
        });
        if (!cancelled) startTyping(translated);
      } catch {
        if (!cancelled) startTyping(HERO_DATA.typing.baseText);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [currentLanguage, translate]);

  // Prefetch translations
  useEffect(() => {
    if (currentLanguage === "en") return;

    const translationItems = [
      { text: HERO_DATA.tagline, key: TRANSLATION_KEYS.tagline },
      { text: HERO_DATA.title.line1, key: TRANSLATION_KEYS.titleLine1 },
      { text: HERO_DATA.title.line2, key: TRANSLATION_KEYS.titleLine2 },
      { text: HERO_DATA.description, key: TRANSLATION_KEYS.description },
      { text: HERO_DATA.ctas[0].text, key: TRANSLATION_KEYS.ctaContact },
      { text: HERO_DATA.ctas[1].text, key: TRANSLATION_KEYS.ctaServices },
      { text: HERO_DATA.valueBullets[0].text, key: TRANSLATION_KEYS.bullet1 },
      { text: HERO_DATA.valueBullets[1].text, key: TRANSLATION_KEYS.bullet2 },
      { text: HERO_DATA.valueBullets[2].text, key: TRANSLATION_KEYS.bullet3 },
      {
        text: HERO_DATA.backgroundImages[0].alt,
        key: TRANSLATION_KEYS.bgSlideAlt,
      },
    ];

    translationItems.forEach(({ text, key }) => {
      translate(text, {
        sourceLanguage: "en",
        targetLanguage: currentLanguage,
        key,
      }).catch(() => void 0);
    });
  }, [currentLanguage, translate]);

  return (
    <section
      className="relative min-h-[90vh] flex items-center overflow-hidden px-4 md:px-8 lg:px-12"
      aria-labelledby="hero-heading"
    >
      {/* Background Swiper */}
      <div className="absolute inset-0 ">
        <Swiper
          modules={[Autoplay, EffectFade]}
          effect={HERO_DATA.swiper.effect as any}
          autoplay={{
            delay: HERO_DATA.swiper.autoplayDelay,
            disableOnInteraction: false,
          }}
          loop
          allowTouchMove={false}
          className="h-full"
        >
          {HERO_DATA.backgroundImages.map((image, index) => (
            <SwiperSlide key={index}>
              <Image
                src={image.src}
                alt={t(
                  `${image.alt} ${index}`,
                  `${TRANSLATION_KEYS.bgSlideAlt} ${index}`
                )}
                fill
                priority
                className="object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-slate-900/90 z-10" aria-hidden />

      {/* Accents */}
      <div
        aria-hidden
        className="absolute z-10 -left-24 -top-32 h-96 w-72 rotate-6 bg-gradient-to-b from-indigo-500 to-purple-600"
      />
      <div
        aria-hidden
        className="absolute z-10 -right-24 bottom-0 h-96 w-72 -rotate-6 bg-gradient-to-b from-purple-600 to-indigo-500"
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-5xl">
          {/* Tagline */}
          <p
            className={`text-indigo-300 font-semibold tracking-wide mb-4 ${
              isArabic ? "text-right" : ""
            }`}
          >
            {t(HERO_DATA.tagline, TRANSLATION_KEYS.tagline)}
          </p>

          {/* Title */}
          <h1
            id="hero-heading"
            className={`text-white font-extrabold leading-[0.95] text-4xl md:text-6xl lg:text-7xl mb-6 ${
              isArabic ? "text-right" : ""
            }`}
          >
            {t(HERO_DATA.title.line1, TRANSLATION_KEYS.titleLine1)}
            <br className="hidden sm:block" />
            {t(HERO_DATA.title.line2, TRANSLATION_KEYS.titleLine2)}
          </h1>

          {/* Description with typing effect */}
          <p
            className={`text-slate-200 text-lg md:text-xl max-w-3xl mb-8 ${
              isArabic ? "text-right" : ""
            }`}
          >
            {t(HERO_DATA.description, TRANSLATION_KEYS.description)}
            <span className="block min-h-[1.75rem] mt-1 text-slate-300/90">
              {typedText}
              {showCursor && <span className="animate-pulse">|</span>}
            </span>
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            {HERO_DATA.ctas.map((cta, index) => {
              const Icon = cta.icon;
              const translationKey =
                index === 0
                  ? TRANSLATION_KEYS.ctaContact
                  : TRANSLATION_KEYS.ctaServices;

              return (
                <Button
                  key={cta.id}
                  size="lg"
                  className={
                    cta.variant === "secondary"
                      ? "bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-base font-semibold"
                      : ""
                  }
                  asChild
                >
                  <Link href={cta.href}>
                    {t(cta.text, translationKey)}
                    {Icon && <Icon className="ml-2 h-4 w-4" aria-hidden />}
                  </Link>
                </Button>
              );
            })}
          </div>

          {/* Tech stack badges */}
          <div className="mt-8 flex flex-wrap items-center gap-3 text-sm">
            {HERO_DATA.techStack.map((tech) => {
              const Icon = tech.icon;
              return (
                <span
                  key={tech.name}
                  className="inline-flex items-center gap-2 rounded-full bg-white/10 text-white px-3 py-1 backdrop-blur"
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  {tech.name}
                </span>
              );
            })}
          </div>

          {/* Value bullets */}
          <ul
            className={`mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-slate-200 ${
              isArabic ? "text-right" : ""
            }`}
          >
            {HERO_DATA.valueBullets.map((bullet, index) => {
              const Icon = bullet.icon;
              const translationKey = [
                TRANSLATION_KEYS.bullet1,
                TRANSLATION_KEYS.bullet2,
                TRANSLATION_KEYS.bullet3,
              ][index];

              return (
                <li key={index} className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-purple-600" />
                  {t(bullet.text, translationKey)}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
