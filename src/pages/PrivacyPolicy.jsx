import LegalPageLayout from "../components/layout/LegalPageLayout";
import LegalSection from "../components/legal/LegalSection";
import useSiteTitle from "../hooks/useSiteTitle";

export default function PrivacyPolicy() {
  const siteTitle = useSiteTitle();

  return (
    <LegalPageLayout title="Privacy Policy" lastUpdated="May 23, 2026">
      <LegalSection title="Introduction">
        <p>
          Welcome to {siteTitle} (&quot;we,&quot; &quot;our,&quot; or
          &quot;us&quot;). We respect your privacy and are committed to protecting
          your personal information. This Privacy Policy explains how we collect,
          use, and safeguard information when you use our website and image
          processing tools.
        </p>
        <p>
          By using {siteTitle}, you agree to the practices described in this
          policy. If you do not agree, please do not use our services.
        </p>
      </LegalSection>

      <LegalSection title="Information We Collect">
        <p>
          <strong className="text-slate-800">Images you upload:</strong> When you
          use our tools, you may upload images for processing. Our Image
          Converter and Image Compressor process files locally in your browser
          whenever possible, meaning those images are not sent to our servers.
        </p>
        <p>
          <strong className="text-slate-800">Background Remover:</strong> Images
          submitted through the Background Remover are sent to our third-party
          provider, remove.bg, solely to perform background removal. We do not
          store your images on our own servers after processing is complete.
        </p>
        <p>
          <strong className="text-slate-800">Usage data:</strong> We may collect
          non-personal technical information such as browser type, device type,
          pages visited, and general usage statistics to improve our website
          performance and user experience.
        </p>
        <p>
          <strong className="text-slate-800">Contact information:</strong> If you
          contact us by email or through a contact form, we collect the
          information you provide (such as your name and email address) to
          respond to your inquiry.
        </p>
      </LegalSection>

      <LegalSection title="How We Use Your Information">
        <p>We use collected information to:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Provide and operate our image tools</li>
          <li>Process background removal requests through trusted API partners</li>
          <li>Improve website functionality, security, and performance</li>
          <li>Respond to support requests and user feedback</li>
          <li>Comply with legal obligations</li>
        </ul>
        <p>
          We do not sell, rent, or trade your personal information to third parties
          for marketing purposes.
        </p>
      </LegalSection>

      <LegalSection title="Third-Party Services">
        <p>
          Our Background Remover uses the remove.bg API to process images. When
          you use this tool, your image is transmitted to remove.bg in accordance
          with their privacy policy and terms of service. We encourage you to
          review{" "}
          <a
            href="https://www.remove.bg/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-brand-600 hover:underline"
          >
            remove.bg&apos;s Privacy Policy
          </a>{" "}
          for details on how they handle uploaded content.
        </p>
        <p>
          We may also use standard web technologies (such as hosting providers)
          that process limited technical data necessary to deliver our website.
        </p>
      </LegalSection>

      <LegalSection title="Data Retention">
        <p>
          Images processed in your browser (converter and compressor tools) are
          not retained by us. For the Background Remover, remove.bg may retain
          uploaded images temporarily according to their own retention policies.
          We do not maintain a permanent archive of user-uploaded images on our
          systems.
        </p>
      </LegalSection>

      <LegalSection title="Cookies">
        <p>
          We may use essential cookies or similar technologies required for basic
          site functionality. We do not use cookies to track you across other
          websites. You can control cookie preferences through your browser
          settings.
        </p>
      </LegalSection>

      <LegalSection title="Data Security">
        <p>
          We implement reasonable technical and organizational measures to protect
          information transmitted through our website. However, no method of
          transmission over the internet is 100% secure, and we cannot guarantee
          absolute security.
        </p>
      </LegalSection>

      <LegalSection title="Your Rights">
        <p>
          Depending on your location, you may have rights to access, correct,
          delete, or restrict the use of your personal data. To exercise these
          rights, please contact us using the information below.
        </p>
      </LegalSection>

      <LegalSection title="Children's Privacy">
        <p>
          {siteTitle} is not intended for children under 13 years of age. We do
          not knowingly collect personal information from children. If you believe
          a child has provided us with personal data, please contact us so we can
          remove it.
        </p>
      </LegalSection>

      <LegalSection title="Changes to This Policy">
        <p>
          We may update this Privacy Policy from time to time. Changes will be
          posted on this page with an updated &quot;Last updated&quot; date.
          Continued use of our website after changes constitutes acceptance of
          the revised policy.
        </p>
      </LegalSection>

      <LegalSection title="Contact Us">
        <p>
          If you have questions about this Privacy Policy or our data practices,
          please contact us at:
        </p>
        <p>
          <a
            href="mailto:privacy@imgoraa.ai"
            className="font-medium text-brand-600 hover:underline"
          >
            privacy@imgoraa.ai
          </a>
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
