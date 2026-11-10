Feature: Empty lead search results

  Scenario: Results are already empty
    Given the lead paging message is "No records to display"
    Then Verify no records to display

  Scenario: Search results finish loading asynchronously
    Given the lead paging message is "Displaying 1 - 20 of 100"
    When the lead paging message becomes "No records to display" after 1500 milliseconds
    Then Verify no records to display
