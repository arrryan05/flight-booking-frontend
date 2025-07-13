import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { Profile } from '@/types/database';
import type { User } from '@supabase/supabase-js';

export function useProfile(user: User | null) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const fetchOrCreateProfile = async () => {
      setLoading(true);
      setError(null);

      // 1) Try to fetch an existing profile
      let { data, error: fetchError } = await supabase
        .from('profiles')
        .select('id, full_name, phone, is_admin')
        .eq('id', user.id)
        .single();

      // 2) If “0 rows” error, create the profile and re-select
      if (fetchError && fetchError.code === 'PGRST116') {
        const { data: created, error: createError } = await supabase
          .from('profiles')
          .upsert({ id: user.id })
          .select('id, full_name, phone, is_admin')
          .single();

        if (createError) {
          setError(createError);
          setLoading(false);
          return;
        }

        data = created;
      } else if (fetchError) {
        // Other errors (network, permissions, etc.)
        setError(fetchError);
        setLoading(false);
        return;
      }

      // 3) At this point, “data” is your Profile
      setProfile(data as Profile);
      setLoading(false);
    };

    fetchOrCreateProfile();
  }, [user]);

  const updateProfile = async (updates: {
    full_name: string;
    phone: string;
  }) => {
    setLoading(true);
    setError(null);

    const { data, error: updateError } = await supabase
      .from('profiles')
      .upsert({ id: user!.id, ...updates })
      .select('id, full_name, phone, is_admin')
      .single();

    if (updateError) {
      setError(updateError);
    } else {
      setProfile(data as Profile);
    }

    setLoading(false);
    return { data: data as Profile, error: updateError };
  };

  return { profile, loading, error, updateProfile };
}
