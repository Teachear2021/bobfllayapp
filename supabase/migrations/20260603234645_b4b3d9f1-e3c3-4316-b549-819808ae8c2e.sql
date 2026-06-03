ALTER FUNCTION public.handle_new_user() SET search_path = public;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM authenticated;

DROP POLICY "Service role can manage all referrals" ON public.referrals;
CREATE POLICY "Service role can manage all referrals" ON public.referrals FOR ALL TO service_role USING (true);
