'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { Card, CardContent } from '@/components/ui/Card';
import api from '@/lib/api';
import { Payment } from '@/types';
import { formatPrice } from '@/lib/utils';

export default function AdminPaymentsPage() {
  const router = useRouter();
  const { isAuthenticated, user, checkAuth } = useAuthStore();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'ADMIN') {
      router.push('/');
      return;
    }
    fetchPayments();
  }, [isAuthenticated, user, router]);

  const fetchPayments = async () => {
    try {
      const response = await api.get('/payments/all');
      setPayments(response.data.payments || []);
    } catch (error) {
      console.error('Ошибка загрузки платежей:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-700';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700';
      case 'FAILED':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'Оплачен';
      case 'PENDING':
        return 'В ожидании';
      case 'FAILED':
        return 'Ошибка';
      case 'REFUNDED':
        return 'Возврат';
      default:
        return status;
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Загрузка...</div>;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold">💳 Управление платежами</h1>
          <Link href="/admin" className="text-sm text-primary hover:underline">
            ← Назад в админку
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="py-4">
              <p className="text-sm text-muted-foreground">Всего платежей</p>
              <p className="text-2xl font-bold">{payments.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <p className="text-sm text-muted-foreground">Успешных</p>
              <p className="text-2xl font-bold text-green-600">
                {payments.filter((p) => p.status === 'COMPLETED').length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <p className="text-sm text-muted-foreground">Общая сумма</p>
              <p className="text-2xl font-bold">
                {formatPrice(
                  payments
                    .filter((p) => p.status === 'COMPLETED')
                    .reduce((sum, p) => sum + p.amount, 0)
                )}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4">
          {payments.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Платежей пока нет
              </CardContent>
            </Card>
          ) : (
            payments.map((payment) => (
              <Card key={payment.id}>
                <CardContent className="py-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 text-xs rounded ${getStatusColor(payment.status)}`}>
                          {getStatusText(payment.status)}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {payment.paymentSystem}
                        </span>
                      </div>
                      <p className="font-semibold text-lg mb-1">
                        {formatPrice(payment.amount, payment.currency)}
                      </p>
                      {payment.course && (
                        <p className="text-sm text-muted-foreground mb-1">
                          Курс: {payment.course.title}
                        </p>
                      )}
                      {payment.transactionId && (
                        <p className="text-xs text-muted-foreground">
                          ID транзакции: {payment.transactionId}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {new Date(payment.createdAt).toLocaleString('ru-RU')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}



