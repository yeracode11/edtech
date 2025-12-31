'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuthStore();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(email, password, firstName, lastName);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || t.common.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-3 sm:p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="pb-4 sm:pb-6">
          <CardTitle className="text-xl sm:text-2xl">{t.auth.register}</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            {t.auth.signUp}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-3 sm:space-y-4 pb-4 sm:pb-6">
            {error && (
              <div className="p-2.5 sm:p-3 bg-destructive/10 text-destructive text-xs sm:text-sm rounded-md">
                {error}
              </div>
            )}
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-xs sm:text-sm font-medium">{t.auth.firstName}</label>
              <Input
                type="text"
                placeholder={t.auth.firstName}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t.auth.lastName}</label>
              <Input
                type="text"
                placeholder={t.auth.lastName}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t.auth.email}</label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t.auth.password}</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-3 sm:gap-4 pt-4 sm:pt-6">
            <Button type="submit" className="w-full text-sm sm:text-base" disabled={loading}>
              {loading ? `${t.common.loading}` : t.auth.signUp}
            </Button>
            <p className="text-xs sm:text-sm text-center text-muted-foreground">
              {t.auth.haveAccount}{' '}
              <Link href="/auth/login" className="text-primary hover:underline font-medium">
                {t.auth.signIn}
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}



