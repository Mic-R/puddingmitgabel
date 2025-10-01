'use client';

import { useState } from 'react';
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
  Checkbox,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, isOrganizer }),
      });

      const data = await response.json();

      if (!response.ok) {
        notifications.show({
          title: 'Fehler',
          message: data.error || 'Registrierung fehlgeschlagen.',
          color: 'red',
        });
      } else {
        notifications.show({
          title: 'Erfolg',
          message: 'Registrierung erfolgreich! Du kannst dich jetzt anmelden.',
          color: 'green',
        });
        router.push('/auth/signin');
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
              Registrieren
            </Title>
            <form onSubmit={handleSubmit}>
              <Stack gap="md">
                <TextInput
                  label="Name"
                  placeholder="Dein Name"
                  value={name}
                  onChange={(e) => setName(e.currentTarget.value)}
                />
                <TextInput
                  label="Email"
                  placeholder="deine@email.de"
                  type="email"
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
                <Checkbox
                  label="Als Organisator registrieren"
                  checked={isOrganizer}
                  onChange={(e) => setIsOrganizer(e.currentTarget.checked)}
                />
                <Button type="submit" loading={loading} fullWidth>
                  Registrieren
                </Button>
              </Stack>
            </form>
            <Text size="sm" className="text-center">
              Bereits ein Konto?{' '}
              <Link href="/auth/signin" className="text-blue-600 hover:underline">
                Jetzt anmelden
              </Link>
            </Text>
          </Stack>
        </Paper>
      </Container>
    </div>
  );
}
