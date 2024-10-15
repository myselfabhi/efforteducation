import CourseSection from "./component/landing-page/course_section";
import FAQSection from "./component/landing-page/faq_section";

import FeatureSection from "./component/landing-page/feature_section";
import HomePage from "./component/landing-page/hero_section";
import WhyChooseUsSection from "./component/landing-page/why_choose_us";
import HomeLayout from "./component/layouts/home_layout";

export default function LandingPage() {
    return (
        <HomeLayout isLandingPage={true}>
            <HomePage />
            <FeatureSection />
            <CourseSection />
            <WhyChooseUsSection/>
            {/* <BlogSection/> */}
            <FAQSection />
        </HomeLayout>
    );
}
