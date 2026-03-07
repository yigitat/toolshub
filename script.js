document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. Language System
    // ==========================================
    let currentLang = 'en';

    const elementsToTranslate = document.querySelectorAll('[data-i18n]');
    const btnEn = document.getElementById('lang-en');
    const btnTr = document.getElementById('lang-tr');

    function updateLanguage(lang) {
        currentLang = lang;
        elementsToTranslate.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang][key]) {
                el.textContent = translations[lang][key];
            }
        });

        // Update inputs placeholders
        document.getElementById('pass-output').placeholder = lang === 'en' ? 'Password...' : 'Şifre...';
        document.getElementById('user-output').placeholder = lang === 'en' ? 'Username...' : 'Kullanıcı adı...';
        document.getElementById('user-keyword').placeholder = lang === 'en' ? "e.g. 'ninja', 'star'" : "Örn: 'ninja', 'yıldız'";

        if (lang === 'en') {
            btnEn.classList.add('active');
            btnTr.classList.remove('active');
        } else {
            btnTr.classList.add('active');
            btnEn.classList.remove('active');
        }
    }

    btnEn.addEventListener('click', () => updateLanguage('en'));
    btnTr.addEventListener('click', () => updateLanguage('tr'));

    // ==========================================
    // 2. Navigation System
    // ==========================================
    const navBtns = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.tool-section');
    const footerNavLinks = document.querySelectorAll('.footer-nav-link');

    function switchTool(targetId) {
        // Remove active from all
        navBtns.forEach(b => b.classList.remove('active'));
        sections.forEach(s => s.classList.remove('active'));

        // Add active to the correct nav button
        navBtns.forEach(btn => {
            if (btn.getAttribute('data-target') === targetId) {
                btn.classList.add('active');
            }
        });

        // Add active to the section
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.classList.add('active');
            // Smooth scroll to top of section
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            switchTool(targetId);
        });
    });

    footerNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');
            switchTool(targetId);
        });
    });

    // ==========================================
    // 3. Password Generator
    // ==========================================
    const passOutput = document.getElementById('pass-output');
    const passLength = document.getElementById('pass-length');
    const passLengthVal = document.getElementById('pass-length-val');
    const passUpper = document.getElementById('pass-upper');
    const passLower = document.getElementById('pass-lower');
    const passNumbers = document.getElementById('pass-numbers');
    const passSymbols = document.getElementById('pass-symbols');
    const passBtn = document.getElementById('pass-generate-btn');
    const passCopyBtn = document.getElementById('pass-copy');

    const chars = {
        upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lower: 'abcdefghijklmnopqrstuvwxyz',
        numbers: '0123456789',
        symbols: '!@#$%^&*()_+~`|}{[]:;?><,./-='
    };

    passLength.addEventListener('input', (e) => {
        passLengthVal.textContent = e.target.value;
    });

    function generatePassword() {
        let charSet = '';
        if (passUpper.checked) charSet += chars.upper;
        if (passLower.checked) charSet += chars.lower;
        if (passNumbers.checked) charSet += chars.numbers;
        if (passSymbols.checked) charSet += chars.symbols;

        if (charSet === '') {
            passUpper.checked = true;
            charSet = chars.upper;
        }

        let password = '';
        const length = parseInt(passLength.value);
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charSet.length);
            password += charSet[randomIndex];
        }

        passOutput.value = password;
    }

    passBtn.addEventListener('click', generatePassword);

    // Generate initial password
    generatePassword();


    // ==========================================
    // 4. Username Generator
    // ==========================================
    const userOutput = document.getElementById('user-output');
    const userKeyword = document.getElementById('user-keyword');
    const userNumbers = document.getElementById('user-numbers');
    const userBtn = document.getElementById('user-generate-btn');
    const userCopyBtn = document.getElementById('user-copy');

    const adjectives = ['Cosmic', 'Silent', 'Electric', 'Phantom', 'Neon', 'Shadow', 'Golden', 'Cyber', 'Crystal', 'Lunar', 'Solar', 'Quantum'];
    const nouns = ['Ninja', 'Dragon', 'Rider', 'Specter', 'Wolf', 'Phoenix', 'Ghost', 'Walker', 'Fox', 'Knight', 'Wizard', 'Hunter'];

    function generateUsername() {
        let baseName = '';

        if (userKeyword.value.trim() !== '') {
            // User provided a keyword
            const useAdjective = Math.random() > 0.5;
            const word = useAdjective ?
                adjectives[Math.floor(Math.random() * adjectives.length)] :
                nouns[Math.floor(Math.random() * nouns.length)];

            // Randomly put the keyword first or second
            if (Math.random() > 0.5) {
                baseName = word + userKeyword.value.trim().replace(/\s+/g, '');
            } else {
                baseName = userKeyword.value.trim().replace(/\s+/g, '') + word;
            }
        } else {
            // No keyword, combine adj + noun
            const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
            const noun = nouns[Math.floor(Math.random() * nouns.length)];
            baseName = adj + noun;
        }

        if (userNumbers.checked) {
            const num = Math.floor(Math.random() * 999) + 1;
            baseName += num;
        }

        userOutput.value = baseName;
    }

    userBtn.addEventListener('click', generateUsername);
    generateUsername();


    // ==========================================
    // 5. Color Picker
    // ==========================================
    const colorInput = document.getElementById('native-color-input');
    const colorPreview = document.getElementById('color-preview');
    const hexOutput = document.getElementById('col-hex-output');
    const rgbOutput = document.getElementById('col-rgb-output');
    const colorRandomBtn = document.getElementById('col-random-btn');

    const hexCopyBtn = document.getElementById('col-hex-copy');
    const rgbCopyBtn = document.getElementById('col-rgb-copy');

    // Convert HEX to RGB
    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})` : null;
    }

    function updateColorFromHex(hex) {
        colorPreview.style.backgroundColor = hex;
        colorPreview.style.boxShadow = `0 0 30px ${hex}80`; // Add glow
        colorInput.value = hex;
        hexOutput.value = hex.toUpperCase();
        rgbOutput.value = hexToRgb(hex);
    }

    colorInput.addEventListener('input', (e) => {
        updateColorFromHex(e.target.value);
    });

    function generateRandomColor() {
        const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
        updateColorFromHex(randomColor);
    }

    colorRandomBtn.addEventListener('click', generateRandomColor);

    // ==========================================
    // 6. Copy to Clipboard Utility
    // ==========================================
    const toastMessage = document.getElementById('toast-message');
    let toastTimeout;

    function copyToClipboard(value, btnElement) {
        if (!value) return;

        navigator.clipboard.writeText(value).then(() => {
            // Visual feedback on button
            const originalBg = btnElement.style.background;
            btnElement.classList.add('success');

            setTimeout(() => {
                btnElement.classList.remove('success');
            }, 1000);

            // Show Toast
            toastMessage.textContent = translations[currentLang].copied_toast;
            toastMessage.classList.add('show');

            clearTimeout(toastTimeout);
            toastTimeout = setTimeout(() => {
                toastMessage.classList.remove('show');
            }, 2500);
        });
    }

    passCopyBtn.addEventListener('click', () => copyToClipboard(passOutput.value, passCopyBtn));
    userCopyBtn.addEventListener('click', () => copyToClipboard(userOutput.value, userCopyBtn));
    hexCopyBtn.addEventListener('click', () => copyToClipboard(hexOutput.value, hexCopyBtn));
    rgbCopyBtn.addEventListener('click', () => copyToClipboard(rgbOutput.value, rgbCopyBtn));

});
