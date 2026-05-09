-- Schedule the late payment processing function to run on the 2nd of every month at 00:00
-- This assumes SUPABASE_URL and SERVICE_ROLE_KEY are available.

DO $$
BEGIN
  PERFORM cron.schedule(
    'process-late-payments-monthly',
    '0 0 2 * *',
    'SELECT net.http_post(
      url := ''https://'' || (SELECT COALESCE(current_setting(''app.settings.project_ref'', true), ''your-project-ref'')) || ''.supabase.co/functions/v1/process-late-payments'',
      headers := jsonb_build_object(
        ''Content-Type'', ''application/json'',
        ''Authorization'', ''Bearer '' || (SELECT COALESCE(current_setting(''app.settings.service_role_key'', true), ''your-service-role-key''))
      ),
      body := ''{}''::jsonb
    );'
  );
END $$;
