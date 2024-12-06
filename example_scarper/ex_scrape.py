import requests

# Making a GET request
r = requests.get('https://brownrec.com/facilities/olney-margolies-athletic-center-omac-/2')

# check status code for response received
# success code - 200
print(r)

# print content of request
print(r.content)