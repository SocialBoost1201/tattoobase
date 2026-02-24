--
-- PostgreSQL database dump
--

\restrict axrPbKN2DwMPyXJ9pWawpdakzhJ04gyFYl9QGfaeeaOnbI059uJFPbAVGU2c4xB

-- Dumped from database version 16.12 (Homebrew)
-- Dumped by pg_dump version 16.12 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: BookingStatus; Type: TYPE; Schema: public; Owner: takumashinnyo
--

CREATE TYPE public."BookingStatus" AS ENUM (
    'Draft',
    'PendingPolicyAgree',
    'PendingPayment',
    'Confirmed',
    'PendingConsent',
    'PendingKYC',
    'ReadyForCheckin',
    'InProgress',
    'Completed',
    'CancelledByUser',
    'CancelledByStudio',
    'NoShow',
    'Disputed'
);


ALTER TYPE public."BookingStatus" OWNER TO takumashinnyo;

--
-- Name: PaymentStatus; Type: TYPE; Schema: public; Owner: takumashinnyo
--

CREATE TYPE public."PaymentStatus" AS ENUM (
    'Pending',
    'Succeeded',
    'Failed',
    'Refunded'
);


ALTER TYPE public."PaymentStatus" OWNER TO takumashinnyo;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: AuditLog; Type: TABLE; Schema: public; Owner: takumashinnyo
--

CREATE TABLE public."AuditLog" (
    id text NOT NULL,
    "actorType" text NOT NULL,
    "actorId" text NOT NULL,
    "entityType" text NOT NULL,
    "entityId" text NOT NULL,
    action text NOT NULL,
    "beforeJson" jsonb,
    "afterJson" jsonb,
    "requestId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."AuditLog" OWNER TO takumashinnyo;

--
-- Name: Booking; Type: TABLE; Schema: public; Owner: takumashinnyo
--

CREATE TABLE public."Booking" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "studioId" text NOT NULL,
    status public."BookingStatus" DEFAULT 'Draft'::public."BookingStatus" NOT NULL,
    "scheduledAtUtc" timestamp(3) without time zone,
    "scheduledAtLocal" timestamp(3) without time zone,
    "studioTz" text,
    "policySnapshot" jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Booking" OWNER TO takumashinnyo;

--
-- Name: ConsentDocument; Type: TABLE; Schema: public; Owner: takumashinnyo
--

CREATE TABLE public."ConsentDocument" (
    id text NOT NULL,
    version text NOT NULL,
    locale text NOT NULL,
    hash text NOT NULL,
    "isPublished" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."ConsentDocument" OWNER TO takumashinnyo;

--
-- Name: KYCSubmission; Type: TABLE; Schema: public; Owner: takumashinnyo
--

CREATE TABLE public."KYCSubmission" (
    id text NOT NULL,
    "bookingId" text NOT NULL,
    "encryptedFilePath" text NOT NULL,
    "birthDate" timestamp(3) without time zone NOT NULL,
    status text NOT NULL,
    "reviewedBy" text,
    "reviewedAt" timestamp(3) without time zone
);


ALTER TABLE public."KYCSubmission" OWNER TO takumashinnyo;

--
-- Name: Payment; Type: TABLE; Schema: public; Owner: takumashinnyo
--

CREATE TABLE public."Payment" (
    id text NOT NULL,
    "bookingId" text NOT NULL,
    "paymentIntentId" text NOT NULL,
    status public."PaymentStatus" DEFAULT 'Pending'::public."PaymentStatus" NOT NULL,
    amount integer NOT NULL,
    currency text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Payment" OWNER TO takumashinnyo;

--
-- Name: WebhookEvent; Type: TABLE; Schema: public; Owner: takumashinnyo
--

CREATE TABLE public."WebhookEvent" (
    id text NOT NULL,
    type text NOT NULL,
    "receivedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "processingStartedAt" timestamp(3) without time zone,
    "lockExpiresAt" timestamp(3) without time zone,
    "processedAt" timestamp(3) without time zone,
    "errorJson" jsonb,
    "processingResultJson" jsonb
);


ALTER TABLE public."WebhookEvent" OWNER TO takumashinnyo;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: takumashinnyo
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO takumashinnyo;

--
-- Data for Name: AuditLog; Type: TABLE DATA; Schema: public; Owner: takumashinnyo
--

COPY public."AuditLog" (id, "actorType", "actorId", "entityType", "entityId", action, "beforeJson", "afterJson", "requestId", "createdAt") FROM stdin;
\.


--
-- Data for Name: Booking; Type: TABLE DATA; Schema: public; Owner: takumashinnyo
--

COPY public."Booking" (id, "userId", "studioId", status, "scheduledAtUtc", "scheduledAtLocal", "studioTz", "policySnapshot", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: ConsentDocument; Type: TABLE DATA; Schema: public; Owner: takumashinnyo
--

COPY public."ConsentDocument" (id, version, locale, hash, "isPublished") FROM stdin;
\.


--
-- Data for Name: KYCSubmission; Type: TABLE DATA; Schema: public; Owner: takumashinnyo
--

COPY public."KYCSubmission" (id, "bookingId", "encryptedFilePath", "birthDate", status, "reviewedBy", "reviewedAt") FROM stdin;
\.


--
-- Data for Name: Payment; Type: TABLE DATA; Schema: public; Owner: takumashinnyo
--

COPY public."Payment" (id, "bookingId", "paymentIntentId", status, amount, currency, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: WebhookEvent; Type: TABLE DATA; Schema: public; Owner: takumashinnyo
--

COPY public."WebhookEvent" (id, type, "receivedAt", "processingStartedAt", "lockExpiresAt", "processedAt", "errorJson", "processingResultJson") FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: takumashinnyo
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
2c74e7a7-ef1e-42b7-99df-81ac4f1e63ca	72a7f8e207c1c24a0beec5bda470b3e32add4d6875e2f38243f53cd8966f7201	2026-02-22 18:12:18.343905+09	20260222091218_baseline_v2_0_0	\N	\N	2026-02-22 18:12:18.333234+09	1
\.


--
-- Name: AuditLog AuditLog_pkey; Type: CONSTRAINT; Schema: public; Owner: takumashinnyo
--

ALTER TABLE ONLY public."AuditLog"
    ADD CONSTRAINT "AuditLog_pkey" PRIMARY KEY (id);


--
-- Name: Booking Booking_pkey; Type: CONSTRAINT; Schema: public; Owner: takumashinnyo
--

ALTER TABLE ONLY public."Booking"
    ADD CONSTRAINT "Booking_pkey" PRIMARY KEY (id);


--
-- Name: ConsentDocument ConsentDocument_pkey; Type: CONSTRAINT; Schema: public; Owner: takumashinnyo
--

ALTER TABLE ONLY public."ConsentDocument"
    ADD CONSTRAINT "ConsentDocument_pkey" PRIMARY KEY (id);


--
-- Name: KYCSubmission KYCSubmission_pkey; Type: CONSTRAINT; Schema: public; Owner: takumashinnyo
--

ALTER TABLE ONLY public."KYCSubmission"
    ADD CONSTRAINT "KYCSubmission_pkey" PRIMARY KEY (id);


--
-- Name: Payment Payment_pkey; Type: CONSTRAINT; Schema: public; Owner: takumashinnyo
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_pkey" PRIMARY KEY (id);


--
-- Name: WebhookEvent WebhookEvent_pkey; Type: CONSTRAINT; Schema: public; Owner: takumashinnyo
--

ALTER TABLE ONLY public."WebhookEvent"
    ADD CONSTRAINT "WebhookEvent_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: takumashinnyo
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: ConsentDocument_version_locale_key; Type: INDEX; Schema: public; Owner: takumashinnyo
--

CREATE UNIQUE INDEX "ConsentDocument_version_locale_key" ON public."ConsentDocument" USING btree (version, locale);


--
-- Name: KYCSubmission_bookingId_key; Type: INDEX; Schema: public; Owner: takumashinnyo
--

CREATE UNIQUE INDEX "KYCSubmission_bookingId_key" ON public."KYCSubmission" USING btree ("bookingId");


--
-- Name: Payment_paymentIntentId_key; Type: INDEX; Schema: public; Owner: takumashinnyo
--

CREATE UNIQUE INDEX "Payment_paymentIntentId_key" ON public."Payment" USING btree ("paymentIntentId");


--
-- Name: Payment Payment_bookingId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: takumashinnyo
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES public."Booking"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

\unrestrict axrPbKN2DwMPyXJ9pWawpdakzhJ04gyFYl9QGfaeeaOnbI059uJFPbAVGU2c4xB

