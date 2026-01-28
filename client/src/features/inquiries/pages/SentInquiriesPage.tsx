import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSentInquiries } from '../hooks/useInquiries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { ROUTES } from '@/lib/constants/routes';
import type { InquiryStatus, InquiryTargetType } from '../types/inquiry.types';

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

export const SentInquiriesPage = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useSentInquiries({ page, limit: 10 });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Failed to load inquiries</p>
      </div>
    );
  }

  const inquiries = data?.items || [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Sent Inquiries</h1>
          <p className="text-muted-foreground">Inquiries you have sent to guides, drivers, and companies</p>
        </div>
        <Link to={ROUTES.INQUIRIES.CREATE}>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Inquiry
          </Button>
        </Link>
      </div>

      {inquiries.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground mb-4">You haven't sent any inquiries yet</p>
            <Link to={ROUTES.INQUIRIES.CREATE}>
              <Button>Send Your First Inquiry</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inquiry) => (
            <Link key={inquiry.id} to={ROUTES.INQUIRIES.DETAILS(inquiry.id)}>
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{inquiry.subject}</CardTitle>
                      <CardDescription>
                        {getTargetTypeLabel(inquiry.targetType)} · {inquiry.targetIds.length} recipient(s)
                      </CardDescription>
                    </div>
                    <Badge variant={getStatusBadgeVariant(inquiry.responses[0]?.status || 'PENDING')}>
                      {inquiry.responses[0]?.status || 'PENDING'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">{inquiry.message}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Sent {new Date(inquiry.createdAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}

          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={!pagination.hasPreviousPage}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => p + 1)}
                disabled={!pagination.hasNextPage}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
