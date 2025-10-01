'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Paper,
  Title,
  TextInput,
  Textarea,
  Button,
  Stack,
  Text,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import Link from 'next/link';

export default function CreateEventPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  if (status === 'loading') {
    return <div>Lädt...</div>;
  }

  if (!session) {
    router.push('/auth/signin');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, location, date, imageUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        notifications.show({
          title: 'Fehler',
          message: data.error || 'Event konnte nicht erstellt werden.',
          color: 'red',
        });
      } else {
        notifications.show({
          title: 'Erfolg',
          message: 'Event wurde erstellt und wartet auf Freigabe!',
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4">
      <Container size="sm" className="py-16">
        <Paper shadow="md" p="xl" radius="md" className="bg-white">
          <Stack gap="md">
            <Title order={2}>Neues Event erstellen</Title>
            <Text c="dimmed">
              Erstelle ein neues Pudding-mit-Gabel Event. Das Event muss manuell von einem
              Admin freigegeben werden, bevor es sichtbar wird.
            </Text>
            <form onSubmit={handleSubmit}>
              <Stack gap="md">
                <TextInput
                  label="Titel"
                  placeholder="z.B. Pudding-Gabel-Treffen im Park"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.currentTarget.value)}
                />
                <Textarea
                  label="Beschreibung"
                  placeholder="Beschreibe dein Event..."
                  required
                  minRows={4}
                  value={description}
                  onChange={(e) => setDescription(e.currentTarget.value)}
                />
                <TextInput
                  label="Ort"
                  placeholder="z.B. Stadtpark, Berlin"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.currentTarget.value)}
                />
                <TextInput
                  label="Datum"
                  type="datetime-local"
                  required
                  value={date}
                  onChange={(e) => setDate(e.currentTarget.value)}
                />
                <TextInput
                  label="Bild-URL (optional)"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.currentTarget.value)}
                />
                <Button type="submit" loading={loading} fullWidth>
                  Event erstellen
                </Button>
                <Link href="/events">
                  <Button variant="subtle" fullWidth>
                    Abbrechen
                  </Button>
                </Link>
              </Stack>
            </form>
          </Stack>
        </Paper>
      </Container>
    </div>
  );
}
