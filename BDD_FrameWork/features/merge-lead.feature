@MergeLead
Feature: Merge leads in Leaftaps CRM

  Background:
    Given Load the Leaftaps login page
    When Enter the username as "Demosalesmanager"
    And Enter the password as "crmsfa"
    And Click on the Login button
    And Click on CRMSFA link

  Scenario: Merge two leads
    When Click on the Leads tab
    And Click on the Create Lead link
    And Enter company name as "MergeCompanyOne"
    And Enter first name as "MergeLeadA"
    And Enter last name as "MergeA"
    And Enter phone number as "98131"
    And Click on Create Lead button
    And Click on the Leads tab
    And Click on the Create Lead link
    And Enter company name as "MergeCompanyTwo"
    And Enter first name as "MergeLeadB"
    And Enter last name as "MergeB"
    And Enter phone number as "98132"
    And Click on Create Lead button
    And Click on the Leads tab
    And Click on Merge Leads link
    And Open the first merge lead lookup
    And Search merge lead by first name "MergeLeadA"
    And Select the first merge lead result
    And Store selected merge lead id
    And Open the second merge lead lookup
    And Search merge lead by first name "MergeLeadB"
    And Select the second merge lead result
    And Click on Merge button
    And Accept merge confirmation
    And Click on Find Leads link
    And Search lead by id with stored merge lead id
    And Click on Find Leads button
    Then Verify no records to display
