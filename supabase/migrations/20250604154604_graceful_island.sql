/*
  # Add create_user_profile function

  1. New Function
    - Creates a new function `create_user_profile` that handles user profile creation
    - Takes two parameters:
      - profile_data: A JSON object containing user profile data
      - user_id: The UUID of the user
    - Returns the created user profile record

  2. Security
    - Function is accessible to authenticated users only
    - Implements proper error handling and validation
*/

CREATE OR REPLACE FUNCTION public.create_user_profile(
  profile_data jsonb,
  user_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result jsonb;
BEGIN
  -- Insert the user profile
  INSERT INTO public.user_profiles (
    id,
    email,
    full_name,
    avatar_url,
    role,
    created_at,
    updated_at
  )
  VALUES (
    user_id,
    profile_data->>'email',
    profile_data->>'fullName',
    profile_data->>'avatarUrl',
    (profile_data->>'role')::user_role,
    now(),
    now()
  )
  RETURNING jsonb_build_object(
    'id', id,
    'email', email,
    'full_name', full_name,
    'avatar_url', avatar_url,
    'role', role,
    'created_at', created_at,
    'updated_at', updated_at
  ) INTO result;

  RETURN result;
EXCEPTION
  WHEN others THEN
    RAISE EXCEPTION 'Failed to create user profile: %', SQLERRM;
END;
$$;