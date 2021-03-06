Feature: Authentication
As a vision user
I want to be able to authenticate via Github
So that I can view project activity

	Scenario: User logs in successfully
    	Given I have a Github Account
    	When I click the Github authentication button
    	Then I should be logged in
   	 	And I should see my name and a logout link
        
    Scenario: User logs out successfully
    	Given I am logged in to Vision
        When I click the logout button
        Then I should see the Github login button
        
        
    
    