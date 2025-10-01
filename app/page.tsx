import Link from "next/link";
import { Container, Title, Text, Button, Card, Group, Stack } from "@mantine/core";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <Container size="lg" className="py-16">
        <Stack gap="xl">
          <div className="text-center">
            <Title order={1} className="text-6xl font-bold mb-4 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
              🥄 Pudding mit Gabel
            </Title>
            <Text size="xl" c="dimmed" className="mb-8">
              Das kontemporäre Gen-Z Phänomen des Puddings mit Gabel Essen
            </Text>
          </div>

          <Card shadow="md" padding="xl" radius="md" className="bg-white/80 backdrop-blur">
            <Stack gap="md">
              <Title order={2} size="h3">
                Willkommen bei Pudding mit Gabel!
              </Title>
              <Text>
                Dies ist die zentrale Plattform für alle Events rund um das Pudding-mit-Gabel-Essen.
                Hier kannst du Events erstellen, dich als Organisator registrieren und an Diskussionen teilnehmen.
              </Text>
              <Group>
                <Link href="/events">
                  <Button size="lg" variant="gradient" gradient={{ from: 'pink', to: 'purple' }}>
                    Events entdecken
                  </Button>
                </Link>
                <Link href="/auth/signin">
                  <Button size="lg" variant="outline">
                    Anmelden
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="lg" variant="light">
                    Registrieren
                  </Button>
                </Link>
              </Group>
            </Stack>
          </Card>

          <Card shadow="md" padding="xl" radius="md" className="bg-white/80 backdrop-blur">
            <Stack gap="md">
              <Title order={3}>Was ist Pudding mit Gabel?</Title>
              <Text>
                Ein virale Gen-Z Trend, bei dem Pudding bewusst mit einer Gabel statt einem Löffel gegessen wird.
                Es geht darum, gesellschaftliche Normen zu hinterfragen und gemeinsam Spaß zu haben.
              </Text>
              <Title order={4} size="h5">Funktionen:</Title>
              <ul className="list-disc list-inside space-y-2">
                <li>📅 Events erstellen und verwalten</li>
                <li>👥 Als Organisator registrieren</li>
                <li>💬 Kommentare hinterlassen (mit automatischer Content-Moderation)</li>
                <li>✅ Manuelle Event-Freigabe durch Admins</li>
                <li>🔒 Sicheres CMS mit Authentifizierung</li>
              </ul>
            </Stack>
          </Card>
        </Stack>
      </Container>
    </div>
  );
}
