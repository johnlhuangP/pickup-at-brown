import requests
from bs4 import BeautifulSoup

def scrape_example():
    url = "https://example.com"
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    # Parse the data
    return {"data": "example data"}
