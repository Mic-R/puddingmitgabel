'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import {
  Container,
  Paper,
  Title,
  Text,
  Button,
  Stack,
  Group,
  Textarea,
  Card,
  Divider,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import Link from 'next/link';

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    name: string;
  };
}

interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  status: string;
  organizer: {
    name: string;
    email: string;
  };
  comments: Comment[];
}

export default function EventDetailPage() {
  const { data: session } = useSession();
  const params = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchEvent();
    }
  }, [params.id]);

  const fetchEvent = async () => {
    try {
      const response = await fetch(`/api/events/${params.id}`);
      const data = await response.json();
      
      if (response.ok) {
        setEvent(data.event);
      } else {
        notifications.show({
          title: 'Fehler',
          message: 'Event konnte nicht geladen werden.',
          color: 'red',
        });
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

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      notifications.show({
        title: 'Fehler',
        message: 'Du musst angemeldet sein, um Kommentare zu schreiben.',
        color: 'red',
      });
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: comment, eventId: params.id }),
      });

      const data = await response.json();

      if (response.ok) {
        notifications.show({
          title: 'Erfolg',
          message: 'Kommentar wurde erfolgreich gepostet und wird moderiert!',
          color: 'green',
        });
        setComment('');
        fetchEvent(); // Reload event to show new comment if approved
      } else {
        notifications.show({
          title: 'Fehler',
          message: data.error || 'Kommentar konnte nicht gepostet werden.',
          color: 'red',
        });
      }
    } catch (error) {
      notifications.show({
        title: 'Fehler',
        message: 'Ein Fehler ist aufgetreten.',
        color: 'red',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div>Lädt...</div>;
  }

  if (!event) {
    return <div>Event nicht gefunden</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <Container size="md" className="py-16">
        <Stack gap="xl">
          <Group>
            <Link href="/events">
              <Button variant="subtle">← Zurück zu Events</Button>
            </Link>
          </Group>

          <Paper shadow="md" p="xl" radius="md" className="bg-white">
            <Stack gap="md">
              <Title order={1}>{event.title}</Title>
              <Group>
                <Text size="sm" c="dimmed">
                  📍 {event.location}
                </Text>
                <Text size="sm" c="dimmed">
                  📅 {new Date(event.date).toLocaleString('de-DE')}
                </Text>
              </Group>
              <Text>{event.description}</Text>
              <Text size="sm" c="dimmed">
                Organisiert von: {event.organizer.name || event.organizer.email}
              </Text>
            </Stack>
          </Paper>

          <Paper shadow="md" p="xl" radius="md" className="bg-white">
            <Stack gap="md">
              <Title order={2} size="h3">
                Kommentare ({event.comments.length})
              </Title>

              {session ? (
                <form onSubmit={handleSubmitComment}>
                  <Stack gap="md">
                    <Textarea
                      placeholder="Schreibe einen Kommentar..."
                      value={comment}
                      onChange={(e) => setComment(e.currentTarget.value)}
                      minRows={3}
                      required
                    />
                    <Button type="submit" loading={submitting}>
                      Kommentar posten
                    </Button>
                  </Stack>
                </form>
              ) : (
                <Text c="dimmed">
                  <Link href="/auth/signin" className="text-blue-600 hover:underline">
                    Melde dich an
                  </Link>
                  , um Kommentare zu schreiben.
                </Text>
              )}

              <Divider />

              {event.comments.length === 0 ? (
                <Text c="dimmed">Noch keine Kommentare.</Text>
              ) : (
                <Stack gap="md">
                  {event.comments.map((comment) => (
                    <Card key={comment.id} padding="md" radius="md" className="bg-gray-50">
                      <Stack gap="xs">
                        <Group justify="space-between">
                          <Text fw={600}>{comment.user.name || 'Anonym'}</Text>
                          <Text size="xs" c="dimmed">
                            {new Date(comment.createdAt).toLocaleString('de-DE')}
                          </Text>
                        </Group>
                        <Text>{comment.content}</Text>
                      </Stack>
                    </Card>
                  ))}
                </Stack>
              )}
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </div>
  );
}
