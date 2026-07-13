// CHÉRIDATE — FRONTEND JAVASCRIPT
// Handles luxury UI interactions, animations, multi-step forms, and Gale-Shapley matching simulator

document.addEventListener("DOMContentLoaded", () => {
    initNavbar();
    initScrollAnimations();
    initFaq();
    initGallery();
    initSimulator();
    initForm();
});

// ==================== NAVBAR LOGIC ====================
function initNavbar() {
    const navbar = document.getElementById("navbar");
    const hamburger = document.getElementById("hamburger");
    const navLinks = document.getElementById("navLinks");

    // Scroll effect
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });

    // Mobile menu toggle
    if (hamburger && navLinks) {
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navLinks.classList.toggle("open");
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                hamburger.classList.remove("active");
                navLinks.classList.remove("open");
            });
        });
    }

    // Active link highlighting based on section scroll
    const sections = document.querySelectorAll("section[id]");
    window.addEventListener("scroll", () => {
        let scrollY = window.pageYOffset;
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute("id");
            const navLink = document.querySelector(`.nav-links a[href*=${sectionId}]`);
            
            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLink.classList.add("active");
                } else {
                    navLink.classList.remove("active");
                }
            }
        });
    });
}

// ==================== SCROLL ANIMATIONS ====================
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    document.querySelectorAll(".animate-on-scroll").forEach(el => observer.observe(el));
}

// ==================== FAQ ACCORDION ====================
function initFaq() {
    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach(item => {
        const trigger = item.querySelector(".faq-trigger");
        trigger.addEventListener("click", () => {
            const isActive = item.classList.contains("active");
            
            // Close all items
            faqItems.forEach(i => i.classList.remove("active"));
            
            // Toggle current item
            if (!isActive) {
                item.classList.add("active");
            }
        });
    });
}

// ==================== LUXURY VALIA GALLERY ====================
function initGallery() {
    const slides = document.querySelectorAll(".gallery-slide");
    const dots = document.querySelectorAll(".gallery-dot");
    if (slides.length === 0) return;

    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        slides.forEach(s => s.classList.remove("active"));
        dots.forEach(d => d.classList.remove("active"));
        
        slides[index].classList.add("active");
        dots[index].classList.add("active");
        currentSlide = index;
    }

    function nextSlide() {
        let next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }

    function startAutoSlide() {
        stopAutoSlide();
        slideInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoSlide() {
        if (slideInterval) clearInterval(slideInterval);
    }

    dots.forEach((dot, idx) => {
        dot.addEventListener("click", () => {
            showSlide(idx);
            startAutoSlide(); // restart timer
        });
    });

    startAutoSlide();
}

// ==================== GALE-SHAPLEY SIMULATOR ====================
function initSimulator() {
    const simBox = document.getElementById("simulator");
    if (!simBox) return;

    // Simulation Data
    const menData = {
        an: { name: "An (29t)", pref: ["hoa", "lan", "dung"], avatar: "🎩", match: null, index: 0, status: "free" },
        binh: { name: "Bình (32t)", pref: ["hoa", "dung", "lan"], avatar: "🍷", match: null, index: 0, status: "free" },
        cuong: { name: "Cường (30t)", pref: ["lan", "hoa", "dung"], avatar: "🕶️", match: null, index: 0, status: "free" }
    };

    const womenData = {
        dung: { name: "Dung (27t)", pref: ["an", "binh", "cuong"], avatar: "💃", match: null },
        hoa: { name: "Hoa (28t)", pref: ["binh", "an", "cuong"], avatar: "🌹", match: null },
        lan: { name: "Lan (26t)", pref: ["an", "cuong", "binh"], avatar: "🎀", match: null }
    };

    let men = JSON.parse(JSON.stringify(menData));
    let women = JSON.parse(JSON.stringify(womenData));

    let stepIndex = 0;
    let running = false;
    let simTimer = null;
    let simulationSteps = [];

    // Build Step Sequence for Gale-Shapley Algorithm
    // Men propose to women. Women hold their favorite so far.
    function generateSteps() {
        let steps = [];
        let localMen = JSON.parse(JSON.stringify(menData));
        let localWomen = JSON.parse(JSON.stringify(womenData));
        let round = 1;
        let active = true;

        while (active) {
            let freeManKey = Object.keys(localMen).find(m => localMen[m].status === "free" && localMen[m].index < localMen[m].pref.length);
            
            if (!freeManKey) {
                active = false;
                break;
            }

            let man = localMen[freeManKey];
            let preferredWomanKey = man.pref[man.index];
            let woman = localWomen[preferredWomanKey];
            
            steps.push({
                type: "PROPOSAL",
                manKey: freeManKey,
                womanKey: preferredWomanKey,
                manName: man.name,
                womanName: woman.name,
                description: `Vòng ${round}: ${man.avatar} ${man.name} ngỏ lời với ${woman.avatar} ${woman.name} (lựa chọn thứ ${man.index + 1} của anh ấy).`
            });

            // Woman decides
            if (woman.match === null) {
                // Free woman accepts
                woman.match = freeManKey;
                man.status = "matched";
                man.match = preferredWomanKey;
                
                steps.push({
                    type: "HOLD_NEW",
                    manKey: freeManKey,
                    womanKey: preferredWomanKey,
                    manName: man.name,
                    womanName: woman.name,
                    description: `→ ${woman.avatar} ${woman.name} đang cô đơn nên đồng ý tạm thời "giữ kết nối" với ${man.name}.`
                });
            } else {
                // Woman is already holding someone, compare preferences
                let currentMatchKey = woman.match;
                let prefList = woman.pref;
                let newIndex = prefList.indexOf(freeManKey);
                let currentIndex = prefList.indexOf(currentMatchKey);

                if (newIndex < currentIndex) {
                    // Woman prefers the new suitor
                    localMen[currentMatchKey].status = "free";
                    localMen[currentMatchKey].match = null;
                    localMen[currentMatchKey].index++; // move to next choice
                    
                    woman.match = freeManKey;
                    man.status = "matched";
                    man.match = preferredWomanKey;

                    steps.push({
                        type: "UPGRADE",
                        manKey: freeManKey,
                        womanKey: preferredWomanKey,
                        oldManKey: currentMatchKey,
                        manName: man.name,
                        womanName: woman.name,
                        oldManName: localMen[currentMatchKey].name,
                        description: `→ Quyết định: ${woman.avatar} ${woman.name} chuộng ${man.name} hơn ${localMen[currentMatchKey].name}. Cô quyết định buông ${localMen[currentMatchKey].name} và giữ ${man.name}.`
                    });
                } else {
                    // Woman rejects the new suitor
                    man.index++; // move to next choice
                    
                    steps.push({
                        type: "REJECT",
                        manKey: freeManKey,
                        womanKey: preferredWomanKey,
                        manName: man.name,
                        womanName: woman.name,
                        description: `→ Từ chối: ${woman.avatar} ${woman.name} đang giữ ${localMen[currentMatchKey].name} (người cô chuộng hơn ${man.name}). Cô nói thẳng và từ chối lời hẹn.`
                    });
                }
            }
            round++;
            
            // Safety break
            if (round > 20) break;
        }

        steps.push({
            type: "SUCCESS",
            description: "🎉 Thuật toán hoàn tất! Toàn hệ thống đạt điểm cân bằng ổn định. Không có hai người nào muốn từ bỏ bạn đời hiện tại để đến với nhau."
        });

        return steps;
    }

    simulationSteps = generateSteps();

    // Render Elements
    function drawLines() {
        const svg = document.getElementById("sim-svg");
        if (!svg) return;
        svg.innerHTML = ""; // Clear existing lines

        const svgRect = svg.getBoundingClientRect();

        // Draw connections
        Object.keys(men).forEach(mKey => {
            const manNode = document.getElementById(`sim-man-${mKey}`);
            const mData = men[mKey];
            
            if (mData.status === "matched" && mData.match) {
                const womanNode = document.getElementById(`sim-woman-${mData.match}`);
                if (manNode && womanNode) {
                    drawLineBetweenNodes(svg, svgRect, manNode, womanNode, "matched");
                }
            } else if (mData.status === "proposing") {
                const womanNode = document.getElementById(`sim-woman-${mData.pref[mData.index]}`);
                if (manNode && womanNode) {
                    drawLineBetweenNodes(svg, svgRect, manNode, womanNode, "proposing");
                }
            }
        });
    }

    function drawLineBetweenNodes(svg, svgRect, node1, node2, type) {
        const r1 = node1.getBoundingClientRect();
        const r2 = node2.getBoundingClientRect();

        // Coordinate relative to SVG container
        const x1 = r1.right - svgRect.left;
        const y1 = r1.top + r1.height / 2 - svgRect.top;
        const x2 = r2.left - svgRect.left;
        const y2 = r2.top + r2.height / 2 - svgRect.top;

        // Curve point
        const cx = (x1 + x2) / 2;

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", `M ${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`);
        path.setAttribute("class", `sim-line ${type}`);
        svg.appendChild(path);
    }

    function updateUIElements() {
        // Update Men UI
        Object.keys(men).forEach(mKey => {
            const node = document.getElementById(`sim-man-${mKey}`);
            if (node) {
                node.className = "sim-node";
                node.classList.add(men[mKey].status);
                
                const matchSpan = node.querySelector(".node-match");
                if (men[mKey].status === "matched" && men[mKey].match) {
                    matchSpan.textContent = `Ghép đôi: ${womenData[men[mKey].match].name.split(" ")[0]}`;
                    matchSpan.style.color = "#81C784";
                } else if (men[mKey].status === "proposing") {
                    matchSpan.textContent = `Đang ngỏ lời với: ${womenData[men[mKey].pref[men[mKey].index]].name.split(" ")[0]}`;
                    matchSpan.style.color = "var(--rose)";
                } else {
                    matchSpan.textContent = `Độc thân`;
                    matchSpan.style.color = "var(--text-muted)";
                }
            }
        });

        // Update Women UI
        Object.keys(women).forEach(wKey => {
            const node = document.getElementById(`sim-woman-${wKey}`);
            if (node) {
                node.className = "sim-node";
                const wData = women[wKey];
                
                if (wData.match) {
                    node.classList.add("matched");
                    const matchSpan = node.querySelector(".node-match");
                    matchSpan.textContent = `Đang giữ: ${menData[wData.match].name.split(" ")[0]}`;
                    matchSpan.style.color = "#81C784";
                } else {
                    node.classList.add("free");
                    const matchSpan = node.querySelector(".node-match");
                    matchSpan.textContent = `Độc thân`;
                    matchSpan.style.color = "var(--text-muted)";
                }
            }
        });

        drawLines();
    }

    function executeStep() {
        if (stepIndex >= simulationSteps.length) {
            stopSimulation();
            return;
        }

        const step = simulationSteps[stepIndex];
        const logEl = document.getElementById("sim-log-text");
        if (logEl) {
            logEl.innerHTML = step.description;
        }

        // Apply mutations
        if (step.type === "PROPOSAL") {
            men[step.manKey].status = "proposing";
        } else if (step.type === "HOLD_NEW") {
            men[step.manKey].status = "matched";
            men[step.manKey].match = step.womanKey;
            women[step.womanKey].match = step.manKey;
        } else if (step.type === "UPGRADE") {
            // Free the old man
            const oldMan = men[step.oldManKey];
            oldMan.status = "free";
            oldMan.match = null;
            oldMan.index++;

            // Match new man
            men[step.manKey].status = "matched";
            men[step.manKey].match = step.womanKey;
            women[step.womanKey].match = step.manKey;
        } else if (step.type === "REJECT") {
            men[step.manKey].status = "free";
            men[step.manKey].index++;
        } else if (step.type === "SUCCESS") {
            Object.keys(men).forEach(mKey => {
                men[mKey].status = "matched";
            });
            updateUIElements();
            showConfetti();
        }

        updateUIElements();
        stepIndex++;

        // Disable "Next" if finished
        if (stepIndex >= simulationSteps.length) {
            const nextBtn = document.getElementById("sim-btn-next");
            if (nextBtn) nextBtn.disabled = true;
        }
    }

    function resetSimulation() {
        stopSimulation();
        men = JSON.parse(JSON.stringify(menData));
        women = JSON.parse(JSON.stringify(womenData));
        stepIndex = 0;
        
        const logEl = document.getElementById("sim-log-text");
        if (logEl) logEl.innerHTML = "Nhấn 'Chạy Tự Động' hoặc 'Bước Tiếp Theo' để xem cách thuật toán Nobel giải quyết bài toán hôn nhân.";

        const nextBtn = document.getElementById("sim-btn-next");
        if (nextBtn) nextBtn.disabled = false;

        const autoBtn = document.getElementById("sim-btn-auto");
        if (autoBtn) autoBtn.innerHTML = "<span>▶ Chạy Tự Động</span>";

        updateUIElements();
    }

    function startSimulation() {
        if (running) return;
        running = true;
        
        const autoBtn = document.getElementById("sim-btn-auto");
        if (autoBtn) autoBtn.innerHTML = "<span>⏸ Dừng Lại</span>";

        simTimer = setInterval(() => {
            if (stepIndex < simulationSteps.length) {
                executeStep();
            } else {
                stopSimulation();
            }
        }, 2200);
    }

    function stopSimulation() {
        running = false;
        if (simTimer) clearInterval(simTimer);
        const autoBtn = document.getElementById("sim-btn-auto");
        if (autoBtn) {
            autoBtn.innerHTML = "<span>▶ Chạy Tự Động</span>";
        }
    }

    // Event listeners
    document.getElementById("sim-btn-next").addEventListener("click", () => {
        stopSimulation();
        executeStep();
    });

    document.getElementById("sim-btn-auto").addEventListener("click", () => {
        if (running) {
            stopSimulation();
        } else {
            if (stepIndex >= simulationSteps.length) {
                resetSimulation();
            }
            startSimulation();
        }
    });

    document.getElementById("sim-btn-reset").addEventListener("click", resetSimulation);

    // Initial draw and redraw on resize
    window.addEventListener("resize", drawLines);
    
    // Run initial UI updates
    updateUIElements();
}

// ==================== REGISTRATION FORM LOGIC ====================
function initForm() {
    const form = document.getElementById("cheriForm");
    if (!form) return;

    const steps = form.querySelectorAll(".form-step");
    const dots = document.querySelectorAll(".step-dot");
    let currentStep = 0;

    // Custom Radio Button Logic (adding class for custom styling)
    const radioTiles = form.querySelectorAll(".radio-tile");
    radioTiles.forEach(tile => {
        const radioInput = tile.querySelector("input[type='radio']");
        
        tile.addEventListener("click", () => {
            // Unselect others in the same group
            const name = radioInput.getAttribute("name");
            form.querySelectorAll(`input[name='${name}']`).forEach(input => {
                input.parentElement.classList.remove("selected");
            });

            // Select current
            radioInput.checked = true;
            tile.classList.add("selected");
        });
    });

    function showStep(idx) {
        steps.forEach((step, sIdx) => {
            step.classList.toggle("active", sIdx === idx);
        });

        dots.forEach((dot, dIdx) => {
            dot.classList.toggle("active", dIdx === idx);
            dot.classList.toggle("completed", dIdx < idx);
        });

        currentStep = idx;

        // Toggle visibility of Prev button
        const prevBtn = document.getElementById("btn-prev");
        if (prevBtn) {
            prevBtn.style.visibility = idx === 0 ? "hidden" : "visible";
        }

        // Change Next button text on last step
        const nextBtn = document.getElementById("btn-next");
        if (nextBtn) {
            if (idx === steps.length - 1) {
                nextBtn.innerHTML = "<span>Hoàn Tất Đăng Ký 🚀</span>";
            } else {
                nextBtn.innerHTML = "<span>Tiếp Theo →</span>";
            }
        }
    }

    function validateStep(idx) {
        const step = steps[idx];
        const inputs = step.querySelectorAll("input[required], select[required]");
        
        let valid = true;
        inputs.forEach(input => {
            if (input.type === "radio") {
                const groupName = input.getAttribute("name");
                const checked = step.querySelector(`input[name='${groupName}']:checked`);
                if (!checked) {
                    valid = false;
                    input.parentElement.style.borderColor = "var(--rose)";
                } else {
                    input.parentElement.style.borderColor = "var(--border-gold)";
                }
            } else {
                if (!input.value.trim()) {
                    valid = false;
                    input.style.borderColor = "var(--rose)";
                } else {
                    input.style.borderColor = "rgba(255, 255, 255, 0.08)";
                }
            }
        });

        // Specific phone validation
        if (idx === 0 && valid) {
            const phoneInput = document.getElementById("phone");
            const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;
            if (phoneInput && !phoneRegex.test(phoneInput.value.trim())) {
                showToast("Số điện thoại không đúng định dạng Việt Nam!", "error");
                phoneInput.style.borderColor = "var(--rose)";
                valid = false;
            }
        }

        if (!valid) {
            showToast("Vui lòng điền đầy đủ và chính xác thông tin!", "warning");
        }

        return valid;
    }

    // Action buttons
    const nextBtn = document.getElementById("btn-next");
    const prevBtn = document.getElementById("btn-prev");

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            if (!validateStep(currentStep)) return;

            if (currentStep < steps.length - 1) {
                showStep(currentStep + 1);
            } else {
                submitForm();
            }
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            if (currentStep > 0) {
                showStep(currentStep - 1);
            }
        });
    }

    function submitForm() {
        // Collect form data
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        console.log("Submitting registration data:", data);

        // Since it's a static site, we mock the submission
        // Show loading state
        if (nextBtn) {
            nextBtn.disabled = true;
            nextBtn.innerHTML = "<span>Đang gửi hồ sơ...</span>";
        }

        setTimeout(() => {
            // Hide form, show success
            form.style.display = "none";
            const successScreen = document.getElementById("successScreen");
            if (successScreen) {
                successScreen.classList.add("active");
                successScreen.scrollIntoView({ behavior: "smooth", block: "center" });
            }
            
            showToast("Đăng ký hồ sơ thành công!", "success");
            showConfetti();
        }, 1500);
    }

    // Initialize first step
    showStep(0);
}

// ==================== TOAST NOTIFICATION SYSTEM ====================
function showToast(message, type = 'info') {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span>${icons[type] || 'ℹ️'}</span>
        <span>${message}</span>
    `;
    container.appendChild(toast);

    // Trigger transition
    setTimeout(() => {
        toast.style.opacity = "1";
        toast.style.transform = "translateX(0)";
    }, 10);

    // Dismiss toast
    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(100px)";
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// ==================== CONFETTI EXPLOSION ====================
function showConfetti() {
    const container = document.createElement("div");
    container.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;overflow:hidden;";
    document.body.appendChild(container);

    const colors = ["#D4AF37", "#6B0D21", "#A21F35", "#E30B5C", "#FFD700", "#FFF"];

    for (let i = 0; i < 100; i++) {
        const particle = document.createElement("div");
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 8 + 4}px;
            height: ${Math.random() * 8 + 4}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}%;
            top: -10px;
            border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
            animation: fall ${Math.random() * 3 + 2}s ease-in forwards;
            animation-delay: ${Math.random() * 0.5}s;
            transform: rotate(${Math.random() * 360}deg);
        `;
        container.appendChild(particle);
    }

    if (!document.getElementById("confetti-keyframes")) {
        const style = document.createElement("style");
        style.id = "confetti-keyframes";
        style.textContent = `
            @keyframes fall {
                0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
                100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    setTimeout(() => container.remove(), 4500);
}
