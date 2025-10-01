'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Title,
  Card,
  Text,
  Button,
  Stack,
  Group,
  Badge,
  Tabs,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import Link from 'next/link';

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

export default function CMSPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [pendingEvents, setPendingEvents] = useState<Event[]>([]);
  const [approvedEvents, setApprovedEvents] = useState<Event[]>([]);
  const [rejectedEvents, setRejectedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      fetchEvents();
    }
  }, [status]);

  const fetchEvents = async () => {
    try {
      const [pending, approved, rejected] = await Promise.all([
        fetch('/api/events?status=PENDING').then((r) => r.json()),
        fetch('/api/events?status=APPROVED').then((r) => r.json()),
        fetch('/api/events?status=REJECTED').then((r) => r.json()),
      ]);

      setPendingEvents(pending.events || []);
      setApprovedEvents(approved.events || []);
      setRejectedEvents(rejected.events || []);
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

  const handleApprove = async (id: string) => {
    try {
      const response = await fetch(`/api/events/${id}/approve`, {
        method: 'POST',
      });

      if (response.ok) {
        notifications.show({
          title: 'Erfolg',
          message: 'Event wurde freigegeben!',
          color: 'green',
        });
        fetchEvents();
      } else {
        const data = await response.json();
        notifications.show({
          title: 'Fehler',
          message: data.error || 'Event konnte nicht freigegeben werden.',
          color: 'red',
        });
      }
    } catch (error) {
      notifications.show({
        title: 'Fehler',
        message: 'Ein Fehler ist aufgetreten.',
        color: 'red',
      });
    }
  };

  const handleReject = async (id: string) => {
    try {
      const response = await fetch(`/api/events/${id}/reject`, {
        method: 'POST',
      });

      if (response.ok) {
        notifications.show({
          title: 'Erfolg',
          message: 'Event wurde abgelehnt.',
          color: 'orange',
        });
        fetchEvents();
      } else {
        const data = await response.json();
        notifications.show({
          title: 'Fehler',
          message: data.error || 'Event konnte nicht abgelehnt werden.',
          color: 'red',
        });
      }
    } catch (error) {
      notifications.show({
        title: 'Fehler',
        message: 'Ein Fehler ist aufgetreten.',
        color: 'red',
      });
    }
  };

  const renderEventCard = (event: Event, showActions: boolean = false) => (
    <Card key={event.id} shadow="sm" padding="lg" radius="md" className="bg-white">
      <Stack gap="sm">
        <Group justify="space-between">
          <Title order={4}>{event.title}</Title>
          <Badge color={event.status === 'APPROVED' ? 'green' : event.status === 'REJECTED' ? 'red' : 'yellow'}>
            {event.status}
          </Badge>
        </Group>
        <Text size="sm" c="dimmed">
          📍 {event.location} | 📅 {new Date(event.date).toLocaleDateString('de-DE')}
        </Text>
        <Text size="sm" lineClamp={2}>
          {event.description}
        </Text>
        <Text size="xs" c="dimmed">
          Organisator: {event.organizer.name || event.organizer.email}
        </Text>
        {showActions && (session?.user as any)?.role === 'ADMIN' && (
          <Group>
            <Button size="xs" color="green" onClick={() => handleApprove(event.id)}>
              Freigeben
            </Button>
            <Button size="xs" color="red" onClick={() => handleReject(event.id)}>
              Ablehnen
            </Button>
          </Group>
        )}
        <Link href={`/events/${event.id}`}>
          <Button variant="light" size="xs" fullWidth>
            Details anzeigen
          </Button>
        </Link>
      </Stack>
    </Card>
  );

  if (status === 'loading' || loading) {
    return <div>Lädt...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <Container size="lg" className="py-16">
        <Stack gap="xl">
          <Group justify="space-between">
            <Title order={1}>📋 Content Management System</Title>
            <Group>
              <Link href="/events">
                <Button variant="subtle">Events</Button>
              </Link>
              <Link href="/">
                <Button variant="subtle">Startseite</Button>
              </Link>
            </Group>
          </Group>

          <Card shadow="md" padding="lg" radius="md" className="bg-white/80 backdrop-blur">
            <Text>
              Willkommen im CMS! Hier kannst du alle Events verwalten.
              {(session?.user as any)?.role === 'ADMIN' 
                ? ' Als Admin kannst du Events freigeben oder ablehnen.'
                : ' Nur Admins können Events freigeben.'}
            </Text>
          </Card>

          <Tabs defaultValue="pending">
            <Tabs.List>
              <Tabs.Tab value="pending">
                Wartend ({pendingEvents.length})
              </Tabs.Tab>
              <Tabs.Tab value="approved">
                Freigegeben ({approvedEvents.length})
              </Tabs.Tab>
              <Tabs.Tab value="rejected">
                Abgelehnt ({rejectedEvents.length})
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="pending" pt="xl">
              <Stack gap="md">
                {pendingEvents.length === 0 ? (
                  <Text c="dimmed">Keine wartenden Events.</Text>
                ) : (
                  pendingEvents.map((event) => renderEventCard(event, true))
                )}
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel value="approved" pt="xl">
              <Stack gap="md">
                {approvedEvents.length === 0 ? (
                  <Text c="dimmed">Keine freigegebenen Events.</Text>
                ) : (
                  approvedEvents.map((event) => renderEventCard(event))
                )}
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel value="rejected" pt="xl">
              <Stack gap="md">
                {rejectedEvents.length === 0 ? (
                  <Text c="dimmed">Keine abgelehnten Events.</Text>
                ) : (
                  rejectedEvents.map((event) => renderEventCard(event))
                )}
              </Stack>
            </Tabs.Panel>
          </Tabs>
        </Stack>
      </Container>
    </div>
  );
}
