const express = require('express');
const router = express.Router();
const { queryUserTable } = require('../models/user');
const { querySubmissionTable } = require('../models/submission');
const { queryAdditionalPositionTable } = require('../models/additional_position');
const { queryBenefitChildrenTable } = require('../models/benefit_children');
const { queryBenefitEducationTable } = require('../models/benefit_education');
const { queryBenefitEquipmentTable } = require('../models/benefit_equipment');
const { queryBenefitFlexibleWorkTable } = require('../models/benefit_flexible_work');
const { queryBenefitFoodDrinksTable } = require('../models/benefit_food_drinks');
const { queryBenefitHealthTable } = require('../models/benefit_health');
const { queryBenefitMobilityTable } = require('../models/benefit_mobility');
const { queryBenefitMonetaryGrantsTable } = require('../models/benefit_monetary_grants');
const { queryBenefitSocialResponsibilityTable } = require('../models/benefit_social_responsibility');
const { queryBenefitTeambuildingTable } = require('../models/benefit_teambuilding');
const { queryBenefitVacationTable } = require('../models/benefit_vacation');
const { queryBenefitWellbeingTable } = require('../models/benefit_wellbeing');
const { queryCompanyTable } = require('../models/company');
const { queryFreelanceTable } = require('../models/freelance');
const { queryHistoryTable } = require('../models/history');
const { queryLeadingTable } = require('../models/leading');
const { querySalaryTable } = require('../models/salary');
const { querySeasonalBonusesTable } = require('../models/seasonal_bonuses');
const { queryStudentTable } = require('../models/student');
const { listTables, queryBigQuery } = require('../models/bigQuery');
const responseUser = require('../dto/user');
const responseSubmission = require('../dto/submission');
const responseAdditionalPosition = require('../dto/additional_position');
const responseBenefitChildren = require('../dto/benefit_children');
const responseBenefitEducation = require('../dto/benefit_education');
const responseBenefitEquipment = require('../dto/benefit_equipment');
const responseBenefitFlexibleWork = require('../dto/benefit_flexible_work');
const responseBenefitFoodDrinks = require('../dto/benefit_food_drinks');
const responseBenefitHealth = require('../dto/benefit_health');
const responseBenefitMobility = require('../dto/benefit_mobility');
const responseBenefitMonetaryGrants = require('../dto/benefit_monetary_grants');
const responseBenefitSocialResponsibility = require('../dto/benefit_social_responsibility');
const responseBenefitTeambuilding = require('../dto/benefit_teambuilding');
const responseBenefitVacation = require('../dto/benefit_vacation');
const responseBenefitWellbeing = require('../dto/benefit_wellbeing');
const responseCompany = require('../dto/company');
const responseFreelance = require('../dto/freelance');
const responseHistory = require('../dto/history');
const responseLeading = require('../dto/leading');
const responseSalary = require('../dto/salary');
const responseSeasonalBonuses = require('../dto/seasonal_bonuses');
const responseStudent = require('../dto/student');
const responseTables = require('../dto/tables');
const responseBigQuery = require('../dto/bigQuery');

router.get('/tables', async (req, res) => {
  try {
    const tables = await listTables();
    res.json(responseTables(true, 'tables', 'listTables', tables));
  } catch (err) {
    res.json(responseTables(false, 'tables', 'listTables', null, err.message));
  }
});

router.get('/user', async (req, res) => {
  try {
    const rows = await queryUserTable();
    res.json(responseUser(true, 'user', 'queryUserTable', rows));
  } catch (err) {
    res.json(responseUser(false, 'user', 'queryUserTable', null, err.message));
  }
});

router.get('/submission', async (req, res) => {
  try {
    const rows = await querySubmissionTable();
    res.json(responseSubmission(true, 'submission', 'querySubmissionTable', rows));
  } catch (err) {
    res.json(responseSubmission(false, 'submission', 'querySubmissionTable', null, err.message));
  }
});

router.get('/additional_position', async (req, res) => {
  try {
    const rows = await queryAdditionalPositionTable();
    res.json(responseAdditionalPosition(true, 'additional_position', 'queryAdditionalPositionTable', rows));
  } catch (err) {
    res.json(responseAdditionalPosition(false, 'additional_position', 'queryAdditionalPositionTable', null, err.message));
  }
});

router.get('/benefit_children', async (req, res) => {
  try {
    const rows = await queryBenefitChildrenTable();
    res.json(responseBenefitChildren(true, 'benefit_children', 'queryBenefitChildrenTable', rows));
  } catch (err) {
    res.json(responseBenefitChildren(false, 'benefit_children', 'queryBenefitChildrenTable', null, err.message));
  }
});

router.get('/benefit_education', async (req, res) => {
  try {
    const rows = await queryBenefitEducationTable();
    res.json(responseBenefitEducation(true, 'benefit_education', 'queryBenefitEducationTable', rows));
  } catch (err) {
    res.json(responseBenefitEducation(false, 'benefit_education', 'queryBenefitEducationTable', null, err.message));
  }
});

router.get('/benefit_equipment', async (req, res) => {
  try {
    const rows = await queryBenefitEquipmentTable();
    res.json(responseBenefitEquipment(true, 'benefit_equipment', 'queryBenefitEquipmentTable', rows));
  } catch (err) {
    res.json(responseBenefitEquipment(false, 'benefit_equipment', 'queryBenefitEquipmentTable', null, err.message));
  }
});

router.get('/benefit_flexible_work', async (req, res) => {
  try {
    const rows = await queryBenefitFlexibleWorkTable();
    res.json(responseBenefitFlexibleWork(true, 'benefit_flexible_work', 'queryBenefitFlexibleWorkTable', rows));
  } catch (err) {
    res.json(responseBenefitFlexibleWork(false, 'benefit_flexible_work', 'queryBenefitFlexibleWorkTable', null, err.message));
  }
});

router.get('/benefit_food_drinks', async (req, res) => {
  try {
    const rows = await queryBenefitFoodDrinksTable();
    res.json(responseBenefitFoodDrinks(true, 'benefit_food_drinks', 'queryBenefitFoodDrinksTable', rows));
  } catch (err) {
    res.json(responseBenefitFoodDrinks(false, 'benefit_food_drinks', 'queryBenefitFoodDrinksTable', null, err.message));
  }
});

router.get('/benefit_health', async (req, res) => {
  try {
    const rows = await queryBenefitHealthTable();
    res.json(responseBenefitHealth(true, 'benefit_health', 'queryBenefitHealthTable', rows));
  } catch (err) {
    res.json(responseBenefitHealth(false, 'benefit_health', 'queryBenefitHealthTable', null, err.message));
  }
});

router.get('/benefit_mobility', async (req, res) => {
  try {
    const rows = await queryBenefitMobilityTable();
    res.json(responseBenefitMobility(true, 'benefit_mobility', 'queryBenefitMobilityTable', rows));
  } catch (err) {
    res.json(responseBenefitMobility(false, 'benefit_mobility', 'queryBenefitMobilityTable', null, err.message));
  }
});

router.get('/benefit_monetary_grants', async (req, res) => {
  try {
    const rows = await queryBenefitMonetaryGrantsTable();
    res.json(responseBenefitMonetaryGrants(true, 'benefit_monetary_grants', 'queryBenefitMonetaryGrantsTable', rows));
  } catch (err) {
    res.json(responseBenefitMonetaryGrants(false, 'benefit_monetary_grants', 'queryBenefitMonetaryGrantsTable', null, err.message));
  }
});

router.get('/benefit_social_responsibility', async (req, res) => {
  try {
    const rows = await queryBenefitSocialResponsibilityTable();
    res.json(responseBenefitSocialResponsibility(true, 'benefit_social_responsibility', 'queryBenefitSocialResponsibilityTable', rows));
  } catch (err) {
    res.json(responseBenefitSocialResponsibility(false, 'benefit_social_responsibility', 'queryBenefitSocialResponsibilityTable', null, err.message));
  }
});

router.get('/benefit_teambuilding', async (req, res) => {
  try {
    const rows = await queryBenefitTeambuildingTable();
    res.json(responseBenefitTeambuilding(true, 'benefit_teambuilding', 'queryBenefitTeambuildingTable', rows));
  } catch (err) {
    res.json(responseBenefitTeambuilding(false, 'benefit_teambuilding', 'queryBenefitTeambuildingTable', null, err.message));
  }
});

router.get('/benefit_vacation', async (req, res) => {
  try {
    const rows = await queryBenefitVacationTable();
    res.json(responseBenefitVacation(true, 'benefit_vacation', 'queryBenefitVacationTable', rows));
  } catch (err) {
    res.json(responseBenefitVacation(false, 'benefit_vacation', 'queryBenefitVacationTable', null, err.message));
  }
});

router.get('/benefit_wellbeing', async (req, res) => {
  try {
    const rows = await queryBenefitWellbeingTable();
    res.json(responseBenefitWellbeing(true, 'benefit_wellbeing', 'queryBenefitWellbeingTable', rows));
  } catch (err) {
    res.json(responseBenefitWellbeing(false, 'benefit_wellbeing', 'queryBenefitWellbeingTable', null, err.message));
  }
});

router.get('/company', async (req, res) => {
  try {
    const rows = await queryCompanyTable();
    res.json(responseCompany(true, 'company', 'queryCompanyTable', rows));
  } catch (err) {
    res.json(responseCompany(false, 'company', 'queryCompanyTable', null, err.message));
  }
});

router.get('/freelance', async (req, res) => {
  try {
    const rows = await queryFreelanceTable();
    res.json(responseFreelance(true, 'freelance', 'queryFreelanceTable', rows));
  } catch (err) {
    res.json(responseFreelance(false, 'freelance', 'queryFreelanceTable', null, err.message));
  }
});

router.get('/history', async (req, res) => {
  try {
    const rows = await queryHistoryTable();
    res.json(responseHistory(true, 'history', 'queryHistoryTable', rows));
  } catch (err) {
    res.json(responseHistory(false, 'history', 'queryHistoryTable', null, err.message));
  }
});

router.get('/leading', async (req, res) => {
  try {
    const rows = await queryLeadingTable();
    res.json(responseLeading(true, 'leading', 'queryLeadingTable', rows));
  } catch (err) {
    res.json(responseLeading(false, 'leading', 'queryLeadingTable', null, err.message));
  }
});

router.get('/salary', async (req, res) => {
  try {
    const rows = await querySalaryTable();
    res.json(responseSalary(true, 'salary', 'querySalaryTable', rows));
  } catch (err) {
    res.json(responseSalary(false, 'salary', 'querySalaryTable', null, err.message));
  }
});

router.get('/seasonal_bonuses', async (req, res) => {
  try {
    const rows = await querySeasonalBonusesTable();
    res.json(responseSeasonalBonuses(true, 'seasonal_bonuses', 'querySeasonalBonusesTable', rows));
  } catch (err) {
    res.json(responseSeasonalBonuses(false, 'seasonal_bonuses', 'querySeasonalBonusesTable', null, err.message));
  }
});

router.get('/student', async (req, res) => {
  try {
    const rows = await queryStudentTable();
    res.json(responseStudent(true, 'student', 'queryStudentTable', rows));
  } catch (err) {
    res.json(responseStudent(false, 'student', 'queryStudentTable', null, err.message));
  }
});

router.get('/:tableName', async (req, res) => {
  const { tableName } = req.params;
  try {
    const rows = await queryBigQuery(tableName);
    res.json(responseBigQuery(true, tableName, 'queryBigQuery', rows));
  } catch (err) {
    res.json(responseBigQuery(false, tableName, 'queryBigQuery', null, err.message));
  }
});

module.exports = router;
