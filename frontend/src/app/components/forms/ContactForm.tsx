'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { contactFormSchema, ContactFormData } from '../../../lib/validations';
import { api } from '../../../lib/api';
import { Loader2, CheckCircle2, Mail, Phone, User, MessageSquare, BookOpen, Send, Sparkles } from 'lucide-react';

export default function ContactForm() {
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
    <div className="relative">
      {/* Decorative background elements */}
      <div className="absolute -top-4 -left-4 w-24 h-24 bg-red-500/10 rounded-full blur-2xl"></div>
      <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-red-600/10 rounded-full blur-2xl"></div>
      
      <Card className="relative border-0 shadow-2xl bg-white/80 backdrop-blur-sm overflow-hidden">
        {/* Top accent bar */}
        <div className="h-1.5 bg-gradient-to-r from-red-500 via-red-600 to-red-700"></div>
        
        <CardContent className="p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl mb-4 shadow-lg shadow-red-500/30">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Let&apos;s Connect
            </h3>
            <p className="text-sm text-gray-600">
              Fill out the form below and we&apos;ll get back to you shortly
            </p>
          </div>

          {/* Success Message */}
          {submitStatus === 'success' && (
            <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl flex items-start space-x-3 animate-fade-in">
              <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 pt-1">
                <p className="font-semibold text-green-900 mb-1">Success!</p>
                <p className="text-sm text-green-800">{submitMessage}</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {submitStatus === 'error' && (
            <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-xl flex items-start space-x-3 animate-fade-in">
              <div className="flex-shrink-0 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">!</span>
              </div>
              <div className="flex-1 pt-1">
                <p className="font-semibold text-red-900 mb-1">Error</p>
                <p className="text-sm text-red-800">{submitMessage}</p>
              </div>
            </div>
          )}
              
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name & Email Row */}
            <div className="grid sm:grid-cols-2 gap-5">
              {/* Name Field */}
              <div className="group">
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className={`w-5 h-5 transition-colors ${errors.name ? 'text-red-500' : 'text-gray-400 group-focus-within:text-red-500'}`} />
                  </div>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    {...register('name')}
                    className={`pl-10 h-12 text-sm !bg-white border-2 transition-all duration-200 ${
                      errors.name 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                        : 'border-gray-200 focus:border-red-400 focus:ring-red-400/20 hover:border-gray-300'
                    }`}
                    disabled={isSubmitting}
                  />
                </div>
                {errors.name && (
                  <p className="mt-1.5 text-xs text-red-600 flex items-center">
                    <span className="w-1 h-1 bg-red-600 rounded-full mr-1.5"></span>
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div className="group">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className={`w-5 h-5 transition-colors ${errors.email ? 'text-red-500' : 'text-gray-400 group-focus-within:text-red-500'}`} />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    {...register('email')}
                    className={`pl-10 h-12 text-sm !bg-white border-2 transition-all duration-200 ${
                      errors.email 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                        : 'border-gray-200 focus:border-red-400 focus:ring-red-400/20 hover:border-gray-300'
                    }`}
                    disabled={isSubmitting}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1.5 text-xs text-red-600 flex items-center">
                    <span className="w-1 h-1 bg-red-600 rounded-full mr-1.5"></span>
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            {/* Phone & Interest Row */}
            <div className="grid sm:grid-cols-2 gap-5">
              {/* Phone Field */}
              <div className="group">
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number <span className="text-gray-400 text-xs">(optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className={`w-5 h-5 transition-colors ${errors.phone ? 'text-red-500' : 'text-gray-400 group-focus-within:text-red-500'}`} />
                  </div>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    {...register('phone')}
                    className={`pl-10 h-12 text-sm !bg-white border-2 transition-all duration-200 ${
                      errors.phone 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                        : 'border-gray-200 focus:border-red-400 focus:ring-red-400/20 hover:border-gray-300'
                    }`}
                    disabled={isSubmitting}
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1.5 text-xs text-red-600 flex items-center">
                    <span className="w-1 h-1 bg-red-600 rounded-full mr-1.5"></span>
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Interest Field */}
              <div className="group">
                <label htmlFor="interest" className="block text-sm font-semibold text-gray-700 mb-2">
                  Program of Interest <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <BookOpen className={`w-5 h-5 transition-colors ${errors.interest ? 'text-red-500' : 'text-gray-400 group-focus-within:text-red-500'}`} />
                  </div>
                  <Select 
                    value={watch('interest')} 
                    onValueChange={(value) => setValue('interest', value)}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className={`pl-10 h-12 text-sm !bg-white border-2 transition-all duration-200 w-full ${
                      errors.interest 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                        : 'border-gray-200 focus:border-red-400 focus:ring-red-400/20 hover:border-gray-300'
                    }`}>
                      <SelectValue placeholder="Choose a program" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank-po">🏦 Bank PO & Clerk</SelectItem>
                      <SelectItem value="ssc-cgl">📚 SSC & CGL</SelectItem>
                      <SelectItem value="other-exams">📝 Other Competitive Exams</SelectItem>
                      <SelectItem value="public-speaking">🎤 Public Speaking</SelectItem>
                      <SelectItem value="general-knowledge">🧠 General Knowledge</SelectItem>
                      <SelectItem value="skill-development">💼 Leadership & Skills</SelectItem>
                      <SelectItem value="other">✨ Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {errors.interest && (
                  <p className="mt-1.5 text-xs text-red-600 flex items-center">
                    <span className="w-1 h-1 bg-red-600 rounded-full mr-1.5"></span>
                    {errors.interest.message}
                  </p>
                )}
              </div>
            </div>

            {/* Message Field */}
            <div className="group">
              <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                Your Message <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3 pointer-events-none">
                  <MessageSquare className={`w-5 h-5 transition-colors ${errors.message ? 'text-red-500' : 'text-gray-400 group-focus-within:text-red-500'}`} />
                </div>
                <Textarea
                  id="message"
                  {...register('message')}
                  rows={5}
                  placeholder="Tell us about your learning goals, questions, or how we can help you succeed..."
                  className={`pl-11 pt-3 text-sm !bg-white border-2 transition-all duration-200 resize-none ${
                    errors.message 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                      : 'border-gray-200 focus:border-red-400 focus:ring-red-400/20 hover:border-gray-300'
                  }`}
                  disabled={isSubmitting}
                />
              </div>
              {errors.message && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center">
                  <span className="w-1 h-1 bg-red-600 rounded-full mr-1.5"></span>
                  {errors.message.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-gradient-to-r from-red-600 via-red-600 to-red-700 hover:from-red-700 hover:via-red-700 hover:to-red-800 text-white text-base font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none group"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  <span>Sending your message...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2 transition-transform group-hover:translate-x-1" />
                  <span>Send Message</span>
                </>
              )}
            </Button>

            {/* Privacy Note */}
            <p className="text-xs text-center text-gray-500 mt-4">
              🔒 Your information is secure and will never be shared with third parties.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}