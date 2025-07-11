
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { Copy, ExternalLink } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface Reel {
  id: string;
  reelId: string; // Now a UUID
  redirectUrl: string;
  userId: string;
}

export default function MyReelsPage() {
  const { user, loading: authLoading } = useAuth();
  const [reels, setReels] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReels = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('reels')
          .select('id, "reelId", "redirectUrl", "userId"')
          .eq('userId', user.id);

        if (error) throw error;

        setReels(data as Reel[]);
      } catch (error: any) {
        toast.error(error.message || 'Failed to fetch ReelIDs.');
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchReels();
    }
  }, [user, authLoading]);

  const copyToClipboard = (reelId: string) => {
    const link = `${window.location.origin.replace(':5173', '')}/${reelId}`;
    navigator.clipboard.writeText(link);
    toast.success('Link copied to clipboard!');
  };

  if (loading || authLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="flex flex-col space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (reels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
        <h2 className="text-2xl font-bold mb-2">No ReelIDs Created</h2>
        <p className="text-muted-foreground mb-4">Start by creating your first ReelID.</p>
        <Link to="/dashboard/create">
          <Button>Create New ReelID</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {reels.map((reel) => (
        <Card key={reel.id} className="flex flex-col">
          <CardHeader className="flex-grow">
            <CardTitle className="text-xl font-semibold">{reel.reelId}</CardTitle>
            <CardDescription className="truncate">Redirect: {reel.redirectUrl}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col space-y-2">
            <Button onClick={() => copyToClipboard(reel.reelId)} variant="outline" className="flex items-center justify-center gap-2">
              <Copy className="h-4 w-4" /> Copy Link
            </Button>
            <a href={reel.redirectUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                <ExternalLink className="h-4 w-4" /> Visit Redirect URL
              </Button>
            </a>
            <Link to={`/dashboard/submissions/${reel.reelId}`}>
              <Button className="w-full">View Submissions</Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
