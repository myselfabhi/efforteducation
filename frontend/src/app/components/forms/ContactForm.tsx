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
import { Loader2, CheckCircle, XCircle, Send } from 'lucide-react';

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
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
      // Submit to backend API
      const response = await api.submitContactForm({
        name: data.name,
        email: data.email,
        phone: data.phone,
        interest: data.interest,
        message: data.message
      });

      if (response.success) {
        setSubmitStatus('success');
        setSubmitMessage('Thank you for your message! We will get back to you within 24 hours.');
        reset();
      } else {
        throw new Error(response.error || 'Failed to submit form');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
      setSubmitMessage('Sorry, there was an error sending your message. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border border-gray-200 shadow-xl bg-white">
      <CardContent className="p-10">
        <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Send us a Message
        </h3>

        {/* Status Messages */}
        {submitStatus === 'success' && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3">
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
            <p className="text-green-800 font-medium">{submitMessage}</p>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
            <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
            <p className="text-red-800 font-medium">{submitMessage}</p>
          </div>
        )}
              
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div>
            <label htmlFor="name" className="block text-gray-700 mb-3 font-semibold text-lg">
              Full Name *
            </label>
            <Input
              id="name"
              type="text"
              {...register('name')}
              className={`w-full border-gray-300 focus:border-red-500 focus:ring-red-500 h-12 text-lg ${
                errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
              }`}
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-gray-700 mb-3 font-semibold text-lg">
              Email Address *
            </label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              className={`w-full border-gray-300 focus:border-red-500 focus:ring-red-500 h-12 text-lg ${
                errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
              }`}
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-gray-700 mb-3 font-semibold text-lg">
              Phone Number
            </label>
            <Input
              id="phone"
              type="tel"
              {...register('phone')}
              className={`w-full border-gray-300 focus:border-red-500 focus:ring-red-500 h-12 text-lg ${
                errors.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
              }`}
              disabled={isSubmitting}
            />
            {errors.phone && (
              <p className="mt-2 text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="interest" className="block text-gray-700 mb-3 font-semibold text-lg">
              Interested Course/Program *
            </label>
            <Select 
              value={watch('interest')} 
              onValueChange={(value) => register('interest').onChange({ target: { value } })}
              disabled={isSubmitting}
            >
              <SelectTrigger className={`w-full border-gray-300 focus:border-red-500 focus:ring-red-500 h-12 text-lg ${
                errors.interest ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
              }`}>
                <SelectValue placeholder="Select a program" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bank-po">Bank PO & Clerk</SelectItem>
                <SelectItem value="ssc-cgl">SSC & CGL</SelectItem>
                <SelectItem value="other-exams">Other Competitive Exams</SelectItem>
                <SelectItem value="public-speaking">Public Speaking</SelectItem>
                <SelectItem value="general-knowledge">General Knowledge</SelectItem>
                <SelectItem value="skill-development">Leadership & Skills</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.interest && (
              <p className="mt-2 text-sm text-red-600">{errors.interest.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="message" className="block text-gray-700 mb-3 font-semibold text-lg">
              Message *
            </label>
            <Textarea
              id="message"
              {...register('message')}
              className={`w-full border-gray-300 focus:border-red-500 focus:ring-red-500 min-h-[140px] text-lg ${
                errors.message ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
              }`}
              placeholder="Tell us about your learning goals or any questions you have..."
              disabled={isSubmitting}
            />
            {errors.message && (
              <p className="mt-2 text-sm text-red-600">{errors.message.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-xl py-4 rounded-lg transition-all duration-300 transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-red-500 shadow-lg hover:shadow-red-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Sending Message...
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Send Message
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}