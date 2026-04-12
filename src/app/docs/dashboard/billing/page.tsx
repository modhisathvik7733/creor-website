import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import {
  DocsPage,
  DocsSection,
  DocsH3,
  DocsParagraph,
  DocsTable,
  DocsList,
  DocsCallout,
} from "@/components/docs-page";

export const metadata: Metadata = generatePageMetadata({
  title: "Billing & Credits | Creor",
  description:
    "Understand Creor plans, credit balance, subscriptions, and payment management through the dashboard.",
  path: "/docs/dashboard/billing",
});

export default function DashboardBillingPage() {
  return (
    <DocsPage
      breadcrumb="Dashboard & Account"
      title="Billing & Credits"
      description="Creor uses a credit-based billing system. Your credits are consumed by LLM inference (token usage) and cloud agent compute. This page covers plans, credit management, and subscription settings."
      toc={[
        { label: "Plans", href: "#plans" },
        { label: "Credits", href: "#credits" },
        { label: "Adding Credits", href: "#adding-credits" },
        { label: "Subscription Management", href: "#subscription-management" },
        { label: "Invoices", href: "#invoices" },
        { label: "FAQ", href: "#faq" },
      ]}
    >
      <DocsSection id="plans" title="Plans">
        <DocsParagraph>
          Creor offers four plans. All plans include access to the full IDE, local agent, and
          all 19+ LLM providers. The difference is in gateway usage, cloud agent access, and
          support level.
        </DocsParagraph>
        <DocsTable
          headers={["Feature", "Free", "Starter ($20/mo)", "Pro ($40/mo)", "BYOK"]}
          rows={[
            ["Gateway requests", "200/month", "2,000/month", "Unlimited", "N/A (your keys)"],
            ["Cloud agent runs", "5/month", "50/month", "Unlimited", "50/month"],
            ["Included credits", "$0", "$20", "$40", "$0"],
            ["Models", "Haiku, GPT-4o mini", "All models", "All models", "Your provider's models"],
            ["Max context window", "100K tokens", "200K tokens", "1M tokens", "Provider limit"],
            ["RAG / codebase search", "Yes", "Yes", "Yes", "Yes"],
            ["Team members", "1", "5", "Unlimited", "5"],
            ["Support", "Community", "Email", "Priority", "Community"],
          ]}
        />
        <DocsCallout type="info">
          The BYOK (Bring Your Own Key) plan is free and gives you unlimited local agent usage
          with your own API keys. You only pay your LLM provider directly. Cloud agent runs
          and gateway requests still consume Creor credits.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="credits" title="Credits">
        <DocsParagraph>
          Credits are the universal currency for Creor&apos;s paid services. 1 credit = $0.01 USD.
          Credits are consumed by gateway inference and cloud agent compute.
        </DocsParagraph>

        <DocsH3>What Consumes Credits</DocsH3>
        <DocsTable
          headers={["Service", "Credit Cost", "Example"]}
          rows={[
            ["Gateway inference", "Varies by model (see pricing)", "1K input tokens of Claude Sonnet = ~0.3 credits"],
            ["Cloud agent compute", "1 credit per minute", "10-minute agent run = 10 credits"],
            ["Cloud agent inference", "Same as gateway pricing", "Tokens used during cloud agent runs"],
          ]}
        />

        <DocsH3>Credit Balance</DocsH3>
        <DocsParagraph>
          Your current credit balance is shown in the dashboard header and on the Billing page.
          Credits from your subscription are added at the start of each billing cycle. Purchased
          credits do not expire and carry over month to month.
        </DocsParagraph>
        <DocsList
          items={[
            "Subscription credits: reset monthly. Unused subscription credits do not roll over.",
            "Purchased credits: added to your balance immediately. Never expire.",
            "Credits are consumed in real time as you use gateway inference and cloud agents.",
            "When your balance reaches zero, gateway requests and cloud agent runs are paused until you add more credits or your next billing cycle begins.",
          ]}
        />
        <DocsCallout type="warning">
          Set up a low-balance alert in Dashboard &gt; Billing &gt; Alerts to get notified
          before you run out of credits. You can configure the threshold (default: 100 credits).
        </DocsCallout>
      </DocsSection>

      <DocsSection id="adding-credits" title="Adding Credits">
        <DocsParagraph>
          Purchase additional credits from the Billing page in the dashboard. Payments are
          processed by Dodo Payments.
        </DocsParagraph>

        <DocsH3>How to Add Credits</DocsH3>
        <DocsList
          items={[
            "Go to Dashboard > Billing > Add Credits.",
            "Select a credit amount or enter a custom amount (minimum $5).",
            "Complete payment via Dodo Payments (credit card, debit card, or supported payment methods).",
            "Credits are added to your balance within seconds.",
          ]}
        />

        <DocsH3>Credit Packages</DocsH3>
        <DocsTable
          headers={["Package", "Credits", "Price", "Bonus"]}
          rows={[
            ["Small", "500", "$5.00", "None"],
            ["Medium", "2,500", "$25.00", "None"],
            ["Large", "5,500", "$50.00", "500 bonus credits (10%)"],
            ["XL", "12,000", "$100.00", "2,000 bonus credits (20%)"],
          ]}
        />
        <DocsParagraph>
          Larger packages include bonus credits. For high-volume usage, contact sales for
          custom enterprise pricing.
        </DocsParagraph>
      </DocsSection>

      <DocsSection id="subscription-management" title="Subscription Management">
        <DocsParagraph>
          Manage your subscription from Dashboard &gt; Billing &gt; Subscription.
        </DocsParagraph>

        <DocsH3>Upgrading</DocsH3>
        <DocsParagraph>
          Upgrading takes effect immediately. You are charged a prorated amount for the
          remainder of the current billing cycle, and the new plan&apos;s credits are added
          to your balance.
        </DocsParagraph>

        <DocsH3>Downgrading</DocsH3>
        <DocsParagraph>
          Downgrading takes effect at the end of the current billing cycle. You keep your
          current plan&apos;s features until then. If your usage exceeds the new plan&apos;s
          limits, excess features (team members, cloud agent runs) will be restricted when
          the downgrade activates.
        </DocsParagraph>

        <DocsH3>Canceling</DocsH3>
        <DocsList
          items={[
            "Cancellation takes effect at the end of the billing cycle.",
            "Your account reverts to the Free plan.",
            "Purchased credits remain in your account and do not expire.",
            "Subscription credits are forfeited at cancellation.",
            "Cloud agent configurations are preserved but paused if they exceed Free plan limits.",
          ]}
        />
      </DocsSection>

      <DocsSection id="invoices" title="Invoices">
        <DocsParagraph>
          View and download invoices from Dashboard &gt; Billing &gt; Invoice History.
        </DocsParagraph>
        <DocsList
          items={[
            "Monthly subscription invoices are generated on your billing date.",
            "Credit purchase receipts are generated immediately after payment.",
            "All invoices are available as downloadable PDFs.",
            "Invoice data includes: date, amount, credits received, payment method, and tax information.",
            "For business accounts, add your company name and tax ID in Billing > Tax Information to include them on invoices.",
          ]}
        />
      </DocsSection>

      <DocsSection id="faq" title="FAQ">
        <DocsH3>What happens when I run out of credits?</DocsH3>
        <DocsParagraph>
          Gateway requests and cloud agent runs are paused. Your IDE and local agent continue
          to work if you have BYOK provider keys configured. Add credits or wait for your
          next billing cycle to resume gateway access.
        </DocsParagraph>

        <DocsH3>Can I get a refund for unused credits?</DocsH3>
        <DocsParagraph>
          Subscription credits are non-refundable. Purchased credits can be refunded within
          14 days if unused. Contact support@creor.ai for refund requests.
        </DocsParagraph>

        <DocsH3>Are there overage charges?</DocsH3>
        <DocsParagraph>
          No. Creor never charges you more than your credit balance. When credits run out,
          services pause instead of incurring overage fees.
        </DocsParagraph>

        <DocsH3>Can I set a spending limit?</DocsH3>
        <DocsParagraph>
          Yes. Go to Dashboard &gt; Billing &gt; Spending Limits to set monthly caps for
          gateway usage and cloud agent compute separately.
        </DocsParagraph>
      </DocsSection>
    </DocsPage>
  );
}
