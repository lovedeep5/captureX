import { COMPANY_EMAIL, COMPANY_NAME } from "@/constants";
import React from "react";

const page = () => {
  return (
    <div className="w-full max-w-screen-xl p-10 mx-auto">
      <h1 className="font-bold text-2xl ">
        Privacy Policy for Screen Recording and Sharing Service
      </h1>
      <p className="text-sm text-muted-forground italic">
        {" "}
        Last Updated: {`${new Date("2024-06-20")}`}
      </p>
      <p className="mt-10">Welcome to {COMPANY_NAME}!</p>

      <p>
        {COMPANY_NAME} referred to as &quot;we&quot;, &quot;us&quot;, or
        &quot;our&quot; provides a screen recording and sharing service through
        our website. This Privacy Policy explains how we collect, use, disclose,
        and safeguard your information when you use our screen recording
        service.
      </p>
      <h2 className="pt-5">1. Information We Collect</h2>
      <p>
        When you use our screen recording service, we may collect the following
        types of information: Personal Information: When you create an account
        and log in to our service, we collect personal information such as your
        name and email address. Recording Information: We collect recordings of
        your screen and voice when you choose to use our screen recording
        feature. You have the option to mute your voice during recording. Usage
        Information: We may collect information about your interactions with our
        service, such as the duration of recordings and sharing activities.
        Device Information: We may collect information about the device and
        browser you use to access our service, including IP address, browser
        type, and operating system.
      </p>
      <h2 className="pt-5">2. Use of Your Information</h2>
      <p>
        We may use the information we collect for the following purposes: To
        provide, operate, and improve our screen recording service. To
        personalize your experience and deliver content and product offerings
        relevant to your interests. To communicate with you, including
        responding to your inquiries and providing customer support. To enforce
        our terms and policies and protect against fraudulent or illegal
        activity.
      </p>
      <h2 className="pt-5">3. Sharing Your Information</h2>
      <p>
        We do not share your personal information with third parties except as
        described in this Privacy Policy or with your consent. We may share your
        information in the following circumstances: With service providers who
        assist us in providing our service (e.g., hosting providers). When
        required by law or to protect our rights.
      </p>
      <h2 className="pt-5">4. Data Retention</h2>
      <p>
        As of this Beta version, we retain recordings for a period of up to one
        month. We reserve the right to delete recordings with or without notice
        if they do not align with our service plans or if they contain offensive
        content.
      </p>
      <h2 className="pt-5">5. Security of Your Information</h2>
      <p>
        We take reasonable measures to protect your information from
        unauthorized access or disclosure. However, no method of transmission
        over the Internet or electronic storage is completely secure.
      </p>
      <h2 className="pt-5">6. Changes to This Privacy Policy</h2>
      <p>
        We may update this Privacy Policy from time to time to reflect changes
        in our practices. We will notify you of any changes by posting the new
        policy on our website.
      </p>
      <h2 className="pt-5">7. Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy or our practices,
        please contact us at {COMPANY_EMAIL}. By using our screen recording
        service, you agree to the terms of this Privacy Policy.
      </p>
    </div>
  );
};

export default page;
