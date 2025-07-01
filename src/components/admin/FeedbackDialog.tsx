'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { saveFeedbackAction } from '@/lib/actions';
import { Loader2, MessageSquare } from 'lucide-react';
import { SidebarMenuButton } from '@/components/ui/sidebar';

export function FeedbackDialog() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      toast({ title: "Empty Feedback", description: "Please enter your feedback before submitting.", variant: "destructive" });
      return;
    }
    if (!user) {
      toast({ title: "Not Authenticated", description: "You must be logged in to submit feedback.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      await saveFeedbackAction({
        userId: user.uid,
        email: user.email || 'N/A',
        feedback: feedback,
      });
      toast({ title: "Feedback Submitted", description: "Thank you for your valuable input!" });
      setFeedback('');
      setIsOpen(false);
    } catch (error: any) {
      toast({ title: "Submission Failed", description: error.message || "Could not submit feedback.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <SidebarMenuButton
          tooltip={{ children: 'Submit Feedback', side: 'right', align: 'center' }}
          className="w-full justify-start"
          variant="ghost"
        >
          <MessageSquare className="h-5 w-5" />
          <span className="group-data-[collapsible=icon]:hidden">Feedback</span>
        </SidebarMenuButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-0 gap-0">
        <DialogHeader className="bg-primary text-primary-foreground p-6">
          <DialogTitle>Submit Feedback</DialogTitle>
          <DialogDescription className="text-primary-foreground/90">
            We'd love to hear your thoughts! What's working well? What could be improved?
          </DialogDescription>
        </DialogHeader>
        <div className="p-6 space-y-6 bg-background">
            <div className="grid w-full gap-1.5">
                <Label htmlFor="feedback-input">Your Feedback</Label>
                <Textarea
                id="feedback-input"
                placeholder="Type your message here..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={6}
                />
            </div>
            <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="border-muted-foreground/60">Cancel</Button>
                <Button type="submit" onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Submit
                </Button>
            </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
