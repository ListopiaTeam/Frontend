# Listopia Frontend

## This project is still work in progress

## Requirements
- Modern Web Browser
    - Currently the website works best on larger screens but most of it is usable on mobile as well
- Active Internet Connection
- Registration To Access All Features (Email, Username, Password & Optional Profile Picture)
    - Account and content made by users can be deleted by the user themselves or by moderators

## Features & Usage Guide
- ### Lists
- ### Events
- ### Social Features
    - #### Commenting & Replying
    - #### Liking Content
- ### Moderation
    - #### Reporting Content
    - #### Moderator Tools
- ### User Profile
    - #### Profile Settings
    - #### Own Lists
    - #### Liked Lists

## How It Works
- ### Frontend
    - Hosting: Netlify (Free Tier)
        - Automatically updates when changes are made to this repository
    - Technologies:
        - Frameworks:
            - React
            - TailwindCSS + HyperUI
        - Other packages (React Query, Axios etc...)
        - Vite (Build Tool & Dev Server)
        - Bun (Package Management)
        - Prettier (Code Formatting)
    - Services Used
        - Firebase (Database & Auth)
        - RAWG API (Game Data)
        - Cloudinary (Image Hosting)
- ### Backend
    - Hosting: Self-hosting at home (Linux Server with Docker Containers)
        - Automatically updates when changes are made to the backend repository
        - Has custom domain