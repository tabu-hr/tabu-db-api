create or replace table function app_demo.getDataAmountWithFilters(
  parameter_position_group string --can be Department or null if parameter_position has a value
  ,parameter_position string --can be a single Position (the user's or their additional) or null if parameter_position_group has a value
  ,parameter_seniority string --can be Junior, Middle, Senior, N/A or a combination of those separated by pipe |
  ,parameter_country_salary string --can be 1 or more options separated by pipe |
  ,parameter_contract_type string --can be 1 or more options separated by pipe |
  ,parameter_tech string --can be null or 1 or more options separated by pipe |
)
as ((
select count(*) over () as data_amount
  ,case when count(*) over () > 0 then cast(round(avg(other_salary.salary_net_for_avg) over (),0) as int) else null end as salary_net_avg
  ,case when count(*) over () > 0 then percentile_disc(other_salary.salary_net,0.5) over () else null end as salary_net_median
  ,case when count(*) over () > 0 then cast(round(avg(other_salary.salary_gross_for_avg) over (),0) as int) else null end as salary_gross_avg
  ,case when count(*) over () > 0 then percentile_disc(other_salary.salary_gross,0.5) over () else null end as salary_gross_median
from app_demo.submission other
inner join app_demo.salary other_salary on other_salary.unique_id = other.unique_id
where 1=1
  and ((parameter_position_group is not null and parameter_position is null and other.position_group = parameter_position_group)
    or (parameter_position_group is null and parameter_position is not null and other.position = parameter_position))
  and other.seniority in unnest(split(parameter_seniority,"|"))
  and other.country_salary in unnest(split(parameter_country_salary,"|"))
  and other.contract_type in unnest(split(parameter_contract_type,"|"))
  and (parameter_tech is null or other.tech in unnest(split(parameter_tech,"|")))
limit 1
));
