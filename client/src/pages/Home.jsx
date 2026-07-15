import React, { useState, useRef, useEffect } from 'react';
import ContactModal from '../components/ContactModal';
import QuoteModal from '../components/QuoteModal';
import ServiceDetailModal from '../components/ServiceDetailModal';
import { useNavigate } from 'react-router-dom';
import { serviceService } from '../services/serviceService';

const featuredSlides = [
  {
    title: 'Collapsible Solar Power Station',
    subtitle: 'Efficient, portable, and sustainable energy for your needs.',
    image: '/featured1.png',
    cards: [],
  },
  {
    title: 'Collapsible Solar Power Station',
    subtitle: 'Reliable solar solutions for every environment.',
    image: '/featured2.png',
    cards: [],
  },
  {
    title: 'Collapsible Solar Power Station',
    subtitle: 'Innovative design for modern energy challenges.',
    image: '/featured3.png',
    cards: [],
  },
];

const Home = () => {
  const [showContact, setShowContact] = useState(false);
  const [showQuote, setShowQuote] = useState(false);
  const [showServiceDetail, setShowServiceDetail] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showSpecs, setShowSpecs] = useState(false);
  const [fade, setFade] = useState(false);
  const fadeTimeout = useRef();
  const slide = featuredSlides[currentSlide];
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);
  const [isHeroVisible, setIsHeroVisible] = useState(false);
  const [areStatsVisible, setAreStatsVisible] = useState(false);
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesError, setServicesError] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsHeroVisible(true), 100);
    const statsTimer = setTimeout(() => setAreStatsVisible(true), 900); // after hero anim
    return () => {
      clearTimeout(timer);
      clearTimeout(statsTimer);
    };
  }, []);

  useEffect(() => {
    // Fetch services from backend
    const fetchServices = async () => {
      setServicesLoading(true);
      try {
        const data = await serviceService.getServices();
        setServices(data);
      } catch (err) {
        setServicesError('Failed to load services.');
      } finally {
        setServicesLoading(false);
      }
    };
    fetchServices();
  }, []);

  // Animated stat numbers
  const statData = [
    { value: '30+', label1: 'Projects', label2: 'Completed Nationwide' },
    { value: '100%', label1: 'Satisfaction', label2: 'Client approval rate' },
    { value: '24/7', label1: 'Support', label2: 'Thru Email' },
    { value: '15+', label1: 'Team Members', label2: 'Expert professionals' },
  ];
  const [statCounts, setStatCounts] = useState(statData.map(() => 0));
  useEffect(() => {
    if (!areStatsVisible) return;
    const durations = [1200, 1200, 1200, 1200];
    const starts = statData.map(() => Date.now());
    let raf;
    function animate() {
      const now = Date.now();
      setStatCounts(statCounts => statCounts.map((prev, i) => {
        const elapsed = now - starts[i];
        const progress = Math.min(elapsed / durations[i], 1);
        const target = statData[i].value;
        return Math.floor(progress * target);
      }));
      if (statCounts.some((count, i) => count < statData[i].value)) {
        raf = requestAnimationFrame(animate);
      } else {
        setStatCounts(statData.map(d => d.value));
      }
    }
    raf = requestAnimationFrame(animate);
    return () => raf && cancelAnimationFrame(raf);
  }, [areStatsVisible]);

  // Only enable swipe when navbar is in hamburger mode (<=1499px)
  const isTouchEnabled = typeof window !== 'undefined' && window.innerWidth <= 1499;

  const handleTouchStart = (e) => {
    if (!isTouchEnabled) return;
    setTouchStartX(e.touches[0].clientX);
  };
  const handleTouchMove = (e) => {
    if (!isTouchEnabled) return;
    setTouchEndX(e.touches[0].clientX);
  };
  const handleTouchEnd = () => {
    if (!isTouchEnabled || touchStartX === null || touchEndX === null) return;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNext(); // swipe left
      } else {
        handlePrev(); // swipe right
      }
    }
    setTouchStartX(null);
    setTouchEndX(null);
  };

  const handleLearnMore = (service) => {
    setSelectedService(service);
    setShowServiceDetail(true);
  };

  const closeServiceDetailModal = () => {
    setShowServiceDetail(false);
    setSelectedService(null);
  };

  const handlePrev = () => {
    setFade(true);
    clearTimeout(fadeTimeout.current);
    fadeTimeout.current = setTimeout(() => {
      setCurrentSlide((prev) => (prev === 0 ? featuredSlides.length - 1 : prev - 1));
      setFade(false);
    }, 250);
  };
  const handleNext = () => {
    setFade(true);
    clearTimeout(fadeTimeout.current);
    fadeTimeout.current = setTimeout(() => {
      setCurrentSlide((prev) => (prev === featuredSlides.length - 1 ? 0 : prev + 1));
      setFade(false);
    }, 250);
  };
  const handleImageClick = () => setShowSpecs((prev) => !prev);

  // Add icon mapping for Material Symbols
  const iconMap = {
    solar_power: 'solar_power',
    build: 'build',
    science: 'science'
  };

  return (
    <div className="homepage-root">
      {/* Main Homepage Section */}
      <section id="home" className="homepage-section home-section-modern" style={{
        minHeight: 'calc(100vh - 64px)',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        position: 'relative',
        background: '#222',
        overflow: 'hidden',
        padding: 0,
        paddingTop: '120px',
      }}>
        {/* Background image placeholder */}
        <div style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          background: `url('/1000013266.jpg') center/cover no-repeat`,
          zIndex: 1,
        }} />
        {/* Overlay for readability */}
        <div style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.72) 0%, rgba(11, 11, 12, 0.92) 100%)',
          zIndex: 2,
        }} />
        <div
          className="homepage-content hero-animate"
          style={{
            position: 'relative',
            zIndex: 3,
            maxWidth: 650,
            width: '100%',
            margin: '0 auto',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '0 2rem',
            opacity: isHeroVisible ? 1 : 0,
            transform: isHeroVisible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'all 0.9s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          <h1
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              fontWeight: 700,
              marginBottom: 14,
              lineHeight: 1.08,
              letterSpacing: '-2px',
              fontFamily: 'Poppins, sans-serif',
              textShadow: '0 4px 24px rgba(0,0,0,0.18)',
              maxWidth: '650px',
              opacity: isHeroVisible ? 1 : 0,
              transform: isHeroVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.9s cubic-bezier(0.34, 1.56, 0.64, 1)',
              transitionDelay: isHeroVisible ? '0.2s' : '0s',
            }}
          >
            Sustainable Energy<br />
            <span className="nowrap-span">that Adapts to You</span>
          </h1>
          <p
            style={{
              fontSize: 'clamp(1rem, 1.8vw, 1.3rem)',
              fontWeight: 400,
              marginBottom: 36,
              maxWidth: 580,
              color: '#f3f3f3',
              textShadow: '0 2px 8px rgba(0,0,0,0.10)',
              lineHeight: 1.5,
              opacity: isHeroVisible ? 1 : 0,
              transform: isHeroVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.9s cubic-bezier(0.34, 1.56, 0.64, 1)',
              transitionDelay: isHeroVisible ? '0.4s' : '0s',
            }}
          >
            Embrace a greener future with innovative solutions tailored for eco-conscious living.
          </p>
          <button
            className="flash-slide flash-slide--green"
            onClick={() => navigate('/products')}
            style={{
              opacity: isHeroVisible ? 1 : 0,
              transform: isHeroVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.9s cubic-bezier(0.34, 1.56, 0.64, 1)',
              transitionDelay: isHeroVisible ? '0.6s' : '0s',
            }}
          >
            Shop Now
          </button>
        </div>
        {/* Spacer for 1920x1200 screens to push stats down */}
        <div className="stats-spacer-1920" />
        <div className="sliding-stats-container single-row">
          <div className="sliding-stats-track">
            {statData.concat(statData).map((stat, i) => (
              <div
                className="stat-group stat-animate"
                key={i}
                style={{
                  opacity: areStatsVisible ? 1 : 0,
                  transition: 'opacity 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  transitionDelay: areStatsVisible ? `${0.2 + 0.12 * (i % 4)}s` : '0s',
                }}
              >
                <div className="stat-number huge">
                  {stat.value}
                </div>
                <div className="stat-label">
                  <span className="stat-title">{stat.label1}</span>
                  <span className="stat-desc">{stat.label2}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section
  id="featured"
  className="homepage-section featured-section-modern"
  style={{
    minHeight: '100vh',
    width: '100%',
    background: 'linear-gradient(180deg, #b2f0e6 0%, #d0f7c6 70%, #fff 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '8rem 1rem 3rem 1rem',
  }}
>
  <h2
    style={{
      fontSize: '2.8rem',
      fontWeight: 700,
      color: '#111',
      marginBottom: 8,
      textAlign: 'center',
      letterSpacing: '-1px',
      textShadow: '0 2px 8px rgba(0,0,0,0.08)',
    }}
  >
    {slide.title}
  </h2>
  <div
    style={{
      fontSize: '1.1rem',
      color: '#444',
      marginBottom: 24,
      textAlign: 'center',
      fontWeight: 400,
      paddingBottom: 16,
    }}
  >
    {slide.subtitle}
  </div>

  {/* Carousel */}
  <div
    style={{
      position: 'relative',
      width: '90vw',
      maxWidth: 1200,
      height: 520,
      margin: '0 auto',
      marginBottom: 48,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
    onTouchStart={handleTouchStart}
    onTouchMove={handleTouchMove}
    onTouchEnd={handleTouchEnd}
  >
    <div className="featured-arrow-left" style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 2 }}>
      <button onClick={handlePrev} aria-label="Previous" style={{
        background: 'none',
        border: 'none',
        fontSize: 56,
        color: '#222',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <span className="material-symbols-outlined" style={{ fontSize: 56 }}>chevron_left</span>
      </button>
    </div>
    <img
      src={slide.image}
      alt="Product"
      className={`featured-image-fade featured-product-img${fade ? ' exiting' : ''}`}
      style={{ width: 700, height: 420, display: 'block', margin: '0 auto', position: 'relative', zIndex: 1 }}
    />
    <div className="featured-arrow-right" style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 2 }}>
      <button onClick={handleNext} aria-label="Next" style={{
        background: 'none',
        border: 'none',
        fontSize: 56,
        color: '#222',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <span className="material-symbols-outlined" style={{ fontSize: 56 }}>chevron_right</span>
      </button>
    </div>
    <div className="dots-indicator featured-section-modern dots-indicator" style={{ position: 'absolute', left: 0, right: 0, bottom: -32 }}>
      {featuredSlides.map((_, i) => (
        <span key={i} className={`dot${i === currentSlide ? ' active' : ''}`}></span>
      ))}
    </div>
  </div>

  {/* New Better Featured Descriptions */}
  <div style={{
  background: 'rgba(40,40,40,0.08)',
  borderRadius: 32,
  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  padding: '3.5rem 3vw',
  maxWidth: 900,
  width: '100%',
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  gap: 48,
}}>
  {[
    {
      heading: 'What is Collapsible?',
      tagline: 'Portable, Smart, Sustainable.',
      text: 'Collapsible is a foldable solar power station that turns sunlight into electricity. Easy to move, quick to set up, perfect for powering farms, ponds, or off-grid sites.'
    },
    {
      heading: 'Why Choose Collapsible?',
      tagline: 'More power. Less cost. Total freedom.',
      text: 'Save on fuel, cut your electric bills, and keep your farm running even during blackouts. Designed for remote use, it’s energy you control.'
    },
    {
      heading: 'How to Use Collapsible?',
      tagline: 'Unfold. Aim. Power up.',
      text: 'Simply unfold the panels, point them toward the sun, and connect your devices or pumps. In minutes, you’re harvesting solar energy with no technical hassle.'
    },
  ].map((desc, idx) => (
    <div key={idx}
      style={{
        display: 'flex',
        justifyContent: idx % 2 === 0 ? 'flex-start' : 'flex-end',
        width: '100%',
      }}
    >
      <div style={{
        maxWidth: 420,
        textAlign: idx % 2 === 0 ? 'left' : 'right',
      }}>
        <div className="featured-desc-heading"
          style={{ fontWeight: 700, fontSize: 28, marginBottom: 6, letterSpacing: '-1px', color: '#111' }}>
          {desc.heading}
        </div>
        <div style={{ fontSize: 16, fontWeight: 500, color: '#2a7f62', marginBottom: 14 }}>
          {desc.tagline}
        </div>
        <div className="featured-desc-text" style={{ fontSize: 18, color: '#222', lineHeight: 1.6 }}>
          {desc.text}
        </div>
      </div>
    </div>
  ))}
</div>

</section>

{(() => {
  const images = [
    '/Tinga Labak,Batangas_edited.png',
    '/Sto Tomas,Batangas_edited.png',
    '/Sabang,Puerto Galera2_edited.png',
    '/Banaba,Batangas_edited.png',
    '/Sabang, Puerto Galera1_edited.png',
    '/Paranaque,Manila_edited.png',
    '/Cuta,Batangas_edited.png',
    '/Alangilan,Batangas_edited.png',
  ];

  const heading = 'Find your dream aesthetic';
  const subheading = `You should feel safe when sitting in, or leaning on the piece, and you shouldn't be able to recognize any way in which it is flawed.`;
  const cta = 'Scroll down to see our services';

  const wrapperRef = React.useRef();
  const [isAnimating, setIsAnimating] = React.useState(true);

  React.useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsAnimating(false);
      return;
    }
    if (!isAnimating) return;
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    let animationId;
    const imageWidth = 452; // 420px width + 32px gap
    const totalWidth = images.length * imageWidth;
    const animate = () => {
      if (wrapper && isAnimating) {
        const currentScroll = wrapper.scrollLeft;
        const newScroll = currentScroll + 0.5;
        if (newScroll >= totalWidth) {
          wrapper.scrollLeft = 0;
        } else {
          wrapper.scrollLeft = newScroll;
        }
      }
      animationId = requestAnimationFrame(animate);
    };
    animationId = requestAnimationFrame(animate);
    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [isAnimating, images.length]);

  // Create multiple copies for seamless loop
  const extendedImages = [...images, ...images, ...images];

  return (
    <div style={{
      width: '100%',
      background: '#fff',
      padding: '5rem 0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      boxSizing: 'border-box'
    }}>
      <h2 className="section-title">Real Installations, Real Impact</h2>
      <div className="section-subtitle">Explore how Reset Corp’s products are powering homes, businesses, and communities.</div>
      <section
        style={{
          width: '100vw',
          overflow: 'hidden',
          position: 'relative',
          '--v-offset': '80px',
          '--curve-height': '180px',
          padding: 0,
        }}
      >
        <div
          ref={wrapperRef}
          className="wrapper"
          style={{
            display: 'grid',
            gridTemplateRows: 'clamp(80px, 30vw, 420px)',
            gridAutoFlow: 'column',
            gridGap: 'clamp(4px, 3vw, 32px)',
            overflow: 'auto',
            scrollSnapType: 'none',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            paddingLeft: 'clamp(4px, 2vw, 2rem)',
            paddingRight: 'clamp(4px, 2vw, 2rem)',
            scrollBehavior: 'auto',
            background: '#fff',
            width: '100%',
            maxWidth: '100vw',
          }}
        >
          {extendedImages.map((src, idx) => (
            <div className="gallery-image-wrapper" key={`${src}-${idx}`} style={{ position: 'relative', width: 'clamp(54px, 22vw, 420px)', height: 'clamp(54px, 22vw, 420px)', display: 'inline-block' }}>
              <img
                src={src}
                alt={`Gallery image ${(idx % images.length) + 1}`}
                loading="lazy"
                style={{
                  width: 'clamp(54px, 22vw, 420px)',
                  height: 'clamp(54px, 22vw, 420px)',
                  objectFit: 'cover',
                  borderRadius: 'clamp(8px, 4vw, 20px)',
                  boxShadow: 'none',
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  flexShrink: 0
                }}
              />
              {/* Overlay with location info */}
              {(() => {
                // Extract filename, remove leading slash and extension
                const filename = src.split('/').pop().replace(/_edited\.(jpg|jpeg|png)/i, '');
                // Split by comma to get place and district
                let [place, district] = filename.split(',').map(s => s.trim());
                // Remove trailing numbers from district (e.g., 'Puerto Galera1' -> 'Puerto Galera')
                if (district) district = district.replace(/\d+$/, '').trim();
                return (
                  <div className="gallery-image-overlay">
                    <div className="gallery-image-location">
                      <div className="gallery-image-place">{place || ''}</div>
                      <div className="gallery-image-district">{district || ''}</div>
                    </div>
                  </div>
                );
              })()}
            </div>
          ))}
        </div>
      </section>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontFamily: "'Inter', 'Roboto', Arial, sans-serif",
        fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
        color: '#1a232b',
        marginTop: '3.5rem',
        gap: '0.5rem'
      }}>
        <span>{cta}</span>
        <span
          className="carousel-down-arrow"
          aria-hidden="true"
          style={{
            fontSize: '2.5rem',
            color: '#1a232b'
          }}
        >
          ↓
        </span>
      </div>
      <style>{`
        .wrapper::-webkit-scrollbar { 
          display: none; 
        }
        section::before, section::after {
          content: "";
          display: block;
          background: white;
          width: calc(100vw + 2 * var(--v-offset));
          height: var(--curve-height);
          position: absolute;
          border-radius: 50%;
          left: calc(-1 * var(--v-offset));
          right: calc(-1 * var(--v-offset));
        }
        section::before { 
          top: calc(-0.6 * var(--curve-height)); 
        }
        section::after { 
          bottom: calc(-0.6 * var(--curve-height)); 
        }
        @keyframes arrow-bounce { 
          0% { transform: translateY(0); } 
          100% { transform: translateY(18px); } 
        }
        .carousel-down-arrow { 
          animation: arrow-bounce 1.5s infinite alternate; 
        }
        @media (max-width: 1024px) {
          section::before,
          section::after {
            display: none !important;
          }
          .wrapper {
            grid-template-rows: clamp(54px, 18vw, 300px);
          }
        }
        @media (max-width: 768px) {
          .wrapper {
            grid-template-rows: clamp(40px, 22vw, 160px);
            grid-gap: clamp(2px, 2vw, 8px);
            padding-left: 1vw;
            padding-right: 1vw;
          }
        }
        @media (max-width: 480px) {
          .wrapper {
            grid-template-rows: clamp(32px, 24vw, 80px);
            grid-gap: 4px;
            padding-left: 0.5vw;
            padding-right: 0.5vw;
          }
        }
      `}</style>
    </div>
  );
})()}

      <section id="services" className="homepage-section services-section" style={{
        background: '#fff',
        width: '100%',
        position: 'relative',
      }}>
        <h2 className="services-section-heading" style={{textAlign: 'center', color: '#111'}}>Our Services</h2>
        <style>{`
          .services-flex {
            display: flex;
            flex-wrap: wrap;
            gap: 2.2rem;
            justify-content: center;
            margin: 2.5rem 0 1.5rem 0;
          }
          .service-card {
            background: #fff;
            border-radius: 18px;
            box-shadow: 0 2px 12px rgba(40,167,69,0.08);
            padding: 2.2rem 2rem 1.5rem 2rem;
            width: 340px;
            min-height: 340px;
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;
            transition: box-shadow 0.3s cubic-bezier(.4,0,.2,1), transform 0.3s cubic-bezier(.4,0,.2,1);
          }
          .service-card:hover {
            box-shadow: 0 8px 32px rgba(40,167,69,0.13);
            transform: translateY(-6px) scale(1.01);
            z-index: 2;
          }
          .service-icon {
            background: #e0fbe8;
            color: #28a745;
            border-radius: 50%;
            padding: 16px;
            font-size: 2.5rem;
            margin-bottom: 1rem;
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }
          .learn-more-btn {
            background: #28a745;
            color: #fff;
            border: none;
            border-radius: 8px;
            padding: 0.7rem 1.6rem;
            font-size: 1.1rem;
            font-weight: 600;
            margin-top: 1.2rem;
            cursor: pointer;
            box-shadow: 0 4px 16px rgba(40,167,69,0.10);
            transition: background 0.2s, color 0.2s, box-shadow 0.2s, transform 0.2s;
            letter-spacing: 0.5px;
          }
          .learn-more-btn:hover {
            background: #218838;
            color: #fff;
            box-shadow: 0 8px 24px rgba(40,167,69,0.18);
            transform: translateY(-2px) scale(1.04);
          }
        `}</style>
        <div className="services-flex">
          {servicesLoading ? (
    <div>Loading services...</div>
  ) : servicesError ? (
    <div style={{ color: 'red' }}>{servicesError}</div>
  ) : (
    services.map(service => (
            <div className="service-card" key={service._id}>
              <div className="service-icon material-symbols-outlined">{iconMap[service.icon] || service.icon || 'miscellaneous_services'}</div>
              <h3 className="services-card-heading" style={{color:'#222',margin:'0.7rem 0 0.5rem 0',fontWeight:600,fontSize:'1.25rem',textAlign:'center'}}>{service.name}</h3>
              <p className="services-card-desc" style={{color:'#222',fontSize:'1rem',margin:'0 0 0.7rem 0',textAlign:'center'}}>{service.description}</p>
              <div style={{flex:1}} />
              <button className="learn-more-btn" onClick={() => handleLearnMore(service)}>
                Learn More
              </button>
            </div>
          ))
  )}
        </div>
        {/* CTA Section with heading and subheading */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: '3rem',
          marginBottom: '1.5rem',
        }}>
          <div style={{
            fontWeight: 700,
            fontSize: '1.7rem',
            marginBottom: 8,
            color: '#111',
            textAlign: 'center',
            fontFamily: 'Poppins, sans-serif',
          }}>
            Ready to Get Started?
          </div>
          <div className="services-cta-desc" style={{
            fontSize: '1.1rem',
            color: '#222',
            marginBottom: 24,
            textAlign: 'center',
            maxWidth: 600,
          }}>
            Contact us today to discuss your project requirements and get customized solutions
        </div>
        <div className="services-cta">
          <button className="contact-btn" onClick={() => setShowContact(true)}>Contact Us</button>
          </div>
        </div>
      </section>
      <section id="about" style={{
        background: "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('about-bg.jpg') center/cover fixed",
        padding: "6rem 0 3rem 0",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "520px",
        position: "relative",
        width: '100%',
      }}>
        {/* SVG wave at top, merging with about-bg */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          lineHeight: 0,
          zIndex: 2,
          pointerEvents: 'none',
        }}>
          <svg viewBox="0 0 1440 80" width="100%" height="80" preserveAspectRatio="none" style={{ display: 'block' }}>
            <path
              d="M0,40 C480,0 960,0 1440,40 L1440,0 L0,0 Z"
              fill="#fff"
            />
          </svg>
        </div>
        <div className="about-2x2-grid" style={{
          display: "flex",
          flexDirection: "column",
          gap: "4rem",
          width: "min(1200px, 95vw)",
          margin: "0 auto",
          position: "relative",
          zIndex: 3,
        }}>
          <div style={{ display: "flex", gap: "4rem", width: "100%" }}>
            <img
              src="/about(2).jpg"
              alt="About 2"
              className="about-img"
              style={{
                width: "600px",
                height: "400px",
                objectFit: "cover",
                borderRadius: "16px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                transition: "transform 0.35s cubic-bezier(.4,0,.2,1)"
              }}
            />
            <div style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              padding: "0 1rem"
            }}>
              <h2 className="about-section-heading" style={{ fontSize: "2.3rem", fontWeight: 600, marginBottom: "1.2rem", marginTop: 0, color: "#fff" }}>Who We Are</h2>
              <p className="about-section-desc" style={{ fontSize: "1.1rem", color: "#fff", lineHeight: 1.6, margin: 0 }}>
              RESET Corp pioneers portable solar solutions that power farms and remote communities. Driven by a mission to make clean energy simple, affordable, and within reach, we help build resilient, sustainable livelihoods wherever the sun shines.
              </p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "4rem", width: "100%" }}>
            <img
              src="/about(1).jpg"
              alt="About 1"
              className="about-img"
              style={{
                width: "600px",
                height: "400px",
                objectFit: "cover",
                borderRadius: "16px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                transition: "transform 0.35s cubic-bezier(.4,0,.2,1)"
              }}
            />
            <img
              src="/about(3).jpg"
              alt="About 3"
              className="about-img"
              style={{
                width: "600px",
                height: "400px",
                objectFit: "cover",
                borderRadius: "16px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                transition: "transform 0.35s cubic-bezier(.4,0,.2,1)"
              }}
            />
          </div>
        </div>
        <style>{`
          .about-img:hover {
            transform: scale(1.13);
            z-index: 2;
            box-shadow: 0 8px 32px rgba(40,167,69,0.13);
          }
          @media (max-width: 900px) {
            .about-2x2-grid {
              gap: 1.5rem;
            }
            .about-2x2-grid > div {
              flex-direction: column !important;
              gap: 1.5rem;
              align-items: center;
            }
            .about-img {
              width: 90vw !important;
              max-width: 340px;
              height: 180px !important;
            }
          }
          @media (max-width: 600px) {
            .featured-arrow-left, .featured-arrow-right {
              display: none !important;
            }
            .services-section-heading {
              font-size: 1.2rem !important;
            }
            .services-card-heading {
              font-size: 1rem !important;
            }
            .services-card-desc {
              font-size: 0.85rem !important;
            }
            .services-cta-desc {
              font-size: 0.85rem !important;
            }
            .about-section-heading {
              font-size: 1.1rem !important;
            }
            .about-section-desc {
              font-size: 0.85rem !important;
            }
            .featured-product-img {
              width: 90vw !important;
              max-width: 320px !important;
              height: auto !important;
            }
            .homepage-section.home-section-modern {
              padding-top: 44px !important;
            }
            #home.homepage-section.home-section-modern {
              padding-top: 44px !important;
            }
          }
          @media (min-width: 1800px) and (min-height: 1000px) {
            .homepage-section.home-section-modern {
              padding-top: 120px !important;
            }
            .stats-spacer-1920 {
              height: 40px;
              width: 100%;
              display: block;
              background: transparent;
            }
            .stat-number.huge {
              font-size: 4.5rem !important;
            }
            .stat-title {
              font-size: 1.7rem !important;
            }
            .stat-desc {
              font-size: 1rem !important;
            }
            .stat-group {
              min-width: 400px !important;
              padding-right: 48px !important;
            }
            .sliding-stats-track {
              gap: 140px !important;
            }
            .sliding-stats-container.single-row {
              margin-top: 80px !important;
            }
          }
          @media not all and (min-width: 1800px) and (min-height: 1000px) {
            .stats-spacer-1920 {
              display: none;
            }
          }
        `}</style>
      </section>
      {/* Footer Section */}
      <footer style={{
        width: '100%',
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        color: '#333',
        padding: '4rem 2rem 2rem 2rem',
        fontFamily: 'Poppins, sans-serif',
        marginTop: '0',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.1)',
        boxSizing: 'border-box'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '2.5rem',
          alignItems: 'start'
        }}>
          
          {/* Company */}
          <div>
            <div className="footer-section-title" style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: 12, color: '#2c3e50' }}>Company</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a href="#about" onClick={e => { e.preventDefault(); document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); }} style={{ color: '#555', textDecoration: 'none', fontSize: '1rem', transition: 'color 0.2s ease', fontWeight: 500 }} onMouseEnter={e => e.target.style.color = '#28a745'} onMouseLeave={e => e.target.style.color = '#555'}>About Us</a>
              <a href="#services" onClick={e => { e.preventDefault(); document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }); }} style={{ color: '#555', textDecoration: 'none', fontSize: '1rem', transition: 'color 0.2s ease', fontWeight: 500 }} onMouseEnter={e => e.target.style.color = '#28a745'} onMouseLeave={e => e.target.style.color = '#555'}>Services</a>
              <a href="/products" onClick={e => { e.preventDefault(); navigate('/products'); }} style={{ color: '#555', textDecoration: 'none', fontSize: '1rem', transition: 'color 0.2s ease', fontWeight: 500 }} onMouseEnter={e => e.target.style.color = '#28a745'} onMouseLeave={e => e.target.style.color = '#555'}>Products</a>
              <a href="/contact" onClick={e => { e.preventDefault(); navigate('/contact'); }} style={{ color: '#555', textDecoration: 'none', fontSize: '1rem', transition: 'color 0.2s ease', fontWeight: 500 }} onMouseEnter={e => e.target.style.color = '#28a745'} onMouseLeave={e => e.target.style.color = '#555'}>Contact</a>
            </div>
          </div>

          {/* Contact Info with Icons */}
          <div>
          <div className="footer-section-title" style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: 12, color: '#2c3e50' }}>Contact</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span className="material-symbols-outlined" style={{ color: '#28a745', fontSize: 20 }}>mail</span>
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=collapsiblesolar@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#28a745', textDecoration: 'none', fontWeight: 500 }}
              >
                collapsiblesolar@gmail.com
              </a>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
  <span className="material-symbols-outlined" style={{ color: '#28a745', fontSize: 20 }}>call</span>
  <a href="tel:+63439800385" style={{ color: '#28a745', textDecoration: 'none', fontWeight: 500 }}>
    (043) 980-0385
  </a>
</div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 10 }}>
              <span className="material-symbols-outlined" style={{ color: '#28a745', fontSize: 20, marginTop: 2 }}>location_on</span>
              <span style={{ color: '#333', fontSize: '1rem' }}>Batangas, 4200, Philippines</span>
            </div>
          </div>

          {/* Our Services (no descriptions) */}
          <div>
            <div className="footer-section-title" style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: 12, color: '#2c3e50', textAlign: 'left' }}>Our Services</div>
            <ul style={{ paddingLeft: 18, color: '#333', fontSize: '1rem', margin: 0, listStyle: 'disc', textAlign: 'left' }}>
              <li>Sustainable Energy Solutions</li>
              <li>Fabrication and Installation</li>
              <li>Research</li>
            </ul>
          </div>
        </div>

        {/* Bottom Section with Social Links and Copyright */}
        <div style={{
          maxWidth: '1200px',
          margin: '3rem auto 0',
          paddingTop: '2rem',
          borderTop: '1px solid #dee2e6',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ 
            fontSize: '0.95rem', 
            color: '#666',
            fontWeight: 500,
            textAlign: 'center',
            width: '100%'
          }}
            className="footer-bottom-text"
          >
            &copy; {new Date().getFullYear()} Collapsible Solar Solutions. All rights reserved.
          </div>
        </div>
      </footer>
      <ContactModal isOpen={showContact} onClose={() => setShowContact(false)} />
      <QuoteModal isOpen={showQuote} onClose={() => setShowQuote(false)} />
      <ServiceDetailModal isOpen={showServiceDetail} onClose={closeServiceDetailModal} service={selectedService} />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined');
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        .homepage-root {
          width: 100vw;
          min-height: 100vh;
          margin: 0;
          padding: 0;
        }
        .homepage-section {
          width: 100vw;
          min-height: 40vh;
          display: flex;
          flex-direction: column;
          alignItems: center;
          justify-content: center;
          padding: 2rem 1rem;
          box-sizing: border-box;
        }
        .home-section { background: #e8fbe8; min-height: 60vh; }
        .featured-section { background: #f1fbe9; }
        .services-section { background: #f6fff6; }
        .about-section { background: #f4fbe8; }
        .footer-section { background: #e8fbe8; min-height: 20vh; }
        .homepage-section h1, .homepage-section h2, .homepage-section h3 {
          margin: 0.5em 0;
        }
        .services-flex {
          display: flex;
          flex-wrap: wrap;
          gap: 2rem;
          justify-content: center;
          width: 100%;
        }
        .service-card {
          background: #fff;
          border-radius: 1rem;
          box-shadow: 0 2px 12px rgba(40,167,69,0.13);
          padding: 2.5rem 1.8rem 2rem 1.8rem;
          min-width: 260px;
          max-width: 320px;
          flex: 1 1 260px;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: box-shadow 0.3s, transform 0.3s;
          border: 2px solid #e8fbe8;
        }
        .service-card:hover {
          box-shadow: 0 8px 32px rgba(40,167,69,0.13);
          transform: translateY(-8px) scale(1.03);
          border-color: #28a745;
        }
        .service-icon.material-symbols-outlined {
          background: #e8fbe8;
          color: #28a745;
          border-radius: 50%;
          padding: 16px;
          font-size: 2.5rem;
          margin-bottom: 1rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .service-card ul {
          text-align: left;
          margin: 1rem 0;
          padding-left: 1.2rem;
        }
        .learn-more-btn {
          position: relative;
          width: 150px;
          padding: 12px;
          border-radius: 20px;
          color: #111;
          border: 2px solid #bbb;
          background: transparent;
          font-weight: 500;
          margin-top: 1rem;
          overflow: hidden;
          z-index: 1;
          cursor: pointer;
          transition: background 0.3s, color 0.2s, border-color 0.2s;
        }
        .learn-more-btn:hover {
          background: #28a745;
          color: #fff;
          border-color: #28a745;
        }
        .services-cta {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1.5rem;
          margin-top: 2.5rem;
          width: 100%;
        }
        .contact-btn, .quote-btn {
          background: #222;
          color: #fff;
          border: none;
          border-radius: 1.5rem;
          padding: 0.7rem 2rem;
          font-weight: 500;
          font-size: 1.1rem;
          cursor: pointer;
          transition: background 0.2s;
        }
        .quote-btn {
          background: #28a745;
        }
        .contact-btn:hover, .quote-btn:hover {
          background: #218838;
        }
        
        /* Responsive Design Improvements */
        @media (max-width: 768px) {
          .home-section-modern {
            padding: 80px 1rem 0 2rem !important;
          }
          .home-section-modern > div {
            padding: 0 1rem 0 2rem !important;
          }
          .home-section-modern h1 {
            max-width: 100% !important;
          }
          .home-section-modern p {
            max-width: 100% !important;
          }
        }
        
        @media (max-width: 900px) {
          .services-flex {
            flex-direction: column;
            align-items: center;
          }
        }
        @media (min-width: 600px) {
          .homepage-section {
            padding: 4rem 2rem;
          }
          .home-section { min-height: 80vh; }
        }
        @media (min-width: 900px) {
          .homepage-section {
            padding: 6rem 4rem;
          }
          .home-section { min-height: 100vh; }
        }
        @media (max-width: 599px) {
          .homepage-section h1 { font-size: 2rem; }
          .homepage-section h2 { font-size: 1.3rem; }
          .homepage-section h3 { font-size: 1.1rem; }
        }
        @media (min-width: 600px) {
          .homepage-section h1 { font-size: 2.7rem; }
          .homepage-section h2 { font-size: 2rem; }
          .homepage-section h3 { font-size: 1.3rem; }
        }
        .spec-box-animate {
          will-change: opacity, transform;
        }
        .flash-slide {
          border: none;
          display: inline-block;
          color: #222;
          border-radius: 32px;
          position: relative;
          overflow: hidden;
          text-decoration: none;
          font-family: 'Poppins', sans-serif;
          font-size: 20px;
          font-weight: 600;
          letter-spacing: 0.5px;
          text-align: center;
          box-shadow: 0 4px 20px rgba(40,167,69,0.13);
          transition: box-shadow 0.3s, transform 0.3s;
          background: linear-gradient(90deg, #e8fbe8 0%, #28a745 100%);
          cursor: pointer;
          padding: 18px 52px;
        }
        .flash-slide--green {
          background: linear-gradient(90deg, #e8fbe8 0%, #28a745 100%);
        }
        
        .flash-slide:hover {
          transform: scale(1.08);
          box-shadow: 0 8px 32px rgba(40,167,69,0.25);
        }

        .flash-slide::before {
          content: "";
          position: absolute;
          top: 0;
          left: -75%;
          width: 50%;
          height: 100%;
          background: rgba(255, 255, 255, 0.3);
          transform: skewX(-20deg);
          transition: left 0.5s;
        }

        .flash-slide:hover::before {
          left: 125%;
        }
        .sliding-stats-container.single-row {
          position: static;
          width: 100vw;
          margin-top: 110px;
          z-index: 10;
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          pointer-events: none;
          overflow: hidden;
        }
        .sliding-stats-track {
          display: flex;
          align-items: flex-end;
          gap: 96px;
          animation: slide-stats 32s linear infinite;
        }
        .stat-group {
          display: flex;
          align-items: flex-end;
          gap: 8px;
          min-width: 320px;
          padding: 0 32px 0 0;
          background: none;
          border-radius: 0;
          box-shadow: none;
        }
        .stat-number.huge {
          font-family: 'Poppins', sans-serif;
          font-size: 5.2rem;
          font-weight: 800;
          color: #fff;
          line-height: 1;
          margin-right: 18px;
          text-shadow: 0 4px 24px rgba(0,0,0,0.18);
        }
        .stat-label {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          font-family: 'Poppins', sans-serif;
          font-size: 2.1rem;
          font-weight: 300;
          color: #e0f7fa;
          letter-spacing: 0.02em;
          white-space: nowrap;
        }
        .stat-title {
          font-size: 2.1rem;
          font-weight: 300;
          color: #e0f7fa;
          line-height: 1.1;
        }
        .stat-desc {
          font-size: 1.1rem;
          font-weight: 200;
          color: #b2f0e6;
          line-height: 1.1;
        }
        @keyframes slide-stats {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .featured-section-modern button[aria-label="Previous"],
        .featured-section-modern button[aria-label="Next"] {
          transition: transform 0.2s cubic-bezier(.4,0,.2,1);
        }
        .featured-section-modern button[aria-label="Previous"]:hover,
        .featured-section-modern button[aria-label="Next"]:hover {
          transform: scale(1.35);
        }
        .featured-section-modern button[aria-label="Previous"]:focus:not(:focus-visible),
        .featured-section-modern button[aria-label="Next"]:focus:not(:focus-visible) {
          outline: none;
          box-shadow: none;
        }
        .featured-section-modern .dots-indicator {
          display: flex;
          justify-content: center;
          gap: 12px;
          align-items: center;
        }
        .featured-section-modern .dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #b2b2b2;
          display: inline-block;
          transition: background 0.2s, transform 0.4s cubic-bezier(.4,0,.2,1);
        }
        .featured-section-modern .dot.active {
          background: #222;
          transform: scale(1.3);
        }
        .featured-image-fade {
          opacity: 1;
          transition: opacity 0.5s cubic-bezier(.4,0,.2,1);
        }
        .featured-image-fade.exiting {
          opacity: 0;
        }
        @media (max-width: 600px) {
          .home-section-modern h1 {
            font-size: clamp(2.8rem, 11vw, 4rem) !important;
            margin-bottom: 18px !important;
            line-height: 1.14 !important;
            letter-spacing: 0 !important;
            word-break: break-word !important;
            text-align: center !important;
          }
          .home-section-modern p {
            font-size: clamp(1.1rem, 4vw, 1.3rem) !important;
            margin-bottom: 20px !important;
          }
          .home-section-modern .homepage-content {
            max-width: 100% !important;
            padding: 0 0.2rem !important;
            margin: 0 auto !important;
            align-items: center !important;
            justify-content: center !important;
            text-align: center !important;
            display: flex !important;
            flex-direction: column !important;
          }
          .home-section-modern .nowrap-span {
            white-space: normal !important;
          }
          /* Featured Products section text size adjustments for small screens */
          .featured-section-modern h2 {
            font-size: 1.3rem !important;
          }
          .featured-section-modern > div[style*="color: #444"] {
            font-size: 0.95rem !important;
          }
          .featured-section-modern div[style*="fontWeight: 700"][style*="fontSize: 28px"] {
            font-size: 1.1rem !important;
          }
          .featured-section-modern div[style*="fontSize: 18px"] {
            font-size: 0.95rem !important;
          }
          .featured-desc-heading {
            font-size: 1.05rem !important;
          }
          .featured-desc-text {
            font-size: 0.85rem !important;
          }
          .footer-section-heading {
            font-size: 0.8rem !important;
          }
          .footer-section-title {
            font-size: 0.95rem !important;
          }
          footer ul, footer a, footer span, footer div[style*='fontSize: 0.95rem'] {
            font-size: 0.75rem !important;
          }
          .footer-bottom-text {
            font-size: 0.65rem !important;
          }
        }
        @media (max-width: 450px) {
          .home-section-modern h1 {
            font-size: 2.3rem !important;
            line-height: 1.18 !important;
          }
          .home-section-modern p {
            font-size: 1.05rem !important;
          }
        }
        @media (max-width: 370px) {
          .home-section-modern h1 {
            font-size: 1.8rem !important;
            line-height: 1.22 !important;
          }
          .home-section-modern p {
            font-size: 0.85rem !important;
          }
        }
        @media (max-height: 900px) {
          .home-section-modern {
            min-height: unset !important;
            padding-top: 80px !important;
            padding-bottom: 40px !important;
          }
        }
        .homepage-stats-row {
          margin-top: 64px;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: flex-end;
          z-index: 3;
          position: relative;
        }
        @media (max-width: 900px), (max-height: 900px) {
          .homepage-stats-row {
            margin-top: 80px !important;
          }
        }
        @media (max-width: 600px) {
          .homepage-stats-row {
            flex-direction: column;
            margin-top: 48px !important;
            gap: 24px;
          }
        }
        @media (max-width: 900px), (max-height: 900px) {
          .sliding-stats-container.single-row {
            z-index: 10 !important;
            position: static !important;
            margin-top: 50px;
            bottom: unset !important;
            pointer-events: auto;
          }
          .home-section-modern {
            min-height: unset !important;
            padding-top: 80px !important;
            padding-bottom: 40px !important;
          }
        }
        @media (max-width: 600px) {
          .sliding-stats-container.single-row {
            z-index: 10 !important;
            position: static !important;
            margin-top: 40px;
            bottom: unset !important;
            pointer-events: auto;
          }
          .home-section-modern {
            min-height: unset !important;
            padding-top: 60px !important;
            padding-bottom: 24px !important;
          }
          .stat-number.huge {
            font-size: 1.35rem;
          }
          .stat-title {
            font-size: 0.9rem;
          }
          .stat-desc {
            font-size: 0.65rem;
          }
        }
        @media (max-height: 1080px) and (min-width: 1200px) {
          .stat-number.huge {
            font-size: 3.2rem;
          }
          .stat-title {
            font-size: 1.3rem;
          }
          .stat-desc {
            font-size: 0.9rem;
          }
        }
        .section-title {
          font-size: clamp(2.2rem, 5vw, 3.2rem);
          font-weight: 700;
          color: #111 !important;
          margin-bottom: 0.5em;
          text-align: center;
          letter-spacing: -1px;
          font-family: 'Poppins', sans-serif;
        }
        .section-subtitle {
          font-size: clamp(1.1rem, 2.5vw, 1.5rem);
          font-weight: 400;
          color: #444 !important;
          margin-bottom: 1.5em;
          text-align: center;
          font-family: 'Poppins', sans-serif;
        }
        /* Gallery Image Hover Overlay */
        .gallery-image-wrapper {
          position: relative;
          display: inline-block;
          /* No z-index or background here */
        }
        .gallery-image-overlay {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(30, 30, 30, 0.62); /* darker semi-transparent gray */
          opacity: 0;
          transition: opacity 0.3s;
          pointer-events: none;
          border-radius: clamp(8px, 4vw, 20px);
          /* No z-index here, so ::before/::after arc stays on top */
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .gallery-image-wrapper:hover .gallery-image-overlay {
          opacity: 1;
        }
        .gallery-image-location {
          color: #fff;
          text-align: center;
          font-family: 'Poppins', sans-serif;
          font-size: clamp(0.9rem, 2vw, 1.25rem);
          font-weight: 600;
          text-shadow: 0 2px 8px rgba(0,0,0,0.25);
          line-height: 1.2;
        }
        .gallery-image-place {
          font-size: clamp(1.1rem, 2.5vw, 1.5rem);
          font-weight: 700;
          margin-bottom: 0.2em;
        }
        .gallery-image-district {
          font-size: clamp(0.9rem, 2vw, 1.1rem);
          font-weight: 500;
        }
        /* Ensure section pseudo-elements (arc) stay on top */
        section {
          position: relative;
          z-index: 0;
        }
        section::before, section::after {
          z-index: 2;
        }
        .hero-animate { will-change: opacity, transform; }
        .stat-animate { will-change: opacity; }
      `}</style>
    </div>
  );
};

export default Home;