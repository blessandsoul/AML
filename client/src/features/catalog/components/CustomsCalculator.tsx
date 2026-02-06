'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, Calendar, Car, Sparkles, TrendingUp, DollarSign, Fuel, Info, Phone, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

import { VEHICLE_AGE_OPTIONS, FUEL_TYPES_GE } from '../constants/customs-data';
import {
  calculateGeorgiaCustoms,
  formatNumber,
} from '../utils/customs-calculator';
import type { CustomsResult } from '../types/customs.types';
import { LeadCaptureModal } from './LeadCaptureModal';

export function CustomsCalculator() {
  const [price, setPrice] = React.useState('');
  const [engine, setEngine] = React.useState('');
  const [fuelType, setFuelType] = React.useState('');
  const [age, setAge] = React.useState('');
  const [result, setResult] = React.useState<CustomsResult | null>(null);
  const [isCalculating, setIsCalculating] = React.useState(false);
  const resultRef = React.useRef<HTMLDivElement>(null);

  // Lead generation modal state
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();

    const priceNum = parseFloat(price);
    const engineNum = parseFloat(engine);
    const ageNum = parseInt(age);

    if (!priceNum || priceNum <= 0 || !engineNum || engineNum <= 0 || !ageNum || ageNum <= 0 || !fuelType) {
      return;
    }

    setIsCalculating(true);

    setTimeout(() => {
      const calculatedResult = calculateGeorgiaCustoms({
        engineCapacity: engineNum,
        age: ageNum,
      });

      setResult(calculatedResult);
      setIsCalculating(false);

      // Scroll to result after animation
      setTimeout(() => {
        resultRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 100);
    }, 400);
  };


  return (
    <section className="relative py-8 md:py-12 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />

      <div className="container relative z-10 px-4 max-w-4xl mx-auto">
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center justify-center gap-2 mb-2">
            <Calculator className="w-6 h-6 md:w-7 md:h-7 text-primary" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            განბაჟების <span className="text-primary">კალკულატორი</span>
          </h2>
          <p className="text-muted-foreground text-xs md:text-sm">
            გაიგეთ საბაჟო გადასახადის ღირებულება საქართველოში
          </p>
        </motion.div>

        {/* Calculator Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative bg-card rounded-xl border border-primary/20 shadow-lg overflow-hidden">
            <div className="relative p-4 md:p-6">
              <form onSubmit={handleCalculate} className="space-y-5">
                {/* Input Section */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                  {/* Price */}
                  <div className="space-y-1.5 min-w-0">
                    <Label htmlFor="price" className="flex items-center gap-1.5 text-xs font-medium whitespace-nowrap overflow-hidden">
                      <DollarSign className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span className="truncate">ღირებულება</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="price"
                        type="number"
                        placeholder="10000"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="h-10 pr-14 w-full"
                        min="0"
                        step="100"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">
                        USD
                      </span>
                    </div>
                  </div>

                  {/* Engine Capacity */}
                  <div className="space-y-1.5 min-w-0">
                    <Label htmlFor="engine" className="flex items-center gap-1.5 text-xs font-medium whitespace-nowrap overflow-hidden">
                      <Car className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span className="truncate">მოცულობა</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="engine"
                        type="number"
                        placeholder="3.0"
                        value={engine}
                        onChange={(e) => setEngine(e.target.value)}
                        className="h-10 pr-14 w-full"
                        min="0"
                        step="0.1"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">
                        ლ.
                      </span>
                    </div>
                  </div>

                  {/* Fuel Type */}
                  <div className="space-y-1.5 min-w-0">
                    <Label htmlFor="fuelType" className="flex items-center gap-1.5 text-xs font-medium whitespace-nowrap overflow-hidden">
                      <Fuel className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span className="truncate">საწვავის ტიპი</span>
                    </Label>
                    <Select value={fuelType} onValueChange={setFuelType}>
                      <SelectTrigger id="fuelType" className="h-10 w-full">
                        <SelectValue placeholder="აირჩიეთ" />
                      </SelectTrigger>
                      <SelectContent>
                        {FUEL_TYPES_GE.map((fuel) => (
                          <SelectItem key={fuel} value={fuel}>
                            {fuel}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Age */}
                  <div className="space-y-1.5 min-w-0">
                    <Label htmlFor="age" className="flex items-center gap-1.5 text-xs font-medium whitespace-nowrap overflow-hidden">
                      <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span className="truncate">ასაკი</span>
                    </Label>
                    <Select value={age} onValueChange={setAge}>
                      <SelectTrigger id="age" className="h-10 w-full">
                        <SelectValue placeholder="აირჩიეთ" />
                      </SelectTrigger>
                      <SelectContent>
                        {VEHICLE_AGE_OPTIONS.map((ageOption) => (
                          <SelectItem key={ageOption} value={ageOption.toString()}>
                            {ageOption} წელი
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Calculate Button */}
                <div className="flex flex-col items-center gap-4 pt-2">
                  <Button
                    type="submit"
                    className="w-full md:w-auto h-11 px-8 font-semibold"
                    disabled={isCalculating}
                  >
                    {isCalculating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        გამოთვლა...
                      </>
                    ) : (
                      <>
                        <Calculator className="w-4 h-4 mr-2" />
                        გამოთვლა
                      </>
                    )}
                  </Button>

                  {/* Result Display */}
                  <AnimatePresence mode="wait">
                    {result && (
                      <motion.div
                        ref={resultRef}
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="w-full"
                      >
                        <div className="bg-emerald-500/5 rounded-xl p-5 border border-emerald-500/20">
                          {/* Amount */}
                          <div className="text-center mb-4">
                            <p className="text-xs font-medium text-muted-foreground uppercase mb-2">
                              განბაჟების ღირებულება
                            </p>
                            <p className="text-4xl md:text-5xl font-bold text-primary">
                              ₾{formatNumber(result.total)}
                            </p>
                          </div>

                          {/* Info Note */}
                          <div className="mb-4 pb-4 border-b border-emerald-500/20 space-y-2">
                            <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5">
                              <Info className="w-3.5 h-3.5 shrink-0" />
                              <span className="font-medium">მიახლოებითი გამოთვლა საქართველოს საბაჟო ტარიფების მიხედვით</span>
                            </p>
                            <p className="text-center text-[11px] text-muted-foreground/80 max-w-md mx-auto">
                              ზუსტი თანხა დამოკიდებულია მანქანის ფაქტობრივ მახასიათებლებზე და საბაჟო შემოწმების შედეგებზე
                            </p>
                          </div>

                          {/* Lead Generation CTA */}
                          <div>
                            <p className="text-center text-xs font-medium mb-3">
                              გსურთ დეტალური კონსულტაცია?
                            </p>
                            <div className="flex flex-col sm:flex-row gap-2 justify-center">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-9"
                                asChild
                              >
                                <a href="tel:+995XXXXXXXXX" className="flex items-center gap-1.5">
                                  <Phone className="w-3.5 h-3.5" />
                                  <span>დარეკვა</span>
                                </a>
                              </Button>
                              <Button
                                size="sm"
                                className="h-9"
                                onClick={() => setIsModalOpen(true)}
                              >
                                <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
                                <span>დაგვიკავშირდით</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </form>
            </div>
          </div>
        </motion.div>

        {/* Lead Generation Modal */}
        <LeadCaptureModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          context="calculation"
          metadata={{
            calculationResult: result?.total,
            price,
            engine,
            fuelType,
            age,
          }}
        />
      </div>
    </section>
  );
}
