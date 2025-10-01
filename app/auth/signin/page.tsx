'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Paper,
  Title,
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Text,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import Link from 'next/link';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        notifications.show({
          title: 'Fehler',
          message: 'Anmeldung fehlgeschlagen. Bitte überprüfe deine Daten.',
          color: 'red',
        });
      } else {
        notifications.show({
          title: 'Erfolg',
          message: 'Anmeldung erfolgreich!',
          color: 'green',
        });
        router.push('/events');
      }
    } catch (error) {
      notifications.show({
        title: 'Fehler',
        message: 'Ein Fehler ist aufgetreten.',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
      <Container size="xs">
        <Paper shadow="md" p="xl" radius="md" className="bg-white">
          <Stack gap="md">
            <Title order={2} className="text-center">
              Anmelden
            </Title>
            <form onSubmit={handleSubmit}>
              <Stack gap="md">
                <TextInput
                  label="Email"
                  placeholder="deine@email.de"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.currentTarget.value)}
                />
                <PasswordInput
                  label="Passwort"
                  placeholder="Dein Passwort"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.currentTarget.value)}
                />
                <Button type="submit" loading={loading} fullWidth>
                  Anmelden
                </Button>
              </Stack>
            </form>
            <Text size="sm" className="text-center">
              Noch kein Konto?{' '}
              <Link href="/auth/register" className="text-blue-600 hover:underline">
                Jetzt registrieren
              </Link>
            </Text>
          </Stack>
        </Paper>
      </Container>
    </div>
  );
}
