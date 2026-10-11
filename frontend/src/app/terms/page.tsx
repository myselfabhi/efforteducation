import type { Metadata } from 'next';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'The terms that govern your use of Effort Education — enrolment, subscriptions, acceptable use, and our mutual responsibilities.',
  openGraph: { url: 'https://efforteducation.in/terms' },
};

const CONTACT_EMAIL = 'efforteducation@gmail.com';

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <article className="container mx-auto max-w-3xl px-6 pt-32 md:pt-36 pb-20">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold">Legal</p>
          <h1 className="mt-3 text-4xl md:text-5xl font-black tracking-tight">Terms of Service</h1>
          <p className="mt-3 text-sm text-muted-foreground">Last updated 11 October 2026</p>

          <div
            className="mt-10 space-y-9 text-[15px] leading-relaxed text-muted-foreground
              [&_h2]:text-xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-foreground [&_h2]:mb-3
              [&_p]:mb-3 [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2
              [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_li]:marker:text-primary
              [&_strong]:text-foreground [&_strong]:font-semibold"
          >
            <section>
              <p>
                These Terms govern your use of the website and services of{' '}
                <strong>Effort Education Pvt. Ltd.</strong> (&ldquo;Effort Education&rdquo;,
                &ldquo;we&rdquo;, &ldquo;us&rdquo;). By accessing the site, enquiring, or enrolling, you
                agree to these Terms. If you don&rsquo;t agree, please don&rsquo;t use the service.
              </p>
            </section>

            <section>
              <h2>The service</h2>
              <p>
                Effort Education provides live online coaching, quizzes, study materials, and related
                programs for competitive exams and young learners. Features, schedules, and course
                content may change as we improve the platform.
              </p>
            </section>

            <section>
              <h2>Eligibility and accounts</h2>
              <p>
                You&rsquo;re responsible for the accuracy of the information you provide and for keeping
                your account credentials secure. Accounts are for a single user and must not be shared.
                A child&rsquo;s account in the Young Scholar program is set up and supervised by a
                parent or guardian, who accepts these Terms on the child&rsquo;s behalf.
              </p>
            </section>

            <section>
              <h2>Enrolment, fees, and subscriptions</h2>
              <p>
                You can enquire through the website and a counsellor will guide you through joining a
                program and its fees. Where a program is billed online, payments are processed through
                our payment provider. Subscriptions renew automatically for the stated period until you
                cancel, and cancelling stops future renewals; it does not retroactively refund the
                current period unless stated otherwise.
              </p>
            </section>

            <section>
              <h2>Cancellations and refunds</h2>
              <p>
                Cancellation and refund terms for a specific program are shared with you at the time of
                enrolment and form part of your agreement with us. If you have a question about a charge,
                contact us and we&rsquo;ll help.
              </p>
            </section>

            <section>
              <h2>Acceptable use</h2>
              <ul>
                <li>Use the platform honestly &mdash; no cheating, automation, or manipulating quizzes or scores.</li>
                <li>Don&rsquo;t share, resell, or redistribute classes, recordings, or materials.</li>
                <li>Don&rsquo;t disrupt the service, other users, or our systems.</li>
                <li>Don&rsquo;t misuse another person&rsquo;s account or impersonate anyone.</li>
              </ul>
            </section>

            <section>
              <h2>Live classes and recordings</h2>
              <p>
                Live classes may be recorded for the benefit of enrolled students. Recordings and
                materials are provided for your personal learning within your batch and may not be
                downloaded for redistribution or shared outside the platform.
              </p>
            </section>

            <section>
              <h2>Intellectual property</h2>
              <p>
                All course content, recordings, question banks, branding, and the platform itself are
                owned by Effort Education or its licensors. We grant you a limited, personal,
                non-transferable right to access them for your own learning while enrolled.
              </p>
            </section>

            <section>
              <h2>No guarantee of results</h2>
              <p>
                We work hard to help you succeed, but exam outcomes depend on many factors. We do not
                guarantee any particular result, rank, selection, or score. Any statistics we share are
                historical and are not a promise of future results.
              </p>
            </section>

            <section>
              <h2>Limitation of liability</h2>
              <p>
                The service is provided on an &ldquo;as is&rdquo; basis. To the extent permitted by law,
                Effort Education is not liable for indirect or consequential losses, and our total
                liability relating to the service is limited to the amount you paid us for it in the
                preceding three months.
              </p>
            </section>

            <section>
              <h2>Governing law</h2>
              <p>
                These Terms are governed by the laws of India, and the courts at our place of business
                have jurisdiction over any dispute.
              </p>
            </section>

            <section>
              <h2>Changes</h2>
              <p>
                We may update these Terms from time to time. Continued use of the service after an
                update means you accept the revised Terms.
              </p>
            </section>

            <section>
              <h2>Contact us</h2>
              <p>
                Questions about these Terms? Email{' '}
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> or call +91&nbsp;99103&nbsp;35093.
              </p>
            </section>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
