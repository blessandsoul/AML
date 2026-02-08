'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Package, Search, Info, Truck, Check } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { motion } from 'framer-motion';

export default function TrackPage() {
  const [code, setCode] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = code.trim();
    if (trimmed) {
      router.push(`/track/${trimmed}`);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-200px)] bg-background bg-mesh flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <Card>
            <CardContent className="pt-8 pb-8 px-6 sm:px-8">
              <div className="flex flex-col items-center text-center space-y-6">
                {/* Icon */}
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Package className="w-8 h-8 text-primary" />
                </div>

                {/* Title and subtitle */}
                <div className="space-y-2">
                  <h1 className="text-2xl font-bold tracking-tight">
                    შეკვეთის თვალყურის დევნება
                  </h1>
                  <p className="text-muted-foreground text-sm">
                    შეიყვანეთ თქვენი თრექინგ კოდი
                  </p>
                </div>

                {/* Search form */}
                <form onSubmit={handleSubmit} className="w-full space-y-3">
                  <div className="flex gap-2">
                    <Input
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      placeholder="მაგ. AML8K2X9"
                      className="text-center font-mono tracking-widest uppercase"
                      maxLength={20}
                    />
                    <Button type="submit" disabled={!code.trim()}>
                      <Search className="w-4 h-4 mr-2" />
                      ძებნა
                    </Button>
                  </div>
                </form>

                {/* Demo Buttons */}
                <div className="w-full pt-2 border-t border-border/50">
                  <p className="text-xs text-muted-foreground mb-3">
                    ნახეთ როგორ მუშაობს თრექინგი:
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 font-mono text-xs"
                      onClick={() => router.push('/track/AML8K2X9')}
                    >
                      <Truck className="w-3.5 h-3.5 mr-1.5 text-orange-500" />
                      AML8K2X9
                      <span className="text-muted-foreground ml-1.5 font-sans">— გზაშია</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 font-mono text-xs"
                      onClick={() => router.push('/track/AML3P7W2')}
                    >
                      <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-500" />
                      AML3P7W2
                      <span className="text-muted-foreground ml-1.5 font-sans">— ჩაბარებული</span>
                    </Button>
                  </div>
                </div>

                {/* Info text */}
                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 shrink-0" />
                  თრექინგ კოდი მოცემულია თქვენს ინვოისში
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </MainLayout>
  );
}
