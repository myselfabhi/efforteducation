import type { Metadata } from 'next';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How Effort Education collects, uses, and protects your personal information — including information about children enrolled in the Young Scholar program.',
  openGraph: { url: 'https://efforteducation.in/privacy' },
};

const CONTACT_EMAIL = 'admissions@efforteducation.com';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <article className="container mx-auto max-w-3xl px-6 pt-32 md:pt-36 pb-20">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold">Legal</p>
          <h1 className="mt-3 text-4xl md:text-5xl font-black tracking-tight">Privacy Policy</h1>
          <p className="mt-3 text-sm text-muted-foreground">Last updated 10 October 2026</p>

          <div
            className="mt-10 space-y-9 text-[15px] leading-relaxed text-muted-foreground
              [&_h2]:text-xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-foreground [&_h2]:mb-3
              [&_p]:mb-3 [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2
              [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_li]:marker:text-primary
              [&_strong]:text-foreground [&_strong]:font-semibold"
          >
            <section>
              <p>
                This Privacy Policy explains how <strong>Effort Education</strong> (&ldquo;we&rdquo;,
                &ldquo;us&rdquo;) collects, uses, shares, and protects your personal information when
                you visit efforteducation.in, enquire about our programs, or enrol as a student. By
                using our website or services, you agree to the practices described here.
              </p>
            </section>

            <section>
              <h2>Information we collect</h2>
              <p>We only collect what we need to respond to you and run our programs:</p>
              <ul>
                <li>
                  <strong>Enquiry details</strong> — when you request a call, you give us your name,
                  phone number, the program you&rsquo;re interested in, and any note you add.
                </li>
                <li>
                  <strong>Account details</strong> — if you create an account, we store your name,
                  username, email, phone, and (for students) class or level.
                </li>
                <li>
                  <strong>Program activity</strong> — attendance in live classes, quiz participation
                  and scores, and materials you access, so we can deliver and improve the service.
                </li>
                <li>
                  <strong>Technical data</strong> — basic device and usage information collected
                  automatically to keep the site secure and working.
                </li>
              </ul>
            </section>

            <section>
              <h2>How we use your information</h2>
              <ul>
                <li>To respond to your enquiry and help you choose and join a program.</li>
                <li>To provide classes, quizzes, materials, and account features.</li>
                <li>To send you class reminders, updates, and administrative messages.</li>
                <li>To process payments where you enrol in a paid program.</li>
                <li>To keep our platform safe, prevent misuse, and meet legal obligations.</li>
              </ul>
            </section>

            <section>
              <h2>How we contact you</h2>
              <p>
                We may contact you by phone, WhatsApp, or email about your enquiry or enrolment. We
                do not sell your contact details, and we don&rsquo;t send marketing you haven&rsquo;t
                asked for. You can ask us to stop contacting you at any time.
              </p>
            </section>

            <section>
              <h2>Children and the Young Scholar program</h2>
              <p>
                The Young Scholar program is for children (roughly ages 8&ndash;14), and a parent or
                guardian enrols the child and provides their information. We rely on that parental
                consent to collect and process a child&rsquo;s information, and we use it only to run
                the program. A parent or guardian can review, correct, or request deletion of their
                child&rsquo;s information by contacting us.
              </p>
            </section>

            <section>
              <h2>Cookies and analytics</h2>
              <p>
                We use essential cookies to keep you signed in and the site functioning, and limited
                analytics to understand how the site is used. You can control cookies through your
                browser settings; disabling essential cookies may affect how the site works.
              </p>
            </section>

            <section>
              <h2>Sharing and disclosure</h2>
              <p>
                We don&rsquo;t sell your personal information. We share it only with trusted service
                providers who help us run the platform &mdash; such as hosting, payment processing,
                and messaging &mdash; and only to the extent they need it. We may also disclose
                information where required by law or to protect our users and our rights.
              </p>
            </section>

            <section>
              <h2>Data retention and security</h2>
              <p>
                We keep your information for as long as needed to provide the service and meet legal
                requirements, then delete or anonymise it. We use reasonable technical and
                organisational measures to protect your information, though no system can be
                guaranteed completely secure.
              </p>
            </section>

            <section>
              <h2>Your rights</h2>
              <p>
                You may ask us to access, correct, or delete your personal information, or to stop
                certain uses of it. To make a request, email{' '}
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> and we&rsquo;ll respond within
                a reasonable time.
              </p>
            </section>

            <section>
              <h2>Changes to this policy</h2>
              <p>
                We may update this policy from time to time. We&rsquo;ll post the revised version here
                with a new &ldquo;last updated&rdquo; date.
              </p>
            </section>

            <section>
              <h2>Contact us</h2>
              <p>
                Questions or privacy requests? Email{' '}
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
