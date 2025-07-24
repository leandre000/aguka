/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DollarSign, Plus, Upload, Eye, Calendar } from "lucide-react";
import { EmployeePortalLayout } from "@/components/layouts/EmployeePortalLayout";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import { getExpenseClaims } from "@/lib/api";

export default function ExpenseClaims() {
  const { t } = useLanguage();
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewExpense, setViewExpense] = useState<any | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    category: "",
    amount: "",
    date: "",
    description: "",
    receipt: null as File | null,
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch expenses from backend
  const fetchExpenses = () => {
    setLoading(true);
    setError(null);
    getExpenseClaims()
      .then((data) => setExpenses(Array.isArray(data) ? data : data.data || []))
      .catch((err) => setError(err.message || t('employee.expenseClaims.failedToSave')))
      .finally(() => setLoading(false));
  };
  // Fetch on mount
  useEffect(() => { fetchExpenses(); }, []);

  return (
    <EmployeePortalLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{t('employee.expenseClaims.newExpenseClaim')}</h1>
          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                {t('employee.expenseClaims.newExpenseClaim')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{t('employee.expenseClaims.submitExpense')}</DialogTitle>
              </DialogHeader>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  // Validation
                  if (!form.category || !form.amount || !form.date || !form.description || !form.receipt) {
                    setFormError(t('employee.expenseClaims.allFieldsRequired'));
                    return;
                  }
                  if (isNaN(Number(form.amount)) || Number(form.amount) <= 0) {
                    setFormError(t('employee.expenseClaims.amountPositive'));
                    return;
                  }
                  setFormError(null);
                  setSubmitting(true);
                  try {
                    const data = new FormData();
                    data.append("category", form.category);
                    data.append("amount", form.amount);
                    data.append("date", form.date);
                    data.append("description", form.description);
                    if (form.receipt) data.append("receipt", form.receipt);
                    await axios.post("/expenses/create", data, {
                      headers: { "Content-Type": "multipart/form-data" },
                    });
                    toast({ title: t('employee.expenseClaims.claimSubmitted') });
                    setModalOpen(false);
                    setForm({ category: "", amount: "", date: "", description: "", receipt: null });
                    if (fileInputRef.current) fileInputRef.current.value = "";
                    fetchExpenses(); // Refetch expenses
                  } catch (err: any) {
                    toast({ title: t('employee.expenseClaims.error'), description: err.response?.data?.message || err.message || t('employee.expenseClaims.failedToSave'), variant: "destructive" });
                  } finally {
                    setSubmitting(false);
                  }
                }}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="category">{t('employee.expenseClaims.category')}</Label>
                  <Select value={form.category} onValueChange={val => setForm(f => ({ ...f, category: val }))}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('employee.expenseClaims.category')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="travel">Travel</SelectItem>
                      <SelectItem value="meals">Meals</SelectItem>
                      <SelectItem value="office">Office Supplies</SelectItem>
                      <SelectItem value="training">Training</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="amount">{t('employee.expenseClaims.amount')}</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      className="pl-10"
                      placeholder="0.00"
                      value={form.amount}
                      onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="date">{t('employee.expenseClaims.date')}</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="date"
                      type="date"
                      className="pl-10"
                      value={form.date}
                      onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">{t('employee.expenseClaims.description')}</Label>
                  <Textarea
                    id="description"
                    placeholder={t('employee.expenseClaims.description')}
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="receipt">{t('employee.expenseClaims.receipt')}</Label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Upload your receipt here
                    </p>
                    <Input
                      type="file"
                      accept="image/*,application/pdf"
                      ref={fileInputRef}
                      onChange={e => setForm(f => ({ ...f, receipt: e.target.files?.[0] || null }))}
                    />
                  </div>
                </div>

                {formError && <div className="text-red-600 text-sm text-center">{formError}</div>}

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" type="button" onClick={() => setModalOpen(false)} disabled={submitting}>{t('employee.expenseClaims.close')}</Button>
                  <Button type="submit" disabled={submitting}>{submitting ? t('employee.expenseClaims.submitting') : t('employee.expenseClaims.submitExpense')}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('employee.expenseClaims.amount')}
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${expenses.reduce((sum, expense) => sum + Number(expense.amount), 0).toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">This Month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('employee.expenseClaims.approved')}
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ${expenses.filter(e => e.status === "approved").reduce((sum, expense) => sum + Number(expense.amount), 0).toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                Ready for Reimbursement
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('employee.expenseClaims.pending')}
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                ${expenses.filter(e => e.status === "pending").reduce((sum, expense) => sum + Number(expense.amount), 0).toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">Under Review</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('employee.expenseClaims.history')}</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">{t('employee.expenseClaims.loading')}</div>
            ) : error ? (
              <div className="text-center text-red-600 py-8">{error}</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Receipt</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">
                      {t('employee.expenseClaims.actions')}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses.map((expense) => (
                    <TableRow key={expense.id || expense._id}>
                      <TableCell>{expense.date}</TableCell>
                      <TableCell className="capitalize">{expense.category}</TableCell>
                      <TableCell className="max-w-xs truncate">{expense.description}</TableCell>
                      <TableCell>${Number(expense.amount).toFixed(2)}</TableCell>
                      <TableCell>
                        {expense.receipt ? (
                          <Badge variant="outline" className="text-green-600">{t('employee.expenseClaims.uploaded')}</Badge>
                        ) : (
                          <Badge variant="outline" className="text-red-600">{t('employee.expenseClaims.missing')}</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            expense.status === "approved"
                              ? "default"
                              : expense.status === "pending"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {expense.status === "approved"
                            ? t('employee.expenseClaims.approved')
                            : expense.status === "pending"
                            ? t('employee.expenseClaims.pending')
                            : t('employee.expenseClaims.rejected')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" onClick={() => setViewExpense(expense)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Expense Details Modal */}
      <Dialog open={!!viewExpense} onOpenChange={open => !open && setViewExpense(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Expense Details</DialogTitle>
          </DialogHeader>
          {viewExpense && (
            <div className="space-y-2">
              <div><strong>Date:</strong> {viewExpense.date}</div>
              <div><strong>Category:</strong> {viewExpense.category}</div>
              <div><strong>Amount:</strong> ${Number(viewExpense.amount).toFixed(2)}</div>
              <div><strong>Description:</strong> {viewExpense.description}</div>
              <div><strong>Status:</strong> {viewExpense.status}</div>
              <div><strong>Receipt:</strong> {viewExpense.receipt ? (
                <a href={typeof viewExpense.receipt === 'string' ? viewExpense.receipt : '#'} target="_blank" rel="noopener noreferrer">View Receipt</a>
              ) : 'None'}
              </div>
            </div>
          )}
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setViewExpense(null)}>{t('employee.expenseClaims.close')}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </EmployeePortalLayout>
  );
}
