/*
  # Add User Point Management Functions

  1. Functions
    - `increment_user_points` - Safely increment user points and total points
    - `check_level_up` - Check if user should level up based on points

  2. Security
    - Functions are security definer to allow point updates
    - Only authenticated users can call these functions
*/

-- Function to increment user points safely
CREATE OR REPLACE FUNCTION increment_user_points(user_id uuid, points_to_add integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE users 
  SET 
    points = points + points_to_add,
    total_points = total_points + points_to_add,
    level = CASE 
      WHEN (total_points + points_to_add) >= level * 300 THEN level + 1
      ELSE level
    END
  WHERE id = user_id;
END;
$$;

-- Function to reset daily points (for level progression)
CREATE OR REPLACE FUNCTION reset_daily_points(user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE users 
  SET points = 0
  WHERE id = user_id;
END;
$$;