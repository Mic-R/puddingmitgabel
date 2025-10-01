'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  Container,
  Title,
  Card,
  Text,
  Button,
  Stack,
  Group,
  Badge,
  Grid,
} from '@mantine/core';
import Link from 'next/link';
import { notifications } from '@mantine/notifications';

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
}

export default function EventsPage() {
  const { data: session } = useSession();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      const data = await response.json();
      setEvents(data.events);
    } catch (error) {
      notifications.show({
        title: 'Fehler',
        message: 'Events konnten nicht geladen werden.',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <Container size="lg" className="py-16">
        <Stack gap="xl">
          <Group justify="space-between">
            <Title order={1}>🥄 Events</Title>
            <Group>
              <Link href="/">
                <Button variant="subtle">Startseite</Button>
              </Link>
              {session ? (
                <>
                  <Link href="/events/create">
                    <Button variant="gradient" gradient={{ from: 'pink', to: 'purple' }}>
                      Event erstellen
                    </Button>
                  </Link>
                  <Link href="/cms">
                    <Button variant="outline">CMS</Button>
                  </Link>
                </>
              ) : (
                <Link href="/auth/signin">
                  <Button variant="filled">Anmelden</Button>
                </Link>
              )}
            </Group>
          </Group>

          {loading ? (
            <Text>Lade Events...</Text>
          ) : events.length === 0 ? (
            <Card shadow="md" padding="xl" radius="md" className="bg-white">
              <Text>Noch keine Events vorhanden.</Text>
            </Card>
          ) : (
            <Grid>
              {events.map((event) => (
                <Grid.Col key={event.id} span={{ base: 12, sm: 6, md: 4 }}>
                  <Card
                    shadow="md"
                    padding="lg"
                    radius="md"
                    className="bg-white h-full flex flex-col"
                  >
                    <Stack gap="sm" className="flex-1">
                      <Group justify="space-between">
                        <Badge color="green">{event.status}</Badge>
                        <Text size="sm" c="dimmed">
                          {new Date(event.date).toLocaleDateString('de-DE')}
                        </Text>
                      </Group>
                      <Title order={3} size="h4">
                        {event.title}
                      </Title>
                      <Text size="sm" c="dimmed">
                        📍 {event.location}
                      </Text>
                      <Text size="sm" lineClamp={3}>
                        {event.description}
                      </Text>
                      <Text size="xs" c="dimmed">
                        Organisiert von: {event.organizer.name || event.organizer.email}
                      </Text>
                      <Link href={`/events/${event.id}`}>
                        <Button variant="light" fullWidth>
                          Details
                        </Button>
                      </Link>
                    </Stack>
                  </Card>
                </Grid.Col>
              ))}
            </Grid>
          )}
        </Stack>
      </Container>
    </div>
  );
}
