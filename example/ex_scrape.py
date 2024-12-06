import requests
from bs4 import BeautifulSoup

# Making a GET request
r = requests.get('https://brownrec.com/facilities/olney-margolies-athletic-center-omac-/2')

# check status code for response received
# success code - 200
print(r)

# print content of request
print(r.content)
# Parse the HTML content
soup = BeautifulSoup(r.content, 'html.parser')

# Find the h2 title
h2_title = soup.find('h2')

# Print the h2 title text
if h2_title:
    print(h2_title.get_text())
else:
    print("No h2 title found")