/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  resumeMatch,
  attritionCheck,
  trainingRecommend,
  sentimentAnalysis,
  chatAssistant,
} from "@/lib/api";

export default function AITools() {
  const { t } = useLanguage();
  const token = localStorage.getItem('token');
  
  // Resume Matcher
  const [resume, setResume] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [resumeResult, setResumeResult] = useState<any>(null);
  const [resumeLoading, setResumeLoading] = useState(false);

  // Attrition Risk
  const [attritionInput, setAttritionInput] = useState("");
  const [attritionResult, setAttritionResult] = useState<any>(null);
  const [attritionLoading, setAttritionLoading] = useState(false);

  // Training Recommender
  const [trainingInput, setTrainingInput] = useState("");
  const [trainingResult, setTrainingResult] = useState<any>(null);
  const [trainingLoading, setTrainingLoading] = useState(false);

  // Sentiment Analyzer
  const [sentimentText, setSentimentText] = useState("");
  const [sentimentResult, setSentimentResult] = useState<any>(null);
  const [sentimentLoading, setSentimentLoading] = useState(false);

  // AI Chat Assistant
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<{ role: string; message: string }[]>([]);
  const [chatLoading, setChatLoading] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <h1 className="text-3xl font-bold mb-4">{t("aiTools.title")}</h1>
      
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
                const result = await resumeMatch(resume, jobDesc, token!);
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
            <div className="mt-2 p-2 bg-muted rounded">
              <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(resumeResult, null, 2)}</pre>
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
          <Textarea
            placeholder={`${t("aiTools.employeeDataJson")}

Sample Employee Data:
{
  "age": 30,
  "department": "Engineering",
  "yearsAtCompany": 3,
  "performance": "good",
  "salary": 75000,
  "jobSatisfaction": 4,
  "workLifeBalance": 3,
  "managerRating": 4,
  "lastPromotion": "2023-01-15",
  "trainingCompleted": 5
}`}
            value={attritionInput}
            onChange={e => setAttritionInput(e.target.value)}
            rows={8}
          />
          <Button
            onClick={async () => {
              setAttritionLoading(true);
              setAttritionResult(null);
              try {
                const inputData = JSON.parse(attritionInput);
                const result = await attritionCheck(inputData, token!);
                setAttritionResult(result);
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
            <div className="mt-2 p-2 bg-muted rounded">
              <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(attritionResult, null, 2)}</pre>
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
          <Textarea
            placeholder={`${t("aiTools.employeeDataJson")}

Sample Employee Data:
{
  "position": "Software Engineer",
  "department": "Engineering",
  "yearsOfExperience": 3,
  "skills": ["JavaScript", "React", "Node.js"],
  "performance": "good",
  "education": "Bachelor's Degree",
  "goals": ["Technical Leadership", "Full Stack Development"]
}`}
            value={trainingInput}
            onChange={e => setTrainingInput(e.target.value)}
            rows={8}
          />
          <Button
            onClick={async () => {
              setTrainingLoading(true);
              setTrainingResult(null);
              try {
                const employeeData = JSON.parse(trainingInput);
                const result = await trainingRecommend(employeeData, token!);
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
            <div className="mt-2 p-2 bg-muted rounded">
              <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(trainingResult, null, 2)}</pre>
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
                const result = await sentimentAnalysis(sentimentText, token!);
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
            <div className="mt-2 p-2 bg-muted rounded">
              <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(sentimentResult, null, 2)}</pre>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Chat Assistant */}
      <Card>
        <CardHeader>
          <CardTitle>{t("aiTools.chatAssistant")}</CardTitle>
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
              setChatLoading(true);
              setChatHistory(h => [...h, { role: "user", message: chatInput }]);
              try {
                const result = await chatAssistant(chatInput, token!);
                setChatHistory(h => [...h, { role: "ai", message: result.answer || JSON.stringify(result) }]);
                setChatInput("");
              } catch (err: any) {
                toast({ title: t("common.error"), description: err.message || t("aiTools.chatError"), variant: "destructive" });
              } finally {
                setChatLoading(false);
              }
            }}
            className="flex gap-2"
          >
            <Input
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              placeholder={`${t("aiTools.typeMessage")} (e.g., "How do I request time off?")`}
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