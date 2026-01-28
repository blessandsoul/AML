import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateInquiry } from '../hooks/useCreateInquiry';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, ArrowLeft, Plus, X } from 'lucide-react';
import type { InquiryTargetType } from '../types/inquiry.types';

export const CreateInquiryPage = () => {
  const navigate = useNavigate();
  const createMutation = useCreateInquiry();

  const [targetType, setTargetType] = useState<InquiryTargetType>('GUIDE');
  const [targetIds, setTargetIds] = useState<string[]>(['']);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const addTargetId = () => {
    if (targetIds.length < 10) {
      setTargetIds([...targetIds, '']);
    }
  };

  const removeTargetId = (index: number) => {
    if (targetIds.length > 1) {
      setTargetIds(targetIds.filter((_, i) => i !== index));
    }
  };

  const updateTargetId = (index: number, value: string) => {
    const newTargetIds = [...targetIds];
    newTargetIds[index] = value;
    setTargetIds(newTargetIds);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validTargetIds = targetIds.filter(id => id.trim() !== '');
    if (validTargetIds.length === 0) {
      return;
    }
    createMutation.mutate({
      targetType,
      targetIds: validTargetIds,
      subject,
      message,
    });
  };

  const isFormValid =
    subject.length >= 3 &&
    message.length >= 10 &&
    targetIds.some(id => id.trim() !== '');

  return (
    <div className="space-y-6 max-w-2xl">
      <Button variant="ghost" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Send an Inquiry</CardTitle>
          <CardDescription>
            Contact guides, drivers, or companies directly
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="targetType">Inquiry Type</Label>
              <Select
                value={targetType}
                onValueChange={(value) => setTargetType(value as InquiryTargetType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GUIDE">Guide</SelectItem>
                  <SelectItem value="DRIVER">Driver</SelectItem>
                  <SelectItem value="COMPANY">Company</SelectItem>
                  <SelectItem value="TOUR">Tour</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Recipients (IDs)</Label>
              <p className="text-xs text-muted-foreground mb-2">
                Enter the ID(s) of the {targetType.toLowerCase()}(s) you want to contact
              </p>
              {targetIds.map((id, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`${targetType} ID`}
                    value={id}
                    onChange={(e) => updateTargetId(index, e.target.value)}
                  />
                  {targetIds.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeTargetId(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              {targetIds.length < 10 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addTargetId}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another Recipient
                </Button>
              )}
              {targetIds.filter(id => id.trim()).length > 2 && (
                <p className="text-xs text-amber-600 mt-2">
                  Note: Sending to more than 2 recipients may require payment
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="What is your inquiry about?"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                minLength={3}
                maxLength={200}
                required
              />
              <p className="text-xs text-muted-foreground">
                {subject.length}/200 characters (minimum 3)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Write your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                minLength={10}
                maxLength={2000}
                required
              />
              <p className="text-xs text-muted-foreground">
                {message.length}/2000 characters (minimum 10)
              </p>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={!isFormValid || createMutation.isPending}
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                'Send Inquiry'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
