// Language translations
const translations = {
  "en": {
    "nav-about": "About",
    "nav-experience": "Experience",
    "nav-education": "Education",
    "nav-skills": "Skills",
    "nav-projects": "Projects",
    "nav-contact": "Contact",
    "hero-title": "Automation Engineer | IT Support Specialist | .NET Developer",
    "about-title": "Who Am I?",
    "about-text1": "A technically driven and detail-oriented professional with a strong passion for programming, automation, and troubleshooting. I'm seeking a challenging role to apply my expertise and problem-solving skills to contribute to innovative solutions.",
    "about-text2": "I am committed to continuous learning and staying current with emerging technologies to drive progress and deliver exceptional results in a collaborative environment.",
    "about-skill1": "Experienced with Embedded Systems",
    "about-skill2": "ROS Certified Professional",
    "about-skill3": "Proficient in HIL Simulation",
    "about-skill4": "Full-Stack .NET Development",
    "experience-title": "Work Experience",
    "experience-job1": "Automation Engineer",
    "experience-job2": "IT Support Engineer",
    "experience-job3": "System Developer",
    "experience-company1": "CATC AB",
    "experience-company2": "Consultant @ Toyota Material Handling",
    "experience-company3": "Chalmers University of Technology",
    "education-title": "Education",
    "education-university1": "Chalmers University of Technology",
    "education-degree1": "Masters of Science, Communication Engineering",
    "education-university2": "University West",
    "education-degree2": "Masters of Science, Robotics and Automation Engineering",
    "education-university3": "Lexicon",
    "education-degree3": "YrkesHögskola, Fullstack Development in C#.Net",
    "education-university4": "International Islamic University of Chittagong",
    "education-degree4": "Bachelor of Science, Electrical and Electronics Engineering",
    "skills-title": "Technical Skills",
    "skills-subtitle": "Programming Languages & Tools",
    "projects-title": "Featured Projects",
    "project1-title": "Bioinformatics Pipeline",
    "project1-org": "Chalmers University of Technology",
    "project1-desc": "Developed a pipeline to extract biomedical data from scientific publications using C#, Blazor, and Entity Framework, deployed on AWS.",
    "project1-link": "View Prototype",
    "project2-title": "Vehicle Radar Component Simulation",
    "project2-org": "Gapwaves AB (Ex-Jobb)",
    "project2-desc": "Designed and simulated a microstrip-to-dual-track waveguide for 77 GHz vehicle radar systems using CST Studio Suite, focusing on gap waveguide technology.",
    "contact-title": "Get In Touch",
    "contact-text": "I'm currently seeking new opportunities and would love to connect. Whether you have a question or a potential project, feel free to reach out.",
    "contact-button": "Contact Me",
    "certificates-title": "Certificates & Achievements",
    "certificates-button": "View All Certificates"
  },
  "sv": {
    "nav-about": "Om",
    "nav-experience": "Erfarenhet",
    "nav-education": "Utbildning",
    "nav-skills": "Färdigheter",
    "nav-projects": "Projekt",
    "nav-contact": "Kontakt",
    "hero-title": "Automationstekniker | IT-supportspecialist | .NET-utvecklare",
    "about-title": "Vem är jag?",
    "about-text1": "En tekniskt driven och detaljorienterad professionell med stark passion för programmering, automation och felsökning. Jag söker en utmanande roll där jag kan tillämpa min expertis och problemlösningsförmåga för att bidra till innovativa lösningar.",
    "about-text2": "Jag är engagerad i kontinuerligt lärande och att hålla mig uppdaterad med framväxande teknologier för att driva framsteg och leverera exceptionella resultat i en samarbetsmiljö.",
    "about-skill1": "Erfaren av inbyggda system",
    "about-skill2": "ROS-certifierad professionell",
    "about-skill3": "Skicklig i HIL-simulering",
    "about-skill4": "Fullstack .NET-utveckling",
    "experience-title": "Arbetslivserfarenhet",
    "experience-job1": "Automationstekniker",
    "experience-job2": "IT-supporttekniker",
    "experience-job3": "Systemutvecklare",
    "experience-company1": "CATC AB",
    "experience-company2": "Konsult @ Toyota Material Handling",
    "experience-company3": "Chalmers tekniska högskola",
    "education-title": "Utbildning",
    "education-university1": "Chalmers tekniska högskola",
    "education-degree1": "Master of Science, Kommunikationsteknik",
    "education-university2": "Högskolan Väst",
    "education-degree2": "Master of Science, Robotik och automationsteknik",
    "education-university3": "Lexicon",
    "education-degree3": "YrkesHögskola, Fullstack-utveckling i C#.Net",
    "education-university4": "International Islamic University of Chittagong",
    "education-degree4": "Bachelor of Science, Elektroteknik och elektronik",
    "skills-title": "Tekniska färdigheter",
    "skills-subtitle": "Programmeringsspråk & verktyg",
    "projects-title": "Presenterade projekt",
    "project1-title": "Bioinformatikspipeline",
    "project1-org": "Chalmers tekniska högskola",
    "project1-desc": "Utvecklade en pipeline för att extrahera biomedicinsk data från vetenskapliga publikationer med C#, Blazor och Entity Framework, distribuerad på AWS.",
    "project1-link": "Visa prototyp",
    "project2-title": "Fordonsradarkomponentsimulering",
    "project2-org": "Gapwaves AB (Ex-Jobb)",
    "project2-desc": "Designade och simulerade en mikrostrip-till-dubbel-spår-vågledare för 77 GHz fordonsradarsystem med CST Studio Suite, med fokus på gapvågledarteknologi.",
    "contact-title": "Kom i kontakt",
    "contact-text": "Jag söker för närvarande nya möjligheter och skulle gärna vilja komma i kontakt. Oavsett om du har en fråga eller ett potentiellt projekt, tveka inte att kontakta mig.",
    "contact-button": "Kontakta mig",
    "certificates-title": "Certifikat & Meriter",
    "certificates-button": "Visa alla certifikat"
  }
};

// Function to change language
function changeLanguage(lang) {
  // Set the language in localStorage
  localStorage.setItem('language', lang);
  
  // Update all translatable elements
  document.querySelectorAll('[data-translate]').forEach(element => {
    const key = element.getAttribute('data-translate');
    if (translations[lang] && translations[lang][key]) {
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        element.placeholder = translations[lang][key];
      } else {
        element.textContent = translations[lang][key];
      }
    }
  });
  
  // Update the language selector button
  const langButton = document.getElementById('language-selector');
  if (langButton) {
    langButton.textContent = lang === 'sv' ? 'EN' : 'SV';
  }
  
  // Update the HTML lang attribute
  document.documentElement.lang = lang;
}

// Function to initialize language
function initLanguage() {
  // Get saved language or default to Swedish
  const savedLang = localStorage.getItem('language') || 'sv';
  changeLanguage(savedLang);
}

// Initialize language when page loads
document.addEventListener('DOMContentLoaded', initLanguage);
