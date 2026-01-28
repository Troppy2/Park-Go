# Park&Go

Park&Go is a web application designed to help students compare and find affordable parking spots near campus.

## About

- **Problem:** Commuting to college can be frustrating and time-consuming, especially at the University of Minnesota Twin Cities campus. Finding affordable and convenient parking is often difficult.
- **Audience:** Students, faculty, and visitors traveling to the University of Minnesota Twin Cities campus.
- **Goal:** The final version of this project aims to provide personalized parking recommendations. A suggestion algorithm will recommend parking spots to users upon login based on their preferences and input data.

## Features

- **Search:** Allows users to search for parking spots by name. The current implementation returns up to five similar results. *(Under development)*
- **Filters:** Enables users to narrow down parking options for a more personalized experience.
- **Suggested Parking Spots:** Uses user-provided information and selected filters to recommend parking locations. *(Under development)*
- **Submit Parking Suggestions:** Allows users to submit new parking locations, expanding the available parking database.

## Version 1.01 — 01/27/2020

This version represents the second iteration of the project. It includes a Flask backend with a SQL database for managing parking spot data and user information. Google Sign-In is used for authentication to improve security and reduce the risk of data mishandling.

Once fully completed and deployed, Park&Go aims to significantly reduce the time and effort required for commuters to find affordable parking near the UMN campus.

## Technologies

- **Languages:** HTML, CSS, JavaScript, Python, SQL
- **Tools / Libraries:**
  - Flask
  - Flask-SQLAlchemy
  - SQLAlchemy
  - PyMySQL
  - Flask-Login
  - Authlib
  - Requests
  - python-dotenv
- **APIs:**
  - Google OAuth 2.0
## Lessons Learned
- Learned the importance of using a modern web framework like **React** for front-end development.  
  The project currently has over 500 lines of CSS, much of which is repetitive and inefficient.  
  For example, coding the sidebar took around 5 hours due to the unoptimized CSS setup.  
  Using a framework like React could significantly reduce development time and improve maintainability.
