const initialCVData = {
  personalInfo: {
    fullName: "Can Yılmaz",
    title: "Kıdemli Full-Stack Yazılım Geliştirici",
    email: "can.yilmaz@email.com",
    phone: "+90 555 123 4567",
    location: "İstanbul, Türkiye",
    website: "https://canyilmaz.dev",
    linkedin: "https://linkedin.com/in/canyilmaz",
    github: "https://github.com/canyilmaz"
  },
  summary: "7 yılı aşkın deneyime sahip, yüksek performanslı web uygulamaları ve ölçeklenebilir mikro hizmet mimarileri tasarlama konusunda uzmanlaşmış Kıdemli Full-Stack Yazılım Geliştirici. Modern Javascript kütüphaneleri (React, Node.js) ve bulut altyapıları (AWS) konusunda derin teknik bilgiye sahibim. Çevik (Agile) takımlarda liderlik yapmış, temiz kod ve test odaklı geliştirme (TDD) prensiplerini benimsemiş biriyim. Kullanıcı dostu arayüzler tasarlamayı ve karmaşık teknik sorunlara yenilikçi çözümler üretmeyi severim.",
  experiences: [
    {
      id: "exp-1",
      company: "TechNexus Çözümleri",
      position: "Kıdemli Full-Stack Geliştirici",
      startDate: "2023-03",
      endDate: "Devam Ediyor",
      description: "• Mikro hizmet mimarisine geçiş sürecini yöneterek sistem yanıt süresini %40 oranında düşürdüm.\n• React ve Node.js/TypeScript kullanarak şirketin ana e-ticaret platformunu yeniden tasarladım; dönüşüm oranlarında %15 artış sağlandı.\n• Docker ve AWS (ECS, RDS, S3) kullanarak CI/CD süreçlerini yapılandırdım ve canlıya alma sürelerini haftalık periyotlardan günlük periyotlara indirdim.\n• 5 kişilik yazılım ekibine mentorluk yaptım ve kod inceleme standartlarını belirledim."
    },
    {
      id: "exp-2",
      company: "Kreatif Kod Bilişim",
      position: "Full-Stack Yazılım Geliştirici",
      startDate: "2020-05",
      endDate: "2023-02",
      description: "• RESTful API ve GraphQL servisleri tasarlayarak üçüncü taraf entegrasyonlarını optimize ettim.\n• Vue.js ve Python/Django kullanarak büyük veri görselleştirme panelleri geliştirdim.\n• PostgreSQL veritabanı sorgularını optimize ederek raporlama işlemlerinin çalışma süresini %60 azalttım.\n• Scrum toplantılarına aktif katılım sağladım ve sprint planlamalarında teknik analizler sundum."
    },
    {
      id: "exp-3",
      company: "Bulut Teknolojileri A.Ş.",
      position: "Junior Geliştirici",
      startDate: "2019-01",
      endDate: "2020-04",
      description: "• HTML5, CSS3 ve JavaScript kullanarak duyarlı (responsive) web sayfaları geliştirdim.\n• PHP/Laravel tabanlı içerik yönetim sistemlerinin (CMS) bakımını ve yeni modüllerinin entegrasyonunu gerçekleştirdim.\n• Birim testlerin (Unit tests) yazılması ve hata ayıklama (debugging) süreçlerinde kıdemli geliştiricilere destek oldum."
    }
  ],
  education: [
    {
      id: "edu-1",
      institution: "Boğaziçi Üniversitesi",
      degree: "Lisans, Bilgisayar Mühendisliği",
      startDate: "2014-09",
      endDate: "2018-06",
      description: "GPA: 3.42 / 4.00. Mezuniyet Projesi: 'Yapay Sinir Ağları ile Doğal Dil İşleme Tabanlı Duygu Analizi Modeli'."
    }
  ],
  portfolio: [
    {
      id: "port-1",
      title: "OpenSource E-Ticaret Sepet Modülü",
      role: "Kurucu Geliştirici",
      link: "https://github.com/canyilmaz/ultra-cart",
      description: "React ve Redux Toolkit ile geliştirilmiş, ultra hafif, modüler ve yüksek performanslı e-ticaret sepet kütüphanesi. NPM üzerinden +10k indirildi.",
      technologies: "React, Redux, TailwindCSS, Jest"
    },
    {
      id: "port-2",
      title: "Finansal Analiz Kontrol Paneli",
      role: "Lead Front-end Geliştirici",
      link: "https://finance-dashboard-demo.canyilmaz.dev",
      description: "Kullanıcıların kişisel portföylerini izlemelerini, hisse senedi ve kripto fiyatlarını canlı grafiklerle takip etmelerini sağlayan web uygulaması.",
      technologies: "Next.js, Chart.js, TailwindCSS, WebSockets"
    },
    {
      id: "port-3",
      title: "Agile Task Manager (Görev Yönetici)",
      role: "Full-Stack Geliştirici",
      link: "https://github.com/canyilmaz/agile-tasks",
      description: "Takımların sprint süreçlerini yönetebilmesi için Kanban tahtası içeren gerçek zamanlı iş birliği aracı.",
      technologies: "Node.js, Express, MongoDB, Socket.io, React"
    }
  ],
  skills: [
    {
      id: "skill-1",
      category: "Programlama Dilleri",
      details: "JavaScript (ES6+), TypeScript, Python, HTML5, CSS3, SQL, PHP"
    },
    {
      id: "skill-2",
      category: "Kütüphaneler & Frameworkler",
      details: "React, Node.js, Express, Vue.js, Django, Laravel, Next.js, Bootstrap"
    },
    {
      id: "skill-3",
      category: "Araçlar & Teknolojiler",
      details: "Git, Docker, AWS (S3, EC2, RDS), PostgreSQL, MongoDB, Redis, Webpack, Vite"
    },
    {
      id: "skill-4",
      category: "Metodolojiler",
      details: "Agile/Scrum, CI/CD, Test Driven Development (TDD), RESTful API Tasarımı"
    }
  ],
  languages: [
    {
      id: "lang-1",
      language: "Türkçe",
      level: "Anadil"
    },
    {
      id: "lang-2",
      language: "İngilizce",
      level: "İleri Düzey (C1 - TOEFL 95)"
    },
    {
      id: "lang-3",
      language: "Almanca",
      level: "Orta Düzey (B1)"
    }
  ]
};

// Export to make it available in the browser environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initialCVData };
}
