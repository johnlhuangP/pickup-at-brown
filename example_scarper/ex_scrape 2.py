from selenium import webdriver
from bs4 import BeautifulSoup
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import requests
from datetime import datetime

class Event:
    def __init__(self, courts, time_range):
        self.courts = courts  # List of strings
        self.time_range = time_range

driver = webdriver.Chrome()

# Load the webpage
driver.get('https://25live.collegenet.com/pro/brown/embedded/calendar?comptype=calendar&compsubject=location&itemTypeId=4&queryId=548963&embeddedConfigToken=4C7BA58F-4540-4940-AF8D-25D1A23A3C00#!/home/location/373/calendar')

# Wait for the page to load completely (you may need to adjust the sleep time)
time.sleep(8)

# Get the page source after JavaScript has rendered
page_source = driver.page_source
# Parse the HTML content
omac = BeautifulSoup(page_source, 'html.parser')

week = omac.find_all('td')


week_reservations = []
for day in week:
    daily_event_reservations = []
    button = day.find('button', class_='btn btn-default ngZhigh ng-binding ng-scope')
    if button:
        # Locate the button using Selenium
        button_element = driver.find_element(By.XPATH, f"//button[@class='btn btn-default ngZhigh ng-binding ng-scope' and text()='{button.text}']")
        
        # Scroll the button into view
        driver.execute_script("arguments[0].scrollIntoView(true);", button_element)
        
        # Click the button using JavaScript to avoid interception
        driver.execute_script("arguments[0].click();", button_element)


        time.sleep(8)
        # Wait for the modal to appear
        try:
            WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.CLASS_NAME, 'modal-content')))
        except TimeoutException:
            print("Timeout waiting for modal to appear")
            continue

        # Get the modal content
        # Get the modal content
        modal_content = driver.find_element(By.CLASS_NAME, 'modal-content').get_attribute('innerHTML')
        modal_soup = BeautifulSoup(modal_content, 'html.parser')
        
        # Scrape the modal content
        events = modal_soup.find_all(class_='ngCalendarDayEventItem CalendarDayEventItem ng-scope')
        for event in events:
            courts_in_use = []
            courts = event.find_all(class_="ngSubjectCalCell ngSubjectCalCellText")
            for court in courts:
                court_name = court.get_text()
                courts_in_use.append(court_name)
            time_allocated = event.find(class_="eventTime").get_text().strip()
            time_allocated = ' '.join(time_allocated.split())
            start_time, end_time = time_allocated.split(' - ')
            daily_event_reservations.append(Event(courts=courts_in_use, time_range=(start_time, end_time)))
        
        # Close the modal
        close_button = driver.find_element(By.XPATH, "//a[@aria-label='Close']")
        close_button.click()
        
        # Wait for the modal to close
        WebDriverWait(driver, 10).until(EC.invisibility_of_element_located((By.CLASS_NAME, 'modal-content')))

        time.sleep(8)
        print(f"Number of events for this day: {len(daily_event_reservations)}")
        print("done")
    else:
        events = day.find_all(class_='ngCalendarDayEventItem CalendarDayEventItem ng-scope')
        for event in events:
            courts_in_use = []
            # get all the courts that are used during this time block
            courts = event.find_all(class_="ngSubjectCalCell ngSubjectCalCellText")
            for court in courts:
                court_name = court.get_text()
                courts_in_use.append(court_name)
            # get the time range of the event
            time_allocated = event.find(class_="eventTime").get_text().strip()
            time_allocated = ' '.join(time_allocated.split())
            start_time, end_time = time_allocated.split(' - ')
            # save the event in event_reservations
            daily_event_reservations.append(Event(courts=courts_in_use, time_range=(start_time, end_time)))
    week_reservations.append(daily_event_reservations)

flat = [item for sublist in week_reservations for item in sublist]
print(flat[0].courts)
print(flat[0].time_range)


driver.quit()

