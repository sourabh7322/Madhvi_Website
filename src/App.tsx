import React, { useState, useEffect, useRef } from 'react';

function useTypewriter(text: string, speed = 38, startDelay = 600) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    let intervalId: ReturnType<typeof setInterval>;

    timeoutId = setTimeout(() => {
      let i = 0;
      intervalId = setInterval(() => {
        setDisplayed(text.substring(0, i + 1));
        i++;
        if (i === text.length) {
          clearInterval(intervalId);
          setDone(true);
        }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [text, speed, startDelay]);

  return { displayed, done };
}

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const links = ["Labs", "Studio", "Openings", "Shop"];

  return (
    <>
      <nav className="fixed top-0 inset-x-0 z-10 px-5 sm:px-8 py-4 sm:py-5 flex flex-row justify-between items-center">
        {/* Logo */}
        <div className="flex flex-row gap-3 items-center">
          <span
            className="text-[21px] sm:text-[26px] tracking-tight text-white"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Mainframe&reg;
          </span>
          <span className="text-[25px] sm:text-[30px] text-white select-none tracking-[-0.02em]">
            ✳︎
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex flex-row text-[23px] text-white">
          {links.map((link, i) => (
            <React.Fragment key={link}>
              <a href="#" className="hover:opacity-60 transition-opacity">{link}</a>
              {i < links.length - 1 && <span className="mr-2">,</span>}
            </React.Fragment>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <a href="#" className="text-[23px] text-white underline underline-offset-2 hover:opacity-60 transition-opacity">
            Get in touch
          </a>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex flex-col items-center justify-center gap-[5px] w-8 h-8 z-[11]"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <div className={`w-6 h-[2px] bg-white transition-all duration-300 transform origin-center ${isMenuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
          <div className={`w-6 h-[2px] bg-white transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
          <div className={`w-6 h-[2px] bg-white transition-all duration-300 transform origin-center ${isMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
        </button>
      </nav>

      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/95 backdrop-blur-sm z-[9] flex flex-col justify-center px-8 gap-8 transition-opacity duration-300 md:hidden ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        {links.map(link => (
          <a key={link} href="#" className="text-[32px] font-medium text-white hover:opacity-60 transition-opacity">
            {link}
          </a>
        ))}
        <a href="#" className="text-[32px] font-medium text-white underline underline-offset-2 hover:opacity-60 transition-opacity">
          Get in touch
        </a>
      </div>
    </>
  );
}

function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const targetTimeRef = useRef(0);
  const isSeekingRef = useRef(false);
  const prevXRef = useRef<number | null>(null);

  const { displayed, done } = useTypewriter("Glad you stopped in. Good taste tends to find us. Now, what are we building?");
  const [showPills, setShowPills] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowPills(true), 400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const SENSITIVITY = 0.8;
    let animationFrameId: number;

    const handleMove = (clientX: number) => {
      if (!videoRef.current || isNaN(videoRef.current.duration)) return;
      const duration = videoRef.current.duration;

      if (prevXRef.current === null) {
        prevXRef.current = clientX;
        return;
      }

      const delta = clientX - prevXRef.current;
      prevXRef.current = clientX;

      const offset = (delta / window.innerWidth) * SENSITIVITY * duration;

      targetTimeRef.current = Math.max(0, Math.min(duration, targetTimeRef.current + offset));
    };

    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX);

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        prevXRef.current = e.touches[0].clientX;
      }
    };

    const updateVideoTime = () => {
      if (videoRef.current && !isNaN(videoRef.current.duration)) {
        const diff = targetTimeRef.current - videoRef.current.currentTime;
        // Smooth easing (lerp) towards the target time
        if (Math.abs(diff) > 0.01) {
          videoRef.current.currentTime += diff * 0.15;
        }
      }
      animationFrameId = requestAnimationFrame(updateVideoTime);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    
    animationFrameId = requestAnimationFrame(updateVideoTime);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchStart);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      targetTimeRef.current = videoRef.current.currentTime;
    }
  };

  const copyEmail = () => {
    navigator.clipboard.writeText("sourabhrawat77200@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative min-h-screen bg-[#E5E5E5] w-full selection:bg-[#ff4b4b] selection:text-white">
      {/* Background Video */}
      <video
        ref={videoRef}
        src="/Hero_MVP_optimized.mp4"
        className="fixed inset-0 w-full h-full object-cover z-0 pointer-events-none -scale-x-[1.15] scale-y-[1.15] origin-center"
        style={{ objectPosition: '80% right' }}
        muted
        playsInline
        preload="auto"
        onLoadedMetadata={handleLoadedMetadata}
      />

      <Navbar />

      {/* Hero Section */}
      <main className="relative z-[1] h-screen w-full flex flex-col justify-end pb-10 sm:pb-12 px-5 sm:px-8 md:px-10 overflow-hidden">
        <div className="max-w-xl w-full relative z-10 mb-8 sm:mb-12">
          {/* Blurred Intro Label */}
          <div className="pointer-events-none select-none mb-5 sm:mb-6 text-[clamp(18px,4vw,26px)] leading-[1.3] font-normal text-white blur-[4px]">
            Hey there, meet A.R.I.A,<br />Mainframe's Adaptive Response Interface Agent
          </div>

          {/* Typewriter text */}
          <p className="mb-5 sm:mb-6 text-[clamp(18px,4vw,26px)] leading-[1.35] font-normal min-h-[54px] sm:min-h-[70px]" style={{ color: "white" }}>
            {displayed}
            {!done && (
              <span className="inline-block w-[2px] h-[1.1em] bg-white align-middle ml-[2px] animate-[blink_1s_step-end_infinite]" />
            )}
          </p>
        </div>

        {/* Action Pills Footer */}
        <div className="w-full relative z-10">
          <div
            className="flex flex-wrap gap-2 sm:gap-3"
            style={{
              transition: 'opacity 0.4s ease, transform 0.4s ease',
              opacity: showPills ? 1 : 0,
              transform: showPills ? 'translateY(0)' : 'translateY(8px)'
            }}
          >
            <button className="cursor-pointer inline-flex items-center justify-center bg-black text-white border border-white/10 rounded-full text-[14px] sm:text-[15px] px-4 sm:px-6 py-2 sm:py-2.5 whitespace-nowrap hover:bg-white hover:text-black hover:border-white transition-colors duration-200">
              Pitch us an idea
            </button>
            <button className="cursor-pointer inline-flex items-center justify-center bg-black text-white border border-white/10 rounded-full text-[14px] sm:text-[15px] px-4 sm:px-6 py-2 sm:py-2.5 whitespace-nowrap hover:bg-white hover:text-black hover:border-white transition-colors duration-200">
              Come work here
            </button>
            <button className="cursor-pointer inline-flex items-center justify-center bg-black text-white border border-white/10 rounded-full text-[14px] sm:text-[15px] px-4 sm:px-6 py-2 sm:py-2.5 whitespace-nowrap hover:bg-white hover:text-black hover:border-white transition-colors duration-200">
              Send a brief hello
            </button>
            <button className="cursor-pointer inline-flex items-center justify-center bg-black text-white border border-white/10 rounded-full text-[14px] sm:text-[15px] px-4 sm:px-6 py-2 sm:py-2.5 whitespace-nowrap hover:bg-white hover:text-black hover:border-white transition-colors duration-200">
              See how we operate
            </button>

            <button
              onClick={copyEmail}
              className="cursor-pointer inline-flex items-center justify-center text-white bg-transparent border border-white rounded-full text-[14px] sm:text-[15px] px-4 sm:px-6 py-2 sm:py-2.5 whitespace-nowrap hover:bg-white hover:text-black transition-colors duration-200 gap-2 sm:gap-3 group"
            >
              <span>Reach us: <span className="underline underline-offset-1 group-hover:no-underline">sourabhrawat77200@gmail.com</span></span>
              {copied ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400 group-hover:text-green-600 transition-colors">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
