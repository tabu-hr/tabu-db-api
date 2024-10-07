--Main tables:
CREATE TABLE app_demo.user (
    email STRING NOT NULL,
    email_unchanged STRING NOT NULL,
    password_hash STRING,
    unique_id STRING(10) NOT NULL,
    bullshit BOOLEAN NOT NULL,
    needs_to_update BOOLEAN NOT NULL,
    too_old BOOLEAN NOT NULL,
    experience_submission_date DATE,
    year_birth INT64,
    gender STRING,
    education STRING,
    update_url STRING,
    benefits_url STRING
);

CREATE TABLE app_demo.submission (
    unique_id STRING NOT NULL,
    submission_timestamp TIMESTAMP NOT NULL,
    position_group STRING NOT NULL,
    position STRING NOT NULL,
    seniority STRING,
    seniority_level STRING,
    tech STRING,
    submission_date DATE NOT NULL,
    submission_date_main TIMESTAMP NOT NULL,
    submission_date_update TIMESTAMP,
    submission_date_old TIMESTAMP,
    contract_type STRING NOT NULL,
    country_living STRING NOT NULL,
    country_salary STRING NOT NULL,
    city_living STRING,
    experience INT64,
    experience_group STRING,
    experience_group_order INT64,
    employment_status STRING
);

CREATE TABLE app_demo.salary (
    unique_id STRING NOT NULL,
    submission_timestamp TIMESTAMP NOT NULL,
    salary_net INT64 NOT NULL,
    salary_gross INT64,
    salary_net_old INT64,
    salary_gross_old INT64,
    salary_net_for_avg INT64,
    salary_gross_for_avg INT64,
    salary_net_old_for_avg INT64,
    salary_gross_old_for_avg INT64,
    salary_increase_index_net DECIMAL,
    salary_increase_index_gross DECIMAL,
    inflation_index DECIMAL,
    real_salary_increase_index_net DECIMAL,
    real_salary_increase_index_gross DECIMAL
);

CREATE TABLE app_demo.additional_position (
    unique_id STRING NOT NULL,
    submission_timestamp TIMESTAMP NOT NULL,
    additional_position_group STRING NOT NULL,
    additional_position STRING NOT NULL
);

CREATE TABLE app_demo.leading (
    unique_id STRING NOT NULL,
    submission_timestamp TIMESTAMP NOT NULL,
    leading_team BOOLEAN NOT NULL,
    leading_department BOOLEAN NOT NULL,
    team_size INT64,
    department_size INT64,
    leading_experience INT64,
    leading_experience_submission_date DATE,
    leading_team_group STRING,
    leading_team_group_order INT64,
    leading_department_group STRING,
    leading_department_group_order INT64,
    leading_experience_group STRING,
    leading_experience_group_order INT64
);

CREATE TABLE app_demo.company (
    unique_id STRING NOT NULL,
    submission_timestamp TIMESTAMP NOT NULL,
    type STRING,
    size STRING,
    size_order INT64,
    county STRING,
    county_order STRING,
    investment STRING,
    owner_stake STRING,
    work_full_part_time STRING,
    work_days_per_week INT64,
    work_home_office STRING,
    work_home_office_order INT64,
    it_or_not STRING,
    hqlocation STRING
);

CREATE TABLE app_demo.student (
    unique_id STRING NOT NULL,
    submission_timestamp TIMESTAMP NOT NULL,
    hourly_rate DECIMAL NOT NULL,
    workhours_week INT64 NOT NULL,
    has_allowance BOOLEAN NOT NULL,
    allowance_amount INT64
);

CREATE TABLE app_demo.freelance (
    unique_id STRING NOT NULL,
    submission_timestamp TIMESTAMP NOT NULL,
    freelance_response STRING NOT NULL,
    freelance_platform STRING
);

CREATE TABLE app_demo.seasonal_bonuses (
    unique_id STRING NOT NULL,
    submission_timestamp TIMESTAMP NOT NULL,
    christmas_response STRING,
    christmas_amount INT64,
    christmas_response_old STRING,
    christmas_amount_old INT64,
    christmas_gift_card INT64,
    easter_response STRING,
    easter_amount INT64,
    easter_response_old STRING,
    easter_amount_old INT64,
    annual_leave_response STRING,
    annual_leave_amount INT64,
    annual_leave_response_old STRING,
    annual_leave_amount_old INT64
);

CREATE TABLE app_demo.history (
    unique_id STRING NOT NULL,
    salary_net INT64 NOT NULL,
    salary_gross INT64,
    amount INT64 NOT NULL,
    avg_salary_net INT64 NOT NULL,
    avg_salary_gross INT64,
    submission_date DATE NOT NULL
);

----------------------------------------------------------------------------------------------------
--Benefits:

CREATE TABLE app_demo.benefit_vacation (
    unique_id STRING NOT NULL,
    submission_datetime TIMESTAMP NOT NULL,
    vacationdays_base INT64,
    vacationdays_additional INT64,
    vacationdays_base_unlimited BOOLEAN,
    birthday_free STRING,
    vacation_paid_accomodation STRING
);

CREATE TABLE app_demo.benefit_monetary_grants (
    unique_id STRING NOT NULL,
    submission_datetime TIMESTAMP NOT NULL,
    allowance_work_results STRING,
    allowance_work_results_amount INT64,
    incentives_additional_work ARRAY<STRING>,
    commemorative_awards ARRAY<STRING>,
    newemployeebonus STRING,
    newemployeebonus_description STRING,
    newemployeebonus_amount INT64,
    reward_seniority STRING,
    reward_seniority_amount INT64,
    pension STRING,
    pension_bruto STRING,
    bonus STRING,
    bonus_amount INT64,
    thirteenth_salary STRING,
    company_stake STRING,
    company_stake_order STRING,
    profit_sharing STRING,
    grants_other ARRAY<STRING>,
    allowance_work_results_monthly INT64,
    allowance_work_results_yearly INT64,
    allowance_work_results_award INT64,
    bonus_amount_yearly INT64,
    bonus_amount_halfyearly INT64,
    bonus_amount_quarterly INT64
);

CREATE TABLE app_demo.benefit_food_drinks (
    unique_id STRING NOT NULL,
    submission_datetime TIMESTAMP NOT NULL,
    allowance_meal STRING,
    organized_meal STRING,
    organized_drinks STRING,
    nutritional_consultation STRING
);

CREATE TABLE app_demo.benefit_flexible_work (
    unique_id STRING NOT NULL,
    submission_datetime TIMESTAMP NOT NULL,
    flexible_working_hours STRING,
    home_office STRING,
    flexible_work_other ARRAY<STRING>
);

CREATE TABLE app_demo.benefit_mobility (
    unique_id STRING NOT NULL,
    submission_datetime TIMESTAMP NOT NULL,
    allowance_transportation STRING,
    company_car STRING,
    carwash STRING,
    parking STRING,
    mobility_other ARRAY<STRING>
);

CREATE TABLE app_demo.benefit_wellbeing (
    unique_id STRING NOT NULL,
    submission_datetime TIMESTAMP NOT NULL,
    services_sport STRING,
    services_wellness STRING,
    services_beauty STRING
);

CREATE TABLE app_demo.benefit_teambuilding (
    unique_id STRING NOT NULL,
    submission_datetime TIMESTAMP NOT NULL,
    teambuilding ARRAY<STRING>
);

CREATE TABLE app_demo.benefit_health (
    unique_id STRING NOT NULL,
    submission_datetime TIMESTAMP NOT NULL,
    health ARRAY<STRING>
);

CREATE TABLE app_demo.benefit_education (
    unique_id STRING NOT NULL,
    submission_datetime TIMESTAMP NOT NULL,
    education_budget STRING,
    mentorship STRING,
    conference_attendance STRING,
    education_other ARRAY<STRING>
);

CREATE TABLE app_demo.benefit_equipment (
    unique_id STRING NOT NULL,
    submission_datetime TIMESTAMP NOT NULL,
    company_phone STRING,
    drycleaners STRING,
    equipment_other ARRAY<STRING>
);

CREATE TABLE app_demo.benefit_children (
    unique_id STRING NOT NULL,
    submission_datetime TIMESTAMP NOT NULL,
    children ARRAY<STRING>
);

CREATE TABLE app_demo.benefit_social_responsibility (
    unique_id STRING NOT NULL,
    submission_datetime TIMESTAMP NOT NULL,
    social_responsibility ARRAY<STRING>
);
