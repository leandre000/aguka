/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";
import {
  matchResume,
  predictAttrition,
  getTrainingRecommendations,
  analyzeSentiment,
  getChatResponse,
} from "@/lib/api";

const fieldLabels: Record<string, string> = {
  age: "Age",
  department: "Department",
  yearsAtCompany: "Years at Company",
  performance: "Performance",
  salary: "Salary",
  jobSatisfaction: "Job Satisfaction (1-5)",
  workLifeBalance: "Work-Life Balance (1-5)",
  managerRating: "Manager Rating (1-5)",
  lastPromotion: "Last Promotion Date",
  trainingCompleted: "Training Completed",
  position: "Position",
  yearsOfExperience: "Years of Experience",
  education: "Education",
  skills: "Skills (comma separated)",
  goals: "Goals (comma separated)",
};

export default function AITools() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the portal path based on user role
  const getPortalPath = () => {
    switch (user?.role) {
      case 'admin': return '/admin-portal';
      case 'manager': return '/manager-portal';
      case 'employee': return '/employee-portal';
      case 'recruiter': return '/recruiter-portal';
      case 'trainer': return '/trainer-portal';
      case 'auditor': return '/auditor-portal';
      default: return '/';
    }
  };
  
  // Resume Matcher
  const [resume, setResume] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [resumeResult, setResumeResult] = useState<any>(null);
  const [resumeLoading, setResumeLoading] = useState(false);

  // Attrition Risk
  const [attritionForm, setAttritionForm] = useState({
    age: '',
    department: '',
    yearsAtCompany: '',
    performance: '',
    salary: '',
    jobSatisfaction: '',
    workLifeBalance: '',
    managerRating: '',
    lastPromotion: '',
    trainingCompleted: '',
  });
  const [attritionResult, setAttritionResult] = useState<any>(null);
  const [attritionLoading, setAttritionLoading] = useState(false);

  // Training Recommender
  const [trainingForm, setTrainingForm] = useState({
    position: '',
    department: '',
    yearsOfExperience: '',
    performance: '',
    education: '',
    skills: '',
    goals: '',
  });
  const [trainingResult, setTrainingResult] = useState<any>(null);
  const [trainingLoading, setTrainingLoading] = useState(false);

  // Sentiment Analyzer
  const [sentimentText, setSentimentText] = useState("");
  const [sentimentResult, setSentimentResult] = useState<any>(null);
  const [sentimentLoading, setSentimentLoading] = useState(false);

  // AI Chat Assistant
  // OpenAI best practice: maintain chat history and send full conversation context to backend
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<{ role: string; message: string }[]>([]);
  const [chatLoading, setChatLoading] = useState(false);

  // Helper to send chat history to backend (OpenAI best practice)
  const sendChat = async (input: string) => {
    setChatLoading(true);
    setChatHistory(h => [...h, { role: "user", message: input }]);
    try {
      // Send the full chat history to the backend for context
      const result = await getChatResponse(input, { history: chatHistory });
      setChatHistory(h => [...h, { role: "ai", message: result.answer || result.data?.answer || "Sorry, I couldn't process your request." }]);
      setChatInput("");
    } catch (err: any) {
      toast({ title: t("common.error"), description: err.message || t("aiTools.chatError"), variant: "destructive" });
    } finally {
      setChatLoading(false);
    }
  };

  // Add/expand translation keys at the top
  const translations = {
    en: {
      allFieldsRequired: "All fields are required.",
      analyzeError: "Failed to analyze data.",
      analyzing: "Analyzing...",
      analyze: "Analyze",
      checking: "Checking...",
      checkAttrition: "Check Attrition",
      noResults: "No results available.",
      error: "Error",
      // Added keys
      'common.backToPortal': "Back to Portal",
      'common.home': "Home",
      'common.error': "Error",
      'aiTools.title': "AI Tools",
      'aiTools.resumeMatch': "Resume Matcher",
      'aiTools.uploadResume': "Upload Resume",
      'aiTools.jobDescription': "Job Description",
      'aiTools.analyzeError': "Failed to analyze data.",
      'aiTools.analyzing': "Analyzing...",
      'aiTools.analyze': "Analyze",
      'aiTools.attritionCheck': "Attrition Risk Checker",
      'aiTools.checkError': "Failed to check attrition risk.",
      'aiTools.checking': "Checking...",
      'aiTools.checkAttrition': "Check Attrition",
      'aiTools.riskLevel': "Risk Level:",
      'aiTools.riskScore': "Risk Score:",
      'aiTools.riskFactors': "Risk Factors:",
      'aiTools.trainingRecommend': "Training Recommender",
      'aiTools.recommendError': "Failed to get recommendations.",
      'aiTools.recommending': "Recommending...",
      'aiTools.recommendTraining': "Recommend Training",
      'aiTools.recommendations': "Recommended Courses:",
      'aiTools.sentimentAnalysis': "Sentiment Analyzer",
      'aiTools.textToAnalyze': "Text to Analyze",
      'aiTools.analyzeSentiment': "Analyze Sentiment",
      'aiTools.sentimentScore': "Sentiment:",
      'aiTools.chatAssistant': "AI Chat Assistant",
      'aiTools.noMessages': "No messages yet.",
      'aiTools.you': "You",
      'aiTools.ai': "AI",
      'aiTools.chatError': "Failed to get chat response.",
      'aiTools.typeMessage': "Type your message",
      'aiTools.sending': "Sending...",
      'aiTools.send': "Send",
    },
    fr: {
      allFieldsRequired: "Tous les champs sont requis.",
      analyzeError: "Échec de l'analyse des données.",
      analyzing: "Analyse en cours...",
      analyze: "Analyser",
      checking: "Vérification...",
      checkAttrition: "Vérifier l'attrition",
      noResults: "Aucun résultat disponible.",
      error: "Erreur",
      // Added keys
      'common.backToPortal': "Retour au portail",
      'common.home': "Accueil",
      'common.error': "Erreur",
      'aiTools.title': "Outils IA",
      'aiTools.resumeMatch': "Comparateur de CV",
      'aiTools.uploadResume': "Télécharger le CV",
      'aiTools.jobDescription': "Description du poste",
      'aiTools.analyzeError': "Échec de l'analyse des données.",
      'aiTools.analyzing': "Analyse en cours...",
      'aiTools.analyze': "Analyser",
      'aiTools.attritionCheck': "Vérificateur de risque d'attrition",
      'aiTools.checkError': "Échec de la vérification du risque d'attrition.",
      'aiTools.checking': "Vérification...",
      'aiTools.checkAttrition': "Vérifier l'attrition",
      'aiTools.riskLevel': "Niveau de risque :",
      'aiTools.riskScore': "Score de risque :",
      'aiTools.riskFactors': "Facteurs de risque :",
      'aiTools.trainingRecommend': "Recommandation de formation",
      'aiTools.recommendError': "Échec de la recommandation.",
      'aiTools.recommending': "Recommandation...",
      'aiTools.recommendTraining': "Recommander une formation",
      'aiTools.recommendations': "Cours recommandés :",
      'aiTools.sentimentAnalysis': "Analyse de sentiment",
      'aiTools.textToAnalyze': "Texte à analyser",
      'aiTools.analyzeSentiment': "Analyser le sentiment",
      'aiTools.sentimentScore': "Sentiment :",
      'aiTools.chatAssistant': "Assistant IA",
      'aiTools.noMessages': "Aucun message pour le moment.",
      'aiTools.you': "Vous",
      'aiTools.ai': "IA",
      'aiTools.chatError': "Échec de la réponse du chat.",
      'aiTools.typeMessage': "Tapez votre message",
      'aiTools.sending': "Envoi...",
      'aiTools.send': "Envoyer",
    },
  };
  const { language } = useLanguage();
  // Update the translation function to accept all keys
  const t = (key: keyof typeof translations["en"]) => translations[language][key] || translations.en[key] || key;

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      {/* Header with back button */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => navigate(getPortalPath())}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{t("common.backToPortal")}</span>
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="flex items-center space-x-2"
          >
            <Home className="h-4 w-4" />
            <span>{t("common.home")}</span>
          </Button>
        </div>
        <h1 className="text-3xl font-bold">{t("aiTools.title")}</h1>
      </div>
      
      {/* Resume Matcher */}
      <Card>
        <CardHeader>
          <CardTitle>{t("aiTools.resumeMatch")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Textarea
            placeholder={`${t("aiTools.uploadResume")}

Sample Resume:
Experienced software engineer with 5 years of experience in JavaScript, React, Node.js, and MongoDB. Led development of multiple web applications and managed teams of 3-5 developers. Strong problem-solving skills and experience with agile methodologies.`}
            value={resume}
            onChange={e => setResume(e.target.value)}
            rows={6}
          />
          <Textarea
            placeholder={`${t("aiTools.jobDescription")}

Sample Job Description:
We are looking for a senior software engineer with experience in JavaScript, React, Node.js, and MongoDB. The ideal candidate should have 3+ years of experience and team leadership skills. Responsibilities include leading development teams, architecting solutions, and mentoring junior developers.`}
            value={jobDesc}
            onChange={e => setJobDesc(e.target.value)}
            rows={6}
          />
          <Button
            onClick={async () => {
              setResumeLoading(true);
              setResumeResult(null);
              try {
                const result = await matchResume(resume, jobDesc);
                setResumeResult(result);
              } catch (err: any) {
                toast({ title: t("common.error"), description: err.message || t("aiTools.analyzeError"), variant: "destructive" });
              } finally {
                setResumeLoading(false);
              }
            }}
            disabled={resumeLoading}
          >
            {resumeLoading ? t("aiTools.analyzing") : t("aiTools.analyze")}
          </Button>
          {resumeResult && (
            <div className="mt-2 p-4 bg-muted rounded">
              <div className="text-lg font-semibold mb-2">Resume Match Results:</div>
              <div className="space-y-2">
                <div><strong>Match Score:</strong> {resumeResult.score ? Math.round(resumeResult.score * 100) : resumeResult.matchPercentage || 0}%</div>
                {resumeResult.matchedKeywords && (
                  <div><strong>Matched Keywords:</strong> {resumeResult.matchedKeywords} out of {resumeResult.totalKeywords}</div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Attrition Risk Checker */}
      <Card>
        <CardHeader>
          <CardTitle>{t("aiTools.attritionCheck")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {/* New Form Fields for Attrition Risk */}
          <div className="grid grid-cols-2 gap-2">
            <Input type="number" placeholder={fieldLabels.age} value={attritionForm.age} onChange={e => setAttritionForm(f => ({ ...f, age: e.target.value }))} />
            <Input placeholder={fieldLabels.department} value={attritionForm.department} onChange={e => setAttritionForm(f => ({ ...f, department: e.target.value }))} />
            <Input type="number" placeholder={fieldLabels.yearsAtCompany} value={attritionForm.yearsAtCompany} onChange={e => setAttritionForm(f => ({ ...f, yearsAtCompany: e.target.value }))} />
            <Input placeholder={fieldLabels.performance} value={attritionForm.performance} onChange={e => setAttritionForm(f => ({ ...f, performance: e.target.value }))} />
            <Input type="number" placeholder={fieldLabels.salary} value={attritionForm.salary} onChange={e => setAttritionForm(f => ({ ...f, salary: e.target.value }))} />
            <Input type="number" placeholder={fieldLabels.jobSatisfaction} value={attritionForm.jobSatisfaction} onChange={e => setAttritionForm(f => ({ ...f, jobSatisfaction: e.target.value }))} />
            <Input type="number" placeholder={fieldLabels.workLifeBalance} value={attritionForm.workLifeBalance} onChange={e => setAttritionForm(f => ({ ...f, workLifeBalance: e.target.value }))} />
            <Input type="number" placeholder={fieldLabels.managerRating} value={attritionForm.managerRating} onChange={e => setAttritionForm(f => ({ ...f, managerRating: e.target.value }))} />
            <Input type="date" placeholder={fieldLabels.lastPromotion} value={attritionForm.lastPromotion} onChange={e => setAttritionForm(f => ({ ...f, lastPromotion: e.target.value }))} />
            <Input type="number" placeholder={fieldLabels.trainingCompleted} value={attritionForm.trainingCompleted} onChange={e => setAttritionForm(f => ({ ...f, trainingCompleted: e.target.value }))} />
          </div>
          <Button
            onClick={async () => {
              setAttritionLoading(true);
              setAttritionResult(null);
              try {
                const inputData = {
                  age: Number(attritionForm.age),
                  department: attritionForm.department,
                  yearsAtCompany: Number(attritionForm.yearsAtCompany),
                  performance: attritionForm.performance,
                  salary: Number(attritionForm.salary),
                  jobSatisfaction: Number(attritionForm.jobSatisfaction),
                  workLifeBalance: Number(attritionForm.workLifeBalance),
                  managerRating: Number(attritionForm.managerRating),
                  lastPromotion: attritionForm.lastPromotion,
                  trainingCompleted: Number(attritionForm.trainingCompleted),
                };
                const result = await predictAttrition(inputData);
                setAttritionResult(result.data);
              } catch (err: any) {
                toast({ title: t("common.error"), description: err.message || t("aiTools.checkError"), variant: "destructive" });
              } finally {
                setAttritionLoading(false);
              }
            }}
            disabled={attritionLoading}
          >
            {attritionLoading ? t("aiTools.checking") : t("aiTools.checkAttrition")}
          </Button>
          {attritionResult && (
            <div className="mt-2 p-4 bg-muted rounded">
              <div className="text-lg font-semibold mb-2">{t("aiTools.attritionCheck")}</div>
              <div className="space-y-2">
                {attritionResult.risk ? (
                  <div className="flex items-center gap-2">
                    <strong>{t("aiTools.riskLevel") || "Risk Level:"}</strong>
                    <span className={`font-bold ${attritionResult.risk === 'high' ? 'text-red-600' : attritionResult.risk === 'medium' ? 'text-yellow-600' : 'text-green-600'}`}>{attritionResult.risk?.toUpperCase()}</span>
                    {attritionResult.risk === 'low' && (
                      <svg className="inline h-5 w-5 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    )}
                  </div>
                ) : (
                  <div className="text-muted-foreground">No risk level returned.</div>
                )}
                {attritionResult.riskScore !== undefined ? (
                  <div>
                    <strong>{t("aiTools.riskScore") || "Risk Score:"}</strong> {Math.abs(attritionResult.riskScore) <= 1 ? Math.round(attritionResult.riskScore * 100) : Math.round(attritionResult.riskScore)}%
                  </div>
                ) : (
                  <div className="text-muted-foreground">No risk score returned.</div>
                )}
                {attritionResult.riskFactors && attritionResult.riskFactors.length > 0 && (
                  <div>
                    <strong>{t("aiTools.riskFactors") || "Risk Factors:"}</strong>
                    <ul className="list-disc list-inside ml-2">
                      {attritionResult.riskFactors.map((factor, idx) => (
                        <li key={idx} className="text-sm">{factor}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Training Recommender */}
      <Card>
        <CardHeader>
          <CardTitle>{t("aiTools.trainingRecommend")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {/* New Form Fields for Training Recommendation */}
          <div className="grid grid-cols-2 gap-2">
            <Input placeholder={fieldLabels.position} value={trainingForm.position} onChange={e => setTrainingForm(f => ({ ...f, position: e.target.value }))} />
            <Input placeholder={fieldLabels.department} value={trainingForm.department} onChange={e => setTrainingForm(f => ({ ...f, department: e.target.value }))} />
            <Input type="number" placeholder={fieldLabels.yearsOfExperience} value={trainingForm.yearsOfExperience} onChange={e => setTrainingForm(f => ({ ...f, yearsOfExperience: e.target.value }))} />
            <Input placeholder={fieldLabels.performance} value={trainingForm.performance} onChange={e => setTrainingForm(f => ({ ...f, performance: e.target.value }))} />
            <Input placeholder={fieldLabels.education} value={trainingForm.education} onChange={e => setTrainingForm(f => ({ ...f, education: e.target.value }))} />
            <Input placeholder={fieldLabels.skills} value={trainingForm.skills} onChange={e => setTrainingForm(f => ({ ...f, skills: e.target.value }))} />
            <Input placeholder={fieldLabels.goals} value={trainingForm.goals} onChange={e => setTrainingForm(f => ({ ...f, goals: e.target.value }))} />
          </div>
          <Button
            onClick={async () => {
              setTrainingLoading(true);
              setTrainingResult(null);
              try {
                const employeeData = {
                  position: trainingForm.position,
                  department: trainingForm.department,
                  yearsOfExperience: Number(trainingForm.yearsOfExperience),
                  skills: trainingForm.skills.split(',').map(s => s.trim()).filter(Boolean),
                  performance: trainingForm.performance,
                  education: trainingForm.education,
                  goals: trainingForm.goals.split(',').map(g => g.trim()).filter(Boolean),
                };
                const result = await getTrainingRecommendations(employeeData);
                setTrainingResult(result);
              } catch (err: any) {
                toast({ title: t("common.error"), description: err.message || t("aiTools.recommendError"), variant: "destructive" });
              } finally {
                setTrainingLoading(false);
              }
            }}
            disabled={trainingLoading}
          >
            {trainingLoading ? t("aiTools.recommending") : t("aiTools.recommendTraining")}
          </Button>
          {trainingResult && (
            <div className="mt-2 p-4 bg-muted rounded">
              <div className="text-lg font-semibold mb-2">{t("aiTools.trainingRecommend")}</div>
              <div className="space-y-2">
                {(() => {
                  const recommended = trainingResult.recommended || (trainingResult.data && trainingResult.data.recommended);
                  if (recommended && recommended.length > 0) {
                    return (
                      <div>
                        <strong>{t("aiTools.recommendations") || "Recommended Courses:"}</strong>
                        <ul className="list-decimal list-inside ml-2">
                          {recommended.map((course, idx) => (
                            <li key={idx} className="text-sm">{course}</li>
                          ))}
                        </ul>
                      </div>
                    );
                  } else {
                    return <div className="text-muted-foreground">{t("noResults") || "No specific recommendations available."}</div>;
                  }
                })()}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sentiment Analyzer */}
      <Card>
        <CardHeader>
          <CardTitle>{t("aiTools.sentimentAnalysis")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Textarea
            placeholder={`${t("aiTools.textToAnalyze")}

Sample Text:
I absolutely love working here! The team is amazing and the work environment is fantastic. I feel valued and supported in my role. The management is very supportive and the benefits are great.`}
            value={sentimentText}
            onChange={e => setSentimentText(e.target.value)}
            rows={6}
          />
          <Button
            onClick={async () => {
              setSentimentLoading(true);
              setSentimentResult(null);
              try {
                const result = await analyzeSentiment(sentimentText);
                setSentimentResult(result);
              } catch (err: any) {
                toast({ title: t("common.error"), description: err.message || t("aiTools.analyzeError"), variant: "destructive" });
              } finally {
                setSentimentLoading(false);
              }
            }}
            disabled={sentimentLoading}
          >
            {sentimentLoading ? t("aiTools.analyzing") : t("aiTools.analyzeSentiment")}
          </Button>
          {sentimentResult && (
            <div className="mt-2 p-4 bg-muted rounded">
              <div className="text-lg font-semibold mb-2">{t("aiTools.sentimentAnalysis")}</div>
              <div className="space-y-2">
                {(() => {
                  const sentiment = sentimentResult.sentiment || (sentimentResult.data && sentimentResult.data.sentiment);
                  if (sentiment) {
                    return (
                      <div><strong>{t("aiTools.sentimentScore") || "Sentiment:"}</strong> <span className={`font-bold ${sentiment === 'positive' ? 'text-green-600' : sentiment === 'negative' ? 'text-red-600' : 'text-yellow-600'}`}>{sentiment.toUpperCase()}</span></div>
                    );
                  } else {
                    return <div className="text-muted-foreground">{t("noResults") || "No sentiment result available."}</div>;
                  }
                })()}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Chat Assistant */}
      <Card>
        <CardHeader>
          <CardTitle>{t("aiTools.chatAssistant") || "AI Chat Assistant"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="h-48 overflow-y-auto bg-muted rounded p-2 mb-2">
            {chatHistory.length === 0 && <div className="text-muted-foreground">{t("aiTools.noMessages")}</div>}
            {chatHistory.map((msg, idx) => (
              <div key={idx} className={msg.role === "user" ? "text-right" : "text-left"}>
                <span className={msg.role === "user" ? "font-semibold" : "font-normal"}>
                  {msg.role === "user" ? t("aiTools.you") : t("aiTools.ai")}:
                </span>
                {msg.message}
              </div>
            ))}
          </div>
          <form
            onSubmit={async e => {
              e.preventDefault();
              if (!chatInput.trim()) return;
              await sendChat(chatInput);
            }}
            className="flex gap-2"
          >
            <Input
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              placeholder={`${t("aiTools.typeMessage")}`}
              disabled={chatLoading}
            />
            <Button type="submit" disabled={chatLoading}>
              {chatLoading ? t("aiTools.sending") : t("aiTools.send")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 