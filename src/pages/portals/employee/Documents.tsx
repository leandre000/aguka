import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format, isBefore, parseISO } from 'date-fns';

interface Document {
  _id: string;
  type: string;
  fileUrl: string;
  expiryDate?: string;
}

const DOCUMENT_TYPES = [
  { value: 'contract', label: 'Contract' },
  { value: 'id', label: 'ID' },
  { value: 'certificate', label: 'Certificate' },
];

export default function Documents() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [docType, setDocType] = useState('contract');
  const [expiryDate, setExpiryDate] = useState('');

  useEffect(() => {
    fetchDocuments();
  }, []);

  async function fetchDocuments() {
    setLoading(true);
    try {
      const res = await fetch(`/api/employees/${user._id}/documents`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await res.json();
      setDocuments(data.documents || []);
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to load documents', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('documents', file);
      formData.append('type', docType);
      if (expiryDate) formData.append('expiryDate', expiryDate);
      const res = await fetch(`/api/employees/${user._id}/documents`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: formData,
      });
      if (!res.ok) throw new Error('Upload failed');
      toast({ title: 'Success', description: 'Document uploaded' });
      setFile(null);
      setExpiryDate('');
      fetchDocuments();
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to upload document', variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card>
        <CardTitle className="mb-4">My Documents</CardTitle>
        <CardContent>
          <form onSubmit={handleUpload} className="flex flex-col gap-4 mb-6">
            <div>
              <Label htmlFor="docType">Document Type</Label>
              <select id="docType" value={docType} onChange={e => setDocType(e.target.value)} className="w-full border rounded p-2">
                {DOCUMENT_TYPES.map(dt => (
                  <option key={dt.value} value={dt.value}>{dt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="expiryDate">Expiry Date (optional)</Label>
              <Input id="expiryDate" type="date" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="file">Upload File</Label>
              <Input id="file" type="file" accept="application/pdf,image/*" onChange={e => setFile(e.target.files?.[0] || null)} required />
            </div>
            <Button type="submit" disabled={uploading}>{uploading ? 'Uploading...' : 'Upload'}</Button>
          </form>
          <div>
            <h3 className="font-semibold mb-2">Uploaded Documents</h3>
            {loading ? (
              <div>Loading...</div>
            ) : documents.length === 0 ? (
              <div>No documents uploaded.</div>
            ) : (
              <ul className="space-y-2">
                {documents.map(doc => (
                  <li key={doc._id} className="flex items-center gap-4 border-b pb-2">
                    <span className="w-32 font-medium">{doc.type}</span>
                    {doc.expiryDate && (
                      <span className={
                        isBefore(parseISO(doc.expiryDate), new Date())
                          ? 'text-red-600 font-bold'
                          : 'text-yellow-600'
                      }>
                        Expiry: {format(parseISO(doc.expiryDate), 'yyyy-MM-dd')}
                        {isBefore(parseISO(doc.expiryDate), new Date()) ? ' (Expired)' : ''}
                      </span>
                    )}
                    <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline ml-auto">Download</a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 