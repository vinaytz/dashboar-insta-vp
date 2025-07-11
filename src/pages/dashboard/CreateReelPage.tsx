
import { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Separator } from '@/components/ui/separator';
import { Copy, Loader2 } from 'lucide-react';

// Function to generate a random 6-character string
const generateReelId = () => {
  return Math.random().toString(36).substring(2, 8);
};

interface Submission {
  id: number;
  name: string;
  username: string;
}

export default function CreateReelPage() {
  const [loading, setLoading] = useState(true);
  const [newReelId, setNewReelId] = useState(generateReelId());
  const [redirectUrl, setRedirectUrl] = useState('');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastCreatedLink, setLastCreatedLink] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchSubmissions = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data: reelsData, error: reelsError } = await supabase
        .from('reels')
        .select('reelId')
        .eq('userId', user.id);

      if (reelsError) throw reelsError;

      const reelIds = reelsData.map((reel) => reel.reelId);

      if (reelIds.length === 0) {
        setSubmissions([]);
        return;
      }

      const { data, error } = await supabase
        .from('submissions')
        .select('id, name, username')
        .in('reelId', reelIds);

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error: any) {
      console.error('Error fetching submissions:', error);
      toast.error(error.message || 'Failed to fetch submissions.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLastCreatedLink(null);

    if (!user) {
      toast.error('You must be logged in to create a ReelID.');
      setIsSubmitting(false);
      return;
    }

    if (!redirectUrl) {
      toast.error('Please provide a redirect URL.');
      setIsSubmitting(false);
      return;
    }

    try {
      const reelIdToSubmit = newReelId;
      const { error } = await supabase.from('reels').insert([
        {
          reelId: reelIdToSubmit,
          redirectUrl: redirectUrl,
          userId: user.id,
        },
      ]);

      if (error) throw error;

      toast.success('ReelID created successfully!');
      const link = `${window.location.origin.replace('5173', '3000')}/${reelIdToSubmit}`;
      setLastCreatedLink(link);
      setRedirectUrl('');
      setNewReelId(generateReelId());
      fetchSubmissions();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create ReelID.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-8">
        <Card className="bg-gray-900 border-gray-800 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white">Create New Link</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="newReelId" className="text-sm font-medium text-gray-400">New ReelID</Label>
                <Input id="newReelId" type="text" value={newReelId} readOnly className="font-mono bg-gray-800 border-gray-700 text-gray-200" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="redirectUrl" className="text-sm font-medium text-gray-400">Redirect Link</Label>
                <Input
                  id="redirectUrl"
                  type="url"
                  placeholder="https://example.com/redirect-here"
                  value={redirectUrl}
                  onChange={(e) => setRedirectUrl(e.target.value)}
                  required
                  className="bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 text-base" disabled={isSubmitting}>
                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : 'Submit'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {lastCreatedLink && (
          <Card className="bg-gray-900 border-gray-800 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white">Link Created!</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400 mb-2">Share this link:</p>
              <div className="flex items-center gap-2">
                <Input type="text" value={lastCreatedLink} readOnly className="font-mono bg-gray-800 border-gray-700 text-gray-200" />
                <Button
                  variant="outline"
                  size="icon"
                  className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                  onClick={() => {
                    navigator.clipboard.writeText(lastCreatedLink);
                    toast.success('Link copied to clipboard!');
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Card className="bg-gray-900 border-gray-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="h-8 w-8 text-gray-500 animate-spin" />
            </div>
          ) : submissions.length > 0 ? (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {submissions.map((submission, index) => (
                <div key={submission.id} className="flex items-center gap-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                  <span className="text-sm font-bold text-gray-400">{index + 1}</span>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input type="text" value={submission.name} readOnly className="bg-gray-700/50 border-gray-600 text-gray-200 font-mono text-sm" />
                    <Input type="text" value={submission.username} readOnly className="bg-gray-700/50 border-gray-600 text-gray-200 font-mono text-sm" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-16">No submissions yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
