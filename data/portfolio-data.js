// portfolio-data.js
const portfolioData = {
    // Projects data
    projects: [
        {
            id: 1,
            title: "Bioinformatics Pipeline",
            titleSv: "Bioinformatikspipeline",
            category: "Software Development",
            categorySv: "Programvaruutveckling",
            description: "Developed a pipeline for extracting biomedical data from scientific publications using C#, Blazor and Entity Framework, deployed on AWS.",
            descriptionSv: "Utvecklade en pipeline för att extrahera biomedicinsk data från vetenskapliga publikationer med C#, Blazor och Entity Framework, distribuerad på AWS.",
            technologies: ["C#", "Blazor", "AWS", "Entity Framework", "Docker"],
            link: "http://addcell.org",
            featured: true,
            type: "software"
        },
        {
            id: 2,
            title: "Vehicle Radar Component Simulation",
            titleSv: "Fordonsradarkomponentsimulering",
            category: "Embedded Systems",
            categorySv: "Inbyggda System",
            description: "Designed and simulated a microstrip-to-double-ridge waveguide transition for 77 GHz automotive radar systems using CST Studio Suite.",
            descriptionSv: "Designade och simulerade en mikrostrip-till-dubbel-spår-vågledare för 77 GHz fordonsradarsystem med CST Studio Suite.",
            technologies: ["CST", "MATLAB", "RF Design", "Waveguide"],
            link: "#",
            featured: true,
            type: "embedded"
        },
        {
            id: 3,
            title: "Industrial Automation System",
            titleSv: "Industriellt Automationssystem",
            category: "Automation",
            categorySv: "Automation",
            description: "PLC programming and system integration for manufacturing automation using Siemens PLC and CODESYS.",
            descriptionSv: "PLC-programmering och systemintegration för tillverkningsautomation med Siemens PLC och CODESYS.",
            technologies: ["PLC", "CODESYS", "SCADA", "Siemens"],
            link: "#",
            featured: true,
            type: "automation"
        },
        {
            id: 4,
            title: "IT Support Management System",
            titleSv: "IT-support Management System",
            category: "IT Support",
            categorySv: "IT-support",
            description: "Developed an internal ticketing system for IT support management with PowerShell automation scripts.",
            descriptionSv: "Utvecklade ett internt ärendehanteringssystem för IT-support med PowerShell-automatiseringsskript.",
            technologies: ["PowerShell", "Python", "Windows Server", "Active Directory"],
            link: "#",
            featured: false,
            type: "it"
        }
    ],

    // Experience data
    experience: [
        {
            id: 1,
            title: "Automation Engineer",
            titleSv: "Automationstekniker",
            company: "CATC AB",
            companySv: "CATC AB",
            period: "Jan 2025 - Apr 2025",
            periodSv: "Jan 2025 - Apr 2025",
            description: "System integration and configuration of industrial automation systems including PLC programming and SCADA implementation.",
            descriptionSv: "Systemintegration och konfiguration av industriella automationssystem inklusive PLC-programmering och SCADA-implementering.",
            type: "left"
        },
        {
            id: 2,
            title: "IT Support Technician",
            titleSv: "IT-supporttekniker",
            company: "Toyota Material Handling",
            companySv: "Toyota Material Handling",
            period: "Mar 2023 - Jun 2024",
            periodSv: "Mar 2023 - Jun 2024",
            description: "Technical support, network configuration and troubleshooting in enterprise environment as a consultant.",
            descriptionSv: "Tekniskt stöd, nätverkskonfiguration och felsökning i företagsmiljö som konsult.",
            type: "right"
        },
        {
            id: 3,
            title: "System Developer",
            titleSv: "Systemutvecklare",
            company: "Chalmers University of Technology",
            companySv: "Chalmers tekniska högskola",
            period: "Jan 2023 - Jun 2023",
            periodSv: "Jan 2023 - Jun 2023",
            description: "Software development for bioinformatics research applications using .NET technologies.",
            descriptionSv: "Programvaruutveckling för bioinformatikforskning med .NET-teknologier.",
            type: "left"
        }
    ],

    // Education data
    education: [
        {
            id: 1,
            institution: "Chalmers University of Technology",
            institutionSv: "Chalmers tekniska högskola",
            degree: "Master of Science, Communication Engineering",
            degreeSv: "Master of Science, Kommunikationsteknik",
            period: "2016 - 2018",
            location: "Gothenburg, Sweden"
        },
        {
            id: 2,
            institution: "University West",
            institutionSv: "Högskolan Väst",
            degree: "Master of Science, Robotics and Automation",
            degreeSv: "Master of Science, Robotik och automationsteknik",
            period: "2018 - 2020",
            location: "Trollhättan, Sweden"
        },
        {
            id: 3,
            institution: "Lexicon",
            institutionSv: "Lexicon",
            degree: "Vocational College, Fullstack Development in C#.Net",
            degreeSv: "YrkesHögskola, Fullstack-utveckling i C#.Net",
            period: "2021 - 2022",
            location: "Stockholm, Sweden"
        },
        {
            id: 4,
            institution: "International Islamic University of Chittagong",
            institutionSv: "International Islamic University of Chittagong",
            degree: "Bachelor of Science, Electrical and Electronic Engineering",
            degreeSv: "Bachelor of Science, Elektroteknik och elektronik",
            period: "2010 - 2014",
            location: "Chittagong, Bangladesh"
        }
    ],

    // Skills data
    skills: {
        categories: [
            {
                name: "Automation & Embedded",
                nameSv: "Automation & Inbyggda System",
                skills: [
                    { name: "PLC Programming", level: 90 },
                    { name: "MATLAB/Simulink", level: 85 },
                    { name: "Embedded C", level: 80 },
                    { name: "CODESYS", level: 75 },
                    { name: "CST Studio Suite", level: 70 }
                ]
            },
            {
                name: "Software Development",
                nameSv: "Programvaruutveckling",
                skills: [
                    { name: "C# / .NET", level: 88 },
                    { name: "Python", level: 75 },
                    { name: "HTML/CSS/JavaScript", level: 70 },
                    { name: "Blazor", level: 68 },
                    { name: "Entity Framework", level: 65 }
                ]
            },
            {
                name: "IT & Infrastructure",
                nameSv: "IT & Infrastruktur",
                skills: [
                    { name: "Windows Server", level: 85 },
                    { name: "PowerShell", level: 80 },
                    { name: "Linux", level: 75 },
                    { name: "AWS", level: 70 },
                    { name: "Docker", level: 65 }
                ]
            }
        ]
    },

    // Gallery data
    gallery: [
        {
            id: 1,
            category: "automation",
            image: "assets/img/gallery/automation1.jpg",
            title: "PLC Control Panel",
            titleSv: "PLC-kontrollpanel",
            description: "Industrial automation control panel setup with Siemens PLC",
            descriptionSv: "Industriell automatiseringskontrollpanel med Siemens PLC"
        },
        {
            id: 2,
            category: "software",
            image: "assets/img/gallery/software1.jpg",
            title: ".NET Application Development",
            titleSv: ".NET Applikationsutveckling",
            description: "Full-stack .NET application development environment",
            descriptionSv: "Full-stack .NET applikationsutvecklingsmiljö"
        },
        {
            id: 3,
            category: "embedded",
            image: "assets/img/gallery/embedded1.jpg",
            title: "RF Circuit Design",
            titleSv: "RF-kretsdesign",
            description: "High-frequency circuit design and simulation",
            descriptionSv: "Högfrekvent kretsdesign och simulering"
        },
        {
            id: 4,
            category: "it",
            image: "assets/img/gallery/it1.jpg",
            title: "Network Configuration",
            titleSv: "Nätverkskonfiguration",
            description: "Enterprise network setup and configuration",
            descriptionSv: "Företagsnätverksinstallation och konfiguration"
        }
    ]
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = portfolioData;
} else {
    window.portfolioData = portfolioData;
}