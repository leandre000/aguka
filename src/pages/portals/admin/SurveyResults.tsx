/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart } from "lucide-react";
import { getSurveys } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { EmployeePortalLayout } from "@/components/layouts/EmployeePortalLayout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function SurveyResults() {
  const { user } = useAuth();
  const isHR = user?.role === "hr" || user?.role === "admin";
  const [surveys, setSurveys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isHR) return;
    setLoading(true);
    getSurveys()
      .then(res => setSurveys(res.data || res))
      .catch(err => setError(err.message || "Failed to load surveys"))
      .finally(() => setLoading(false));
  }, [isHR]);

  if (!isHR) {
    return <div className="p-8 text-center text-red-600">Access denied. HR only.</div>;
  }

  return (
    <EmployeePortalLayout>
      <div className="space-y-6 p-4 md:p-6">
        <Button className="mb-4" onClick={() => navigate('/admin-portal/succession-planning')}>
          Manage Succession Plans
        </Button>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart className="h-5 w-5 mr-2" />
              Survey Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading survey results...</div>
            ) : error ? (
              <div className="text-center text-red-600 py-8">{error}</div>
            ) : (
              <div className="space-y-4">
                {surveys.length === 0 ? (
                  <div className="text-center text-muted-foreground">No survey results yet.</div>
                ) : (
                  surveys.map((survey: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{survey.submittedBy?.Names || "Anonymous"}</p>
                        <p className="text-sm text-muted-foreground">{survey.surveyData?.overall ? `Score: ${survey.surveyData.overall}/10` : "No score"}</p>
                      </div>
                      <Badge variant="secondary">{survey.surveyData?.workLife || "-"}</Badge>
                    </div>
                  ))
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </EmployeePortalLayout>
  );
} 