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
      // Submit contact form
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
      <CardContent className="p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Send us a Message
        </h3>

        {/* Status Messages */}
        {submitStatus === 'success' && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p className="text-green-800 text-sm">{submitMessage}</p>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-800 text-sm">{submitMessage}</p>
          </div>
        )}
              
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-gray-700 mb-2 font-semibold text-sm">
              Full Name *
            </label>
            <Input
              id="name"
              type="text"
              {...register('name')}
              className={`w-full border-gray-300 focus:border-red-500 focus:ring-red-500 h-10 text-sm ${
                errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
              }`}
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-gray-700 mb-2 font-semibold text-sm">
              Email Address *
            </label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              className={`w-full border-gray-300 focus:border-red-500 focus:ring-red-500 h-10 text-sm ${
                errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
              }`}
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-gray-700 mb-2 font-semibold text-sm">
              Phone Number
            </label>
            <Input
              id="phone"
              type="tel"
              {...register('phone')}
              className={`w-full border-gray-300 focus:border-red-500 focus:ring-red-500 h-10 text-sm ${
                errors.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
              }`}
              disabled={isSubmitting}
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="interest" className="block text-gray-700 mb-2 font-semibold text-sm">
              Interested Course/Program *
            </label>
            <Select 
              value={watch('interest')} 
              onValueChange={(value) => register('interest').onChange({ target: { value } })}
              disabled={isSubmitting}
            >
              <SelectTrigger className={`w-full border-gray-300 focus:border-red-500 focus:ring-red-500 h-10 text-sm ${
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
              <p className="mt-1 text-xs text-red-600">{errors.interest.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="message" className="block text-gray-700 mb-2 font-semibold text-sm">
              Message *
            </label>
            <Textarea
              id="message"
              {...register('message')}
              className={`w-full border-gray-300 focus:border-red-500 focus:ring-red-500 min-h-[100px] text-sm ${
                errors.message ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
              }`}
              placeholder="Tell us about your learning goals or any questions you have..."
              disabled={isSubmitting}
            />
            {errors.message && (
              <p className="mt-1 text-xs text-red-600">{errors.message.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-base py-2.5 rounded-lg transition-all duration-300 transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-red-500 shadow-lg hover:shadow-red-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending Message...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}