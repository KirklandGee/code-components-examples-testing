import { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

export interface TestimonialCarouselProps {
  id?: string;
  heading?: React.ReactNode;
  subheading?: string;
  showNavigation?: boolean;
  showPagination?: boolean;
  enableAutoplay?: boolean;
  autoplayDelay?: number;
  testimonial1Text?: React.ReactNode;
  testimonial1AuthorName?: string;
  testimonial1AuthorRole?: string;
  testimonial1AuthorCompany?: string;
  testimonial1Avatar?: string;
  testimonial1Visible?: boolean;
  testimonial2Text?: React.ReactNode;
  testimonial2AuthorName?: string;
  testimonial2AuthorRole?: string;
  testimonial2AuthorCompany?: string;
  testimonial2Avatar?: string;
  testimonial2Visible?: boolean;
  testimonial3Text?: React.ReactNode;
  testimonial3AuthorName?: string;
  testimonial3AuthorRole?: string;
  testimonial3AuthorCompany?: string;
  testimonial3Avatar?: string;
  testimonial3Visible?: boolean;
  testimonial4Text?: React.ReactNode;
  testimonial4AuthorName?: string;
  testimonial4AuthorRole?: string;
  testimonial4AuthorCompany?: string;
  testimonial4Avatar?: string;
  testimonial4Visible?: boolean;
  testimonial5Text?: React.ReactNode;
  testimonial5AuthorName?: string;
  testimonial5AuthorRole?: string;
  testimonial5AuthorCompany?: string;
  testimonial5Avatar?: string;
  testimonial5Visible?: boolean;
}

export default function TestimonialCarousel({
  id,
  heading = "What Our Customers Say",
  subheading = "Trusted by thousands of satisfied customers worldwide",
  showNavigation = true,
  showPagination = true,
  enableAutoplay = true,
  autoplayDelay = 5000,
  testimonial1Text = "This product has completely transformed how we work. The team is responsive and the features are exactly what we needed.",
  testimonial1AuthorName = "Sarah Johnson",
  testimonial1AuthorRole = "Marketing Director",
  testimonial1AuthorCompany = "TechCorp Inc.",
  testimonial1Avatar,
  testimonial1Visible = true,
  testimonial2Text = "Outstanding service and support. We've seen a 300% increase in productivity since implementing this solution.",
  testimonial2AuthorName = "Michael Chen",
  testimonial2AuthorRole = "CEO",
  testimonial2AuthorCompany = "Growth Solutions",
  testimonial2Avatar,
  testimonial2Visible = true,
  testimonial3Text = "The best investment we've made this year. Intuitive, powerful, and reliable. Highly recommended!",
  testimonial3AuthorName = "Emily Rodriguez",
  testimonial3AuthorRole = "Product Manager",
  testimonial3AuthorCompany = "Innovate Labs",
  testimonial3Avatar,
  testimonial3Visible = true,
  testimonial4Text = "Exceptional quality and attention to detail. Our clients have noticed the difference immediately.",
  testimonial4AuthorName = "David Thompson",
  testimonial4AuthorRole = "Operations Lead",
  testimonial4AuthorCompany = "Premier Services",
  testimonial4Avatar,
  testimonial4Visible = true,
  testimonial5Text = "A game-changer for our business. Simple to use yet incredibly powerful. Worth every penny.",
  testimonial5AuthorName = "Jessica Williams",
  testimonial5AuthorRole = "Founder",
  testimonial5AuthorCompany = "Startup Studio",
  testimonial5Avatar,
  testimonial5Visible = true,
}: TestimonialCarouselProps) {
  const swiperRef = useRef<SwiperType | null>(null);
  const prevButtonRef = useRef<HTMLButtonElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const paginationRef = useRef<HTMLDivElement>(null);

  const testimonials = [
    {
      text: testimonial1Text,
      authorName: testimonial1AuthorName,
      authorRole: testimonial1AuthorRole,
      authorCompany: testimonial1AuthorCompany,
      avatar: testimonial1Avatar,
      visible: testimonial1Visible,
    },
    {
      text: testimonial2Text,
      authorName: testimonial2AuthorName,
      authorRole: testimonial2AuthorRole,
      authorCompany: testimonial2AuthorCompany,
      avatar: testimonial2Avatar,
      visible: testimonial2Visible,
    },
    {
      text: testimonial3Text,
      authorName: testimonial3AuthorName,
      authorRole: testimonial3AuthorRole,
      authorCompany: testimonial3AuthorCompany,
      avatar: testimonial3Avatar,
      visible: testimonial3Visible,
    },
    {
      text: testimonial4Text,
      authorName: testimonial4AuthorName,
      authorRole: testimonial4AuthorRole,
      authorCompany: testimonial4AuthorCompany,
      avatar: testimonial4Avatar,
      visible: testimonial4Visible,
    },
    {
      text: testimonial5Text,
      authorName: testimonial5AuthorName,
      authorRole: testimonial5AuthorRole,
      authorCompany: testimonial5AuthorCompany,
      avatar: testimonial5Avatar,
      visible: testimonial5Visible,
    },
  ].filter((t) => t.visible);

  useEffect(() => {
    if (swiperRef.current && prevButtonRef.current && nextButtonRef.current) {
      const swiper = swiperRef.current;
      swiper.params.navigation = {
        prevEl: prevButtonRef.current,
        nextEl: nextButtonRef.current,
      };
      swiper.navigation.init();
      swiper.navigation.update();
    }
  }, []);

  return (
    <div id={id} className="wf-testimonialcarousel">
      <div className="wf-testimonialcarousel-header">
        <h2 className="wf-testimonialcarousel-heading">{heading}</h2>
        {subheading && (
          <p className="wf-testimonialcarousel-subheading">{subheading}</p>
        )}
      </div>

      <div className="wf-testimonialcarousel-container">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          autoplay={
            enableAutoplay
              ? {
                  delay: autoplayDelay,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }
              : false
          }
          pagination={
            showPagination
              ? {
                  el: paginationRef.current,
                  clickable: true,
                }
              : false
          }
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          className="wf-testimonialcarousel-swiper"
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <div className="wf-testimonialcarousel-card">
                <div className="wf-testimonialcarousel-quote-icon">
                  <svg
                    width="40"
                    height="32"
                    viewBox="0 0 40 32"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M0 32V16C0 7.168 5.504 0 16 0v6.4C11.328 6.4 8 9.728 8 14.4V16h8v16H0zm24 0V16c0-8.832 5.504-16 16-16v6.4c-4.672 0-8 3.328-8 8V16h8v16H24z" />
                  </svg>
                </div>
                <div className="wf-testimonialcarousel-text">
                  {testimonial.text}
                </div>
                <div className="wf-testimonialcarousel-author">
                  {testimonial.avatar && (
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.authorName}
                      className="wf-testimonialcarousel-avatar"
                    />
                  )}
                  <div className="wf-testimonialcarousel-author-info">
                    <div className="wf-testimonialcarousel-author-name">
                      {testimonial.authorName}
                    </div>
                    <div className="wf-testimonialcarousel-author-role">
                      {testimonial.authorRole}
                    </div>
                    <div className="wf-testimonialcarousel-author-company">
                      {testimonial.authorCompany}
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {showNavigation && (
          <div className="wf-testimonialcarousel-navigation">
            <button
              ref={prevButtonRef}
              className="wf-testimonialcarousel-button wf-testimonialcarousel-button-prev"
              aria-label="Previous testimonial"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              ref={nextButtonRef}
              className="wf-testimonialcarousel-button wf-testimonialcarousel-button-next"
              aria-label="Next testimonial"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        )}

        {showPagination && (
          <div
            ref={paginationRef}
            className="wf-testimonialcarousel-pagination"
          />
        )}
      </div>
    </div>
  );
}