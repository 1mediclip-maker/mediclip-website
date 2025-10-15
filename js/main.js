// MEDICLIP Landing Page JavaScript - Updated Version

// Global Variables
let currentTestimonialSlide = 0;
let testimonialInterval;
let isFormSubmitting = false;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

// Initialize Website Functions
function initializeWebsite() {
    initializeHeader();
    initializeScrollReveal();
    initializeTestimonialSlider();
    initializeFAQ();
    initializeForm();
    initializeSmoothScroll();
    initializeMobileMenu();
    
    // Add performance monitoring
    monitorPerformance();
}

// Header Functions
function initializeHeader() {
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    });
}

// Mobile Menu Functions - 완전히 새로운 구현
let mobileMenuOpen = false;

function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const menuButton = document.getElementById('mobile-menu-button');
    const overlay = document.getElementById('mobile-menu-overlay');
    
    if (!mobileMenu || !menuButton || !overlay) {
        console.error('Mobile menu elements not found');
        return;
    }
    
    mobileMenuOpen = !mobileMenuOpen;
    
    if (mobileMenuOpen) {
        // 메뉴 열기 - 오른쪽에서 슬라이드
        overlay.classList.remove('opacity-0', 'pointer-events-none');
        overlay.classList.add('opacity-100', 'pointer-events-all');
        
        mobileMenu.classList.remove('translate-x-full');
        mobileMenu.classList.add('translate-x-0');
        
        // 바디 스크롤 방지
        document.body.style.overflow = 'hidden';
        
        console.log('✅ Mobile menu opened (slide from right)');
    } else {
        // 메뉴 닫기 - 오른쪽으로 슬라이드
        overlay.classList.remove('opacity-100', 'pointer-events-all');
        overlay.classList.add('opacity-0', 'pointer-events-none');
        
        mobileMenu.classList.remove('translate-x-0');
        mobileMenu.classList.add('translate-x-full');
        
        // 바디 스크롤 복원
        document.body.style.overflow = '';
        
        console.log('✅ Mobile menu closed (slide to right)');
    }
}

function closeMobileMenu() {
    if (mobileMenuOpen) {
        toggleMobileMenu();
    }
}

function initializeMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');
    const mobileCTAButton = document.getElementById('mobile-cta-button');
    const overlay = document.getElementById('mobile-menu-overlay');
    const closeButton = document.getElementById('mobile-menu-close');
    const leftSpace = document.getElementById('mobile-menu-left-space');
    
    console.log('Initializing mobile menu (fullscreen right slide)...');
    
    // 햄버거 버튼 클릭 이벤트
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🍔 Hamburger button clicked');
            toggleMobileMenu();
        });
        
        // 터치 이벤트도 추가 (모바일 호환성)
        mobileMenuButton.addEventListener('touchstart', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('👆 Hamburger button touched');
            toggleMobileMenu();
        });
    }
    
    // X 버튼 클릭 이벤트
    if (closeButton) {
        closeButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('❌ Close button clicked');
            closeMobileMenu();
        });
    }
    
    // 오버레이 클릭 시 메뉴 닫기
    if (overlay) {
        overlay.addEventListener('click', function(e) {
            console.log('🌍 Overlay clicked - closing menu');
            closeMobileMenu();
        });
    }
    
    // 왼쪽 빈 공간 클릭 시 메뉴 닫기
    if (leftSpace) {
        leftSpace.addEventListener('click', function(e) {
            console.log('⬅️ Left space clicked - closing menu');
            closeMobileMenu();
        });
    }
    
    // 메뉴 링크 클릭 시 메뉴 닫기 및 스크롤 이동
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // 기본 링크 동작 방지
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            const menuText = this.querySelector('span').textContent.trim();
            
            console.log(`🔗 Menu clicked: ${menuText} → ${targetId}`);
            
            // 메뉴 먼저 닫기
            closeMobileMenu();
            
            // 메뉴 닫기 애니메이션 후 스크롤 이동
            setTimeout(() => {
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    console.log(`✅ Scrolled to: ${targetId}`);
                } else {
                    console.warn(`❌ Section not found: ${targetId}`);
                }
            }, 350); // 메뉴 닫기 애니메이션 시간(300ms) + 여유분
        });
    });
    
    // CTA 버튼 클릭 시 메뉴 닫기
    if (mobileCTAButton) {
        mobileCTAButton.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🎯 Mobile CTA button clicked');
            closeMobileMenu();
            setTimeout(() => {
                scrollToCTA();
            }, 350);
        });
    }
    
    // ESC 키로 메뉴 닫기
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenuOpen) {
            console.log('⌨️ ESC pressed - closing menu');
            closeMobileMenu();
        }
    });
    
    console.log('✅ Mobile menu (fullscreen right slide) initialized successfully');
}

// Scroll Reveal Animation
function initializeScrollReveal() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, observerOptions);
    
    // Add scroll reveal to sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('scroll-reveal');
        observer.observe(section);
    });
}

// Testimonial Slider
function initializeTestimonialSlider() {
    const track = document.querySelector('.testimonial-track');
    const dots = document.querySelectorAll('.testimonial-dot');
    
    if (!track || !dots.length) return;
    
    // Set up dot click handlers
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            goToTestimonialSlide(index);
        });
    });
    
    // Auto-play testimonials
    startTestimonialAutoplay();
    
    // Pause on hover
    const testimonialSlider = document.querySelector('.testimonial-slider');
    if (testimonialSlider) {
        testimonialSlider.addEventListener('mouseenter', stopTestimonialAutoplay);
        testimonialSlider.addEventListener('mouseleave', startTestimonialAutoplay);
    }
}

function goToTestimonialSlide(slideIndex) {
    const track = document.querySelector('.testimonial-track');
    const dots = document.querySelectorAll('.testimonial-dot');
    
    if (!track || !dots.length) return;
    
    currentTestimonialSlide = slideIndex;
    
    // Update track position
    track.style.transform = `translateX(-${slideIndex * 100}%)`;
    
    // Update dots
    dots.forEach((dot, index) => {
        if (index === slideIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

function startTestimonialAutoplay() {
    stopTestimonialAutoplay(); // Clear any existing interval
    
    testimonialInterval = setInterval(function() {
        const totalSlides = document.querySelectorAll('.testimonial-slide').length;
        if (totalSlides === 0) return;
        
        currentTestimonialSlide = (currentTestimonialSlide + 1) % totalSlides;
        goToTestimonialSlide(currentTestimonialSlide);
    }, 5000); // Change slide every 5 seconds
}

function stopTestimonialAutoplay() {
    if (testimonialInterval) {
        clearInterval(testimonialInterval);
        testimonialInterval = null;
    }
}

// FAQ Functions
function initializeFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const icon = this.querySelector('i');
            
            // Close all other FAQs
            faqQuestions.forEach(otherQuestion => {
                if (otherQuestion !== this) {
                    const otherAnswer = otherQuestion.nextElementSibling;
                    const otherIcon = otherQuestion.querySelector('i');
                    
                    otherAnswer.classList.add('hidden');
                    otherQuestion.classList.remove('active');
                    otherIcon.style.transform = 'rotate(0deg)';
                }
            });
            
            // Toggle current FAQ
            if (answer.classList.contains('hidden')) {
                answer.classList.remove('hidden');
                this.classList.add('active');
                icon.style.transform = 'rotate(180deg)';
            } else {
                answer.classList.add('hidden');
                this.classList.remove('active');
                icon.style.transform = 'rotate(0deg)';
            }
        });
    });
}

// Form Functions
function initializeForm() {
    const form = document.getElementById('ctaForm');
    
    if (!form) return;
    
    form.addEventListener('submit', handleFormSubmit);
    
    // Add real-time validation
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', validateInput);
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateInput.call(this);
            }
        });
    });
}

function validateInput() {
    const value = this.value.trim();
    const type = this.type || this.tagName.toLowerCase();
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (this.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = '';
    }
    
    // Specific validations
    if (value && type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = '올바른 이메일 형식을 입력해주세요.';
        }
    }
    
    if (value && type === 'tel') {
        const phoneRegex = /^[0-9-+\s()]+$/;
        if (!phoneRegex.test(value) || value.length < 10) {
            isValid = false;
            errorMessage = '올바른 전화번호를 입력해주세요.';
        }
    }
    
    // Update UI
    if (isValid) {
        this.classList.remove('error');
        removeErrorMessage(this);
    } else {
        this.classList.add('error');
        showErrorMessage(this, errorMessage);
    }
    
    return isValid;
}

function showErrorMessage(input, message) {
    removeErrorMessage(input);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message text-red-500 text-sm mt-1';
    errorDiv.textContent = message;
    
    input.parentNode.appendChild(errorDiv);
}

function removeErrorMessage(input) {
    const errorMessage = input.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

function handleFormSubmit(event) {
    event.preventDefault();
    
    if (isFormSubmitting) return;
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Validate all fields
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isFormValid = true;
    
    inputs.forEach(input => {
        if (!validateInput.call(input)) {
            isFormValid = false;
        }
    });
    
    // Check privacy checkbox
    const privacyCheckbox = form.querySelector('input[name="privacy"]');
    if (!privacyCheckbox.checked) {
        isFormValid = false;
        alert('개인정보 수집 및 이용에 동의해주세요.');
        return;
    }
    
    if (!isFormValid) {
        alert('입력 정보를 확인해주세요.');
        return;
    }
    
    // Submit form
    submitFormData(formData, form);
}

async function submitFormData(formData, form) {
    isFormSubmitting = true;
    
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.innerHTML = '<div class="loading-spinner"></div>';
    submitButton.disabled = true;
    
    try {
        // Prepare data for Google Sheets (MEDICLIP 구글시트 연동)
        const data = {
            hospitalName: formData.get('hospitalName'),      // 병원명
            applicantName: formData.get('applicantName'),    // 신청자명  
            phone: formData.get('phone'),                    // 연락처
            timestamp: new Date().toISOString(),
            source: 'MEDICLIP 랜딩페이지',
            userAgent: navigator.userAgent,
            referrer: document.referrer || 'direct'
        };
        
        // Send to Google Sheets (Web App)
        console.log('📊 구글시트 전송 데이터:', data);
        
        const response = await fetch('https://script.google.com/macros/s/AKfycbx66fl-SwWKF3VvZXbuQKhucDdmhSs6jPbSjRZb149NDCvdn4bFwhSHs27VrvXz-__e/exec', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            mode: 'no-cors' // Important for Google Apps Script
        });
        
        // Since we're using no-cors, we can't check the response
        // We'll assume success if no error is thrown
        console.log('✅ 구글시트로 데이터 전송 완료!');
        
        // Show success message
        showSuccessModal();
        
        // Reset form
        form.reset();
        
        // Track conversion (if analytics is set up)
        trackConversion('form_submit', {
            hospital_type: data.hospitalType,
            source: 'landing_page'
        });
        
    } catch (error) {
        console.error('Form submission error:', error);
        
        // Fallback: try mailto as backup
        const mailtoLink = createMailtoLink(formData);
        window.location.href = mailtoLink;
        
        alert('신청이 접수되었습니다. 빠른 시일 내에 연락드리겠습니다.');
        
    } finally {
        // Reset button state
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        isFormSubmitting = false;
    }
}

// Create mailto link as fallback
function createMailtoLink(formData) {
    const subject = encodeURIComponent('[MEDICLIP] 마케팅 진단 신청 - ' + formData.get('hospitalName'));
    const body = encodeURIComponent(`
병원명: ${formData.get('hospitalName')}
신청자명: ${formData.get('applicantName')}
연락처: ${formData.get('phone')}

신청 시간: ${new Date().toLocaleString()}
출처: MEDICLIP 마케팅 진단 신청 폼
    `);
    
    return `mailto:1mediclip@gmail.com?subject=${subject}&body=${body}`;
}

// Success Modal Functions
function showSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        
        // Focus on modal for accessibility
        const modalContent = modal.querySelector('.bg-white');
        if (modalContent) {
            modalContent.focus();
        }
    }
}

function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

// Privacy Policy Modal Functions
function openPrivacyModal() {
    const modal = document.getElementById('privacyModal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
        
        // Focus on modal for accessibility
        const closeButton = modal.querySelector('button');
        if (closeButton) {
            closeButton.focus();
        }
    }
}

function closePrivacyModal() {
    const modal = document.getElementById('privacyModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        
        // Restore body scroll
        document.body.style.overflow = 'auto';
    }
}

// Close modal when clicking outside
document.addEventListener('DOMContentLoaded', function() {
    const privacyModal = document.getElementById('privacyModal');
    if (privacyModal) {
        privacyModal.addEventListener('click', function(e) {
            if (e.target === privacyModal) {
                closePrivacyModal();
            }
        });
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const modal = document.getElementById('privacyModal');
            if (modal && !modal.classList.contains('hidden')) {
                closePrivacyModal();
            }
        }
    });
});

// Navigation Functions
function scrollToCTA() {
    const ctaSection = document.getElementById('cta');
    if (ctaSection) {
        ctaSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
        
        // Focus on the first input for better UX
        setTimeout(() => {
            const firstInput = ctaSection.querySelector('input');
            if (firstInput) {
                firstInput.focus();
            }
        }, 500);
    }
}

// Scroll to form function
function scrollToForm() {
    const formSection = document.getElementById('consultation-form');
    if (formSection) {
        formSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'center'
        });
        
        // Focus on the first input
        setTimeout(() => {
            const firstInput = formSection.querySelector('input');
            if (firstInput) {
                firstInput.focus();
            }
        }, 500);
    }
}

// Smooth Scroll for Navigation Links
function initializeSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                const mobileMenu = document.getElementById('mobile-menu');
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
            }
        });
    });
}

// Analytics and Tracking
function trackConversion(eventName, properties = {}) {
    // Google Analytics 4 tracking (if implemented)
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, {
            event_category: 'conversion',
            event_label: 'mediclip_landing',
            ...properties
        });
    }
    
    // Facebook Pixel tracking (if implemented)
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead', properties);
    }
    
    // Custom tracking
    console.log('Conversion tracked:', eventName, properties);
}

// Performance Monitoring
function monitorPerformance() {
    // Log page load time
    window.addEventListener('load', function() {
        setTimeout(() => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log('Page load time:', loadTime + 'ms');
        }, 0);
    });
}

// Error Handling
window.addEventListener('error', function(event) {
    console.error('JavaScript Error:', event.error);
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled Promise Rejection:', event.reason);
    event.preventDefault();
});

// Accessibility Enhancements
function enhanceAccessibility() {
    // Add keyboard navigation for custom elements
    const interactiveElements = document.querySelectorAll('.testimonial-dot, .faq-question');
    
    interactiveElements.forEach(element => {
        // Make focusable
        if (!element.hasAttribute('tabindex')) {
            element.setAttribute('tabindex', '0');
        }
        
        // Add keyboard event handlers
        element.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                this.click();
            }
        });
    });
}

// Initialize accessibility enhancements
document.addEventListener('DOMContentLoaded', enhanceAccessibility);

// Export functions for global access
window.scrollToCTA = scrollToCTA;
window.scrollToForm = scrollToForm;
window.toggleMobileMenu = toggleMobileMenu;
window.closeMobileMenu = closeMobileMenu;
window.closeSuccessModal = closeSuccessModal;
window.goToTestimonialSlide = goToTestimonialSlide;