CREATE TABLE public.support_chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_token text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.support_chat_sessions TO service_role;
ALTER TABLE public.support_chat_sessions ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.support_chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.support_chat_sessions(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user','assistant')),
  message jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON public.support_chat_messages(session_id, created_at);
GRANT ALL ON public.support_chat_messages TO service_role;
ALTER TABLE public.support_chat_messages ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text NOT NULL UNIQUE,
  client_token text NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  topic text NOT NULL,
  description text NOT NULL,
  status text NOT NULL DEFAULT 'abierto' CHECK (status IN ('abierto','en_revision','resuelto','cerrado')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON public.support_tickets(client_token, created_at);
CREATE INDEX ON public.support_tickets(lower(email));
GRANT ALL ON public.support_tickets TO service_role;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;