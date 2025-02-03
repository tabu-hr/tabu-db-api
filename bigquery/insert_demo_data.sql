-- Execute on the dataset with the demo tables.
-- Dataset expected to be in Multi-region EU.

begin transaction;

create temp table demo_account as
select e.email
from (
  select email
  from `elite-clarity-344910.tabu1.web_app_demo_accounts`
  -- https://docs.google.com/spreadsheets/d/1AnLhIqfe6E3M_DoDWJnYllXAJNsDNIPg3LReFqxKC5k/edit
  union all
  select d.email_private
  from `elite-clarity-344910.tabu1.04_datastudio` d
  where d.email_private like "%@tabu%"
) e
left join app_demo.user u on u.email = e.email
where u.email is null; -- creates only new users

insert into app_demo.user
select d.email_private
  ,d.email_private_unchanged
  ,null as passwod_hash
  ,d.unique_id
  ,d.bullshit
  ,case
    when
      date_add(
        cast(coalesce(d.submission_date_update,d.submission_date_main) as date)
        ,interval 3 month  -- interval "month" is subtracts months independently of days so it can only be used in date_add
      ) > current_date()
    then false
    else true
	end as needs_to_update
  ,d.too_old
  ,d.experience_submission_date
  ,d.year_birth
  ,d.gender
  ,d.education
  ,concat("https://tabuhr.typeform.com/azuriranje?utm_source=datastudio#unique_id=",d.unique_id) as update_url
  ,concat("https://tabuhr.typeform.com/benefiti?utm_source=datastudio#unique_id=",d.unique_id) as benefits_url
from `elite-clarity-344910.tabu1.04_datastudio` d
inner join demo_account a on a.email = d.email_private;

insert into app_demo.submission
select d.unique_id
  ,coalesce(d.submission_date_update,d.submission_date_main) as submission_timestamp
  ,d.position_group
  ,d.position
  ,d.seniority
  ,d.seniority_level
  ,d.tech
  ,d.submission_date
  ,d.submission_date_main
  ,d.submission_date_update
  ,d.submission_date_old
  ,d.contract_type
  ,d.country_living
  ,d.country_salary
  ,d.city_living
  ,d.experience
  ,d.experiencegroup
  ,d.experiencegroup_order
  ,d.employment_status
from `elite-clarity-344910.tabu1.04_datastudio` d
inner join demo_account a on a.email = d.email_private;

insert into app_demo.salary
select d.unique_id
  ,coalesce(d.submission_date_update,d.submission_date_main) as submission_timestamp
  ,cast(d.salary as int)
  ,cast(d.salary_bruto as int)
  ,cast(d.salary_old as int)
  ,cast(d.salary_bruto_old as int)
  ,cast(d.salary_for_avg as int)
  ,cast(d.salary_bruto_for_avg as int)
  ,cast(d.salary_old_for_avg as int)
  ,cast(d.salary_bruto_old_for_avg as int)
  ,cast(d.indeks_porasta_place as int)
  ,cast(d.indeks_porasta_place_bruto as int)
  ,cast(d.indeks_inflacije as int)
  ,cast(d.realni_postotak_porasta_place as int)
  ,cast(d.realni_postotak_porasta_place_bruto as int)
from `elite-clarity-344910.tabu1.04_datastudio` d
inner join demo_account a on a.email = d.email_private;

insert into app_demo.additional_position
select d.unique_id
  ,coalesce(d.submission_date_update,d.submission_date_main) as submission_timestamp
  ,d.additional_position_group
  ,d.additional_position
from `elite-clarity-344910.tabu1.04_datastudio` d
inner join demo_account a on a.email = d.email_private
where d.additional_position is not null;

insert into app_demo.leading
select d.unique_id
  ,coalesce(d.submission_date_update,d.submission_date_main) as submission_timestamp
  ,case when d.leading_team = 1 then true else false end as leading_team
  ,case when d.leading_department = 1 then true else false end as leading_department
  ,d.leading_people as team_size
  ,d.leading_people_total as department_size
  ,d.leading_experience
  ,d.leading_experience_submission_date
  ,d.leadingpeoplegroup
  ,d.leadingpeoplegroup_order
  ,d.leadingpeopletotalgroup
  ,d.leadingpeopletotalgroup_order
  ,d.leadingexperiencegroup
  ,d.leadingexperiencegroup_order
from `elite-clarity-344910.tabu1.04_datastudio` d
inner join demo_account a on a.email = d.email_private;

insert into app_demo.company
select d.unique_id
  ,coalesce(d.submission_date_update,d.submission_date_main) as submission_timestamp
  ,d.company_type
  ,d.company_size
  ,d.company_size_order
  ,d.company_county
  ,d.company_county_order
  ,d.company_investment
  ,d.owner_stake
  ,d.work_full_part_time
  ,d.work_days_per_week
  ,d.work_home_office
  ,d.work_home_office_order
  ,d.it_or_not
  ,d.company_hqlocation
from `elite-clarity-344910.tabu1.04_datastudio` d
inner join demo_account a on a.email = d.email_private;

insert into app_demo.student
select d.unique_id
  ,coalesce(d.submission_date_update,d.submission_date_main) as submission_timestamp
  ,cast(d.student_satnica as numeric)
  ,d.student_workhours_week
  ,d.student_prijevozprehrana_yesno
  ,d.student_prijevozprehrana
from `elite-clarity-344910.tabu1.04_datastudio` d
inner join demo_account a on a.email = d.email_private
where d.student_satnica is not null;

insert into app_demo.freelance
select d.unique_id
  ,coalesce(d.submission_date_update,d.submission_date_main) as submission_timestamp
  ,d.freelance
  ,d.freelance_platform
from `elite-clarity-344910.tabu1.04_datastudio` d
inner join demo_account a on a.email = d.email_private
where d.freelance is not null;

insert into app_demo.seasonal_bonuses
select d.unique_id
  ,coalesce(d.submission_date_update,d.submission_date_main) as submission_timestamp
  ,d.bozic_odgovor
  ,cast(d.bozicnica as int)
  ,d.bozic_odgovor_old
  ,cast(d.bozicnica_old as int)
  ,d.bozic_poklon_bon
  ,d.uskrs_odgovor
  ,cast(d.uskrsnica as int)
  ,d.uskrs_odgovor_old
  ,cast(d.uskrsnica_old as int)
  ,d.regres_odgovor
  ,cast(d.regres as int)
  ,d.regres_odgovor_old
  ,cast(d.regres_old as int)
from `elite-clarity-344910.tabu1.04_datastudio` d
inner join demo_account a on a.email = d.email_private;

insert into app_demo.history
select d.unique_id
  ,d.history_salary
  ,d.history_salary_bruto
  ,d.amount
  ,d.avg_salary
  ,d.avg_salary_bruto
  ,d.submission_date
from `elite-clarity-344910.tabu1.06_historical_data` d
inner join demo_account a on a.email = d.email_private;

commit;
