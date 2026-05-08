-- Schedule the late payment processing function to run on the 2nd of every month at 00:00
-- This assumes SUPABASE_URL and SERVICE_ROLE_KEY are available or can be interpolated.
-- In a real Supabase environment, you'd often use the vault or a custom settings table.

-- Placeholder for scheduling logic using pg_cron and pg_net
-- We'll use a more generic approach that expects the project URL to be known.

DO $$
BEGIN
  PERFORM cron.schedule(
    'process-late-payments-monthly',
    '0 0 2 * *',
    'SELECT net.http_post(
      url := ''https://' || (SELECT COALESCE(current_setting('app.settings.project_ref', true), 'your-project-ref')) || '.supabase.co/functions/v1/process-late-payments'',
      headers := jsonb_build_object(
        ''Content-Type'', ''application/json'',
        ''Authorization'', ''Bearer '' || (SELECT COALESCE(current_setting('app.settings.service_role_key', true), 'your-service-role-key'))
      ),
      body := ''{}''::jsonb
    );'
  );
END $$;
