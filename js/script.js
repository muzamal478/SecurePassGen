document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS for scroll animations
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out',
    });
  
    // GSAP animations for hero section
    gsap.from('.hero-section h1', {
      y: 50,
      opacity: 0,
      duration: 1,
      delay: 0.5,
      ease: 'power3.out',
    });
  
    gsap.from('.hero-section p', {
      y: 50,
      opacity: 0,
      duration: 1,
      delay: 0.7,
      ease: 'power3.out',
    });
  
    gsap.from('.hero-section .btn', {
      y: 50,
      opacity: 0,
      duration: 1,
      delay: 0.9,
      ease: 'power3.out',
    });
  
    // Lazy loading for images
    const images = document.querySelectorAll('.lazy-load');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('loaded');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
  
    images.forEach(image => observer.observe(image));
  
    // Dark mode toggle
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    const savedTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
  
    themeToggle.addEventListener('click', () => {
      const currentTheme = body.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      body.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcon(newTheme);
    });
  
    // Load last generated password
    const lastPassword = localStorage.getItem('lastPassword');
    if (lastPassword) {
      document.getElementById('passwordOutput').value = lastPassword;
      updatePasswordStrength(lastPassword);
    }
  
    // Prevent multiple rapid clicks on generate button
    const generateButton = document.querySelector('.btn-primary');
    generateButton.addEventListener('click', () => {
      generateButton.disabled = true;
      setTimeout(() => {
        generateButton.disabled = false;
      }, 500); // Re-enable after 500ms
    });
  });
  
  // Update theme icon for dark/light mode
  function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.innerHTML = theme === 'light' ? '<i class="bi bi-moon-stars-fill"></i>' : '<i class="bi bi-sun-fill"></i>';
    themeToggle.setAttribute('aria-label', theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
  }
  
  // Generate a new password
  function generatePassword() {
    const email = document.getElementById('emailInput').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    if (!email || !emailRegex.test(email)) {
      alert('Please enter a valid email address.');
      document.getElementById('emailInput').focus();
      return;
    }
  
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    let password = '';
    const timestamp = Date.now(); // Add timestamp for randomness
    const emailInfluence = email.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  
    // Generate 12-character password
    for (let i = 0; i < 12; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length + (emailInfluence + timestamp) % 10);
      password += chars.charAt(randomIndex % chars.length);
    }
  
    // Ensure password meets minimum requirements
    password = ensurePasswordRequirements(password);
  
    const passwordOutput = document.getElementById('passwordOutput');
    passwordOutput.value = password;
    localStorage.setItem('lastPassword', password);
    updatePasswordStrength(password);
    passwordOutput.focus(); // Accessibility: focus on output
  }
  
  // Ensure password meets requirements (at least 1 uppercase, 1 lowercase, 1 number, 1 special)
  function ensurePasswordRequirements(password) {
    const chars = {
      uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      lowercase: 'abcdefghijklmnopqrstuvwxyz',
      numbers: '0123456789',
      special: '!@#$%^&*()_+-=[]{}|;:,.<>?',
    };
  
    // Check if password meets all requirements
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password);
  
    if (hasUppercase && hasLowercase && hasNumber && hasSpecial) {
      return password;
    }
  
    // If requirements not met, replace characters to ensure compliance
    let newPassword = password.split('');
    if (!hasUppercase) {
      newPassword[0] = chars.uppercase[Math.floor(Math.random() * chars.uppercase.length)];
    }
    if (!hasLowercase) {
      newPassword[1] = chars.lowercase[Math.floor(Math.random() * chars.lowercase.length)];
    }
    if (!hasNumber) {
      newPassword[2] = chars.numbers[Math.floor(Math.random() * chars.numbers.length)];
    }
    if (!hasSpecial) {
      newPassword[3] = chars.special[Math.floor(Math.random() * chars.special.length)];
    }
  
    return newPassword.join('');
  }
  
  // Update password strength indicator
  function updatePasswordStrength(password) {
    const strengthDiv = document.getElementById('passwordStrength');
    let strength = 'weak';
  
    if (password.length >= 12 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password) && /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) {
      strength = 'strong';
    } else if (password.length >= 8 && (/[A-Z]/.test(password) || /[a-z]/.test(password)) && /[0-9]/.test(password)) {
      strength = 'medium';
    }
  
    strengthDiv.className = `form-text mt-2 ${strength}`;
    strengthDiv.textContent = `Password Strength: ${strength.charAt(0).toUpperCase() + strength.slice(1)}`;
    strengthDiv.setAttribute('aria-live', 'polite'); // Accessibility
  }
  
  // Copy password to clipboard
  function copyPassword() {
    const password = document.getElementById('passwordOutput').value;
    if (!password) {
      alert('No password to copy!');
      document.getElementById('passwordOutput').focus();
      return;
    }
  
    navigator.clipboard.writeText(password).then(() => {
      alert('Password copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy password.');
    });
  }
  
  // Handle contact form submission
  function submitContact() {
    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const message = document.getElementById('contactMessage').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    if (!name || !email || !message || !emailRegex.test(email)) {
      alert('Please fill out all fields with valid information.');
      if (!name) document.getElementById('contactName').focus();
      else if (!email || !emailRegex.test(email)) document.getElementById('contactEmail').focus();
      else document.getElementById('contactMessage').focus();
      return;
    }
  
    alert('Message sent! Thank you for contacting us.');
    document.getElementById('contactName').value = '';
    document.getElementById('contactEmail').value = '';
    document.getElementById('contactMessage').value = '';
  }