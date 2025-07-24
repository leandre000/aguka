import { useEffect, useState } from 'react';
import { getMyContracts } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { EmployeePortalLayout } from '@/components/layouts/EmployeePortalLayout';
import { format } from 'date-fns';

export default function EmployeeContracts() {
  const { t } = useLanguage();
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyContracts()
      .then((res) => setContracts(res.data || res))
      .catch(() => setContracts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <EmployeePortalLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">{t('employee.contracts')}</h1>
        {loading ? (
          <div>Loading...</div>
        ) : contracts.length === 0 ? (
          <div>{t('employee.noContracts')}</div>
        ) : (
          <div className="grid gap-4">
            {contracts.map((contract) => (
              <Card key={contract._id}>
                <CardHeader>
                  <CardTitle>
                    {t('employee.contractType')}: {contract.contractType} | {t('employee.status')}: {contract.status}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <strong>{t('employee.startDate')}:</strong> {contract.startDate ? format(new Date(contract.startDate), 'yyyy-MM-dd') : '-'}
                  </div>
                  <div>
                    <strong>{t('employee.endDate')}:</strong> {contract.endDate ? format(new Date(contract.endDate), 'yyyy-MM-dd') : '-'}
                  </div>
                  {contract.terms && (
                    <div>
                      <strong>{t('employee.terms')}:</strong> {contract.terms}
                    </div>
                  )}
                  {contract.fileUrl && (
                    <div>
                      <a href={contract.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                        {t('employee.download')}
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </EmployeePortalLayout>
  );
} 