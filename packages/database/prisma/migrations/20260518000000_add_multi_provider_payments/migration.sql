-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('STRIPE', 'PAYJP', 'SQUARE', 'LINK', 'STERA');

-- AlterTable: Payment — add provider column
ALTER TABLE "Payment" ADD COLUMN "provider" "PaymentProvider" NOT NULL DEFAULT 'STRIPE';

-- AlterTable: WebhookEvent — add source column
ALTER TABLE "WebhookEvent" ADD COLUMN "source" "PaymentProvider" NOT NULL DEFAULT 'STRIPE';

-- AlterTable: Studio — add defaultPaymentProvider and acceptedPaymentProviders
ALTER TABLE "Studio"
  ADD COLUMN "defaultPaymentProvider" "PaymentProvider" NOT NULL DEFAULT 'STRIPE',
  ADD COLUMN "acceptedPaymentProviders" "PaymentProvider"[] DEFAULT ARRAY['STRIPE']::"PaymentProvider"[];
