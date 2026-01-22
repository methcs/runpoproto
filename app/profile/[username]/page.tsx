import ProfilePageClient from '@/components/profile-page-client'

export default function ProfilePage({ params }: any) {
  const username = params?.username
  return <ProfilePageClient username={username} />
}
