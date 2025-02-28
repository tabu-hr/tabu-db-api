create or replace view app_demo.list_tech as
select user.unique_id
  ,other.tech
  ,count(*) as amount
from app_demo.submission user
inner join app_demo.submission other on other.position_group = user.position_group
group by user.unique_id
  ,other.tech
--having amount > 4
;

create or replace view app_demo.list_country_salary as
select user.unique_id
  ,other.country_salary
  ,count(*) as amount
from app_demo.submission user
inner join app_demo.submission other on other.position_group = user.position_group
group by user.unique_id
  ,other.country_salary
--having amount > 4
;

create or replace view app_demo.list_contract_type as
select user.unique_id
  ,other.contract_type
  ,count(*) as amount
from app_demo.submission user
inner join app_demo.submission other on other.position_group = user.position_group
group by user.unique_id
  ,other.contract_type
--having amount > 4
;

--All together (1 database call instead of 3):
create or replace view app_demo.filter_data as
select user.unique_id
  ,"tech" as data_type
  ,other.tech as list_item
  ,count(*) as amount
from app_demo.submission user
inner join app_demo.submission other on other.position_group = user.position_group
group by user.unique_id
  ,other.tech
--having amount > 4
union all
select user.unique_id
  ,"country_salary"
  ,other.country_salary
  ,count(*) as amount
from app_demo.submission user
inner join app_demo.submission other on other.position_group = user.position_group
group by user.unique_id
  ,other.country_salary
--having amount > 4
union all
select user.unique_id
  ,"contract_type"
  ,other.contract_type
  ,count(*) as amount
from app_demo.submission user
inner join app_demo.submission other on other.position_group = user.position_group
group by user.unique_id
  ,other.contract_type
--having amount > 4
;

create or replace view app_demo.data_amount as
select user.unique_id
  ,count(*) as amount
from app_demo.submission user
inner join app_demo.submission other on other.position_group = user.position_group
  and other.position = user.position
  and other.seniority = user.seniority
  and other.country_salary = user.country_salary
  and other.contract_type = user.contract_type
  --Tech is intentionally not included in default filter
group by user.unique_id
