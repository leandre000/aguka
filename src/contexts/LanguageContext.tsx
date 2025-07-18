import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.employees': 'Employees',
    'nav.recruitment': 'Recruitment',
    'nav.payroll': 'Payroll',
    'nav.performance': 'Performance',
    'nav.employeePortal': 'Employee Portal',
    'nav.compliance': 'Compliance',
    'nav.reports': 'Reports',
    'common.messages': 'Messages',
    
    // Homepage
    'home.title': 'HR Management System',
    'home.subtitle': 'Choose your role to access the appropriate portal',
    'home.selectRole': 'Select Your Role',
    'home.administrator': 'Administrator',
    'home.administrator.desc': 'Complete system control and management',
    'home.manager': 'Manager',
    'home.manager.desc': 'Team management and oversight',
    'home.employee': 'Employee',
    'home.employee.desc': 'Personal workspace and information',
    'home.recruiter': 'Recruiter',
    'home.recruiter.desc': 'Talent acquisition and hiring',
    'home.trainer': 'Trainer',
    'home.trainer.desc': 'Training programs and development',
    'home.auditor': 'Auditor',
    'home.auditor.desc': 'Compliance monitoring and reporting',
    'home.accessPortal': 'Access Portal',
    
    // Auth
    'auth.signIn': 'Sign In',
    'auth.signUp': 'Sign Up',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.role': 'Role',
    'auth.enterEmail': 'Enter your email',
    'auth.enterPassword': 'Enter your password',
    'auth.selectRole': 'Select your role',
    'auth.signInAccount': 'Sign in to your account',
    'auth.noAccount': "Don't have an account?",
    'auth.haveAccount': 'Already have an account?',
    
    // Common
    'common.loading': 'Loading...',
    'common.language': 'Language',
    'common.english': 'English',
    'common.french': 'French',
    'common.navigation': 'Navigation',
    'common.edit': 'Edit',
    'common.actions': 'Actions',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.dowload': 'Download',
    'common.reports': 'Reports',
    
    // Admin Portal
    'admin.title': 'Admin Portal',
    'admin.subtitle': 'System Administration',
    'admin.dashboard': 'Dashboard',
    'admin.userManagement': 'User Management',
    'admin.systemSettings': 'System Settings',
    'admin.security': 'Security & Permissions',
    'admin.analytics': 'Analytics Dashboard',
    'admin.auditLogs': 'Audit Logs',
    'admin.backup': 'Backup & Recovery',
    'admin.surveyResults': 'Survey Results',
    'admin.successionPlanning': 'Succession Planning',
    
    // Manager Portal
    'manager.title': 'Manager Portal',
    'manager.subtitle': 'Team Management',
    'manager.dashboard': 'Dashboard',
    'manager.teamMembers': 'Team Members',
    'manager.attendance': 'Attendance',
    'manager.timeoff': 'Time Off',
    'manager.performance': 'Performance',
    'manager.approvals': 'Approvals',
    'manager.goals': 'Goals',
    'manager.reports': 'Reports',
    'manager.successionPlanning': 'Succession Planning',
    
    // Employee Portal
    'employee.title': 'Employee Portal',
    'employee.subtitle': 'Personal Workspace',
    'employee.dashboard': 'Dashboard',
    'employee.profile': 'Profile',
    'employee.timeoff': 'Time Off',
    'employee.payroll': 'Payroll',
    'employee.training': 'Training',
    'employee.performance': 'Performance',
    'employee.timesheet': 'Timesheet',
    'employee.feedback': 'Feedback',
    'employee.documents': 'Documents',
    'employee.portalTitle': 'Employee Portal',
    'employee.portalSubtitle': 'Your personal workspace and information',
    'employee.vacationDays': 'Vacation Days',
    'employee.daysRemaining': 'Days remaining',
    'employee.daysUsed': 'days used',
    'employee.overtime': 'Overtime Hours',
    'employee.thisMonth': 'This month',
    'employee.trainingProgress': 'Training Progress',
    'employee.completionRate': 'Completion rate',
    'employee.notifications': 'Notifications',
    'employee.unread': 'Unread',
    'employee.quickActions': 'Quick Actions',
    'employee.quickActionsDesc': 'Frequently used actions and shortcuts',
    'employee.upcomingEvents': 'Upcoming Events',
    'employee.upcomingEventsDesc': 'Your scheduled meetings and appointments',
    'employee.recentActivity': 'Recent Activity',
    'employee.recentActivityDesc': 'Your latest actions and updates',
    'employee.hrFaq': 'HR FAQ',
    'employee.wellbeingSurvey': 'Wellbeing Survey',
    'employee.aiAssistant': 'AI Assistant',
    'employee.payslips': 'Payslips',
    'employee.leaveRequests': 'Leave Requests',
    'employee.expenseClaims': 'Expense Claims',
    'employee.announcements': 'Announcements',
    
    // Recruiter Portal
    'recruiter.title': 'Recruiter Portal',
    'recruiter.subtitle': 'Talent Acquisition',
    'recruiter.dashboard': 'Dashboard',
    'recruiter.jobs': 'Job Postings',
    'recruiter.candidates': 'Candidates',
    'recruiter.interviews': 'Interviews',
    'recruiter.sourcing': 'Talent Sourcing',
    'recruiter.pipeline': 'Pipeline',
    'recruiter.offers': 'Job Offers',
    'recruiter.reports': 'Reports',
    
    // Trainer Portal
    'trainer.title': 'Trainer Portal',
    'trainer.subtitle': 'Training Management',
    'trainer.dashboard': 'Dashboard',
    'trainer.courses': 'Courses',
    'trainer.learningPaths': 'Learning Paths',
    'trainer.students': 'Students',
    'trainer.progress': 'Progress Tracking',
    'trainer.assessments': 'Assessments',
    'trainer.content': 'Content Library',
    'trainer.reports': 'Reports',
    'trainer.sessions': 'Training Sessions',
    
    // Auditor Portal
    'auditor.title': 'Auditor Portal',
    'auditor.subtitle': 'Compliance & Audit',
    'auditor.dashboard': 'Dashboard',
    'auditor.complianceReports': 'Compliance Reports',
    'auditor.auditFindings': 'Audit Findings',
    'auditor.riskAssessments': 'Risk Assessments',
    'auditor.analytics': 'Analytics',
    'auditor.documents': 'Documents',
    'auditor.search': 'Search',
  },
  fr: {
    // Navigation
    'nav.dashboard': 'Tableau de Bord',
    'nav.employees': 'Employés',
    'nav.recruitment': 'Recrutement',
    'nav.payroll': 'Paie',
    'nav.performance': 'Performance',
    'nav.employeePortal': 'Portail Employé',
    'nav.compliance': 'Conformité',
    'nav.reports': 'Rapports',
    'common.messages': 'Messages',
    
    // Homepage
    'home.title': 'Système de Gestion RH',
    'home.subtitle': 'Choisissez votre rôle pour accéder au portail approprié',
    'home.selectRole': 'Sélectionnez Votre Rôle',
    'home.administrator': 'Administrateur',
    'home.administrator.desc': 'Contrôle et gestion complète du système',
    'home.manager': 'Manager',
    'home.manager.desc': 'Gestion et supervision d\'équipe',
    'home.employee': 'Employé',
    'home.employee.desc': 'Espace de travail personnel et informations',
    'home.recruiter': 'Recruteur',
    'home.recruiter.desc': 'Acquisition de talents et embauche',
    'home.trainer': 'Formateur',
    'home.trainer.desc': 'Programmes de formation et développement',
    'home.auditor': 'Auditeur',
    'home.auditor.desc': 'Surveillance de conformité et rapports',
    'home.accessPortal': 'Accéder au Portail',
    
    // Auth
    'auth.signIn': 'Se Connecter',
    'auth.signUp': 'S\'inscrire',
    'auth.email': 'Email',
    'auth.password': 'Mot de Passe',
    'auth.role': 'Rôle',
    'auth.enterEmail': 'Entrez votre email',
    'auth.enterPassword': 'Entrez votre mot de passe',
    'auth.selectRole': 'Sélectionnez votre rôle',
    'auth.signInAccount': 'Connectez-vous à votre compte',
    'auth.noAccount': 'Vous n\'avez pas de compte ?',
    'auth.haveAccount': 'Vous avez déjà un compte ?',
    
    // Common
    'common.loading': 'Chargement...',
    'common.language': 'Langue',
    'common.english': 'Anglais',
    'common.french': 'Français',
    'common.navigation': 'Navigation',
    'common.edit': 'Modifier',
    'common.actions': 'Actions',
    'common.cancel': 'Annuler',
    'common.save': 'Enregistrer',
    'common.next': 'Suivant',
    'common.previous': 'Précédent',
    'common.dowload': 'Télécharger',
    'common.reports': 'Rapports',
    
    // Admin Portal
    'admin.title': 'Portail Admin',
    'admin.subtitle': 'Administration Système',
    'admin.dashboard': 'Tableau de Bord',
    'admin.userManagement': 'Gestion des Utilisateurs',
    'admin.systemSettings': 'Paramètres Système',
    'admin.security': 'Sécurité et Permissions',
    'admin.analytics': 'Tableau d\'Analyse',
    'admin.auditLogs': 'Journaux d\'Audit',
    'admin.backup': 'Sauvegarde et Récupération',
    'admin.surveyResults': 'Résultats des enquêtes',
    'admin.successionPlanning': 'Plan de succession',
    
    // Manager Portal
    'manager.title': 'Portail Manager',
    'manager.subtitle': 'Gestion d\'Équipe',
    'manager.dashboard': 'Tableau de Bord',
    'manager.teamMembers': 'Membres de l\'Équipe',
    'manager.attendance': 'Présence',
    'manager.timeoff': 'Congés',
    'manager.performance': 'Performance',
    'manager.approvals': 'Approbations',
    'manager.goals': 'Objectifs',
    'manager.reports': 'Rapports',
    'manager.successionPlanning': 'Plan de succession',
    
    // Employee Portal
    'employee.title': 'Portail Employé',
    'employee.subtitle': 'Espace Personnel',
    'employee.dashboard': 'Tableau de Bord',
    'employee.profile': 'Profil',
    'employee.timeoff': 'Congés',
    'employee.payroll': 'Paie',
    'employee.training': 'Formation',
    'employee.performance': 'Performance',
    'employee.timesheet': 'Feuille de Temps',
    'employee.feedback': 'Feedback',
    'employee.documents': 'Documents',
    'employee.portalTitle': 'Portail Employé',
    'employee.portalSubtitle': 'Votre espace de travail personnel et informations',
    'employee.vacationDays': 'Jours de Vacances',
    'employee.daysRemaining': 'Jours restants',
    'employee.daysUsed': 'jours utilisés',
    'employee.overtime': 'Heures Supplémentaires',
    'employee.thisMonth': 'Ce mois-ci',
    'employee.trainingProgress': 'Progrès Formation',
    'employee.completionRate': 'Taux de completion',
    'employee.notifications': 'Notifications',
    'employee.unread': 'Non lues',
    'employee.quickActions': 'Actions Rapides',
    'employee.quickActionsDesc': 'Actions fréquemment utilisées et raccourcis',
    'employee.upcomingEvents': 'Événements à Venir',
    'employee.upcomingEventsDesc': 'Vos réunions et rendez-vous programmés',
    'employee.recentActivity': 'Activité Récente',
    'employee.recentActivityDesc': 'Vos dernières actions et mises à jour',
    'employee.hrFaq': 'FAQ RH',
    'employee.wellbeingSurvey': 'Enquête de Bien-être',
    'employee.aiAssistant': 'Assistant IA',
    'employee.payslips': 'Fiches de paie',
    'employee.leaveRequests': 'Demandes de Congé',
    'employee.expenseClaims': 'Demandes de Remboursement',
    'employee.announcements': 'Annonces',
    
    // Recruiter Portal
    'recruiter.title': 'Portail Recruteur',
    'recruiter.subtitle': 'Acquisition de Talents',
    'recruiter.dashboard': 'Tableau de Bord',
    'recruiter.jobs': 'Offres d\'Emploi',
    'recruiter.candidates': 'Candidats',
    'recruiter.interviews': 'Entretiens',
    'recruiter.sourcing': 'Sourcing de Talents',
    'recruiter.pipeline': 'Pipeline',
    'recruiter.offers': 'Offres d\'Emploi',
    'recruiter.reports': 'Rapports',
    
    // Trainer Portal
    'trainer.title': 'Portail Formateur',
    'trainer.subtitle': 'Gestion de Formation',
    'trainer.dashboard': 'Tableau de Bord',
    'trainer.courses': 'Cours',
    'trainer.learningPaths': 'Parcours d\'Apprentissage',
    'trainer.students': 'Étudiants',
    'trainer.progress': 'Suivi des Progrès',
    'trainer.assessments': 'Évaluations',
    'trainer.content': 'Bibliothèque de Contenu',
    'trainer.reports': 'Rapports',
    'trainer.sessions': 'Sessions de Formation',
    
    // Auditor Portal
    'auditor.title': 'Portail Auditeur',
    'auditor.subtitle': 'Conformité et Audit',
    'auditor.dashboard': 'Tableau de Bord',
    'auditor.complianceReports': 'Rapports de Conformité',
    'auditor.auditFindings': 'Conclusions d\'Audit',
    'auditor.riskAssessments': 'Évaluations des Risques',
    'auditor.analytics': 'Analyses',
    'auditor.documents': 'Documents',
    'auditor.search': 'Rechercher',
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};