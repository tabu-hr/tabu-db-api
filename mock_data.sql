-- Mock data for app_demo tables

-- Insert mock data into the user table
INSERT INTO app_demo.user (email, email_unchanged, password_hash, unique_id, bullshit, needs_to_update, too_old, experience_submission_date, year_birth, gender, education, update_url, benefits_url)
VALUES
('user1@example.com', 'User1@example.com', 'hashed_password1', 'user1', FALSE, FALSE, FALSE, '2023-01-01', 1990, 'Male', 'Bachelor', 'http://update.com', 'http://benefits.com'),
('user2@example.com', 'User2@example.com', 'hashed_password2', 'user2', TRUE, TRUE, TRUE, '2023-02-01', 1985, 'Female', 'Master', 'http://update.com', 'http://benefits.com');

-- Insert mock data into the submission table
INSERT INTO app_demo.submission (unique_id, submission_timestamp, position_group, position, seniority, seniority_level, tech, submission_date, submission_date_main, submission_date_update, submission_date_old, contract_type, country_living, country_salary, city_living, experience, experience_group, experience_group_order, employment_status)
VALUES
('user1', '2023-01-01T10:00:00Z', 'Developer', 'Software Engineer', 'Junior', 'Junior 1', 'JavaScript', '2023-01-01', '2023-01-01T09:00:00Z', '2023-01-01T11:00:00Z', NULL, 'Full-time', 'USA', 'USA', 'New York', 2, 'Junior', 1, 'Employed'),
('user2', '2023-02-01T10:00:00Z', 'Manager', 'Project Manager', 'Senior', 'Senior 3', 'Python', '2023-02-01', '2023-02-01T09:00:00Z', '2023-02-01T11:00:00Z', NULL, 'Contract', 'Canada', 'Canada', 'Toronto', 5, 'Senior', 3, 'Contractor');

-- Insert mock data into the salary table
INSERT INTO app_demo.salary (unique_id, submission_timestamp, salary_net, salary_gross, salary_net_old, salary_gross_old, salary_net_for_avg, salary_gross_for_avg, salary_net_old_for_avg, salary_gross_old_for_avg, salary_increase_index_net, salary_increase_index_gross, inflation_index, real_salary_increase_index_net, real_salary_increase_index_gross)
VALUES
('user1', '2023-01-01T10:00:00Z', 5000, 6000, 4500, 5500, 5000, 6000, 4500, 5500, 0.1, 0.1, 0.02, 0.08, 0.08),
('user2', '2023-02-01T10:00:00Z', 7000, 8000, 6500, 7500, 7000, 8000, 6500, 7500, 0.15, 0.15, 0.03, 0.12, 0.12);

-- Insert mock data into the additional_position table
INSERT INTO app_demo.additional_position (unique_id, submission_timestamp, additional_position_group, additional_position)
VALUES
('user1', '2023-01-01T10:00:00Z', 'Team Lead', 'Team Lead'),
('user2', '2023-02-01T10:00:00Z', 'Mentor', 'Mentor');

-- Insert mock data into the leading table
INSERT INTO app_demo.leading (unique_id, submission_timestamp, leading_team, leading_department, team_size, department_size, leading_experience, leading_experience_submission_date, leading_team_group, leading_team_group_order, leading_department_group, leading_department_group_order, leading_experience_group, leading_experience_group_order)
VALUES
('user1', '2023-01-01T10:00:00Z', TRUE, FALSE, 5, NULL, 2, '2023-01-01', 'Team Lead', 1, NULL, NULL, 'Leading Experience', 1),
('user2', '2023-02-01T10:00:00Z', FALSE, TRUE, NULL, 10, 3, '2023-02-01', NULL, NULL, 'Department Head', 1, 'Leading Experience', 1);

-- Insert mock data into the company table
INSERT INTO app_demo.company (unique_id, submission_timestamp, type, size, size_order, county, county_order, investment, owner_stake, work_full_part_time, work_days_per_week, work_home_office, work_home_office_order, it_or_not, hqlocation)
VALUES
('user1', '2023-01-01T10:00:00Z', 'Tech', 'Large', 3, 'USA', 'USA', 'Venture Capital', 'Majority', 'Full-time', 5, 'Home Office', 1, 'IT', 'New York'),
('user2', '2023-02-01T10:00:00Z', 'Finance', 'Medium', 2, 'Canada', 'Canada', 'Private Equity', 'Minority', 'Part-time', 3, 'Office', 2, 'Non-IT', 'Toronto');

-- Insert mock data into the student table
INSERT INTO app_demo.student (unique_id, submission_timestamp, hourly_rate, workhours_week, has_allowance, allowance_amount)
VALUES
('user1', '2023-01-01T10:00:00Z', 20.00, 20, TRUE, 100),
('user2', '2023-02-01T10:00:00Z', 25.00, 25, FALSE, NULL);

-- Insert mock data into the freelance table
INSERT INTO app_demo.freelance (unique_id, submission_timestamp, freelance_response, freelance_platform)
VALUES
('user1', '2023-01-01T10:00:00Z', 'Yes', 'Upwork'),
('user2', '2023-02-01T10:00:00Z', 'No', NULL);

-- Insert mock data into the seasonal_bonuses table
INSERT INTO app_demo.seasonal_bonuses (unique_id, submission_timestamp, christmas_response, christmas_amount, christmas_response_old, christmas_amount_old, christmas_gift_card, easter_response, easter_amount, easter_response_old, easter_amount_old, annual_leave_response, annual_leave_amount, annual_leave_response_old, annual_leave_amount_old)
VALUES
('user1', '2023-01-01T10:00:00Z', 'Yes', 500, 'Yes', 400, 100, 'Yes', 200, 'Yes', 150, 'Yes', 10, 'Yes', 10),
('user2', '2023-02-01T10:00:00Z', 'No', NULL, 'No', NULL, NULL, 'No', NULL, 'No', NULL, 'No', NULL, 'No', NULL);

-- Insert mock data into the history table
INSERT INTO app_demo.history (unique_id, salary_net, salary_gross, amount, avg_salary_net, avg_salary_gross, submission_date)
VALUES
('user1', 5000, 6000, 5000, 5000, 6000, '2023-01-01'),
('user2', 7000, 8000, 7000, 7000, 8000, '2023-02-01');

-- Insert mock data into the benefit_vacation table
INSERT INTO app_demo.benefit_vacation (unique_id, submission_datetime, vacationdays_base, vacationdays_additional, vacationdays_base_unlimited, birthday_free, vacation_paid_accomodation)
VALUES
('user1', '2023-01-01T10:00:00Z', 20, 5, FALSE, 'Yes', 'Yes'),
('user2', '2023-02-01T10:00:00Z', 25, 10, TRUE, 'No', 'No');

-- Insert mock data into the benefit_monetary_grants table
INSERT INTO app_demo.benefit_monetary_grants (unique_id, submission_datetime, allowance_work_results, allowance_work_results_amount, incentives_additional_work, commemorative_awards, newemployeebonus, newemployeebonus_description, newemployeebonus_amount, reward_seniority, reward_seniority_amount, pension, pension_bruto, bonus, bonus_amount, thirteenth_salary, company_stake, company_stake_order, profit_sharing, grants_other, allowance_work_results_monthly, allowance_work_results_yearly, allowance_work_results_award, bonus_amount_yearly, bonus_amount_halfyearly, bonus_amount_quarterly)
VALUES
('user1', '2023-01-01T10:00:00Z', 'Yes', 500, ['Bonus'], ['Award'], 'Yes', 'Welcome Bonus', 1000, 'Yes', 200, 'Yes', 'Full', 'Yes', 'Yes', 1000, 'Yes', 'Majority', 'Majority', 'Yes', ['Other'], 50, 600, 100, 1200, 600, 300),
('user2', '2023-02-01T10:00:00Z', 'No', NULL, NULL, NULL, 'No', NULL, NULL, 'No', NULL, 'No', 'None', 'No', NULL, 'No', 'Minority', 'Minority', 'No', NULL, NULL, NULL, NULL, NULL, NULL);

-- Insert mock data into the benefit_food_drinks table
INSERT INTO app_demo.benefit_food_drinks (unique_id, submission_datetime, allowance_meal, organized_meal, organized_drinks, nutritional_consultation)
VALUES
('user1', '2023-01-01T10:00:00Z', 'Yes', 'Yes', 'Yes', 'Yes'),
('user2', '2023-02-01T10:00:00Z', 'No', 'No', 'No', 'No');

-- Insert mock data into the benefit_flexible_work table
INSERT INTO app_demo.benefit_flexible_work (unique_id, submission_datetime, flexible_working_hours, home_office, flexible_work_other)
VALUES
('user1', '2023-01-01T10:00:00Z', 'Yes', 'Yes', ['Other']),
('user2', '2023-02-01T10:00:00Z', 'No', 'No', NULL);

-- Insert mock data into the benefit_mobility table
INSERT INTO app_demo.benefit_mobility (unique_id, submission_datetime, allowance_transportation, company_car, carwash, parking, mobility_other)
VALUES
('user1', '2023-01-01T10:00:00Z', 'Yes', 'Yes', 'Yes', 'Yes', ['Other']),
('user2', '2023-02-01T10:00:00Z', 'No', 'No', 'No', 'No', NULL);

-- Insert mock data into the benefit_wellbeing table
INSERT INTO app_demo.benefit_wellbeing (unique_id, submission_datetime, services_sport, services_wellness, services_beauty)
VALUES
('user1', '2023-01-01T10:00:00Z', 'Yes', 'Yes', 'Yes'),
('user2', '2023-02-01T10:00:00Z', 'No', 'No', 'No');

-- Insert mock data into the benefit_teambuilding table
INSERT INTO app_demo.benefit_teambuilding (unique_id, submission_datetime, teambuilding)
VALUES
('user1', '2023-01-01T10:00:00Z', ['Team Building']),
('user2', '2023-02-01T10:00:00Z', NULL);

-- Insert mock data into the benefit_health table
INSERT INTO app_demo.benefit_health (unique_id, submission_datetime, health)
VALUES
('user1', '2023-01-01T10:00:00Z', ['Health Insurance']),
('user2', '2023-02-01T10:00:00Z', NULL);

-- Insert mock data into the benefit_education table
INSERT INTO app_demo.benefit_education (unique_id, submission_datetime, education_budget, mentorship, conference_attendance, education_other)
VALUES
('user1', '2023-01-01T10:00:00Z', 'Yes', 'Yes', 'Yes', ['Other']),
('user2', '2023-02-01T10:00:00Z', 'No', 'No', 'No', NULL);

-- Insert mock data into the benefit_equipment table
INSERT INTO app_demo.benefit_equipment (unique_id, submission_datetime, company_phone, drycleaners, equipment_other)
VALUES
('user1', '2023-01-01T10:00:00Z', 'Yes', 'Yes', ['Other']),
('user2', '2023-02-01T10:00:00Z', 'No', 'No', NULL);

-- Insert mock data into the benefit_children table
INSERT INTO app_demo.benefit_children (unique_id, submission_datetime, children)
VALUES
('user1', '2023-01-01T10:00:00Z', ['Childcare']),
('user2', '2023-02-01T10:00:00Z', NULL);

-- Insert mock data into the benefit_social_responsibility table
INSERT INTO app_demo.benefit_social_responsibility (unique_id, submission_datetime, social_responsibility)
VALUES
('user1', '2023-01-01T10:00:00Z', ['Community Service']),
('user2', '2023-02-01T10:00:00Z', NULL);
