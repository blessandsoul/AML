import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInquiry } from '../hooks/useInquiries';
import { useRespondToInquiry } from '../hooks/useRespondToInquiry';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowLeft, Check, X, MessageSquare } from 'lucide-react';
import { ROUTES } from '@/lib/constants/routes';
import type { InquiryStatus, InquiryTargetType, RespondToInquiryInput } from '../types/inquiry.types';

const getStatusBadgeVariant = (status: InquiryStatus) => {
  switch (status) {
    case 'PENDING':
      return 'secondary';
    case 'RESPONDED':
      return 'default';
    case 'ACCEPTED':
      return 'default';
    case 'DECLINED':
      return 'destructive';
    case 'EXPIRED':
      return 'outline';
    default:
      return 'secondary';
  }
};

const getTargetTypeLabel = (type: InquiryTargetType) => {
  switch (type) {
    case 'TOUR':
      return 'Tour';
    case 'GUIDE':
      return 'Guide';
    case 'DRIVER':
      return 'Driver';
    case 'COMPANY':
      return 'Company';
    default:
      return type;
  }
};

export const InquiryDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: inquiry, isLoading, error } = useInquiry(id || '');
  const respondMutation = useRespondToInquiry();
  const [responseMessage, setResponseMessage] = useState('');
  const [showResponseForm, setShowResponseForm] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !inquiry) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Failed to load inquiry</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    );
  }

  const isOwner = inquiry.userId === user?.id;
  const myResponse = inquiry.responses.find(r => r.recipientId === user?.id);
  const canRespond = myResponse && myResponse.status === 'PENDING';

  const handleRespond = (status: RespondToInquiryInput['status']) => {
    if (!id) return;
    respondMutation.mutate({
      id,
      data: {
        status,
        message: responseMessage || undefined,
      },
    });
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl">{inquiry.subject}</CardTitle>
              <CardDescription className="mt-1">
                {isOwner ? 'Sent to' : 'From'}{' '}
                {isOwner
                  ? `${inquiry.responses.length} recipient(s)`
                  : `${inquiry.user.firstName} ${inquiry.user.lastName}`}{' '}
                · {getTargetTypeLabel(inquiry.targetType)}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Message</Label>
            <p className="mt-1 whitespace-pre-wrap">{inquiry.message}</p>
          </div>

          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>Sent: {new Date(inquiry.createdAt).toLocaleString()}</span>
            {inquiry.expiresAt && (
              <span>Expires: {new Date(inquiry.expiresAt).toLocaleDateString()}</span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Responses Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Responses</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {inquiry.responses.length === 0 ? (
            <p className="text-muted-foreground">No responses yet</p>
          ) : (
            inquiry.responses.map((response) => (
              <div
                key={response.id}
                className="border rounded-lg p-4 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="font-medium">
                    {response.recipient.firstName} {response.recipient.lastName}
                  </div>
                  <Badge variant={getStatusBadgeVariant(response.status)}>
                    {response.status}
                  </Badge>
                </div>
                {response.message && (
                  <p className="text-sm text-muted-foreground">{response.message}</p>
                )}
                {response.respondedAt && (
                  <p className="text-xs text-muted-foreground">
                    Responded: {new Date(response.respondedAt).toLocaleString()}
                  </p>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Response Form (for recipients) */}
      {canRespond && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Respond to Inquiry</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {showResponseForm ? (
              <>
                <div>
                  <Label htmlFor="message">Your Response (Optional)</Label>
                  <Textarea
                    id="message"
                    placeholder="Add a message with your response..."
                    value={responseMessage}
                    onChange={(e) => setResponseMessage(e.target.value)}
                    rows={4}
                    className="mt-1"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleRespond('ACCEPTED')}
                    disabled={respondMutation.isPending}
                    className="flex-1"
                  >
                    {respondMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Check className="h-4 w-4 mr-2" />
                    )}
                    Accept
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleRespond('DECLINED')}
                    disabled={respondMutation.isPending}
                    className="flex-1"
                  >
                    {respondMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <X className="h-4 w-4 mr-2" />
                    )}
                    Decline
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleRespond('RESPONDED')}
                    disabled={respondMutation.isPending}
                    className="flex-1"
                  >
                    {respondMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <MessageSquare className="h-4 w-4 mr-2" />
                    )}
                    Reply Only
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setShowResponseForm(false)}
                  className="w-full"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={() => setShowResponseForm(true)} className="w-full">
                Write a Response
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
