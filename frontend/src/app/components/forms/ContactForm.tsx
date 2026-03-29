'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { contactFormSchema, ContactFormData } from '../../../lib/validations';
import { api } from '../../../lib/api';
import { Loader2, CheckCircle2, Mail, Phone, User, MessageSquare, BookOpen, Sparkles } from 'lucide-react';

export default function ContactForm() {
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      interest: '',
      message: ''
    }
  });

  useEffect(() => {
    const interestParam = searchParams?.get('interest');
    if (interestParam) {
      const interestMap: Record<string, string> = {
        'young_scholar': 'young-scholar',
        'young-scholar': 'young-scholar',
      };
      const formValue = interestMap[interestParam] || interestParam;
      setValue('interest', formValue);
    }
  }, [searchParams, setValue]);

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setSubmitMessage('');

    try {
      const response = await api.submitContactForm({
        name: data.name,
        email: data.email,
        phone: data.phone,
        interest: data.interest,
        message: data.message
      });

      if (response.success) {
        setSubmitStatus('success');
        setSubmitMessage('Thank you for reaching out! We will get back to you within 24 hours.');
        reset();
      } else {
        throw new Error(response.error || 'Failed to submit form');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
      setSubmitMessage('Oops! Something went wrong. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative h-full">
      <Card className="relative border border-gray-200 shadow-sm bg-white overflow-hidden h-full flex flex-col rounded-2xl hover:shadow-lg transition-shadow">
        <div className="h-1.5 bg-gradient-to-r from-red-500 via-red-600 to-red-700"></div>
        
        <CardContent className="p-6 sm:p-8 flex-1 flex flex-col">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-red-50 rounded-xl mb-4 border border-red-100">
              <Sparkles className="w-7 h-7 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">
              Let&apos;s Connect
            </h3>
            <p className="text-sm text-gray-500">
              Fill out the form below and we&apos;ll get back to you shortly
            </p>
          </div>

          {submitStatus === 'success' && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start space-x-3 animate-fade-in">
              <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 pt-0.5">
                <p className="font-bold text-green-700 text-sm mb-0.5">Success!</p>
                <p className="text-xs text-green-600 leading-relaxed">{submitMessage}</p>
              </div>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3 animate-fade-in">
              <div className="flex-shrink-0 w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">!</span>
              </div>
              <div className="flex-1 pt-0.5">
                <p className="font-bold text-red-700 text-sm mb-0.5">Error</p>
                <p className="text-xs text-red-600 leading-relaxed">{submitMessage}</p>
              </div>
            </div>
          )}
              
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 flex-1 flex flex-col">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="group">
                <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className={`w-4 h-4 transition-colors ${errors.name ? 'text-red-500' : 'text-gray-400 group-focus-within:text-red-500'}`} />
                  </div>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    {...register('name')}
                    className={`pl-10 h-12 text-sm border-gray-200 transition-all duration-200 focus:border-red-500 focus:ring-red-500/10 ${
                      errors.name ? 'border-red-500' : ''
                    }`}
                    disabled={isSubmitting}
                  />
                </div>
                {errors.name && <p className="mt-1.5 text-xs font-bold text-red-500">{errors.name.message}</p>}
              </div>

              <div className="group">
                <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className={`w-4 h-4 transition-colors ${errors.email ? 'text-red-500' : 'text-gray-400 group-focus-within:text-red-500'}`} />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    {...register('email')}
                    className={`pl-10 h-12 text-sm border-gray-200 transition-all duration-200 focus:border-red-500 focus:ring-red-500/10 ${
                      errors.email ? 'border-red-500' : ''
                    }`}
                    disabled={isSubmitting}
                  />
                </div>
                {errors.email && <p className="mt-1.5 text-xs font-bold text-red-500">{errors.email.message}</p>}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="group">
                <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="w-4 h-4 text-gray-400 group-focus-within:text-red-500" />
                  </div>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 99103 35093"
                    {...register('phone')}
                    className="pl-10 h-12 text-sm border-gray-200 transition-all duration-200 focus:border-red-500 focus:ring-red-500/10"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="group">
                <label htmlFor="interest" className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Program <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <BookOpen className={`w-4 h-4 transition-colors ${errors.interest ? 'text-red-500' : 'text-gray-400 group-focus-within:text-red-500'}`} />
                  </div>
                  <Select 
                    value={watch('interest')} 
                    onValueChange={(value) => setValue('interest', value)}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className={`pl-10 h-12 text-sm border-gray-200 transition-all duration-200 focus:border-red-500 focus:ring-red-500/10 ${
                      errors.interest ? 'border-red-500' : ''
                    }`}>
                      <SelectValue placeholder="Choose program" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200 text-gray-900">
                      <SelectItem value="young-scholar">Young Scholar Program</SelectItem>
                      <SelectItem value="bank-po-so">Bank PO / SO</SelectItem>
                      <SelectItem value="interview-prep">Interview Preparation</SelectItem>
                      <SelectItem value="ugc-net-jrf">UGC NET / JRF</SelectItem>
                      <SelectItem value="ctet-tet">CTET / TET</SelectItem>
                      <SelectItem value="prt-tgt-pgt">PRT / TGT / PGT</SelectItem>
                      <SelectItem value="dsssb">DSSSB Coaching</SelectItem>
                      <SelectItem value="hotel-management">Hotel Management</SelectItem>
                      <SelectItem value="cuet">CUET (UG) Entrance</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="group flex-1 flex flex-col">
              <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                Your Message <span className="text-red-500">*</span>
              </label>
              <div className="relative flex-1 flex flex-col">
                <div className="absolute top-3 left-3 pointer-events-none z-10">
                  <MessageSquare className={`w-4 h-4 transition-colors ${errors.message ? 'text-red-500' : 'text-gray-400 group-focus-within:text-red-500'}`} />
                </div>
                <Textarea
                  id="message"
                  {...register('message')}
                  placeholder="How can we help you succeed?"
                  className={`pl-10 pt-3 text-sm border-gray-200 transition-all duration-200 resize-none flex-1 min-h-[100px] focus:border-red-500 focus:ring-red-500/10 ${
                    errors.message ? 'border-red-500' : ''
                  }`}
                  disabled={isSubmitting}
                />
              </div>
              {errors.message && <p className="mt-1.5 text-xs font-bold text-red-500">{errors.message.message}</p>}
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-red-600 hover:bg-red-700 text-white text-sm font-bold uppercase tracking-wider rounded-xl transition-all duration-300 shadow-sm hover:shadow-md disabled:opacity-60"
              >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Send Message</span>}
              </Button>
              <p className="text-xs text-center text-gray-400 mt-4 font-medium">
                🔒 Your information is secure
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
