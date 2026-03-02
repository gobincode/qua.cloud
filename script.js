/* ═══════════════════════════════════════════════
   Quatarly — Interactive JS
   ═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    // ── 1. Scroll-based Animations (Intersection Observer) ──
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger animation for grid items
                const delay = entry.target.closest('.models-grid, .features-grid, .faq-grid, .testimonials-grid')
                    ? Array.from(entry.target.parentElement.children).indexOf(entry.target) * 60
                    : 0;

                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

    // Also trigger perf bar animations when model cards become visible
    const perfObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fill = entry.target.querySelector('.perf-fill');
                if (fill) {
                    const targetWidth = fill.style.width;
                    fill.style.width = '0%';
                    setTimeout(() => {
                        fill.style.width = targetWidth;
                    }, 300);
                }
                perfObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.model-card').forEach(card => perfObserver.observe(card));


    // ── 2. Navbar Scroll Effect ──
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    }, { passive: true });


    // ── 3. Mobile Navigation Toggle ──
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            mobileToggle.classList.toggle('active');
        });

        // Close mobile nav on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                mobileToggle.classList.remove('active');
            });
        });
    }


    // ── 4. Model Filter Tabs ──
    const filterBtns = document.querySelectorAll('.filter-btn');
    const modelCards = document.querySelectorAll('.model-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            modelCards.forEach((card, index) => {
                const category = card.dataset.category;
                const shouldShow = filter === 'all' || category === filter;

                if (shouldShow) {
                    card.style.display = '';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';

                    setTimeout(() => {
                        card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });


    // ── 5. FAQ Accordion ──
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all FAQs
            faqItems.forEach(faq => {
                faq.classList.remove('active');
                faq.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });

            // Toggle current
            if (!isActive) {
                item.classList.add('active');
                question.setAttribute('aria-expanded', 'true');
            }
        });
    });


    // ── 6. Smooth Scroll for Anchor Links ──
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;

            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });


    // ── 7. Animated Counter for Pricing ──
    const priceValue = document.querySelector('.pricing-value');
    if (priceValue) {
        const priceObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(priceValue, 0, 30, 1200);
                    priceObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        priceObserver.observe(priceValue);
    }

    function animateCounter(element, start, end, duration) {
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(start + (end - start) * eased);

            element.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }


    // ── 8. Card Hover Glow Effect (Mouse Tracking) ──
    document.querySelectorAll('.model-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });


    // ── 9. Typing effect for hero badge ──
    const badge = document.querySelector('.hero-badge span');
    if (badge) {
        const text = badge.textContent;
        badge.textContent = '';
        badge.style.borderRight = '2px solid var(--accent-indigo)';

        let i = 0;
        function typeChar() {
            if (i < text.length) {
                badge.textContent += text.charAt(i);
                i++;
                setTimeout(typeChar, 30 + Math.random() * 20);
            } else {
                badge.style.borderRight = 'none';
            }
        }

        // Start typing after a delay
        setTimeout(typeChar, 800);
    }

});
