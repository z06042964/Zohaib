import { Link } from "react-router-dom";
import LegalPageLayout from "../components/layout/LegalPageLayout";
import LegalSection from "../components/legal/LegalSection";

export default function TermsOfService() {
  return (
    <LegalPageLayout title="Terms and Conditions" lastUpdated="May 23, 2026">
      <LegalSection title="Agreement to Terms">
        <p>
          These Terms and Conditions (&quot;Terms&quot;) govern your access to and
          use of the PixelCraft AI website and image processing tools
          (collectively, the &quot;Service&quot;). By accessing or using the Service,
          you agree to be bound by these Terms. If you do not agree, you must not
          use the Service.
        </p>
      </LegalSection>

      <LegalSection title="Description of Service">
        <p>
          PixelCraft AI provides online image utilities, including but not limited
          to background removal, image format conversion, and image compression.
          Some tools operate entirely in your browser; others may rely on
          third-party APIs to process your content.
        </p>
        <p>
          We may update, suspend, or discontinue any part of the Service at any
          time without prior notice.
        </p>
      </LegalSection>

      <LegalSection title="Eligibility">
        <p>
          You must be at least 13 years old to use the Service. By using PixelCraft
          AI, you represent that you meet this requirement and have the legal
          capacity to enter into these Terms.
        </p>
      </LegalSection>

      <LegalSection title="User Responsibilities">
        <p>You are solely responsible for:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Images and content you upload or process through the Service</li>
          <li>Ensuring you have the right to use, modify, and distribute such content</li>
          <li>Compliance with applicable laws, including copyright and privacy laws</li>
          <li>Maintaining the security of your device and internet connection</li>
        </ul>
        <p>
          You agree not to upload content that is illegal, harmful, offensive,
          infringing, or otherwise violates the rights of others.
        </p>
      </LegalSection>

      <LegalSection title="Acceptable Use">
        <p>You agree not to:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Use the Service for any unlawful or fraudulent purpose</li>
          <li>Attempt to reverse engineer, disrupt, or overload our systems</li>
          <li>Use automated scripts or bots to abuse the Service or API limits</li>
          <li>Upload malware, viruses, or harmful code</li>
          <li>Misrepresent your identity or affiliation with any person or entity</li>
        </ul>
        <p>
          We reserve the right to restrict or terminate access for users who violate
          these Terms.
        </p>
      </LegalSection>

      <LegalSection title="Intellectual Property">
        <p>
          The PixelCraft AI name, logo, website design, and original content are
          owned by us or our licensors and are protected by intellectual property
          laws. You may not copy, modify, or distribute our branding without prior
          written permission.
        </p>
        <p>
          You retain ownership of images you upload. By using the Service, you
          grant us a limited, temporary license to process your content solely to
          provide the requested functionality (including transmission to
          third-party processors where applicable).
        </p>
      </LegalSection>

      <LegalSection title="Third-Party Services">
        <p>
          The Background Remover tool uses the remove.bg API. Your use of that
          feature is also subject to remove.bg&apos;s terms and policies. We are
          not responsible for the practices, availability, or performance of
          third-party services.
        </p>
        <p>
          Links to external websites are provided for convenience only. We do not
          endorse or assume responsibility for third-party content.
        </p>
      </LegalSection>

      <LegalSection title="Disclaimer of Warranties">
        <p>
          The Service is provided on an &quot;as is&quot; and &quot;as available&quot;
          basis without warranties of any kind, whether express or implied,
          including but not limited to warranties of merchantability, fitness for a
          particular purpose, or non-infringement.
        </p>
        <p>
          We do not guarantee that processed images will meet your expectations,
          that the Service will be uninterrupted or error-free, or that results will
          be accurate in every case.
        </p>
      </LegalSection>

      <LegalSection title="Limitation of Liability">
        <p>
          To the fullest extent permitted by law, PixelCraft AI and its operators
          shall not be liable for any indirect, incidental, special, consequential,
          or punitive damages arising from your use of the Service, including loss
          of data, profits, or business opportunities.
        </p>
        <p>
          Our total liability for any claim related to the Service shall not exceed
          the amount you paid us in the twelve (12) months preceding the claim, or
          zero if you used the Service for free.
        </p>
      </LegalSection>

      <LegalSection title="Indemnification">
        <p>
          You agree to indemnify and hold harmless PixelCraft AI from any claims,
          damages, losses, or expenses (including reasonable legal fees) arising
          from your use of the Service, your uploaded content, or your violation
          of these Terms.
        </p>
      </LegalSection>

      <LegalSection title="Free and Paid Features">
        <p>
          Certain tools may be offered free of charge with usage limits. We may
          introduce paid features or subscriptions in the future. Any paid
          offerings will be subject to additional terms disclosed at the time of
          purchase.
        </p>
      </LegalSection>

      <LegalSection title="Changes to These Terms">
        <p>
          We may revise these Terms at any time. Updated Terms will be posted on
          this page with a revised &quot;Last updated&quot; date. Your continued use
          of the Service after changes constitutes acceptance of the new Terms.
        </p>
      </LegalSection>

      <LegalSection title="Governing Law">
        <p>
          These Terms shall be governed by and construed in accordance with
          applicable laws, without regard to conflict of law principles. Any
          disputes shall be resolved in the courts of competent jurisdiction as
          determined by applicable law.
        </p>
      </LegalSection>

      <LegalSection title="Contact Us">
        <p>
          For questions about these Terms and Conditions, please contact us at:
        </p>
        <p>
          <a
            href="mailto:legal@pixelcraft.ai"
            className="font-medium text-brand-600 hover:underline"
          >
            legal@pixelcraft.ai
          </a>
        </p>
        <p>
          See also our{" "}
          <Link to="/privacy" className="font-medium text-brand-600 hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
