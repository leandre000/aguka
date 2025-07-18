/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import {
  resumeMatch,
  attritionCheck,
  trainingRecommend,
  sentimentAnalysis,
  chatAssistant,
} from "@/lib/api";

export default function AITools() {
  // Resume Matcher
  const [resume, setResume] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [resumeResult, setResumeResult] = useState<any>(null);
  const [resumeLoading, setResumeLoading] = useState(false);

  // Attrition Risk
  const [attritionInput, setAttritionInput] = useState(`{
  "employeeId": "",
  "features": {
    "age": 30,
    "department": "Engineering"
  }
}`);
  const [attritionResult, setAttritionResult] = useState<any>(null);
  const [attritionLoading, setAttritionLoading] = useState(false);

  // Training Recommender
  const [trainingInput, setTrainingInput] = useState(`{
  "employeeId": "",
  "skills": ["React", "Node.js"]
}`);
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
      <h1 className="text-3xl font-bold mb-4">AI Tools</h1>
      {/* Resume Matcher */}
      <Card>
        <CardHeader>
          <CardTitle>Resume Matcher</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Textarea
            placeholder="Paste resume text here..."
            value={resume}
            onChange={e => setResume(e.target.value)}
            rows={4}
          />
          <Textarea
            placeholder="Paste job description here..."
            value={jobDesc}
            onChange={e => setJobDesc(e.target.value)}
            rows={4}
          />
          <Button
            onClick={async () => {
              setResumeLoading(true);
              setResumeResult(null);
              try {
                const result = await resumeMatch({ resumeText: resume, jobDescription: jobDesc });
                setResumeResult(result);
              } catch (err: any) {
                toast({ title: "Error", description: err.message || "Failed to match resume", variant: "destructive" });
              } finally {
                setResumeLoading(false);
              }
            }}
            disabled={resumeLoading}
          >
            {resumeLoading ? "Matching..." : "Match Resume"}
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
          <CardTitle>Attrition Risk Checker</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Textarea
            placeholder="Paste employee data as JSON..."
            value={attritionInput}
            onChange={e => setAttritionInput(e.target.value)}
            rows={6}
          />
          <Button
            onClick={async () => {
              setAttritionLoading(true);
              setAttritionResult(null);
              try {
                const inputData = JSON.parse(attritionInput);
                const result = await attritionCheck(inputData);
                setAttritionResult(result);
              } catch (err: any) {
                toast({ title: "Error", description: err.message || "Failed to check attrition", variant: "destructive" });
              } finally {
                setAttritionLoading(false);
              }
            }}
            disabled={attritionLoading}
          >
            {attritionLoading ? "Checking..." : "Check Attrition Risk"}
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
          <CardTitle>Training Recommender</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Textarea
            placeholder="Paste employee data as JSON..."
            value={trainingInput}
            onChange={e => setTrainingInput(e.target.value)}
            rows={6}
          />
          <Button
            onClick={async () => {
              setTrainingLoading(true);
              setTrainingResult(null);
              try {
                const employeeData = JSON.parse(trainingInput);
                const result = await trainingRecommend({ employeeData });
                setTrainingResult(result);
              } catch (err: any) {
                toast({ title: "Error", description: err.message || "Failed to recommend training", variant: "destructive" });
              } finally {
                setTrainingLoading(false);
              }
            }}
            disabled={trainingLoading}
          >
            {trainingLoading ? "Recommending..." : "Recommend Training"}
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
          <CardTitle>Sentiment Analyzer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Textarea
            placeholder="Paste text to analyze..."
            value={sentimentText}
            onChange={e => setSentimentText(e.target.value)}
            rows={4}
          />
          <Button
            onClick={async () => {
              setSentimentLoading(true);
              setSentimentResult(null);
              try {
                const result = await sentimentAnalysis({ text: sentimentText });
                setSentimentResult(result);
              } catch (err: any) {
                toast({ title: "Error", description: err.message || "Failed to analyze sentiment", variant: "destructive" });
              } finally {
                setSentimentLoading(false);
              }
            }}
            disabled={sentimentLoading}
          >
            {sentimentLoading ? "Analyzing..." : "Analyze Sentiment"}
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
          <CardTitle>AI Chat Assistant</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="h-48 overflow-y-auto bg-muted rounded p-2 mb-2">
            {chatHistory.length === 0 && <div className="text-muted-foreground">No messages yet.</div>}
            {chatHistory.map((msg, idx) => (
              <div key={idx} className={msg.role === "user" ? "text-right" : "text-left"}>
                <span className={msg.role === "user" ? "font-semibold" : "font-normal"}>
                  {msg.role === "user" ? "You: " : "AI: "}
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
                const result = await chatAssistant({ message: chatInput });
                setChatHistory(h => [...h, { role: "ai", message: result.response || JSON.stringify(result) }]);
                setChatInput("");
              } catch (err: any) {
                toast({ title: "Error", description: err.message || "Failed to chat with AI", variant: "destructive" });
              } finally {
                setChatLoading(false);
              }
            }}
            className="flex gap-2"
          >
            <Input
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              placeholder="Type your message..."
              disabled={chatLoading}
            />
            <Button type="submit" disabled={chatLoading || !chatInput.trim()}>
              {chatLoading ? "Sending..." : "Send"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 